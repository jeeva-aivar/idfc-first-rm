'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import { Icon } from '@/components/ui/Icon'
import { ALL_ITEMS, BADGE_STYLE, type Badge } from '@/lib/auto-actions-data'

const TABS = [
  { id: 'summary',    label: 'Summary',           icon: 'LayoutDashboard' },
  { id: 'email',      label: 'Original Email',     icon: 'Mail' },
  { id: 'draft',      label: 'AI Draft',           icon: 'Sparkles' },
  { id: 'analysis',   label: 'AI Analysis',        icon: 'BrainCircuit' },
  { id: 'customer',   label: 'Customer Context',   icon: 'User' },
  { id: 'compliance', label: 'Compliance Check',   icon: 'ShieldCheck' },
  { id: 'audit',      label: 'Audit Trail',        icon: 'ScrollText' },
  { id: 'related',    label: 'Related Actions',    icon: 'GitBranch' },
] as const
type TabId = typeof TABS[number]['id']

function BadgePill({ badge, large }: { badge: Badge; large?: boolean }) {
  const s = BADGE_STYLE[badge] ?? BADGE_STYLE.DONE
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: large ? 28 : 22, padding: large ? '0 12px' : '0 8px',
      border: `1px solid ${s.border}`, borderRadius: 4,
      fontFamily: "'JetBrains Mono','SF Mono',ui-monospace,monospace",
      fontSize: large ? 11.5 : 10, fontWeight: 700, letterSpacing: '0.1em', color: s.color,
      whiteSpace: 'nowrap',
    }}>{badge}</span>
  )
}

function Mono({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.12em', ...style }}>{children}</div>
}

function KVRow({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <Mono style={{ minWidth: 140, paddingTop: 2 }}>{k}</Mono>
      <span style={{ fontSize: 13.5, color: accent ?? 'var(--text-primary)', lineHeight: 1.5, flex: 1 }}>{v}</span>
    </div>
  )
}

function ScoreBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: 'var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

function CheckItem({ text, pass }: { text: string; pass: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: pass ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon name={pass ? 'Check' : 'X'} size={11} style={{ color: pass ? '#16a34a' : '#dc2626' }} />
      </div>
      <span style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

function AuditStep({ time, actor, action, detail, idx }: { time: string; actor: string; action: string; detail: string; idx: number }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: idx === 0 ? 'var(--idfc-red-bright)' : 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={actor === 'AI' ? 'Sparkles' : 'User'} size={13} style={{ color: idx === 0 ? '#fff' : 'var(--text-tertiary)' }} />
        </div>
        <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)', marginTop: 4 }} />
      </div>
      <div style={{ paddingBottom: 16, flex: 1 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{action}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-tertiary)' }}>{time}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: actor === 'AI' ? 'var(--idfc-red-bright)' : 'var(--text-tertiary)', background: actor === 'AI' ? 'rgba(220,38,38,0.07)' : 'var(--bg-subtle)', padding: '1px 6px', borderRadius: 3 }}>{actor}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{detail}</div>
      </div>
    </div>
  )
}

function RelatedCard({ title, badge, time, detail }: { title: string; badge: Badge; time: string; detail: string }) {
  const s = BADGE_STYLE[badge]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, cursor: 'pointer' }} className="row-hover">
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-tertiary)', minWidth: 44 }}>{time}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>{detail}</div>
      </div>
      <span style={{ display: 'inline-flex', height: 20, padding: '0 7px', border: `1px solid ${s.border}`, borderRadius: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: s.color }}>{badge}</span>
      <Icon name="ChevronRight" size={13} style={{ color: 'var(--text-tertiary)' }} />
    </div>
  )
}

