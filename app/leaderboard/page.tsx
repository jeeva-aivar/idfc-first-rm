'use client'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import type { Leaderboard } from '@/lib/api-contracts'

const RM_ID = 'rm-priya-sharma-001'

const PERIODS = [
  { key: 'THIS_WEEK', label: 'This Week' },
  { key: 'THIS_MONTH', label: 'This Month' },
]

function LeaderboardContent() {
  const [period, setPeriod] = useState('THIS_WEEK')

  const { data, isLoading } = useQuery<Leaderboard>({
    queryKey: ['leaderboard', RM_ID, period],
    queryFn: () => fetch(`/api/leaderboard?rmId=${RM_ID}&period=${period}`).then(r => r.json()),
  })

  if (isLoading) return <div style={{ padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading leaderboard…</div>
  if (!data) return <div style={{ padding: 48, color: 'var(--danger)', fontSize: 13 }}>Failed to load.</div>

  return (
    <div className="anim-fade" style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
      <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div className="h1">Leaderboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="caption" style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>{data.meta.cluster} · {data.meta.totalRMs} RMs</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 4, background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            {PERIODS.map(p => (
              <button key={p.key} className={'tab' + (period === p.key ? ' active' : '')} onClick={() => setPeriod(p.key)}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 32 }}>
        <div>
          {/* Hero stats */}
          <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 40, animationDelay: '60ms' }}>
            <div>
              <div className="caption" style={{ fontSize: 11 }}>YOUR RANK</div>
              <div className="num" style={{ fontSize: 56, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 12 }}>#{data.currentRM.rank}</div>
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>in {data.meta.cluster}</div>
            </div>
            <div>
              <div className="caption" style={{ fontSize: 11 }}>STREAK</div>
              <div className="num" style={{ fontSize: 56, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 12 }}>{data.currentRM.streakDays} <span style={{ fontSize: 24, color: 'var(--text-tertiary)', fontWeight: 400 }}>days</span></div>
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{data.currentRM.points.toLocaleString()} pts this week</div>
            </div>
          </div>

          {/* Table */}
          <div className="anim-fade-up" style={{ animationDelay: '120ms' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 80px 100px 60px', padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              {['#', 'NAME', 'STREAK', 'POINTS', 'Δ'].map(h => (
                <div key={h} className="caption" style={{ fontSize: 10.5, color: 'var(--text-tertiary)', textAlign: h === '#' || h === 'NAME' ? 'left' : 'right' }}>{h}</div>
              ))}
            </div>
            {data.rankings.map(r => (
              <div key={r.name} style={{
                display: 'grid', gridTemplateColumns: '48px 1fr 80px 100px 60px',
                alignItems: 'center', padding: '14px 16px',
                borderTop: '1px solid var(--border-subtle)',
                background: r.isCurrentUser ? 'var(--bg-subtle)' : 'transparent',
                borderLeft: r.isCurrentUser ? '2px solid var(--idfc-red)' : '2px solid transparent',
              }}>
                <div className="num" style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-tertiary)' }}>{String(r.rank).padStart(2, '0')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                    {r.name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: r.isCurrentUser ? 600 : 500 }}>{r.name}</span>
                </div>
                <div className="num" style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{r.streakDays}d</div>
                <div className="num" style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 14, fontWeight: 500 }}>{r.points.toLocaleString()}</div>
                <div className="num" style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: r.delta > 0 ? 'var(--success)' : r.delta < 0 ? 'var(--danger)' : 'var(--text-tertiary)', fontWeight: 500 }}>
                  {r.delta > 0 ? '+' : ''}{r.delta}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points guide */}
        <aside className="card density-card anim-fade-up" style={{ padding: 22, alignSelf: 'start', animationDelay: '180ms' }}>
          <div className="caption" style={{ fontSize: 11 }}>HOW POINTS WORK</div>
          <ul style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { pts: '+50', label: 'Auto-action approved', color: 'var(--success)' },
              { pts: '+100', label: 'Priority task completed', color: 'var(--success)' },
              { pts: '+200', label: 'NBA converted', color: 'var(--success)' },
              { pts: '−150', label: 'SLA breach', color: 'var(--danger)' },
            ].map(p => (
              <li key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.label}</span>
                <span className="num" style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: p.color }}>{p.pts} pts</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
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
      <LeaderboardContent />
    </AppShell>
  )
}
