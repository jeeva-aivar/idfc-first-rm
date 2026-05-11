
​'use client'
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { AppShell } from '@/components/shared/AppShell'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'CUSTOMER' | 'AGENT'
type AlertKind = 'compliance' | 'empathy' | 'belief' | 'buying' | 'general'
type CallStatus = 'waiting' | 'live' | 'ended'
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface Suggestion {
  id: string; text: string; kind?: AlertKind; done: boolean
  latencyMs?: number; timeToFirstToken?: number; inputTokens?: number; outputTokens?: number
  startedAt: number; triggerTurnIndex: number
}
interface Turn { id: string; role: Role; text: string; partial: boolean; callOffsetMs: number }
interface CallState { status: CallStatus; callSid: string | null; startedAt: number | null; endedAt: number | null }

type ServerEvent =
  | { type: 'call_start'; callSid: string }
  | { type: 'call_end'; callSid: string }
  | { type: 'partial'; label: Role; text: string }
  | { type: 'transcript'; label: Role; text: string; callOffset?: string }
  | { type: 'assist_chunk'; suggestionId: string; chunk: string }
  | { type: 'assist_done'; suggestionId: string; kind: AlertKind; latencyMs: number; timeToFirstToken: number; inputTokens: number; outputTokens: number; fullText: string }
  | { type: 'ask_chunk'; askId: string; chunk: string }
  | { type: 'ask_done'; askId: string; fullText: string }

// ─── State machine ────────────────────────────────────────────────────────────

interface State {
  call: CallState
  turns: Turn[]
  partials: Record<Role, string>
  suggestions: Record<string, Suggestion>
  askMessages: { id: string; role: 'user' | 'assistant'; text: string; done: boolean }[]
}

const init: State = {
  call: { status: 'waiting', callSid: null, startedAt: null, endedAt: null },
  turns: [], partials: { CUSTOMER: '', AGENT: '' }, suggestions: {}, askMessages: [],
}

type Action =
  | { type: 'reset'; callSid: string }
  | { type: 'callEnd' }
  | { type: 'partial'; label: Role; text: string }
  | { type: 'turn'; label: Role; text: string }
  | { type: 'assistChunk'; id: string; chunk: string }
  | { type: 'assistDone'; id: string; kind: AlertKind; latencyMs: number; timeToFirstToken: number; inputTokens: number; outputTokens: number }
  | { type: 'askChunk'; id: string; chunk: string }
  | { type: 'askDone'; id: string; fullText: string }
  | { type: 'askSend'; id: string; question: string }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'reset': return { ...init, call: { status: 'live', callSid: a.callSid, startedAt: Date.now(), endedAt: null } }
    case 'callEnd': return { ...s, call: { ...s.call, status: 'ended', endedAt: Date.now() } }
    case 'partial': return { ...s, partials: { ...s.partials, [a.label]: a.text } }
    case 'turn': {
      const turn: Turn = { id: `t-${s.turns.length}-${Date.now()}`, role: a.label, text: a.text, partial: false, callOffsetMs: s.call.startedAt ? Date.now() - s.call.startedAt : 0 }
      return { ...s, turns: [...s.turns, turn], partials: { ...s.partials, [a.label]: '' } }
    }
    case 'assistChunk': {
      const existing = s.suggestions[a.id]
      const anchorIdx = (() => { for (let i = s.turns.length - 1; i >= 0; i--) { if (s.turns[i].role === 'CUSTOMER') return i } return s.turns.length - 1 })()
      if (existing) return { ...s, suggestions: { ...s.suggestions, [a.id]: { ...existing, text: existing.text + a.chunk } } }
      return { ...s, suggestions: { ...s.suggestions, [a.id]: { id: a.id, text: a.chunk, done: false, startedAt: Date.now(), triggerTurnIndex: anchorIdx } } }
    }
    case 'assistDone': {
      const existing = s.suggestions[a.id]
      if (!existing) return s
      return { ...s, suggestions: { ...s.suggestions, [a.id]: { ...existing, done: true, kind: a.kind, latencyMs: a.latencyMs, timeToFirstToken: a.timeToFirstToken, inputTokens: a.inputTokens, outputTokens: a.outputTokens } } }
    }
    case 'askSend': return { ...s, askMessages: [...s.askMessages, { id: a.id, role: 'user', text: a.question, done: true }] }
    case 'askChunk': {
      const msgs = s.askMessages; const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant' && last.id === a.id) return { ...s, askMessages: [...msgs.slice(0, -1), { ...last, text: last.text + a.chunk }] }
      return { ...s, askMessages: [...msgs, { id: a.id, role: 'assistant', text: a.chunk, done: false }] }
    }
    case 'askDone': {
      const msgs = s.askMessages; const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') return { ...s, askMessages: [...msgs.slice(0, -1), { ...last, text: a.fullText, done: true }] }
      return s
    }
    default: return s
  }
}