// ─── Per-item extended mock data ───────────────────────────────────────────────
function getExtended(id: string) {
  const base: Record<string, any> = {
    c0: {
      customer: { name: 'Patel Industries', cif: 'CIF-PI-002291', segment: 'SME', tier: 'Standard', health: 74, aum: '₹3.8 Cr', since: '2021', rm: 'Priya Sharma', city: 'Ahmedabad', lastContact: '8 May 2026', openDeals: 1 },
      compliance: { overall: 'PASS', items: [
        { text: 'Customer is KYC-compliant (valid until Nov 2026)', pass: true },
        { text: 'No active PEP / sanctions flags on entity', pass: true },
        { text: 'Email content scanned — no pricing or rate commitments made', pass: true },
        { text: 'CC to Risk team matches policy for facility > ₹5 Cr', pass: true },
        { text: 'Template used: T1-ACK-002 (approved, last reviewed Mar 2026)', pass: true },
        { text: 'Sent within SLA window (< 4 hrs of receipt)', pass: true },
      ]},
      audit: [
        { time: '04:01', actor: 'Email gateway', action: 'Inbound email received', detail: 'Patel Industries sent renewal pack to priya.sharma@idfcfirstbank.com. Attachment count: 3.' },
        { time: '04:02', actor: 'AI', action: 'Document classification', detail: 'Attachments classified: FY26 financials, Form 16C, GST returns Q1–Q3. Completeness: 3/3 required docs present.' },
        { time: '04:03', actor: 'AI', action: 'Intent detection', detail: 'Email intent: facility renewal submission. Tone: professional. No pricing ask detected. Auto-reply threshold met.' },
        { time: '04:11', actor: 'AI', action: 'Draft composed', detail: 'Tier-1 acknowledgement drafted using template T1-ACK-002. Risk team CC added per policy.' },
        { time: '04:12', actor: 'AI', action: 'Email sent', detail: 'Reply dispatched via SMTP. Message ID: <msg-20260510-0412-PI>. Delivery confirmed.' },
        { time: '04:12', actor: 'AI', action: 'CRM updated', detail: 'Salesforce: interaction logged, stage updated to "Docs received", next action set for 13 May.' },
      ],
      related: [
        { title: 'KYC status check · Patel Industries', badge: 'DONE' as Badge, time: '03:40', detail: 'KYC valid — no action needed before renewal.' },
        { title: 'Facility sanction · Patel Industries', badge: 'READY' as Badge, time: 'Yesterday', detail: 'Credit memo pre-filled. Awaiting your sign-off.' },
      ],
    },
    c1: {
      customer: { name: 'Joshi & Co', cif: 'CIF-JC-005512', segment: 'SME', tier: 'Standard', health: 67, aum: '₹4.6 Cr', since: '2023', rm: 'Priya Sharma', city: 'Pune', lastContact: '5 May 2026', openDeals: 1 },
      compliance: { overall: 'HOLD', items: [
        { text: 'Customer is KYC-compliant (valid until Aug 2026)', pass: true },
        { text: 'No active PEP / sanctions flags', pass: true },
        { text: 'Email references competitor pricing — auto-send suspended per policy CC-07', pass: false },
        { text: 'Rate commitment requires credit desk approval before dispatch', pass: false },
        { text: 'Draft does not contain rate — hold is precautionary', pass: true },
        { text: 'Recommend human review before sending', pass: false },
      ]},
      audit: [
        { time: '05:31', actor: 'Email gateway', action: 'Inbound email received', detail: 'Amit Joshi asked for CC pricing match vs HDFC at 9.25%.' },
        { time: '05:32', actor: 'AI', action: 'Intent detection', detail: 'Intent: competitive pricing inquiry. Sensitivity flag triggered — policy CC-07 applies.' },
        { time: '05:33', actor: 'AI', action: 'Rate benchmark lookup', detail: 'Internal pricing for Joshi & Co: 9.75% (Standard SME). Exception required to match HDFC.' },
        { time: '05:45', actor: 'AI', action: 'Draft composed', detail: 'Holding reply drafted — acknowledges query, commits to revert by 10:00, makes no pricing promise.' },
        { time: '05:48', actor: 'AI', action: 'Held for review', detail: 'Auto-send suspended. Flagged for Priya Sharma review at 09:15 briefing.' },
      ],
      related: [
        { title: 'CC renewal · Joshi & Co', badge: 'FLAGGED' as Badge, time: '2 days ago', detail: 'Renewal due 30 Jun — pricing yet to be agreed.' },
        { title: 'Credit desk query · Joshi pricing exception', badge: 'READY' as Badge, time: 'Today', detail: 'Pre-filled exception request — needs your submit.' },
      ],
    },
    s2: {
      customer: { name: 'Kapoor Group', cif: 'CIF-KG-008831', segment: 'SME', tier: 'Standard', health: 43, aum: '₹2.2 Cr', since: '2022', rm: 'Priya Sharma', city: 'Delhi', lastContact: '6 May 2026', openDeals: 0 },
      compliance: { overall: 'RISK', items: [
        { text: 'KYC expiry: 12 May 2026 — breach in 48 hrs', pass: false },
        { text: 'Customer unreachable for 4 consecutive days', pass: false },
        { text: 'SLA breach prediction: 94% confidence', pass: false },
        { text: 'Reassignment to Amit Kulkarni within policy', pass: true },
        { text: 'Escalation to Cluster Head if no response by EOD', pass: true },
      ]},
      audit: [
        { time: '01 May', actor: 'AI', action: 'KYC countdown started', detail: 'KYC expiry detected 12 days out. Reminder sequence initiated.' },
        { time: '03 May', actor: 'AI', action: 'First reminder sent', detail: 'Email + WhatsApp reminder dispatched. No response.' },
        { time: '05 May', actor: 'AI', action: 'Second reminder sent', detail: 'Follow-up email sent. Still no response.' },
        { time: '06 May', actor: 'AI', action: 'SLA risk flag raised', detail: 'Customer unreachable for 4 days. 48-hr breach prediction triggered.' },
        { time: '06:02', actor: 'AI', action: 'Reassignment proposed', detail: 'Amit Kulkarni identified as best alternate RM (prior relationship, FY24). Pending approval.' },
      ],
      related: [
        { title: 'KYC reminder #1 · Kapoor Group', badge: 'SENT' as Badge, time: '3 May', detail: 'First automated reminder — no response.' },
        { title: 'KYC reminder #2 · Kapoor Group', badge: 'SENT' as Badge, time: '5 May', detail: 'Second reminder sent — no response.' },
      ],
    },
    s3: {
      customer: { name: 'Iyer Family', cif: 'CIF-WM-007731', segment: 'Wealth', tier: 'Priority', health: 88, aum: '₹12.1 Cr', since: '2021', rm: 'Priya Sharma', city: 'Chennai', lastContact: '7 May 2026', openDeals: 1 },
      compliance: { overall: 'PASS', items: [
        { text: 'KYC valid until Feb 2027', pass: true },
        { text: 'Wealth customer — NBA engine cross-sell flag is within policy', pass: true },
        { text: 'No unsolicited solicitation — triggered by product event (RD maturity)', pass: true },
        { text: 'PMS pitch requires NISM-certified RM — Priya Sharma certified', pass: true },
        { text: 'Prep pack generated — no regulatory documents included yet', pass: true },
      ]},
      audit: [
        { time: '05:50', actor: 'AI', action: 'RD maturity detected', detail: 'Recurring deposit of ₹38L maturing 22 May 2026. NBA engine triggered.' },
        { time: '05:51', actor: 'AI', action: 'Customer profile scored', detail: 'Wealth fit score: 87/100. PMS and ULIP both flagged as viable.' },
        { time: '05:55', actor: 'AI', action: 'Prep pack generated', detail: 'RD maturity pitch pack created: 5 slides, benchmarked against last quarter returns.' },
        { time: '06:24', actor: 'AI', action: 'Opportunity flagged', detail: 'Flagged for Priya Sharma action. Priority: high (12 days to maturity).' },
      ],
      related: [
        { title: 'Wealth pitch · Iyer Family — ULIP', badge: 'REVIEW' as Badge, time: '15 Apr', detail: 'Previous pitch — client asked for LIC comparison.' },
        { title: 'Portfolio review · Iyer Family Q1', badge: 'DONE' as Badge, time: '2 Apr', detail: 'Q1 returns: 14.2% vs 11.8% benchmark.' },
      ],
    },
  }

  return base[id] ?? {
    customer: { name: 'Customer', cif: '—', segment: '—', tier: '—', health: 70, aum: '—', since: '—', rm: 'Priya Sharma', city: '—', lastContact: '—', openDeals: 0 },
    compliance: { overall: 'PASS', items: [
      { text: 'KYC status verified', pass: true },
      { text: 'No sanctions flags', pass: true },
      { text: 'Policy compliance confirmed', pass: true },
    ]},
    audit: [
      { time: 'Overnight', actor: 'AI', action: 'Action executed', detail: 'Automated action completed per configured rules.' },
    ],
    related: [],
  }
}

