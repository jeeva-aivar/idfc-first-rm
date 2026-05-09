'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const NAV = [
  { id: 'morning-briefing', label: 'Morning Briefing', icon: '☀️', path: '/morning-briefing' },
  { id: 'priority-stack',   label: 'Priority Stack',   icon: '📋', path: '/priority-stack' },
  { id: 'auto-actions',     label: 'Auto-actions',     icon: '⚡', path: '/auto-actions' },
  { id: 'daily-debrief',    label: 'Daily Debrief',    icon: '📊', path: '/daily-debrief' },
  { id: 'leaderboard',      label: 'Leaderboard',      icon: '🏆', path: '/leaderboard' },
]

function LogoMark() {
  return (
    <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--idfc-red)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 11h8M8 14.5h8M8 18h5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const sidebarW = collapsed ? 72 : 240

  const initials = session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() ?? 'PS'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarW, minHeight: '100vh', flexShrink: 0,
        background: 'var(--bg-subtle)', borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', transition: 'width 200ms ease',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ height: 'var(--topbar-h)', padding: collapsed ? '0' : '0 18px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark />
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>IDFC FIRST</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>AI WORKSPACE</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {!collapsed && <div className="caption" style={{ fontSize: 10.5, color: 'var(--text-tertiary)', padding: '0 12px', marginBottom: 4 }}>WORKSPACE</div>}
          {NAV.map(item => {
            const active = pathname === item.path
            return (
              <Link key={item.id} href={item.path} style={{ textDecoration: 'none' }}>
                <div className={'nav-item' + (active ? ' active' : '')} style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? 0 : '0 12px', height: collapsed ? 36 : 32 }} title={collapsed ? item.label : undefined}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(c => !c)} style={{
          margin: collapsed ? '0 auto 12px' : '0 16px 12px',
          height: 30, width: collapsed ? 30 : 'auto', padding: collapsed ? 0 : '0 10px',
          display: 'inline-flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8,
          borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-card)',
          fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer',
        }}>
          {collapsed ? '→' : '← Collapse'}
        </button>

        {/* User */}
        <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10 }}>
          <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, cursor: 'pointer' }} title="Sign out" onClick={() => signOut({ callbackUrl: '/login' })}>{initials}</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{session?.user?.name ?? 'Priya Sharma'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Relationship Manager</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 'var(--topbar-h)', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {NAV.find(n => n.path === pathname)?.label ?? 'IDFC FIRST AI'}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>06:30 IST · WED 8 MAY 2026</span>
          </div>
          <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, cursor: 'pointer' }} title="Sign out" onClick={() => signOut({ callbackUrl: '/login' })}>{initials}</div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
