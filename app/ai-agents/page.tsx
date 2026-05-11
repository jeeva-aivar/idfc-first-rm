'use client'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import { Icon } from '@/components/ui/Icon'

const AGENTS = [
  {
    id: 'pitch-builder',
    label: 'Pitch Builder',
    icon: 'Presentation',
    tagline: 'Generate tailored pitch decks & talking points for customer meetings',
    latency: '~53s',
    color: 'var(--idfc-red)',
    colorRaw: '#8B1A1A',
    fields: ['Customer name & segment', 'AUM & risk profile', 'Products in scope', 'Meeting objective'],
  },
  {
    id: 'meeting-preparer',
    label: 'Meeting Preparer',
    icon: 'CalendarCheck',
    tagline: 'Pre-meeting brief with agenda, open actions & market context',
    latency: '~20s',
    color: '#2563eb',
    colorRaw: '#2563eb',
    fields: ['Customer & meeting details', 'Duration & channel', 'Sections to include', 'Meeting purpose'],
  },
  {
    id: 'earnings-reviewer',
    label: 'Earnings Reviewer',
    icon: 'TrendingUp',
    tagline: 'Synthesise earnings releases into per-customer action briefs',
    latency: '~25s',
    color: '#16a34a',
    colorRaw: '#16a34a',
    fields: ['Ticker & fiscal period', 'Document sources', 'Customer exposure scope', 'Output depth'],
  },
  {
    id: 'model-builder',
    label: 'Model Builder',
    icon: 'BarChart3',
    tagline: 'Portfolio optimisation with allocation deltas, trade list & scenarios',
    latency: '~35s',
    color: '#7c3aed',
    colorRaw: '#7c3aed',
    fields: ['Customer & currency', 'Investment horizon', 'Optimisation objective', 'Allocation constraints'],
  },
  {
    id: 'memo-maker',
    label: 'Memo Maker',
    icon: 'FileText',
    tagline: 'Post-meeting recap with decisions, action items & risk flags',
    latency: '~27s',
    color: '#d97706',
    colorRaw: '#d97706',
    fields: ['Customer & meeting IDs', 'Memo type & audience', 'Sections to include', 'Compliance region'],
  },
]

function AgentCard({ agent }: { agent: typeof AGENTS[0] }) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/ai-agents/${agent.id}`)}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 24, cursor: 'pointer', transition: 'border-color 150ms, box-shadow 150ms', display: 'flex', flexDirection: 'column', gap: 16 }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = agent.colorRaw + '50'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${agent.colorRaw}12` }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${agent.colorRaw}15`, border: `1px solid ${agent.colorRaw}30`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name={agent.icon} size={20} style={{ color: agent.colorRaw }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginTop: 4 }}>{agent.latency}</span>
      </div>

      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{agent.label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{agent.tagline}</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {agent.fields.map(f => (
          <span key={f} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.06em', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '3px 8px' }}>{f}</span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: agent.colorRaw, fontSize: 13, fontWeight: 500, marginTop: 'auto' }}>
        <span>Open agent</span>
        <Icon name="ArrowRight" size={14} style={{ color: agent.colorRaw }} />
      </div>
    </div>
  )
}

function HubContent() {
  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>AWS Bedrock AgentCore · us-east-1</div>
        <h1 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 44, fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: 1.1 }}>
          AI <em style={{ fontStyle: 'italic', color: 'var(--idfc-red-bright)' }}>Agents</em>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, maxWidth: 560 }}>
          Five specialised agents ready to run. Select one, fill in the details, and get a structured output in seconds.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '1px solid var(--border-subtle)', marginBottom: 36 }}>
        {[
          { label: 'AGENTS DEPLOYED', value: '5' },
          { label: 'AVG RESPONSE TIME', value: '32s' },
          { label: 'AUTH', value: 'SigV4' },
        ].map((k, i) => (
          <div key={k.label} style={{ padding: '16px 22px', borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 28, color: 'var(--idfc-red-bright)', lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {AGENTS.map(a => <AgentCard key={a.id} agent={a} />)}
      </div>

      <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
        <Icon name="ShieldCheck" size={13} />
        <span>All agent requests are signed server-side with AWS SigV4 — credentials never exposed to the browser.</span>
      </div>
    </div>
  )
}

export default function AIAgentsHub() {
  return <AppShell><HubContent /></AppShell>
}
