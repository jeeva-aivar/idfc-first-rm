'use client'
import { useState, useEffect } from 'react'
import { AppShell } from '@/components/shared/AppShell'
import { Icon } from '@/components/ui/Icon'
import { StatusDot, StatusPill } from '@/components/ui/StatusDot'
import { Blade } from '@/components/ui/Blade'
import { Modal } from '@/components/ui/Modal'
import { Switch, KV } from '@/components/ui/FormElements'
import { useApp } from '@/lib/app-context'
import { MOCK } from '@/lib/mock-data'

type ActionRow = typeof MOCK.comms[number] & { status: string; tone: string; needsAction?: boolean }

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="density-card" style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
      <div className="caption" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="num" style={{ fontSize: 32, fontWeight: 600, marginTop: 10, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-tertiary)' }}>{sub}</div>}
    </div>
  )
}

function ActionRowItem({ row, onAct, onView, dismissing }: {
  row: ActionRow
  onAct: (kind: string) => void
  onView: () => void
  dismissing: boolean
}) {
  return (
    <div
      className={'row-divider row-hover density-row' + (dismissing ? ' row-dismiss' : '')}
      onClick={onView}
      style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 14, alignItems: 'flex-start', padding: '14px 18px', cursor: 'pointer' }}
    >
      <div className="font-mono num" style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingTop: 2 }}>{row.time}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{row.title}</div>
        <div className="body" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{row.detail}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }} onClick={e => e.stopPropagation()}>
          <button className="btn-ghost" style={{ height: 28, fontSize: 12 }} onClick={onView}>
            <Icon name="Eye" size={12} style={{ marginRight: 6 }} />View detail
          </button>
          {row.needsAction && row.status !== 'APPROVED' && (
            <>
              <button className="btn-ghost" style={{ height: 28, fontSize: 12, color: 'var(--success)' }} onClick={() => onAct('approve')}>Approve</button>
              <button className="btn-ghost" style={{ height: 28, fontSize: 12 }} onClick={() => onAct('dismiss')}>Dismiss</button>
            </>
          )}
        </div>
      </div>
      <div style={{ pointerEvents: 'none' }}>
        <StatusDot tone={row.tone} label={row.status} />
      </div>
    </div>
  )
}

function ActionDetailBlade({ open, onClose, row, onAct }: {
  open: boolean
  onClose: () => void
  row: ActionRow | null
  onAct: (k: string) => void
}) {
  if (!row) return null
  const f = (row as any).detailFull || {}
  const reviewing = row.needsAction && row.status !== 'APPROVED'
  return (
    <Blade
      open={open}
      onClose={onClose}
      eyebrow={f.kind || row.status}
      title={row.title.replace(/\.$/, '')}
      width={580}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {reviewing ? (
            <>
              <button className="btn-primary" onClick={() => { onAct('approve'); onClose() }}>Approve & send</button>
              <button className="btn-secondary" onClick={() => { onAct('dismiss'); onClose() }}>Dismiss & learn rule</button>
              <span className="caption" style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>Dismissing trains the AI not to surface this pattern again.</span>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={onClose}>Close</button>
              <span className="caption" style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>Already {row.status.toLowerCase()} · no action needed.</span>
            </>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusDot tone={row.tone} label={row.status} />
          <span className="font-mono caption" style={{ fontSize: 11 }}>{row.time} IST</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span className="caption" style={{ minWidth: 50 }}>TO</span><span style={{ fontSize: 13.5 }}>{f.to || '—'}</span></div>
          {f.cc && f.cc !== '—' && <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span className="caption" style={{ minWidth: 50 }}>CC</span><span style={{ fontSize: 13.5 }}>{f.cc}</span></div>}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span className="caption" style={{ minWidth: 50 }}>SUBJECT</span><span style={{ fontSize: 13.5, fontWeight: 500 }}>{f.subject || row.title}</span></div>
        </div>

        {f.body && (
          <div>
            <div className="caption" style={{ marginBottom: 8 }}>MESSAGE BODY</div>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-primary)', padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, margin: 0 }}>{f.body}</pre>
          </div>
        )}

        {Array.isArray(f.meta) && f.meta.length > 0 && (
          <div>
            <div className="caption" style={{ marginBottom: 8 }}>METADATA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {f.meta.map((m: { k: string; v: string }, i: number) => <KV key={i} k={m.k} v={m.v} />)}
            </div>
          </div>
        )}
      </div>
    </Blade>
  )
}

function ConfigureRulesModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (rules: typeof MOCK.defaultRules) => void }) {
  const [rules, setRules] = useState(() => MOCK.defaultRules.map(r => ({ ...r })))
  const toggle = (id: string) => setRules(arr => arr.map(r => r.id === id ? { ...r, on: !r.on } : r))
  const enabled = rules.filter(r => r.on).length
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="AUTOMATION RULES"
      title="Configure what runs without you"
      width={620}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-primary" onClick={() => { onSave(rules); onClose() }}>Save changes</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <span className="caption" style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>{enabled} of {rules.length} enabled</span>
        </div>
      }
    >
      <p className="body" style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        These rules govern what IDFC FIRST AI does on your behalf overnight. Anything you turn off becomes a one-time draft for your review instead.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rules.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{r.label}</div>
              <div className="body" style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{r.desc}</div>
              <div className="font-mono caption" style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4 }}>Threshold: {r.threshold}</div>
            </div>
            <Switch checked={r.on} onChange={() => toggle(r.id)} label={r.on ? 'On' : 'Off'} />
          </div>
        ))}
      </div>
    </Modal>
  )
}