// ─── Main page ─────────────────────────────────────────────────────────────────
function ActionDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>('summary')
  const item = ALL_ITEMS.find(a => a.id === id)

  if (!item) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Action not found.</div>
        <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => router.push('/auto-actions')}>Back</button>
      </div>
    )
  }

  const ai = item.ai
  const ext = getExtended(id)
  const reviewing = item.needsAction && item.badge !== 'APPROVED'
  const complianceColor = ext.compliance.overall === 'PASS' ? '#16a34a' : ext.compliance.overall === 'HOLD' ? '#d97706' : '#dc2626'

  return (
    <div className="anim-fade" style={{ padding: '36px 40px', maxWidth: 1180, margin: '0 auto' }}>

      {/* Back */}
      <button onClick={() => router.push('/auto-actions')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 12, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28, padding: 0 }}>
        <Icon name="ChevronLeft" size={13} /> Auto-actions
      </button>

      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 0, flexWrap: 'wrap' }}>
        <div>
          <Mono style={{ marginBottom: 10 }}>{ai.kind} · {item.time} IST · 10 May 2026</Mono>
          <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 400, lineHeight: 1.15, margin: 0, color: 'var(--text-primary)', maxWidth: 760 }}>
            {item.title.replace(/\.$/, '')}
          </h1>
          <div style={{ marginTop: 8, fontSize: 14, color: 'var(--text-secondary)' }}>{item.detail}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, paddingTop: 4 }}>
          <BadgePill badge={item.badge} large />
          {reviewing && <>
            <button className="btn-primary" style={{ height: 36 }}>Approve & send</button>
            <button className="btn-secondary" style={{ height: 36 }}>Dismiss</button>
          </>}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginTop: 28, marginBottom: 32, overflowX: 'auto', gap: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
            borderBottom: tab === t.id ? '2px solid var(--idfc-red-bright)' : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap', transition: 'color 120ms',
          }}>
            <Icon name={t.icon} size={13} style={{ color: tab === t.id ? 'var(--idfc-red-bright)' : 'var(--text-tertiary)', flexShrink: 0 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SUMMARY ── */}
      {tab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI insight banner */}
            <div style={{ background: 'linear-gradient(135deg,rgba(220,38,38,0.05) 0%,var(--bg-card) 65%)', border: '1px solid rgba(220,38,38,0.16)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--idfc-red-bright)' }} />
                <Mono style={{ color: 'var(--idfc-red-bright)' }}>IDFC FIRST AI · Action Summary</Mono>
              </div>
              <div style={{ fontSize: 14.5, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                {ai.reasoning?.[0] ?? 'Automated action executed per configured rules.'} {ai.reasoning?.[1] ?? ''} {ai.reasoning?.[2] ? `${ai.reasoning[2]}.` : ''}
              </div>
            </div>

            {/* What was done */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <Mono>What the AI did</Mono>
              </div>
              {(ai.metaItems ?? []).map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '11px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
                  <Mono style={{ minWidth: 140 }}>{m.k}</Mono>
                  <span style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{m.v}</span>
                </div>
              ))}
            </div>

            {/* Quick tabs pointer */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { tab: 'email' as TabId, icon: 'Mail', label: 'Original Email', sub: 'View what was received' },
                { tab: 'draft' as TabId, icon: 'Sparkles', label: 'AI Draft', sub: 'Review the reply' },
                { tab: 'analysis' as TabId, icon: 'BrainCircuit', label: 'AI Analysis', sub: `${ai.confidence ?? '—'}% confidence score` },
              ].map(c => (
                <button key={c.tab} onClick={() => setTab(c.tab)} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'border-color 120ms' }} className="row-hover">
                  <Icon name={c.icon} size={18} style={{ color: 'var(--idfc-red-bright)' }} />
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{c.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Status card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '16px 18px' }}>
              <Mono style={{ marginBottom: 12 }}>Status</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <KVRow k="Badge" v={item.badge} />
                <KVRow k="Time" v={`${item.time} IST · 10 May`} />
                <KVRow k="Compliance" v={ext.compliance.overall} accent={complianceColor} />
                {ai.confidence !== undefined && <KVRow k="Confidence" v={`${ai.confidence}%`} accent={ai.confidence >= 80 ? '#16a34a' : '#d97706'} />}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}><Mono>Jump to</Mono></div>
              {TABS.slice(4).map((t, i) => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: 13 }} className="row-hover">
                  <Icon name={t.icon} size={13} style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  <Icon name="ChevronRight" size={12} style={{ color: 'var(--text-tertiary)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ORIGINAL EMAIL ── */}
      {tab === 'email' && (
        <div style={{ maxWidth: 780 }}>
          {ai.originalEmail ? (
            <>
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '16px 22px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ai.to && <div style={{ display: 'flex', gap: 16 }}><Mono style={{ minWidth: 64 }}>TO</Mono><span style={{ fontSize: 14 }}>{ai.to}</span></div>}
                {ai.cc && <div style={{ display: 'flex', gap: 16 }}><Mono style={{ minWidth: 64 }}>CC</Mono><span style={{ fontSize: 14 }}>{ai.cc}</span></div>}
                {ai.subject && <div style={{ display: 'flex', gap: 16 }}><Mono style={{ minWidth: 64 }}>SUBJECT</Mono><span style={{ fontSize: 14, fontWeight: 600 }}>{ai.subject}</span></div>}
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)', padding: '24px 28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>{ai.originalEmail}</pre>
            </>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, color: 'var(--text-tertiary)', fontSize: 14 }}>
              No inbound email for this action — it was triggered by a system event.
            </div>
          )}
        </div>
      )}

      {/* ── AI DRAFT ── */}
      {tab === 'draft' && (
        <div style={{ maxWidth: 780 }}>
          {ai.aiDraft ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--idfc-red-bright)' }} />
                <Mono style={{ color: 'var(--idfc-red-bright)' }}>AI-drafted reply · {ai.kind}</Mono>
                {ai.confidence && <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: ai.confidence >= 80 ? '#16a34a' : '#d97706', fontWeight: 700 }}>{ai.confidence}% confidence</span>}
              </div>
              {(ai.to || ai.subject) && (
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 20px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ai.to && <div style={{ display: 'flex', gap: 16 }}><Mono style={{ minWidth: 64 }}>TO</Mono><span style={{ fontSize: 14 }}>{ai.to}</span></div>}
                  {ai.cc && <div style={{ display: 'flex', gap: 16 }}><Mono style={{ minWidth: 64 }}>CC</Mono><span style={{ fontSize: 14 }}>{ai.cc}</span></div>}
                  {ai.subject && <div style={{ display: 'flex', gap: 16 }}><Mono style={{ minWidth: 64 }}>SUBJECT</Mono><span style={{ fontSize: 14, fontWeight: 600 }}>{ai.subject}</span></div>}
                </div>
              )}
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)', padding: '24px 28px', background: 'var(--bg-card)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 10 }}>{ai.aiDraft}</pre>
              {reviewing && (
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn-primary">Approve & send this draft</button>
                  <button className="btn-secondary">Edit before sending</button>
                  <button className="btn-secondary">Dismiss</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, color: 'var(--text-tertiary)', fontSize: 14 }}>
              No email draft for this action — it was a system update.
            </div>
          )}
        </div>
      )}

      {/* ── AI ANALYSIS ── */}
      {tab === 'analysis' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {ai.confidence !== undefined && (
              <div style={{ background: 'linear-gradient(135deg,rgba(220,38,38,0.05) 0%,var(--bg-card) 65%)', border: '1px solid rgba(220,38,38,0.16)', borderRadius: 10, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 28 }}>
                <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
                  <svg width={96} height={96} viewBox="0 0 96 96">
                    <circle cx={48} cy={48} r={38} fill="none" stroke="var(--border-subtle)" strokeWidth={8} />
                    <circle cx={48} cy={48} r={38} fill="none"
                      stroke={ai.confidence >= 80 ? '#16a34a' : ai.confidence >= 60 ? '#d97706' : '#dc2626'}
                      strokeWidth={8}
                      strokeDasharray={`${(ai.confidence / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                      strokeLinecap="round" transform="rotate(-90 48 48)"
                    />
                    <text x={48} y={54} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--text-primary)">{ai.confidence}%</text>
                  </svg>
                </div>
                <div>
                  <Mono style={{ color: 'var(--idfc-red-bright)', marginBottom: 8 }}>AI Confidence Score</Mono>
                  <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {ai.confidence >= 85 ? 'High — safe to auto-send' : ai.confidence >= 65 ? 'Moderate — review recommended' : 'Low — requires your judgement'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Scored across 6 factors: customer history, tone, policy compliance, deal stage, recency, context.</div>
                </div>
              </div>
            )}

            <div>
              <Mono style={{ marginBottom: 12 }}>Factor scores</Mono>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 22px' }}>
                <ScoreBar label="Customer relationship strength" value={82} color="#16a34a" />
                <ScoreBar label="Tone & sentiment analysis" value={91} color="#16a34a" />
                <ScoreBar label="Policy compliance" value={ai.confidence && ai.confidence < 70 ? 55 : 95} color={ai.confidence && ai.confidence < 70 ? '#d97706' : '#16a34a'} />
                <ScoreBar label="Deal stage relevance" value={78} color="#16a34a" />
                <ScoreBar label="Response recency" value={88} color="#16a34a" />
                <ScoreBar label="Contextual match" value={ai.confidence ?? 80} color={ai.confidence && ai.confidence < 70 ? '#d97706' : '#16a34a'} />
              </div>
            </div>

            {ai.reasoning && (
              <div>
                <Mono style={{ marginBottom: 12 }}>Reasoning chain</Mono>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                  {ai.reasoning.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Icon name="Check" size={11} style={{ color: '#16a34a' }} />
                      </div>
                      <span style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ai.deck && (
              <div>
                <Mono style={{ marginBottom: 12 }}>Auto-generated deck</Mono>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, cursor: 'pointer' }} className="row-hover">
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--idfc-red-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                      <rect width="26" height="26" fill="#8B1A1A"/>
                      <rect x="1.5" y="1.5" width="23" height="23" fill="white"/>
                      <rect x="3.5" y="3.5" width="19" height="19" fill="#8B1A1A"/>
                      <rect x="5.5" y="5.5" width="15" height="4" fill="white"/>
                      <rect x="5.5" y="11.5" width="10" height="3.5" fill="white"/>
                      <rect x="5.5" y="17" width="5" height="3.5" fill="white"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{ai.deck}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 3 }}>Click to preview · auto-generated by IDFC FIRST AI</div>
                  </div>
                  <Icon name="ChevronRight" size={16} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '16px 18px' }}>
              <Mono style={{ marginBottom: 12 }}>Context</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <KVRow k="Time" v={`${item.time} IST`} />
                {(ai.metaItems ?? []).map((m, i) => <KVRow key={i} k={m.k} v={m.v} />)}
              </div>
            </div>
            {reviewing && (
              <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 10, padding: '16px 18px' }}>
                <Mono style={{ color: 'var(--idfc-red-bright)', marginBottom: 10 }}>Awaiting review</Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Approve & send</button>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Dismiss</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CUSTOMER CONTEXT ── */}
      {tab === 'customer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '20px 22px' }}>
              <Mono style={{ marginBottom: 16 }}>Customer profile</Mono>
              <KVRow k="Name" v={ext.customer.name} />
              <KVRow k="CIF ID" v={ext.customer.cif} />
              <KVRow k="Segment" v={ext.customer.segment} />
              <KVRow k="Tier" v={ext.customer.tier} />
              <KVRow k="City" v={ext.customer.city} />
              <KVRow k="Customer since" v={ext.customer.since} />
              <KVRow k="Assigned RM" v={ext.customer.rm} />
              <KVRow k="Last contact" v={ext.customer.lastContact} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '20px 22px' }}>
              <Mono style={{ marginBottom: 16 }}>Financial snapshot</Mono>
              <KVRow k="AUM" v={ext.customer.aum} />
              <KVRow k="Health score" v={String(ext.customer.health)} accent={ext.customer.health >= 80 ? '#16a34a' : ext.customer.health >= 60 ? '#d97706' : '#dc2626'} />
              <KVRow k="Open deals" v={String(ext.customer.openDeals)} />
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '18px 22px' }}>
              <Mono style={{ marginBottom: 14 }}>Relationship health</Mono>
              <ScoreBar label="Overall health" value={ext.customer.health} color={ext.customer.health >= 80 ? '#16a34a' : ext.customer.health >= 60 ? '#d97706' : '#dc2626'} />
              <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                <button onClick={() => router.push(`/portfolio/${ALL_ITEMS.find(a => a.id === id)?.which === 'c' ? '1' : '2'}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--idfc-red-bright)', fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace", padding: 0 }}>View full customer page →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPLIANCE CHECK ── */}
      {tab === 'compliance' && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', background: ext.compliance.overall === 'PASS' ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.05)', border: `1px solid ${complianceColor}30`, borderRadius: 10, marginBottom: 20 }}>
            <Icon name={ext.compliance.overall === 'PASS' ? 'ShieldCheck' : 'AlertTriangle'} size={24} style={{ color: complianceColor }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: complianceColor }}>{ext.compliance.overall === 'PASS' ? 'All checks passed' : ext.compliance.overall === 'HOLD' ? 'Action held — review required' : 'Risk detected — immediate review'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{ext.compliance.items.length} compliance checks run by IDFC FIRST AI</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}><Mono>Check results</Mono></div>
            {ext.compliance.items.map((c: any, i: number) => <CheckItem key={i} text={c.text} pass={c.pass} />)}
          </div>
        </div>
      )}

      {/* ── AUDIT TRAIL ── */}
      {tab === 'audit' && (
        <div style={{ maxWidth: 700 }}>
          <Mono style={{ marginBottom: 20 }}>Complete step-by-step log · {ext.audit.length} events</Mono>
          <div style={{ paddingLeft: 8 }}>
            {ext.audit.map((step: any, i: number) => (
              <AuditStep key={i} idx={i} time={step.time} actor={step.actor} action={step.action} detail={step.detail} />
            ))}
          </div>
        </div>
      )}

      {/* ── RELATED ACTIONS ── */}
      {tab === 'related' && (
        <div style={{ maxWidth: 700 }}>
          <Mono style={{ marginBottom: 16 }}>Actions involving the same customer or workflow</Mono>
          {ext.related.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ext.related.map((r: any, i: number) => (
                <RelatedCard key={i} title={r.title} badge={r.badge} time={r.time} detail={r.detail} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, color: 'var(--text-tertiary)', fontSize: 14 }}>No related actions found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ActionDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '')
  return (
    <AppShell>
      <ActionDetailContent id={id} />
    </AppShell>
  )
}
