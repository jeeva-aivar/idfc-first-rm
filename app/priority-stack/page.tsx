'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/shared/AppShell'
import type { PriorityStack, PriorityItem } from '@/lib/api-contracts'

const RM_ID = 'rm-priya-sharma-001'

const BADGE_MAP: Record<string, string> = {
  HIGHEST_RISK: 'badge-danger', DECISION_GRADE: 'badge-info',
  TIME_SAVED: 'badge-success', NBA: 'badge-info',
}
const STATUS_TONE: Record<string, string> = {
  PREP_READY: 'warning', ALIGNED: 'info', DRAFTED: 'warning', SURFACED: 'info',
}

function PrepPackRow({ label, detail, badge, completed }: { label: string; detail: string; badge: string; completed: boolean }) {
  const badgeCls = badge === 'AUTO_PREPARED' ? 'badge-success' : badge === 'EMPLOYEE_AI' ? 'badge-info' : 'badge-warning'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
      <span style={{ fontSize: 16, marginTop: 1 }}>{completed ? '✓' : '○'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{detail}</div>
      </div>
      <span className={'badge ' + badgeCls}>{badge.replace(/_/g, ' ')}</span>
    </div>
  )
}

function PriorityCard({ p }: { p: PriorityItem }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="card density-card anim-fade-up" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="num" style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>#{p.rank}</div>
          <div className="num" style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'monospace', marginTop: 2 }}>{p.timeSlot}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={'dot dot-' + (STATUS_TONE[p.status] ?? 'info')} />
          <span className="caption" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{p.status.replace(/_/g, ' ')}</span>
        </div>
      </div>

      <div className="h2" style={{ marginTop: 16, color: 'var(--text-primary)' }}>
        {p.customerName}
        <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}> · {p.title.split('·').slice(1).join('·').trim() || p.title}</span>
      </div>
      <div className="body" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{p.description}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <span className="badge badge-info">{p.whyNowLabel}</span>
        <span className={'badge ' + (BADGE_MAP[p.urgencyBadge] ?? 'badge-info')}>{p.urgencyBadge.replace(/_/g, ' ')}</span>
        {p.priorityScore && <span className="num" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 4 }}>Score {p.priorityScore.toFixed(1)}</span>}
      </div>

      {p.prepPacks.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {p.prepPacks.map((pp, i) => (
            <PrepPackRow key={i} {...pp} />
          ))}
        </div>
      )}

      {p.dealValue && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div className="caption" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>DEAL VALUE</div>
            <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>₹{(p.dealValue / 10000000).toFixed(1)} Cr</div>
          </div>
          {p.managerAligned && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#eef4ee', border: '1px solid #c8dccd', borderRadius: 8 }}>
              <span className="dot dot-success" />
              <span className="caption" style={{ fontSize: 10.5, color: 'var(--success)' }}>MANAGER ALIGNED</span>
            </div>
          )}
        </div>
      )}

      <button className="ghost-link" onClick={() => setExpanded(e => !e)} style={{ marginTop: 20, fontSize: 13 }}>
        {expanded ? 'Collapse' : 'View prep pack details'} {expanded ? '↑' : '→'}
      </button>
    </div>
  )
}

function PriorityStackContent() {
  const { data, isLoading } = useQuery<PriorityStack>({
    queryKey: ['priorities', RM_ID],
    queryFn: () => fetch(`/api/priorities?rmId=${RM_ID}`).then(r => r.json()),
  })

  if (isLoading) return <div style={{ padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading priorities…</div>
  if (!data) return <div style={{ padding: 48, color: 'var(--danger)', fontSize: 13 }}>Failed to load.</div>

  return (
    <div className="anim-fade" style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <div className="anim-fade-up" style={{ marginBottom: 32 }}>
        <div className="h1" style={{ color: 'var(--text-primary)' }}>Today's priority stack</div>
        <div className="body-lg" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          {data.priorities.length} actions ranked · {data.metadata.scoringMethod}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.priorities.map(p => <PriorityCard key={p.id} p={p} />)}
      </div>
    </div>
  )
}

export default function PriorityStackPage() {
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
      <PriorityStackContent />
    </AppShell>
  )
}