function AutoActionsContent() {
  const app = useApp()
  const [comms, setComms] = useState<ActionRow[]>(() => app.state.comms as ActionRow[])
  const [sys, setSys] = useState<ActionRow[]>(() => app.state.sys as ActionRow[])
  const [dismissingIds, setDismissingIds] = useState<Record<string, boolean>>({})
  const [viewing, setViewing] = useState<{ which: 'c' | 's'; idx: number } | null>(null)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [savedRules, setSavedRules] = useState<typeof MOCK.defaultRules | null>(null)

  // Sync to shared state
  useEffect(() => { app.setState(s => ({ ...s, comms: comms as typeof s.comms, sys: sys as typeof s.sys })) }, [comms, sys])

  const act = (which: 'c' | 's', idx: number, kind: string) => {
    const list = which === 'c' ? comms : sys
    const setter = which === 'c' ? setComms : setSys
    const key = which + idx
    if (kind === 'approve') {
      setter(list.map((r, i) => i === idx ? { ...r, status: 'APPROVED', tone: 'success', needsAction: false } : r) as ActionRow[])
      app.toast(`Approved · ${list[idx].title.replace(/\.$/, '')}`)
      app.bumpPoints(50)
    } else {
      setDismissingIds(prev => ({ ...prev, [key]: true }))
      app.toast('Dismissed · rule learned')
      setTimeout(() => {
        setter(prev => prev.filter((_, i) => i !== idx) as ActionRow[])
        setDismissingIds(prev => { const n = { ...prev }; delete n[key]; return n })
      }, 360)
    }
  }

  const approveAll = () => {
    setComms(comms.map(r => r.needsAction ? { ...r, status: 'APPROVED', tone: 'success', needsAction: false } : r) as ActionRow[])
    setSys(sys.map(r => r.needsAction ? { ...r, status: 'APPROVED', tone: 'success', needsAction: false } : r) as ActionRow[])
    const n = comms.filter(r => r.needsAction).length + sys.filter(r => r.needsAction).length
    app.toast(`${n} actions approved`)
    app.bumpPoints(n * 50)
  }

  const reviewCount = comms.filter(r => r.needsAction).length + sys.filter(r => r.needsAction).length
  const completeCount = comms.filter(r => !r.needsAction).length + sys.filter(r => !r.needsAction).length

  const stats = [
    { label: 'TIER-1 REPLIES',     value: String(comms.filter(r => r.title.toLowerCase().includes('repl') || r.title.toLowerCase().includes('whatsapp') || r.title.toLowerCase().includes('greeting') || r.title.toLowerCase().includes('reminder')).length), sub: 'auto-sent' },
    { label: 'SALESFORCE UPDATED', value: '5',      sub: 'records' },
    { label: 'KYC REMINDERS',      value: '2',      sub: 'dispatched' },
    { label: 'TIME YOU SAVED',     value: '1h 48m', sub: 'vs baseline' },
  ]

  const viewRow = viewing ? (viewing.which === 'c' ? comms[viewing.idx] : sys[viewing.idx]) : null

  return (
    <div className="anim-fade" style={{ padding: '32px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ maxWidth: '48rem' }}>
          <div className="caption" style={{ fontSize: 11, marginBottom: 8 }}>AUTO-ACTIONS · WHILE YOU SLEPT · 09:15 IST</div>
          <div className="h1" style={{ color: 'var(--text-primary)' }}>{completeCount} things IDFC FIRST AI handled overnight.</div>
          <div className="body-lg" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Allow all, or review individually. Anything you reject becomes a rule going forward.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusPill tone="success" label={`${completeCount} actions complete`} />
          {reviewCount > 0 && <StatusPill tone="warning" label={`${reviewCount} awaiting review`} />}
        </div>
      </div>

      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40, animationDelay: '60ms' }}>
        {stats.map(s => <StatTile key={s.label} {...s} />)}
      </div>

      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, animationDelay: '120ms' }}>
        {/* Communications */}
        <div className="card">
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="caption">COMMUNICATIONS</div>
            <div className="caption" style={{ color: 'var(--text-tertiary)', fontSize: 10.5 }}>{comms.length} entries</div>
          </div>
          <div>
            {comms.map((row, i) => (
              <ActionRowItem
                key={i + row.time}
                row={row}
                dismissing={!!dismissingIds['c' + i]}
                onAct={k => act('c', i, k)}
                onView={() => setViewing({ which: 'c', idx: i })}
              />
            ))}
            {comms.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>All caught up.</div>}
          </div>
        </div>

        {/* System updates */}
        <div className="card">
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="caption">SYSTEM UPDATES</div>
            <div className="caption" style={{ color: 'var(--text-tertiary)', fontSize: 10.5 }}>{sys.length} entries</div>
          </div>
          <div>
            {sys.map((row, i) => (
              <ActionRowItem
                key={i + row.time}
                row={row}
                dismissing={!!dismissingIds['s' + i]}
                onAct={k => act('s', i, k)}
                onView={() => setViewing({ which: 's', idx: i })}
              />
            ))}
            {sys.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>All caught up.</div>}
          </div>
        </div>
      </div>

      <div className="anim-fade-up" style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12, animationDelay: '220ms' }}>
        <button
          className="btn-primary"
          onClick={approveAll}
          disabled={reviewCount === 0}
          style={{ opacity: reviewCount === 0 ? 0.45 : 1, cursor: reviewCount === 0 ? 'not-allowed' : 'pointer' }}
        >
          {reviewCount === 0 ? 'All approved' : `Approve all (${reviewCount})`}
        </button>
        <button className="btn-secondary" onClick={() => setRulesOpen(true)}>
          <Icon name="SlidersHorizontal" size={13} style={{ marginRight: 6 }} />
          Configure rules{savedRules ? ` (${savedRules.filter(r => r.on).length} on)` : ''}
        </button>
        <span className="caption" style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>
          Each approval +50 pts · current session: <span className="num" style={{ color: 'var(--success)' }}>+{app.state.sessionPoints}</span>
        </span>
      </div>

      <ActionDetailBlade
        open={!!viewing}
        onClose={() => setViewing(null)}
        row={viewRow}
        onAct={k => viewing && act(viewing.which, viewing.idx, k)}
      />
      <ConfigureRulesModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        onSave={r => { setSavedRules(r); app.toast(`${r.filter(x => x.on).length} rules active · changes saved`) }}
      />
    </div>
  )
}

export default function AutoActionsPage() {
  return (
    <AppShell>
      <AutoActionsContent />
    </AppShell>
  )
}