// ─── WebSocket hook ───────────────────────────────────────────────────────────

function useAgentSocket(onEvent: (e: ServerEvent) => void) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)
  const timerRef = useRef<number | null>(null)
  const downRef = useRef(false)
  const onRef = useRef(onEvent); onRef.current = onEvent

  useEffect(() => {
    downRef.current = false
    function connect() {
      if (downRef.current) return
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) return
      setStatus('connecting')
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = process.env.NEXT_PUBLIC_AGENT_WS_URL ?? `${proto}//${location.host}/api/agent/live`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws
      ws.onopen = () => setStatus('connected')
      ws.onmessage = ({ data }) => { try { onRef.current(JSON.parse(data) as ServerEvent) } catch { /* ignore */ } }
      ws.onclose = () => {
        if (wsRef.current === ws) wsRef.current = null
        if (downRef.current) return
        setStatus('disconnected')
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(connect, 3000)
      }
      ws.onerror = () => setStatus('disconnected')
    }
    connect()
    return () => {
      downRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
      const ws = wsRef.current
      if (ws) { ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null; if (ws.readyState < 2) ws.close(); wsRef.current = null }
    }
  }, [])

  const send = useCallback((cmd: object) => { if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify(cmd)) }, [])
  return { status, send }
}

// ─── Helper fns ───────────────────────────────────────────────────────────────

function fmtElapsed(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
function fmtClock(ts: number) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const KIND_STYLE: Record<string, { bg: string; border: string; label: string }> = {
  compliance: { bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)', label: 'Compliance' },
  empathy:    { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', label: 'Empathy' },
  belief:     { bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)', label: 'Belief' },
  buying:     { bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.2)', label: 'Buying signal' },
  general:    { bg: 'rgba(180,30,30,0.05)', border: 'rgba(180,30,30,0.15)', label: 'Suggestion' },
}

function SuggestionCard({ s, callStartedAt }: { s: Suggestion; callStartedAt: number | null }) {
  const style = KIND_STYLE[s.kind ?? 'general'] ?? KIND_STYLE.general
  const ts = callStartedAt ? fmtClock(s.startedAt) : ''
  return (
    <div style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: 10, padding: '14px 16px', marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--idfc-red-bright)' }}>◆ FIRST AI · {style.label}</span>
        {ts && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{ts}</span>}
      </div>
      <p style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, color: 'var(--text-primary)', margin: 0 }}>
        {s.text || (s.done ? '—' : '')}
      </p>
      {s.done && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {['Use line', 'Read aloud', 'Why this?', 'Pull sanction PDF', 'Escalate'].map(b => (
            <button key={b} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 5, border: `1px solid ${style.border}`, background: 'var(--bg-card)', color: 'var(--idfc-red-bright)', cursor: 'pointer' }}>{b}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function TurnRow({ turn, suggestions, callStartedAt }: { turn: Turn; suggestions: Suggestion[]; callStartedAt: number | null }) {
  const isCustomer = turn.role === 'CUSTOMER'
  const ts = callStartedAt ? fmtClock(callStartedAt + turn.callOffsetMs) : ''
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isCustomer ? 'var(--idfc-red-bright)' : 'var(--text-secondary)' }}>
          {isCustomer ? 'Customer · Rajesh' : 'Priya · RM'}
        </span>
        {ts && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)' }}>{ts}</span>}
        {isCustomer && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>VoIP · BKC bridge</span>}
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-primary)', margin: 0 }}>{turn.text}</p>
      {suggestions.map(s => <SuggestionCard key={s.id} s={s} callStartedAt={callStartedAt} />)}
    </div>
  )
}

