'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/shared/AppShell'
import type { Debrief } from '@/lib/api-contracts'

const RM_ID = 'rm-priya-sharma-001'

const OUTCOME_COLOR: Record<string, string> = {
  WIN: 'var(--success)',
  MULTIPLIED: '#8a6a30',
  SAVED: 'var(--text-secondary)',
  SURFACED: 'var(--idfc-red)',
}

function DailyDebriefContent() {
  const { data, isLoading } = useQuery<Debrief>({
    queryKey: ['debrief', RM_ID],
    queryFn: () => fetch(`/api/debrief?rmId=${RM_ID}`).then(r => r.json()),
  })

  if (isLoading) return (
    <div data-theme="dark" style={{ minHeight: '100vh', padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>
      Loading debrief…
    </div>
  )
  if (!data) return <div style={{ padding: 48, color: 'var(--danger)', fontSize: 13 }}>Failed to load.</div>

  const headlineParts = data.headline.split(/(\*[^*]+\*)/g).filter(Boolean)

  return (
    <div data-theme="dark" style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <div className="anim-fade" style={{ padding: '48px 32px', maxWidth: 920, margin: '0 auto' }}>
        <div className="caption anim-fade-up" style={{ color: 'var(--idfc-red-bright)', fontSize: 11 }}>TODAY, IN ONE BREATH · {data.meta.date.toUpperCase()}</div>

        <h1 className="display-56 anim-fade-up" style={{ color: 'var(--text-primary)', marginTop: 20, animationDelay: '100ms' }}>
          {headlineParts.map((part, i) =>
            part.startsWith('*') && part.endsWith('*')
              ? <span key={i} style={{ color: 'var(--idfc-red-bright)', fontWeight: 500 }}>{part.slice(1, -1)}</span>
              : <span key={i}>{part}</span>
          )}
        </h1>

        {/* Stats */}
        <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48, animationDelay: '200ms' }}>
          {[
            { label: 'CUSTOMER TIME', value: data.stats.customerTimeDisplay, sub: `of ${Math.ceil(data.stats.customerTimeMinutes / 60 / 0.7)}h total` },
            { label: 'AUTO-ACTIONS', value: String(data.stats.autoActionsCount), sub: 'handled by AI' },
            { label: 'SLA BREACHES', value: String(data.stats.slaBreachers), sub: data.stats.slaBreachers === 0 ? 'clean day' : 'needs review' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '8px 24px', borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
              <div className="caption" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.label}</div>
              <div className="num" style={{ fontSize: 40, fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginTop: 12 }}>{s.value}</div>
              {s.sub && <div className="num" style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ marginTop: 64, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 6, top: 6, bottom: 6, width: 1, background: 'var(--idfc-red)', opacity: 0.25 }} />
          {data.timeline.map((event, i) => (
            <div key={event.id} className="anim-fade-up" style={{ position: 'relative', paddingLeft: 40, paddingRight: 8, paddingTop: i === 0 ? 0 : 20, paddingBottom: 20, animationDelay: `${300 + i * 110}ms` }}>
              <div style={{ position: 'absolute', left: 1.5, top: i === 0 ? 6 : 26, width: 11, height: 11, borderRadius: 999, background: 'var(--bg-canvas)', border: '1.5px solid var(--idfc-red)' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, minWidth: 0 }}>
                  <div className="num" style={{ fontSize: 13, color: 'var(--text-tertiary)', fontFamily: 'monospace', flexShrink: 0 }}>{event.timeSlot}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{event.title}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 4 }}>{event.detail}</div>
                  </div>
                </div>
                <div className="caption" style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: OUTCOME_COLOR[event.outcome] ?? 'var(--text-secondary)' }}>{event.outcome}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tomorrow preview */}
        <div className="card anim-fade-up" style={{ padding: 24, marginTop: 56, borderTop: '2px solid var(--idfc-red)', animationDelay: '1000ms', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
          <div className="caption" style={{ color: 'var(--idfc-red-bright)', fontSize: 11 }}>TOMORROW'S PREVIEW</div>
          <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)' }}>{data.tomorrowPreview}</div>
        </div>

        {/* Actions */}
        <div className="anim-fade-up" style={{ marginTop: 32, display: 'flex', gap: 12, animationDelay: '1100ms' }}>
          <button className="btn-primary">Lock tomorrow's plan</button>
          <button className="btn-secondary">Send debrief to manager</button>
        </div>
      </div>
    </div>
  )
}

export default function DailyDebriefPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Loading…</div>
      </div>
    )
  }

  return (
    <AppShell>
      <DailyDebriefContent />
    </AppShell>
  )
}
