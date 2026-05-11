'use client'
import { useState } from 'react'
import { AgentPage, Field, TextInput, SelectInput, TagInput } from '@/components/agents/AgentShell'

const DEPTHS = [{ value: 'summary', label: 'Summary' }, { value: 'standard', label: 'Standard' }, { value: 'deep', label: 'Deep Dive' }]
const CONSENSUS = [{ value: 'factset', label: 'FactSet' }, { value: 'bloomberg', label: 'Bloomberg' }, { value: 'refinitiv', label: 'Refinitiv' }]

export default function EarningsReviewerPage() {
  const [ticker, setTicker] = useState('AAPL')
  const [fiscalPeriod, setFiscalPeriod] = useState('FY2026Q2')
  const [releaseDate, setReleaseDate] = useState('2026-05-02')
  const [transcriptUri, setTranscriptUri] = useState('s3://rm-research/aapl_fy26q2_call.txt')
  const [pressReleaseUri, setPressReleaseUri] = useState('s3://rm-research/aapl_fy26q2_pr.pdf')
  const [financialsUri, setFinancialsUri] = useState('s3://rm-research/aapl_fy26q2.xlsx')
  const [priorPeriod, setPriorPeriod] = useState('FY2026Q1')
  const [consensusProvider, setConsensusProvider] = useState('factset')
  const [clientScope, setClientScope] = useState(['CLI-883201', 'CLI-771045'])
  const [outputDepth, setOutputDepth] = useState('standard')

  const buildPayload = () => {
    if (!ticker || !fiscalPeriod) return null
    return {
      agent: 'earnings_reviewer', version: '1.0', rm_id: 'RM-04812',
      ticker: ticker.toUpperCase(), fiscal_period: fiscalPeriod, release_date: releaseDate,
      sources: [
        { type: 'transcript', uri: transcriptUri },
        { type: 'press_release', uri: pressReleaseUri },
        { type: 'financials_xlsx', uri: financialsUri },
      ].filter(s => s.uri),
      compare_to: { prior_period: priorPeriod, consensus_provider: consensusProvider },
      client_exposure_scope: clientScope,
      output_depth: outputDepth,
    }
  }

  return (
    <AgentPage
      agentId="earnings_reviewer" label="Earnings Reviewer" icon="TrendingUp"
      tagline="Synthesise earnings releases into per-customer action briefs" color="#16a34a" latency="~25s"
      buildPayload={buildPayload}
      form={
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Ticker"><TextInput value={ticker} onChange={setTicker} placeholder="AAPL" /></Field>
            <Field label="Fiscal Period"><TextInput value={fiscalPeriod} onChange={setFiscalPeriod} placeholder="FY2026Q2" /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Release Date"><input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} style={{ height: 42, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} /></Field>
            <Field label="Output Depth"><SelectInput value={outputDepth} onChange={setOutputDepth} options={DEPTHS} /></Field>
          </div>
          <Field label="Earnings Call Transcript (S3 URI)" hint="s3://bucket/path/to/transcript.txt"><TextInput value={transcriptUri} onChange={setTranscriptUri} placeholder="s3://rm-research/..." /></Field>
          <Field label="Press Release (S3 URI)" hint="s3://bucket/path/to/press_release.pdf"><TextInput value={pressReleaseUri} onChange={setPressReleaseUri} placeholder="s3://rm-research/..." /></Field>
          <Field label="Financials Spreadsheet (S3 URI)" hint="s3://bucket/path/to/financials.xlsx"><TextInput value={financialsUri} onChange={setFinancialsUri} placeholder="s3://rm-research/..." /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Prior Period to Compare"><TextInput value={priorPeriod} onChange={setPriorPeriod} placeholder="FY2026Q1" /></Field>
            <Field label="Consensus Provider"><SelectInput value={consensusProvider} onChange={setConsensusProvider} options={CONSENSUS} /></Field>
          </div>
          <Field label="Customer Exposure Scope" hint="Customer IDs to assess impact for — press Enter to add"><TagInput value={clientScope} onChange={setClientScope} placeholder="CLI-883201" /></Field>
        </>
      }
    />
  )
}