function TranscriptPanel({ turns, partials, suggestionsByTurn, call }: { turns: Turn[]; partials: Record<Role, string>; suggestionsByTurn: Map<number, Suggestion[]>; call: CallState }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const sticky = useRef(true)
  const [, tick] = useState(0)

  useEffect(() => { if (call.status !== 'live') return; const id = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(id) }, [call.status])
  useEffect(() => {
    const root = scrollRef.current, sentinel = sentinelRef.current; if (!root || !sentinel) return
    const obs = new IntersectionObserver(([e]) => { sticky.current = e.isIntersecting }, { root, threshold: 0 })
    obs.observe(sentinel); return () => obs.disconnect()
  }, [])
  useLayoutEffect(() => { if (sticky.current && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight })

  const isLive = call.status === 'live'
  const elapsedMs = call.startedAt ? Date.now() - call.startedAt : 0

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--idfc-red-bright)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? 'var(--idfc-red-bright)' : 'var(--text-tertiary)', animation: isLive ? 'pulse 1.5s infinite' : 'none', flexShrink: 0 }} />
          {isLive ? 'Recording live' : call.status === 'ended' ? 'Recording ended' : 'Standby'}
          <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>· Transcribing EN/HI</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: 'var(--text-tertiary)' }}>
          {fmtClock(Date.now())} · <strong style={{ color: 'var(--text-secondary)' }}>{fmtElapsed(elapsedMs)} elapsed</strong>
        </div>
      </div>

      {/* Customer strip */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--idfc-red)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 18, fontWeight: 600, flexShrink: 0 }}>RM</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 22, fontWeight: 500, lineHeight: 1.1, color: 'var(--text-primary)' }}>Mr. Rajesh Mehta</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
            <span><strong style={{ color: 'var(--text-secondary)' }}>CIF</strong> 80214467</span>
            <span>·</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>PAN</strong> AHRPM••62K</span>
            <span>·</span>
            <span>Promoter, Mehta Group · Mumbai Andheri E.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#16a34a', border: '1px solid rgba(22,163,74,0.3)', background: 'rgba(22,163,74,0.06)', padding: '3px 10px', borderRadius: 6 }}>KYC valid</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d97706', border: '1px solid rgba(217,119,6,0.3)', background: 'rgba(217,119,6,0.06)', padding: '3px 10px', borderRadius: 6 }}>Re-KYC Mar '26</span>
        </div>
      </div>

      {/* Transcript scroll */}
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 20px' }}>
        {call.status === 'waiting' && turns.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-tertiary)', padding: '80px 0' }}>
            <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 40, color: 'var(--border-subtle)', lineHeight: 1 }}>◎</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Awaiting call</div>
            <div style={{ fontSize: 13, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>Live transcripts and AI suggestions will appear here once a customer call connects.</div>
          </div>
        )}

        {turns.map((turn, idx) => (
          <TurnRow key={turn.id} turn={turn} suggestions={suggestionsByTurn.get(idx) ?? []} callStartedAt={call.startedAt} />
        ))}

        {partials.CUSTOMER && (
          <div style={{ padding: '10px 0' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--idfc-red-bright)' }}>Customer · Rajesh</span>
            <p style={{ fontSize: 14.5, fontStyle: 'italic', color: 'var(--text-tertiary)', margin: '6px 0 0' }}>{partials.CUSTOMER}</p>
          </div>
        )}
        {partials.AGENT && (
          <div style={{ padding: '10px 0' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Priya · RM</span>
            <p style={{ fontSize: 14.5, fontStyle: 'italic', color: 'var(--text-tertiary)', margin: '6px 0 0' }}>{partials.AGENT}</p>
          </div>
        )}
        {isLive && turns.length === 0 && !partials.CUSTOMER && !partials.AGENT && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', color: 'var(--text-tertiary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--idfc-red-bright)', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Listening…</span>
          </div>
        )}
        {call.status === 'ended' && <div style={{ textAlign: 'center', padding: '14px 0', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>— call ended —</div>}

        <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />
      </div>

      {/* Footer bar */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', flexShrink: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? 'var(--idfc-red-bright)' : 'var(--text-tertiary)', animation: isLive ? 'pulse 1.5s infinite' : 'none' }} />
          {isLive ? 'Mic open · Priya' : 'Mic idle'}
        </span>
        <span style={{ color: 'var(--border-subtle)' }}>·</span>
        <span>SNR 38 dB · HI/EN mix</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {['Add note', 'Flag clause', 'Open sanction'].map(b => (
            <button key={b} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>{b}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Right rail tabs ──────────────────────────────────────────────────────────

type RailTab = 'overview' | 'holdings' | 'credit' | 'history' | 'compliance'
const RAIL_TABS: { key: RailTab; label: string }[] = [
  { key: 'overview', label: 'Overview' }, { key: 'holdings', label: 'Holdings' },
  { key: 'credit', label: 'Credit' }, { key: 'history', label: 'History' }, { key: 'compliance', label: 'Compliance' },
]

function MetricBox({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 22, color: positive ? '#16a34a' : 'var(--text-primary)', lineHeight: 1 }}>
        {value}{sub && <small style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 4 }}>{sub}</small>}
      </div>
    </div>
  )
}

function RailRow({ k, v, vColor }: { k: string; v: string; vColor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{k}</span>
      <span style={{ fontSize: 12.5, fontWeight: 500, color: vColor ?? 'var(--text-primary)' }}>{v}</span>
    </div>
  )
}

function SectionHead({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 0 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
      <span>{children}</span>
      {tag && <span style={{ color: 'var(--idfc-red-bright)' }}>{tag}</span>}
    </div>
  )
}

function OverviewTab() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricBox label="Total exposure" value="₹3.24" sub="Cr" />
        <MetricBox label="Avg balance · 90d" value="+18%" sub="vs Q2" positive />
        <MetricBox label="CIBIL · Aug" value="786" />
        <MetricBox label="DPD 12mo" value="0" />
      </div>
      <SectionHead tag="Voice AI">Sentiment trend · this call</SectionHead>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 6 }}>
        <span>Cool</span><span>Neutral 0.62</span><span>Warm</span>
      </div>
      <div style={{ position: 'relative', height: 6, borderRadius: 999, background: 'var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0 38% 0 0', background: 'linear-gradient(to right, rgba(59,130,246,0.5), var(--idfc-red-bright))' }} />
        <div style={{ position: 'absolute', top: '50%', left: '62%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: 'var(--text-primary)', border: '2px solid var(--bg-card)' }} />
      </div>
      <SectionHead tag="FIRST AI">Next-best-action</SectionHead>
      <div style={{ background: 'rgba(180,30,30,0.05)', border: '1px solid rgba(180,30,30,0.15)', borderRadius: 8, padding: '12px 14px', fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-primary)' }}>
        <span style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontStyle: 'italic', fontSize: 15, color: 'var(--idfc-red-bright)', fontWeight: 500 }}>Reassure on locked terms</span>, then surface the <strong>prepayment waiver</strong> on WCDL. Mehta asked about it on <span style={{ background: 'rgba(217,119,6,0.1)', color: '#d97706', padding: '1px 5px', borderRadius: 3 }}>Aug 14</span> — still unresolved.
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
          <span>Sanction Lr · 06-Nov</span><span>·</span><span>CRM note · 14-Aug</span><span>·</span><span>SME pricing v3.1</span>
        </div>
      </div>
      <SectionHead>Last 3 interactions</SectionHead>
      {[
        { d: 'Oct 28', t: 'Email — Site visit confirmed for Nov 4 · BKC team' },
        { d: 'Oct 14', t: 'Call · 18 min — Working-capital tranche · positive' },
        { d: 'Aug 14', t: 'Branch visit — Asked about prepayment terms · open' },
      ].map(i => (
        <div key={i.d} style={{ display: 'flex', gap: 10, fontSize: 12, marginBottom: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', width: 44, flexShrink: 0, marginTop: 1 }}>{i.d}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{i.t}</span>
        </div>
      ))}
    </>
  )
}

function HoldingsTab() {
  const items = [
    { ic: 'TL', name: 'Term loan · Plant & machinery', meta: 'A/c ••••4719 · Sanctioned 06-Nov-25', amt: '₹3.20', sub: 'Cr', tag: 'Outstanding', color: 'rgba(180,30,30,0.08)', textColor: 'var(--idfc-red-bright)' },
    { ic: 'CA', name: 'Current · Mehta Industries Pvt Ltd', meta: 'A/c ••••8821 · BKC branch', amt: '₹14.6', sub: 'L', tag: 'Bal · 90d avg', color: 'rgba(59,130,246,0.08)', textColor: '#3b82f6' },
    { ic: 'OD', name: 'Cash credit / OD', meta: 'A/c ••••1140 · Limit ₹50 L · Util 32%', amt: '₹16.0', sub: 'L', tag: 'Drawn', color: 'rgba(217,119,6,0.08)', textColor: '#d97706' },
    { ic: 'FD', name: 'Fixed deposit · Auto-renew', meta: "3 deposits · Matures Mar '27", amt: '₹42.0', sub: 'L', tag: 'Principal', color: 'rgba(22,163,74,0.08)', textColor: '#16a34a' },
    { ic: 'CC', name: 'FIRST Wealth credit card', meta: 'Limit ₹8 L · Util 22% · No DPD', amt: '₹1.76', sub: 'L', tag: 'Spend MTD', color: 'rgba(124,58,237,0.08)', textColor: '#7c3aed' },
  ]
  return (
    <>
      <SectionHead>Linked accounts · 5</SectionHead>
      {items.map(h => (
        <div key={h.ic + h.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: h.color, color: h.textColor, display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{h.ic}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.meta}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 16, color: 'var(--text-primary)' }}>{h.amt}<small style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', marginLeft: 3 }}>{h.sub}</small></div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{h.tag}</div>
          </div>
        </div>
      ))}
    </>
  )
}

function CreditTab() {
  return (
    <>
      <SectionHead>Term loan · ••••4719</SectionHead>
      <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '4px 12px' }}>
        <RailRow k="Sanctioned" v="₹3.20 Cr" />
        <RailRow k="Disbursed" v="₹1.20 Cr · 06-Nov-25" />
        <RailRow k="Rate · locked" v="8.40% · MCLR + 1.10" vColor="#16a34a" />
        <RailRow k="Tenor" v="84 mo · 81 left" />
        <RailRow k="EMI" v="₹4,89,210 · 5th of mo" />
        <RailRow k="DPD · current" v="0 days" vColor="#16a34a" />
        <RailRow k="Prepayment" v="25%/yr waived" vColor="#d97706" />
      </div>
      <SectionHead>Bureau · CIBIL Aug-25</SectionHead>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricBox label="Score" value="786" sub="/ 900" />
        <MetricBox label="Δ 6mo" value="+12" positive />
        <MetricBox label="Enquiries 6m" value="2" />
        <MetricBox label="Util · all CC" value="22%" />
      </div>
    </>
  )
}

