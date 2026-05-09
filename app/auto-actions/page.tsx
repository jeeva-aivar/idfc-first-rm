'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/shared/AppShell'
import type { AutoActions, ActionItem } from '@/lib/api-contracts'

const RM_ID = 'rm-priya-sharma-001'

const STATUS_TONE: Record<string, string> = {
  SENT: 'success', DONE: 'success', APPROVED: 'success',
  REVIEW: 'warning', FLAGGED: 'warning', READY: 'warning',
  PENDING: 'info',
}

const AGENT_LABEL: Record<string, string> = {
  EMAIL_AGENT: 'Email', KYC_AGENT: 'KYC', NBA_AGENT: 'NBA',
  MIS_AGENT: 'MIS', DOC_AGENT: 'Doc',
}

function ActionRow({ item }: { item: ActionItem }) {
  const tone = STATUS_TONE[item.status] ?? 'info'
  return (
    <div className="row-divider row-hover" style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 14, alignItems: 'flex-start', padding: '14px 18px', cursor: 'pointer' }}>
      <div className="num" style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingTop: 2, fontFamily: 'monospace' }}>{item.timestamp}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</div>
        <div className="body" style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{item.detail}</div>
        {item.customerName && (
          <div className="caption" style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>{item.customerName} · {AGENT_LABEL[item.agentSource] ?? item.agentSource}</div>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={'dot dot-' + tone} />
          <span className="caption" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{item.status}</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="density-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
      <div className="caption" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="num" style={{ fontSize: 32, fontWeight: 600, marginTop: 10, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-tertiary)' }}>{sub}</div>
    </div>
  )
}

function AutoActionsContent() {
  const { data, isLoading } = useQuery<AutoActions>({
    queryKey: ['auto-actions', RM_ID],
    queryFn: () => fetch(`/api/auto-actions?rmId=${RM_ID}`).then(r => r.json()),
  })

  if (isLoading) return <div style={{ padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading auto-actions…</div>
  if (!data) return <div style={{ padding: 48, color: 'var(--danger)', fontSize: 13 }}>Failed to load.</div>

  const stats = [
    { label: 'TIER-1 REPLIES', value: String(data.stats.tier1RepliesSent), sub: 'auto-sent' },
    { label: 'SALESFORCE UPDATED', value: String(data.stats.salesforceUpdated), sub: 'records' },
    { label: 'KYC REMINDERS', value: String(data.stats.kycRemindersSent), sub: 'dispatched' },
    { label: 'TIME SAVED', value: data.stats.timeSavedDisplay, sub: 'vs baseline' },
  ]

  return (
    <div className="anim-fade" style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
      <div className="anim-fade-up" style={{ marginBottom: 24 }}>
        <div className="caption" style={{ fontSize: 11, marginBottom: 8 }}>AUTO-ACTIONS · WHILE YOU SLEPT</div>
        <div className="h1" style={{ color: 'var(--text-primary)' }}>{data.summary.headline}</div>
        <div className="body-lg" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{data.summary.subtext}</div>
      </div>

      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40, animationDelay: '60ms' }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, animationDelay: '120ms' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="caption">COMMUNICATIONS</div>
            <div className="caption" style={{ color: 'var(--text-tertiary)', fontSize: 10.5 }}>{data.communications.length} entries</div>
          </div>
          {data.communications.map(item => <ActionRow key={item.id} item={item} />)}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="caption">SYSTEM UPDATES</div>
            <div className="caption" style={{ color: 'var(--text-tertiary)', fontSize: 10.5 }}>{data.systemUpdates.length} entries</div>
          </div>
          {data.systemUpdates.map(item => <ActionRow key={item.id} item={item} />)}
        </div>
      </div>

      <div className="anim-fade-up" style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12, animationDelay: '180ms' }}>
        <button className="btn-primary">Approve all ({data.summary.totalAwaitingReview})</button>
        <button className="btn-secondary">Configure rules</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-success">{data.summary.totalActionsComplete} complete</span>
          {data.summary.totalAwaitingReview > 0 && <span className="badge badge-warning">{data.summary.totalAwaitingReview} awaiting review</span>}
        </div>
      </div>
    </div>
  )
}

export default function AutoActionsPage() {
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
      <AutoActionsContent />
    </AppShell>
  )
}
