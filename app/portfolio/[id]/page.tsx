'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import { Icon } from '@/components/ui/Icon'

// ─── Full customer data ───────────────────────────────────────────────────────
const CUSTOMER_DETAIL: Record<string, any> = {
  '1': {
    id: 1, name: 'Mehta Group', segment: 'SME', tier: 'Priority', cifId: 'CIF-MH-004412',
    rm: 'Priya Sharma', since: '2019', city: 'Mumbai', industry: 'Manufacturing',
    revenue: 4.2, aum: 8.4, health: 62, creditLimit: 12, utilisation: 71,
    npa: false, kycDue: '2026-08-15', phone: '+91 98200 12345', email: 'cfo@mehtagroup.in',
    tags: ['CC Review Pending', 'FX Potential', 'KYC-Due-Q3'],
    scores: { engagement: 58, repayment: 81, growth: 44, loyalty: 72 },
    products: [
      { name: 'Working Capital OD', value: '₹8.5 Cr', status: 'active', util: 71 },
      { name: 'Term Loan', value: '₹3.5 Cr', status: 'active', util: 100 },
      { name: 'FX Hedging', value: 'Nil', status: 'opportunity' },
      { name: 'Trade Finance', value: '₹0.4 Cr', status: 'active', util: 40 },
    ],
    revenue12m: [3.1, 3.4, 3.6, 3.8, 3.9, 3.7, 4.0, 4.1, 4.2, 3.9, 4.1, 4.2],
    balanceTrend: [7.2, 7.5, 7.8, 8.1, 7.9, 8.0, 8.2, 8.3, 8.1, 8.2, 8.4, 8.4],
    conversations: [
      { date: '08 May 2026', type: 'Call', summary: 'Discussed sanction letter for CC renewal. CMD unavailable — follow-up at 09:30 tomorrow.', sentiment: 'neutral', aiDraft: true },
      { date: '01 May 2026', type: 'Email', summary: 'Sent revised term sheet for ₹12 Cr limit. Awaiting board sign-off.', sentiment: 'positive', aiDraft: false },
      { date: '22 Apr 2026', type: 'Meeting', summary: 'Quarterly review at Mehta HQ. Identified FX exposure of ~$2M annually — pitched hedging product.', sentiment: 'positive', aiDraft: false },
      { date: '10 Apr 2026', type: 'Email', summary: 'KYC documents reminder sent — 3 of 6 docs pending.', sentiment: 'neutral', aiDraft: true },
      { date: '28 Mar 2026', type: 'Call', summary: 'CMD flagged delay in disbursement. Escalated to credit ops — resolved within 48 hrs.', sentiment: 'negative', aiDraft: false },
    ],
    importantDates: [
      { label: 'CC Renewal deadline', date: '30 Jun 2026', urgency: 'high', icon: 'AlertCircle' },
      { label: 'KYC expiry', date: '15 Aug 2026', urgency: 'medium', icon: 'FileText' },
      { label: 'Founder birthday', date: '12 Aug 2026', urgency: 'low', icon: 'Gift' },
      { label: 'FY quarter close', date: '30 Jun 2026', urgency: 'medium', icon: 'Calendar' },
      { label: 'Term Loan maturity', date: '15 Dec 2026', urgency: 'medium', icon: 'Landmark' },
    ],
    preferences: {
      contact: 'WhatsApp + Email (no calls before 10am)',
      decisionStyle: 'CMD-driven — all decisions need Rajiv Mehta sign-off',
      language: 'English with occasional Hindi',
      meetingPreference: 'Boardroom at their HQ, Andheri East',
      keyRelationships: ['Rajiv Mehta (CMD)', 'Sunita Mehta (CFO)', 'Aman Verma (GM Ops)'],
      sensitivities: 'Competitor pricing very sensitive — do not quote other banks',
    },
    aiInsight: 'Mehta Group is a medium-risk relationship showing declining health score (-8 pts this quarter). The ₹12 Cr CC renewal is the critical near-term event. FX hedging is an upsell opportunity estimated at ₹18L annual revenue. Recommend personal visit before sanction call.',
  },
  '2': {
    id: 2, name: 'Iyer Family', segment: 'Wealth', tier: 'Priority', cifId: 'CIF-WM-007731',
    rm: 'Priya Sharma', since: '2021', city: 'Chennai', industry: 'Wealth Management',
    revenue: 2.8, aum: 12.1, health: 88, creditLimit: 5, utilisation: 12,
    npa: false, kycDue: '2027-02-10', phone: '+91 98400 56789', email: 'krishna.iyer@gmail.com',
    tags: ['Wealth HNI', 'Equity-Oriented', 'Referral Source'],
    scores: { engagement: 91, repayment: 96, growth: 82, loyalty: 88 },
    products: [
      { name: 'Portfolio Management', value: '₹8.2 Cr', status: 'active', util: null },
      { name: 'Mutual Funds', value: '₹2.4 Cr', status: 'active', util: null },
      { name: 'Fixed Deposits', value: '₹1.5 Cr', status: 'active', util: null },
      { name: 'Insurance (ULIP)', value: '₹0 ', status: 'opportunity' },
    ],
    revenue12m: [2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.5, 2.6, 2.7, 2.7, 2.8, 2.8],
    balanceTrend: [9.8, 10.2, 10.5, 10.8, 11.0, 11.2, 11.0, 11.3, 11.5, 11.8, 12.0, 12.1],
    conversations: [
      { date: '07 May 2026', type: 'Call', summary: 'Discussed shifting 15% of portfolio to international equities. Client is interested — needs brochure.', sentiment: 'positive', aiDraft: true },
      { date: '15 Apr 2026', type: 'Meeting', summary: 'Wealth pitch for ULIP product. Client receptive but wants to compare with LIC terms.', sentiment: 'positive', aiDraft: false },
      { date: '02 Apr 2026', type: 'Email', summary: 'Sent Q1 portfolio performance report. 14.2% returns vs 11.8% benchmark.', sentiment: 'positive', aiDraft: false },
    ],
    importantDates: [
      { label: 'FD maturity — ₹1.5 Cr', date: '22 May 2026', urgency: 'high', icon: 'Landmark' },
      { label: 'Wealth pitch follow-up', date: '16 May 2026', urgency: 'high', icon: 'TrendingUp' },
      { label: 'Anniversary — Mr & Mrs Iyer', date: '05 Jun 2026', urgency: 'low', icon: 'Gift' },
      { label: 'KYC renewal', date: '10 Feb 2027', urgency: 'low', icon: 'FileText' },
    ],
    preferences: {
      contact: 'WhatsApp preferred, email for documents',
      decisionStyle: 'Joint decision with spouse — include Mrs Lakshmi Iyer in key meetings',
      language: 'Tamil / English',
      meetingPreference: 'Branch or their residence in RA Puram, Chennai',
      keyRelationships: ['Krishna Iyer (primary)', 'Lakshmi Iyer (joint holder)', 'CA Rajan (advisor)'],
      sensitivities: 'Very return-sensitive — always lead with performance data',
    },
    aiInsight: 'Iyer Family is a high-value, high-engagement wealth customer. FD maturity on 22 May is the most time-sensitive action — recommend calling today to discuss reinvestment options. ULIP pitch has strong probability of close if benchmarked against LIC. Also a referral source — 2 customers introduced in last 12 months.',
  },
  '9': {
    id: 9, name: 'Verma Capital', segment: 'Wealth', tier: 'Priority', cifId: 'CIF-VC-009124',
    rm: 'Priya Sharma', since: '2018', city: 'Delhi', industry: 'Investment Holding',
    revenue: 5.2, aum: 18.4, health: 95, creditLimit: 20, utilisation: 8,
    npa: false, kycDue: '2027-06-30', phone: '+91 99100 77777', email: 'office@vermacapital.in',
    tags: ['Ultra HNI', 'Equity + RE', 'Board-level Relationship'],
    scores: { engagement: 97, repayment: 98, growth: 92, loyalty: 95 },
    products: [
      { name: 'Portfolio Management', value: '₹12.4 Cr', status: 'active', util: null },
      { name: 'Real Estate Financing', value: '₹4.0 Cr', status: 'active', util: 20 },
      { name: 'Structured Products', value: '₹2.0 Cr', status: 'active', util: null },
      { name: 'NRI Services', value: 'Nil', status: 'opportunity' },
    ],
    revenue12m: [4.1, 4.3, 4.5, 4.7, 4.8, 4.9, 5.0, 5.1, 5.0, 5.1, 5.2, 5.2],
    balanceTrend: [14.2, 15.0, 15.6, 16.1, 16.5, 17.0, 17.2, 17.5, 17.8, 18.0, 18.2, 18.4],
    conversations: [
      { date: '05 May 2026', type: 'Meeting', summary: 'Q4 portfolio review. 18.4% returns. Client very satisfied — discussed expanding RE financing.', sentiment: 'positive', aiDraft: false },
      { date: '18 Apr 2026', type: 'Email', summary: 'NRI services brochure sent for family members based in Singapore.', sentiment: 'positive', aiDraft: true },
    ],
    importantDates: [
      { label: 'Portfolio review (Q2)', date: '30 Jun 2026', urgency: 'medium', icon: 'TrendingUp' },
      { label: 'Structured product maturity', date: '15 Aug 2026', urgency: 'medium', icon: 'Landmark' },
      { label: 'Anniversary — client on-boarding', date: '10 Jun 2026', urgency: 'low', icon: 'Gift' },
    ],
    preferences: {
      contact: 'Only through personal secretary (Meera) — 9am–6pm weekdays',
      decisionStyle: 'Independent, data-driven — prepare a one-page summary always',
      language: 'English only',
      meetingPreference: 'Their Connaught Place office or IDFC branch lounge',
      keyRelationships: ['Anand Verma (Principal)', 'Meera Sinha (Secretary)', 'CA Ravi Bhatia'],
      sensitivities: 'Hates being called without appointment; very private about portfolio composition',
    },
    aiInsight: 'Verma Capital is the highest health score in your book (95). No immediate risks. Focus: NRI services for Singapore family — strong cross-sell potential. Structured product matures in August — begin reinvestment conversation by June.',
  },
}