function HistoryTab() {
  return (
    <>
      <SectionHead>12-month engagement</SectionHead>
      {[
        { d: 'Oct 28', t: 'Email — Site visit confirmed for Nov 4' },
        { d: 'Oct 14', t: 'Call · 18 min — Working capital tranche' },
        { d: 'Aug 14', t: 'Branch visit — Asked about prepayment · open' },
        { d: 'Jul 02', t: 'WhatsApp — FD renewal confirmation' },
        { d: 'May 19', t: 'Service · resolved — Cheque book · 2-day TAT' },
        { d: 'Apr 03', t: 'Product offer — Forex card · declined' },
      ].map(i => (
        <div key={i.d} style={{ display: 'flex', gap: 10, fontSize: 12, marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', width: 44, flexShrink: 0, marginTop: 1 }}>{i.d}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{i.t}</span>
        </div>
      ))}
      <SectionHead>Cashflow · 90d</SectionHead>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricBox label="Inflow" value="₹4.82" sub="Cr" />
        <MetricBox label="Outflow" value="₹4.61" sub="Cr" />
        <MetricBox label="Salary book" value="42" sub="emp" />
        <MetricBox label="Min daily bal" value="₹6.4" sub="L" />
      </div>
    </>
  )
}

function ComplianceTab() {
  const flags = [
    { ok: true, title: 'KYC · current', sub: "Aadhaar + PAN re-verified 14-Mar-23 · Re-KYC scheduled Mar '26" },
    { ok: true, title: 'AML screening · clear', sub: 'Last screened 06-Nov-25 · No hits across UN, OFAC, RBI watchlists' },
    { ok: false, title: 'Suitability review pending', sub: "Risk profile last refreshed Apr '24 · Refresh due before next product offer" },
    { ok: true, title: 'Nominee on file', sub: 'Spouse · Mrs. Anjali Mehta · SA / FD / TL' },
    { ok: false, title: 'Consent · Account Aggregator', sub: 'External cashflow consent expires 21-Dec-25 · Renew to retain DPD analytics' },
  ]
  return (
    <>
      <SectionHead>Compliance posture</SectionHead>
      {flags.map(f => (
        <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.ok ? '#16a34a' : '#d97706', flexShrink: 0, marginTop: 4 }} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', marginTop: 3 }}>{f.sub}</div>
          </div>
        </div>
      ))}
      <SectionHead>Autonomy tier · this thread</SectionHead>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { label: 'Green · auto', color: '#16a34a', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.2)', count: 3, desc: 'Send sanction PDF · log call · update CRM' },
          { label: 'Yellow · 60s', color: '#d97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)', count: 2, desc: 'Schedule WCDL review · email CFO' },
          { label: 'Red · approve', color: '#dc2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)', count: 1, desc: 'Restructure tenor' },
        ].map(t => (
          <div key={t.label} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: 10 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.color }}>{t.label}</div>
            <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 22, color: 'var(--text-primary)', margin: '4px 0' }}>{t.count}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function RightRailPanel() {
  const [active, setActive] = useState<RailTab>('overview')
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--idfc-red)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>Mehta Group</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>Active · 6 yrs · SME · Risk M2</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '10px 12px 0', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, overflowX: 'auto' }}>
        {RAIL_TABS.map(t => (
          <button key={t.key} onClick={() => setActive(t.key)} style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '6px 10px', borderRadius: '6px 6px 0 0', border: active === t.key ? '1px solid var(--border-subtle)' : '1px solid transparent',
            borderBottom: active === t.key ? '1px solid var(--bg-card)' : '1px solid transparent', marginBottom: active === t.key ? -1 : 0,
            background: active === t.key ? 'var(--bg-card)' : 'transparent',
            color: active === t.key ? 'var(--idfc-red-bright)' : 'var(--text-tertiary)', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 16px' }}>
        {active === 'overview'   && <OverviewTab />}
        {active === 'holdings'   && <HoldingsTab />}
        {active === 'credit'     && <CreditTab />}
        {active === 'history'    && <HistoryTab />}
        {active === 'compliance' && <ComplianceTab />}
      </div>
    </div>
  )
}

// ─── Ask panel ────────────────────────────────────────────────────────────────

function AskPanel({ messages, onAsk, wsStatus }: {
  messages: { id: string; role: 'user' | 'assistant'; text: string; done: boolean }[]
  onAsk: (q: string) => void
  wsStatus: ConnectionStatus
}) {
  const [q, setQ] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const submit = () => { const trimmed = q.trim(); if (!trimmed) return; onAsk(trimmed); setQ('') }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--idfc-red-bright)' }}>◆ Ask FIRST AI</span>
        <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: wsStatus === 'connected' ? '#16a34a' : wsStatus === 'connecting' ? '#d97706' : '#dc2626', flexShrink: 0 }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{wsStatus}</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 12.5, lineHeight: 1.6 }}>
            Ask anything about this customer, their products, compliance status, or get suggested talking points.
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%',
            background: m.role === 'user' ? 'var(--idfc-red)' : 'var(--bg-subtle)',
            border: `1px solid ${m.role === 'user' ? 'transparent' : 'var(--border-subtle)'}`,
            borderRadius: 10, padding: '8px 12px',
            color: m.role === 'user' ? '#fff' : 'var(--text-primary)', fontSize: 13, lineHeight: 1.5,
          }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Ask about this customer…"
          style={{ flex: 1, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text-primary)', outline: 'none' }}
        />
        <button onClick={submit} disabled={!q.trim() || wsStatus !== 'connected'} style={{
          background: 'var(--idfc-red)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: !q.trim() || wsStatus !== 'connected' ? 'not-allowed' : 'pointer',
          opacity: !q.trim() || wsStatus !== 'connected' ? 0.5 : 1,
        }}>Ask</button>
      </div>
    </div>
  )
}

