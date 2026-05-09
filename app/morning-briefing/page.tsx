'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/shared/AppShell'
import type { MorningBriefing } from '@/lib/api-contracts'

const RM_ID = 'rm-priya-sharma-001'

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="density-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
      <div className="caption" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="num" style={{ fontSize: 32, fontWeight: 600, marginTop: 10, color: accent ?? 'var(--text-primary)', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-tertiary)' }}>{sub}</div>}
    </div>
  )
}

const BADGE_TONE: Record<string, string> = {
  HIGHEST_RISK: 'badge-danger',
  DECISION_GRADE: 'badge-info',
  TIME_SAVED: 'badge-success',
  NBA: 'badge-info',
}

const STATUS_TONE: Record<string, string> = {
  PREP_READY: 'warning',
  ALIGNED: 'info',
  DRAFTED: 'warning',
  SURFACED: 'info',
}

function MorningBriefingContent() {
  const { data, isLoading, error } = useQuery<MorningBriefing>({
    queryKey: ['morning-briefing', RM_ID],
    queryFn: () => fetch(`/api/morning-briefing?rmId=${RM_ID}`).then(r => r.json()),
  })

  if (isLoading) return <div style={{ padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading morning briefing…</div>
  if (error || !data) return <div style={{ padding: 48, color: 'var(--danger)', fontSize: 13 }}>Failed to load. Check API.</div>

  const stats = [
    { label: 'TIER-1 REPLIES', value: String(data.overnightStats.tier1RepliesSent), sub: 'auto-sent overnight' },
    { label: 'SALESFORCE UPDATED', value: String(data.overnightStats.salesforceUpdated), sub: 'records synced' },
    { label: 'KYC REMINDERS', value: String(data.overnightStats.kycRemindersSent), sub: 'dispatched' },
    { label: 'TIME SAVED', value: data.overnightStats.timeSavedDisplay, sub: 'vs manual baseline', accent: 'var(--success)' },
  ]

  return (
    <div className="anim-fade" style={{ padding: '32px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 32 }}>
        <div className="h2" style={{ color: 'var(--text-primary)' }}>Good morning, {data.rm.name.split(' ')[0]}.</div>
        <div className="body-lg" style={{ color: 'var(--text-secondary)', maxWidth: 720, marginTop: 8 }}>
          While you slept, IDFC FIRST AI handled the routine. Here's what needs your judgement today.
        </div>
      </div>

      {/* Stats */}
      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40, animationDelay: '60ms' }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Body */}
      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 24, animationDelay: '120ms' }}>
        {/* Priorities */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="caption" style={{ fontSize: 11 }}>TODAY'S PRIORITIES · RANKED & REASONED</div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>Scored by deal value × urgency × sentiment risk</div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {data.topPriorities.map((p, i) => (
              <div key={p.id} className="row-divider row-hover" style={{ display: 'grid', gridTemplateColumns: '72px 1fr 200px 20px', alignItems: 'center', gap: 16, padding: '18px 22px', cursor: 'pointer' }}>
                <div className="num" style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{p.timeSlot}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</div>
                  <div className="body" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{p.customerName}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                  <span className={'badge ' + (BADGE_TONE[p.urgencyBadge] ?? 'badge-info')}>{p.urgencyBadge.replace(/_/g, ' ')}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className={'dot dot-' + (STATUS_TONE[p.status] ?? 'info')} />
                    <span className="caption" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{p.status.replace(/_/g, ' ')}</span>
                  </span>
                </div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>›</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar cards */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Manager alignment */}
          <div className="card density-card">
            <div className="caption" style={{ fontSize: 11 }}>MANAGER ALIGNMENT</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>VJ</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{data.managerAlignment.managerName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Cluster Head · Mumbai N</div>
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 15, lineHeight: 1.5, fontWeight: 500, color: 'var(--text-primary)', borderLeft: '2px solid var(--idfc-red)', paddingLeft: 14 }}>
              "{data.managerAlignment.message}"
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="dot dot-success" />
              <span className="caption" style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>{data.managerAlignment.alignedCount}/{data.managerAlignment.totalCount} aligned</span>
            </div>
          </div>

          {/* Tomorrow preview */}
          <div className="card density-card">
            <div className="caption" style={{ fontSize: 11 }}>TOMORROW'S PREVIEW</div>
            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {data.tomorrowPreview}
            </div>
          </div>

          {/* RM stats */}
          <div className="card density-card">
            <div className="caption" style={{ fontSize: 11 }}>YOUR WEEK</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
              <div>
                <div className="caption" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>RANK</div>
                <div className="num" style={{ fontSize: 24, fontWeight: 300, marginTop: 4 }}>#{data.rm.rank ?? '—'}</div>
              </div>
              <div>
                <div className="caption" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>STREAK</div>
                <div className="num" style={{ fontSize: 24, fontWeight: 300, marginTop: 4 }}>{data.rm.streakDays}d</div>
              </div>
              <div>
                <div className="caption" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>POINTS</div>
                <div className="num" style={{ fontSize: 24, fontWeight: 300, marginTop: 4 }}>{data.rm.weeklyPoints.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function MorningBriefingPage() {
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
      <MorningBriefingContent />
    </AppShell>
  )
}
