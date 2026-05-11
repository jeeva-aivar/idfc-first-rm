'use client'

import { useState } from 'react'
import { AppShell } from '@/components/shared/AppShell'
import { Icon } from '@/components/ui/Icon'

const TODAY_MEETINGS = [
  { id: 1, time: '08:45', duration: '15m', title: 'Cluster Huddle', with: 'Vikram Joshi', type: 'In-person', link: '', score: 38, reason: 'Routine standup — low information density for you.' },
  { id: 2, time: '09:30', duration: '30m', title: 'Sanction Call · Mehta Group', with: 'Rajesh Mehta', type: 'Call', link: '', score: 92, reason: 'High-value decision — your presence required.' },
  { id: 3, time: '11:00', duration: '45m', title: 'NPA Committee', with: 'Branch team', type: 'In-person', link: '', score: 87, reason: 'Key decision gate — your input needed on Kapoor case.' },
  { id: 4, time: '11:00', duration: '30m', title: 'Branch Standup', with: 'Ops team', type: 'Google Meet', link: 'https://meet.google.com/abc-defg-hij', score: 44, reason: 'Status round — avatar can take notes and debrief you.' },
  { id: 5, time: '14:00', duration: '60m', title: 'Quarterly Review · Mehta Group', with: 'Acme Capital', type: 'Google Meet', link: 'https://meet.google.com/mse-cjyq-rsr', score: 71, reason: 'Portfolio review — avatar can attend and surface action items.' },
  { id: 6, time: '15:00', duration: '45m', title: 'Q4 Portfolio Sign-off', with: 'Internal', type: 'Teams', link: 'https://teams.microsoft.com/l/meetup-join/abc123', score: 55, reason: 'Doc review — avatar can capture decisions and draft memo.' },
  { id: 7, time: '16:00', duration: '30m', title: 'Wealth Pitch · Iyer Family', with: 'Lakshmi Iyer', type: 'Call', link: '', score: 88, reason: 'Cross-sell moment — your relationship matters here.' },
  { id: 8, time: '17:30', duration: '20m', title: 'EOD Debrief · 1:1', with: 'Vikram Joshi', type: 'In-person', link: '', score: 60, reason: 'Manager 1:1 — your presence expected.' },
]

function scoreColor(score: number) {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#d97706'
  return 'var(--text-tertiary)'
}

function typeIcon(type: string) {
  if (type === 'Google Meet') return 'Video'
  if (type === 'Teams') return 'Video'
  if (type === 'Call') return 'Phone'
  return 'Users'
}