// ─── Top status bar ───────────────────────────────────────────────────────────

function StatusBar({ call, wsStatus }: { call: CallState; wsStatus: ConnectionStatus }) {
  const [, tick] = useState(0)
  useEffect(() => { if (call.status !== 'live') return; const id = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(id) }, [call.status])
  const elapsed = call.startedAt ? fmtElapsed(Date.now() - call.startedAt) : '00:00'
  const wsColor = wsStatus === 'connected' ? '#16a34a' : wsStatus === 'connecting' ? '#d97706' : '#dc2626'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: call.status === 'live' ? 'var(--idfc-red-bright)' : 'var(--text-tertiary)', flexShrink: 0 }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: call.status === 'live' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
          {call.status === 'live' ? `Live · ${elapsed}` : call.status === 'ended' ? 'Call ended' : 'Waiting for call'}
        </span>
        {call.callSid && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)' }}>{call.callSid.slice(0, 16)}…</span>}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: wsColor, flexShrink: 0 }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>WS: {wsStatus}</span>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function VoiceIntelligenceContent() {
  const [state, dispatch] = useReducer(reducer, init)

  const handleEvent = useCallback((e: ServerEvent) => {
    switch (e.type) {
      case 'call_start':   dispatch({ type: 'reset', callSid: e.callSid }); break
      case 'call_end':     dispatch({ type: 'callEnd' }); break
      case 'partial':      dispatch({ type: 'partial', label: e.label, text: e.text }); break
      case 'transcript':   dispatch({ type: 'turn', label: e.label, text: e.text }); break
      case 'assist_chunk': dispatch({ type: 'assistChunk', id: e.suggestionId, chunk: e.chunk }); break
      case 'assist_done':  dispatch({ type: 'assistDone', id: e.suggestionId, kind: e.kind, latencyMs: e.latencyMs, timeToFirstToken: e.timeToFirstToken, inputTokens: e.inputTokens, outputTokens: e.outputTokens }); break
      case 'ask_chunk':    dispatch({ type: 'askChunk', id: e.askId, chunk: e.chunk }); break
      case 'ask_done':     dispatch({ type: 'askDone', id: e.askId, fullText: e.fullText }); break
    }
  }, [])

  const { status: wsStatus, send } = useAgentSocket(handleEvent)

  const suggestionsByTurn = useMemo(() => {
    const map = new Map<number, Suggestion[]>()
    for (const s of Object.values(state.suggestions)) {
      if (!map.has(s.triggerTurnIndex)) map.set(s.triggerTurnIndex, [])
      map.get(s.triggerTurnIndex)!.push(s)
    }
    for (const list of map.values()) list.sort((a, b) => a.startedAt - b.startedAt)
    return map
  }, [state.suggestions])

  const handleAsk = useCallback((q: string) => {
    const id = `ask-${Date.now()}`
    dispatch({ type: 'askSend', id, question: q })
    send({ type: 'ask', askId: id, question: q })
  }, [send])

  return (
    <div style={{ padding: '28px 32px', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 1600, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Voice Intelligence</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 36, fontWeight: 400, color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
            Live call <em style={{ fontStyle: 'italic', color: 'var(--idfc-red-bright)' }}>assist</em>
          </h1>
          <StatusBar call={state.call} wsStatus={wsStatus} />
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 360px', gridTemplateRows: '1fr 260px', gap: 16 }}>
        {/* Transcript — spans both rows on left */}
        <div style={{ gridRow: '1 / 3' }}>
          <TranscriptPanel turns={state.turns} partials={state.partials} suggestionsByTurn={suggestionsByTurn} call={state.call} />
        </div>
        {/* Right rail top */}
        <div>
          <RightRailPanel />
        </div>
        {/* Ask panel bottom right */}
        <div>
          <AskPanel messages={state.askMessages} onAsk={handleAsk} wsStatus={wsStatus} />
        </div>
      </div>
    </div>
  )
}

export default function VoiceIntelligencePage() {
  return (
    <AppShell>
      <VoiceIntelligenceContent />
    </AppShell>
  )
}
