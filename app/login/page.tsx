'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })
    if (result?.ok) {
      router.push('/morning-briefing')
    } else {
      setError('Invalid credentials. Try demo@idfcfirst.com / demo')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--idfc-red)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 11h8M8 14.5h8M8 18h5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>IDFC FIRST</div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>AI WORKSPACE</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Good morning.</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Sign in to your workspace.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="caption" style={{ fontSize: 10.5, display: 'block', marginBottom: 6 }}>EMAIL</label>
              <input
                name="email"
                type="email"
                defaultValue="demo@idfcfirst.com"
                required
                style={{ width: '100%', height: 40, padding: '0 12px', fontSize: 14, background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 8, outline: 0, color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label className="caption" style={{ fontSize: 10.5, display: 'block', marginBottom: 6 }}>PASSWORD</label>
              <input
                name="password"
                type="password"
                defaultValue="demo"
                required
                style={{ width: '100%', height: 40, padding: '0 12px', fontSize: 14, background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 8, outline: 0, color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>
            {error && <div style={{ fontSize: 13, color: 'var(--danger)', padding: '8px 12px', background: '#fbf0f2', border: '1px solid #ecc3cb', borderRadius: 8 }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: 40, marginTop: 4, fontSize: 14 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
            Demo: <strong style={{ color: 'var(--text-secondary)' }}>demo@idfcfirst.com</strong> / <strong style={{ color: 'var(--text-secondary)' }}>demo</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