// Fallback for customers without full detail
function getFallback(id: string, name: string): any {
  return {
    id, name, segment: 'SME', tier: 'Standard', cifId: `CIF-${id}-DEMO`,
    rm: 'Priya Sharma', since: '2022', city: 'Mumbai', industry: 'General',
    revenue: 2.0, aum: 4.0, health: 70, creditLimit: 6, utilisation: 55,
    npa: false, kycDue: '2026-12-01', phone: '+91 98000 00000', email: 'contact@example.com',
    tags: ['Standard'],
    scores: { engagement: 68, repayment: 75, growth: 60, loyalty: 70 },
    products: [
      { name: 'Working Capital OD', value: '₹4 Cr', status: 'active', util: 55 },
      { name: 'Trade Finance', value: 'Nil', status: 'opportunity' },
    ],
    revenue12m: [1.6, 1.7, 1.8, 1.9, 2.0, 1.9, 2.0, 2.1, 2.0, 2.0, 2.0, 2.0],
    balanceTrend: [3.2, 3.4, 3.6, 3.7, 3.8, 3.9, 4.0, 4.0, 3.9, 4.0, 4.0, 4.0],
    conversations: [
      { date: '01 May 2026', type: 'Call', summary: 'Routine check-in. No immediate concerns flagged.', sentiment: 'neutral', aiDraft: false },
    ],
    importantDates: [
      { label: 'KYC renewal', date: '01 Dec 2026', urgency: 'medium', icon: 'FileText' },
    ],
    preferences: {
      contact: 'Email preferred',
      decisionStyle: 'Promoter-driven',
      language: 'English / Hindi',
      meetingPreference: 'Branch',
      keyRelationships: ['Promoter (primary)'],
      sensitivities: 'None flagged',
    },
    aiInsight: 'Stable relationship. No immediate risks or upsell opportunities flagged. Maintain regular check-in cadence.',
  }
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

function MiniBarChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
        {data.map((v, i) => {
          const h = max === min ? 50 : Math.round(((v - min) / (max - min)) * 44) + 8
          const isLast = i === data.length - 1
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: '100%', height: h, background: isLast ? color : `${color}55`, borderRadius: '3px 3px 0 0', position: 'relative' }}>
                {isLast && (
                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 8.5, fontWeight: 600, color, whiteSpace: 'nowrap', marginBottom: 2 }}>{v}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
        {MONTHS.map((m, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{m}</div>
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 10.5, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

// ─── Radar / score ring ───────────────────────────────────────────────────────
function ScoreRing({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 22, circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={58} height={58} viewBox="0 0 58 58">
        <circle cx={29} cy={29} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={5} />
        <circle cx={29} cy={29} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 29 29)" />
        <text x={29} y={33} textAnchor="middle" fill="var(--text-primary)" fontSize={11} fontWeight={600}>{value}</text>
      </svg>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'center' }}>{label}</div>
    </div>
  )
}

// ─── Sentiment dot ────────────────────────────────────────────────────────────
const SENTIMENT_COLOR: Record<string, string> = { positive: '#16a34a', neutral: '#c49e62', negative: '#dc2626' }
const TYPE_ICON: Record<string, string> = { Call: 'Phone', Email: 'Mail', Meeting: 'Users' }

// ─── Health bar ──────────────────────────────────────────────────────────────
function HealthBar({ val, wide }: { val: number; wide?: boolean }) {
  const color = val >= 80 ? '#16a34a' : val >= 60 ? '#c49e62' : '#dc2626'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: wide ? 120 : 64, height: 6, borderRadius: 999, background: 'var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{val}</span>
    </div>
  )
}

// ─── Urgency badge ────────────────────────────────────────────────────────────
const URGENCY_STYLE: Record<string, any> = {
  high: { bg: 'rgba(220,38,38,0.08)', color: '#b91c1c' },
  medium: { bg: 'rgba(196,158,98,0.12)', color: '#92400e' },
  low: { bg: 'var(--bg-subtle)', color: 'var(--text-tertiary)' },
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Conversations', 'Products', 'Preferences', 'Dates']

function CustomerDetailContent({ customerId }: { customerId: string }) {
  const router = useRouter()
  const [tab, setTab] = useState('Overview')
  const c = CUSTOMER_DETAIL[customerId] ?? getFallback(customerId, `Customer #${customerId}`)

  const urgencyOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }

  return (
    <div className="anim-fade" style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Back nav */}
      <button
        onClick={() => router.push('/portfolio')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 12.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24, padding: 0 }}
      >
        <Icon name="ChevronLeft" size={13} />
        Portfolio
      </button>

      {/* Hero row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            {c.cifId} · {c.segment} · {c.tier} · {c.city}
          </div>
          <h1 className="font-serif" style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.1, margin: 0, color: 'var(--text-primary)' }}>
            {c.name}
          </h1>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {c.tags.map((t: string) => (
              <span key={t} style={{ display: 'inline-flex', height: 20, padding: '0 8px', borderRadius: 4, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-subtle)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={`tel:${c.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-card)', fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'inherit' }}>
            <Icon name="Phone" size={13} /> Call
          </a>
          <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-card)', fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'inherit' }}>
            <Icon name="Mail" size={13} /> Email
          </a>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 8, border: 'none', background: 'var(--idfc-red-bright)', fontSize: 13, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
            <Icon name="Plus" size={13} /> Log interaction
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 28, borderTop: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)' }}>
        {[
          { label: 'Revenue (12m)', value: `₹${c.revenue} Cr` },
          { label: 'AUM', value: `₹${c.aum} Cr` },
          { label: 'Credit Limit', value: `₹${c.creditLimit} Cr` },
          { label: 'Utilisation', value: `${c.utilisation}%` },
          { label: 'Customer Since', value: c.since },
        ].map(k => (
          <div key={k.label} style={{ padding: '18px 22px', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
            <div className="num" style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-subtle)', marginBottom: 28 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13.5, fontWeight: tab === t ? 600 : 400, color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
            borderBottom: tab === t ? '2px solid var(--idfc-red-bright)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 120ms ease',
          }}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI Insight */}
            <div style={{ background: 'linear-gradient(135deg,rgba(220,38,38,0.04) 0%,var(--bg-card) 60%)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--idfc-red-bright)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--idfc-red-bright)', fontWeight: 600 }}>IDFC FIRST AI · Relationship Insight</span>
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-primary)' }}>{c.aiInsight}</p>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 20px' }}>
                <MiniBarChart data={c.revenue12m} color="var(--idfc-red-bright)" label="Revenue ₹ Cr · 12 months" />
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 20px' }}>
                <MiniBarChart data={c.balanceTrend} color="#2563eb" label="AUM ₹ Cr · 12 months" />
              </div>
            </div>

            {/* Relationship scores */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Relationship Scores</div>
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                <ScoreRing label="Engagement" value={c.scores.engagement} color="#dc2626" />
                <ScoreRing label="Repayment" value={c.scores.repayment} color="#16a34a" />
                <ScoreRing label="Growth" value={c.scores.growth} color="#2563eb" />
                <ScoreRing label="Loyalty" value={c.scores.loyalty} color="#c49e62" />
              </div>
            </div>

            {/* Recent conversations (last 2) */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Recent Interactions</div>
                <button onClick={() => setTab('Conversations')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--idfc-red-bright)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>View all →</button>
              </div>
              {c.conversations.slice(0, 2).map((cv: any, i: number) => (
                <div key={i} style={{ padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', gap: 14 }}>
                  <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={TYPE_ICON[cv.type] ?? 'MessageSquare'} size={14} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{cv.type}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-tertiary)' }}>{cv.date}</span>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: SENTIMENT_COLOR[cv.sentiment], marginLeft: 'auto' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cv.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Health */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Relationship Health</div>
              <HealthBar val={c.health} wide />
              <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                {c.health >= 80 ? 'Strong — no immediate action required.' : c.health >= 60 ? 'Moderate — monitor closely this week.' : 'At-risk — immediate attention needed.'}
              </div>
            </div>

            {/* Upcoming dates */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Important Dates</div>
              </div>
              {[...c.importantDates].sort((a: any, b: any) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]).map((d: any, i: number) => (
                <div key={i} style={{ padding: '12px 18px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: URGENCY_STYLE[d.urgency].bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={d.icon} size={13} style={{ color: URGENCY_STYLE[d.urgency].color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>{d.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: URGENCY_STYLE[d.urgency].color, marginTop: 2 }}>{d.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preferences summary */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Preferences</div>
              {[
                { label: 'Contact', value: c.preferences.contact },
                { label: 'Language', value: c.preferences.language },
                { label: 'Style', value: c.preferences.decisionStyle },
              ].map(p => (
                <div key={p.label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{p.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45 }}>{p.value}</div>
                </div>
              ))}
              <button onClick={() => setTab('Preferences')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--idfc-red-bright)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', padding: 0 }}>View full profile →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONVERSATIONS ── */}
      {tab === 'Conversations' && (
        <div style={{ maxWidth: 820 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
            {c.conversations.map((cv: any, i: number) => (
              <div key={i} style={{ padding: '20px 24px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={TYPE_ICON[cv.type] ?? 'MessageSquare'} size={15} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{cv.type}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{cv.date}</span>
                    <span style={{ display: 'inline-flex', height: 18, padding: '0 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: `${SENTIMENT_COLOR[cv.sentiment]}18`, color: SENTIMENT_COLOR[cv.sentiment] }}>{cv.sentiment}</span>
                    {cv.aiDraft && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 18, padding: '0 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(220,38,38,0.07)', color: 'var(--idfc-red-bright)' }}>AI draft available</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{cv.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === 'Products' && (
        <div style={{ maxWidth: 860 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 130px 140px', padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
              {['Product', 'Value', 'Status', 'Utilisation'].map(h => (
                <div key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{h}</div>
              ))}
            </div>
            {c.products.map((p: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 130px 140px', padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', alignItems: 'center' }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</div>
                <div className="num" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{p.value}</div>
                <div>
                  <span style={{ display: 'inline-flex', height: 20, padding: '0 8px', borderRadius: 4, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: p.status === 'active' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.06)', color: p.status === 'active' ? '#166534' : 'var(--idfc-red-bright)' }}>{p.status}</span>
                </div>
                <div>
                  {p.util !== null && p.util !== undefined ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 5, borderRadius: 999, background: 'var(--border-subtle)', overflow: 'hidden' }}>
                        <div style={{ width: `${p.util}%`, height: '100%', background: p.util > 85 ? '#dc2626' : p.util > 60 ? '#c49e62' : '#16a34a', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{p.util}%</span>
                    </div>
                  ) : <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PREFERENCES ── */}
      {tab === 'Preferences' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}>
          {[
            { label: 'Preferred Contact Method', value: c.preferences.contact },
            { label: 'Decision Making Style', value: c.preferences.decisionStyle },
            { label: 'Language Preference', value: c.preferences.language },
            { label: 'Meeting Preference', value: c.preferences.meetingPreference },
            { label: 'Sensitivities / Watch-outs', value: c.preferences.sensitivities },
          ].map(p => (
            <div key={p.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{p.label}</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{p.value}</div>
            </div>
          ))}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 22px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Key Relationships</div>
            {c.preferences.keyRelationships.map((r: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {r.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <span style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DATES ── */}
      {tab === 'Dates' && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
            {[...c.importantDates].sort((a: any, b: any) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]).map((d: any, i: number) => (
              <div key={i} style={{ padding: '18px 22px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: URGENCY_STYLE[d.urgency].bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={d.icon} size={16} style={{ color: URGENCY_STYLE[d.urgency].color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{d.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: URGENCY_STYLE[d.urgency].color }}>{d.date}</div>
                </div>
                <span style={{ display: 'inline-flex', height: 20, padding: '0 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: URGENCY_STYLE[d.urgency].bg, color: URGENCY_STYLE[d.urgency].color }}>{d.urgency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CustomerDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '')
  return (
    <AppShell>
      <CustomerDetailContent customerId={id} />
    </AppShell>
  )
}