export default function MeetingAvatarPage() {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [dispatching, setDispatching] = useState<Set<number>>(new Set())
  const [dispatched, setDispatched] = useState<Set<number>>(new Set())
  const [error, setError] = useState<number | null>(null)

  const canSelect = (m: typeof TODAY_MEETINGS[0]) => !!m.link

  function toggle(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function dispatchSelected() {
    const toDispatch = TODAY_MEETINGS.filter(m => selected.has(m.id) && m.link)
    setDispatching(new Set(toDispatch.map(m => m.id)))
    setError(null)

    await Promise.all(toDispatch.map(async m => {
      try {
        const res = await fetch('/api/avatar/join-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meeting_url: m.link }),
        })
        if (res.ok) {
          setDispatched(prev => new Set([...prev, m.id]))
          setSelected(prev => { const n = new Set(prev); n.delete(m.id); return n })
        } else {
          setError(m.id)
        }
      } catch {
        setError(m.id)
      }
    }))
    setDispatching(new Set())
  }

  const selectedCount = selected.size
  const dispatchableSelected = TODAY_MEETINGS.filter(m => selected.has(m.id) && m.link).length

  return (
    <AppShell>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--idfc-red)', marginBottom: 10 }}>10 MAY 2026 · PRIYA'S CALENDAR</div>
          <h1 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
            Your meetings today — <em style={{ color: 'var(--idfc-red)', fontStyle: 'italic' }}>select which the avatar attends.</em>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6, maxWidth: 620 }}>
            AI scores each meeting against your priorities. Select the ones you want the avatar to join — it will take notes and send you a debrief.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, marginTop: 20 }}>
          {[{ color: '#16a34a', label: 'Score 80+ · attend yourself' }, { color: '#d97706', label: 'Score 60–79 · your call' }, { color: 'var(--text-tertiary)', label: 'Score <60 · good for avatar' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono',monospace" }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Meeting list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {TODAY_MEETINGS.map(m => {
            const isSelected = selected.has(m.id)
            const isDispatched = dispatched.has(m.id)
            const isDispatching = dispatching.has(m.id)
            const hasLink = !!m.link
            const hasError = error === m.id

            return (
              <div
                key={m.id}
                onClick={() => !isDispatched && hasLink && toggle(m.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr auto',
                  alignItems: 'center', gap: 16,
                  background: isDispatched ? 'rgba(22,163,74,0.04)' : isSelected ? 'rgba(139,26,26,0.05)' : 'var(--bg-card)',
                  border: isDispatched ? '1px solid rgba(22,163,74,0.25)' : isSelected ? '1px solid rgba(139,26,26,0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '14px 18px',
                  cursor: hasLink && !isDispatched ? 'pointer' : 'default',
                  transition: 'all 120ms ease',
                  opacity: !hasLink ? 0.7 : 1,
                }}
              >
                {/* Time */}
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {m.time}
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{m.duration}</div>
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name={typeIcon(m.type)} size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</span>
                    {isDispatched && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 4, padding: '2px 6px' }}>AVATAR DISPATCHED</span>}
                    {!hasLink && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '2px 6px' }}>NO LINK</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 3 }}>
                    {m.with} · {m.type}
                    {hasError && <span style={{ color: 'var(--idfc-red-bright)', marginLeft: 8 }}>Dispatch failed — try again</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>{m.reason}</div>
                </div>

                {/* Score + checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 28, fontWeight: 700, color: scoreColor(m.score), lineHeight: 1 }}>{m.score}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--text-tertiary)', marginTop: 2 }}>SCORE</div>
                  </div>
                  {hasLink && !isDispatched && (
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      border: isSelected ? '2px solid var(--idfc-red)' : '2px solid var(--border-subtle)',
                      background: isSelected ? 'var(--idfc-red)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 120ms ease',
                    }}>
                      {isSelected && <Icon name="Check" size={13} style={{ color: '#fff' }} />}
                    </div>
                  )}
                  {isDispatching && <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Loader" size={14} style={{ color: 'var(--text-tertiary)' }} /></div>}
                  {isDispatched && <Icon name="CheckCircle" size={20} style={{ color: '#16a34a' }} />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Dispatch bar */}
        <div style={{ position: 'sticky', bottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <Icon name="Bot" size={18} style={{ color: selectedCount > 0 ? 'var(--idfc-red)' : 'var(--text-tertiary)' }} />
          <div style={{ flex: 1 }}>
            {selectedCount === 0
              ? <span style={{ fontSize: 13.5, color: 'var(--text-tertiary)' }}>Select meetings above to dispatch the avatar — only meetings with a link can be joined.</span>
              : <span style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500 }}>{selectedCount} meeting{selectedCount > 1 ? 's' : ''} selected{dispatchableSelected < selectedCount ? ` · ${selectedCount - dispatchableSelected} missing link` : ''}</span>
            }
          </div>
          <button
            onClick={dispatchSelected}
            disabled={dispatchableSelected === 0 || dispatching.size > 0}
            style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: dispatchableSelected > 0 ? 'var(--idfc-red)' : 'var(--bg-subtle)',
              color: dispatchableSelected > 0 ? '#fff' : 'var(--text-tertiary)',
              cursor: dispatchableSelected > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 120ms ease',
            }}
          >
            {dispatching.size > 0 ? 'DISPATCHING…' : `DISPATCH AVATAR${dispatchableSelected > 1 ? 'S' : ''}`}
          </button>
        </div>

      </div>
    </AppShell>
  )
}
