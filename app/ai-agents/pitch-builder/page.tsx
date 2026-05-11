'use client'
import { useState } from 'react'
import { AgentPage, Field, TextInput, NumberInput, SelectInput, CheckboxGroup, TagInput } from '@/components/agents/AgentShell'

const SEGMENTS = [{ value: 'UHNW', label: 'UHNW' }, { value: 'HNW', label: 'HNW' }, { value: 'Mass Affluent', label: 'Mass Affluent' }, { value: 'SME', label: 'SME' }]
const RISK_PROFILES = [{ value: 'conservative', label: 'Conservative' }, { value: 'balanced', label: 'Balanced' }, { value: 'growth', label: 'Growth' }, { value: 'aggressive', label: 'Aggressive' }]
const OBJECTIVES = [{ value: 'cross_sell_private_credit', label: 'Cross-sell Private Credit' }, { value: 'cross_sell_equity', label: 'Cross-sell Equity' }, { value: 'portfolio_review', label: 'Portfolio Review' }, { value: 'renewal', label: 'Product Renewal' }, { value: 'onboarding', label: 'New Onboarding' }]
const PRODUCTS = [{ value: 'private_credit_fund_v3', label: 'Private Credit Fund v3' }, { value: 'structured_note_eq_basket', label: 'Structured Note — Equity Basket' }, { value: 'forex_card', label: 'Forex Card' }, { value: 'wealth_fd', label: 'Wealth FD' }, { value: 'wcdl', label: 'Working Capital Demand Loan' }]
const TONES = [{ value: 'consultative', label: 'Consultative' }, { value: 'formal', label: 'Formal' }, { value: 'friendly', label: 'Friendly' }]
const COMPLIANCE = [{ value: 'MAS', label: 'MAS (Singapore)' }, { value: 'SEBI', label: 'SEBI (India)' }, { value: 'FCA', label: 'FCA (UK)' }, { value: 'SEC', label: 'SEC (US)' }]

export default function PitchBuilderPage() {
  const [clientName, setClientName] = useState('Acme Capital Partners')
  const [clientId, setClientId] = useState('CLI-883201')
  const [segment, setSegment] = useState('UHNW')
  const [aum, setAum] = useState('42500000')
  const [riskProfile, setRiskProfile] = useState('growth')
  const [domicile, setDomicile] = useState('SG')
  const [objective, setObjective] = useState('cross_sell_private_credit')
  const [products, setProducts] = useState(['private_credit_fund_v3', 'structured_note_eq_basket'])
  const [maxSlides, setMaxSlides] = useState('8')
  const [tone, setTone] = useState('consultative')
  const [complianceRegion, setComplianceRegion] = useState('MAS')
  const [lastMeetingDate, setLastMeetingDate] = useState('2026-04-22')
  const [recentActions, setRecentActions] = useState(['sold_HY_bond_fund', 'added_USD_cash'])

  const buildPayload = () => {
    if (!clientName || !clientId || !products.length) return null
    return {
      agent: 'pitch_builder', version: '1.0', rm_id: 'RM-04812',
      client: { client_id: clientId, name: clientName, segment, aum_usd: Number(aum), risk_profile: riskProfile, domicile },
      objective,
      products_in_scope: products,
      constraints: { max_slides: Number(maxSlides), tone, language: 'en', compliance_region: complianceRegion },
      context: { last_meeting_date: lastMeetingDate, open_opportunities: [], recent_portfolio_actions: recentActions },
    }
  }

  return (
    <AgentPage
      agentId="pitch_builder" label="Pitch Builder" icon="Presentation"
      tagline="Generate tailored pitch decks & talking points" color="#8B1A1A" latency="~53s"
      buildPayload={buildPayload}
      form={
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Customer Name"><TextInput value={clientName} onChange={setClientName} placeholder="Acme Capital Partners" /></Field>
            <Field label="Customer ID"><TextInput value={clientId} onChange={setClientId} placeholder="CLI-883201" /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Segment"><SelectInput value={segment} onChange={setSegment} options={SEGMENTS} /></Field>
            <Field label="Domicile"><TextInput value={domicile} onChange={setDomicile} placeholder="SG" /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="AUM (USD)" hint="Total assets under management"><NumberInput value={aum} onChange={setAum} placeholder="42500000" /></Field>
            <Field label="Risk Profile"><SelectInput value={riskProfile} onChange={setRiskProfile} options={RISK_PROFILES} /></Field>
          </div>
          <Field label="Pitch Objective"><SelectInput value={objective} onChange={setObjective} options={OBJECTIVES} /></Field>
          <Field label="Products in Scope"><CheckboxGroup value={products} onChange={setProducts} options={PRODUCTS} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Field label="Max Slides"><NumberInput value={maxSlides} onChange={setMaxSlides} min={4} max={20} /></Field>
            <Field label="Tone"><SelectInput value={tone} onChange={setTone} options={TONES} /></Field>
            <Field label="Compliance Region"><SelectInput value={complianceRegion} onChange={setComplianceRegion} options={COMPLIANCE} /></Field>
          </div>
          <Field label="Last Meeting Date"><input type="date" value={lastMeetingDate} onChange={e => setLastMeetingDate(e.target.value)} style={{ height: 42, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} /></Field>
          <Field label="Recent Portfolio Actions" hint="Press Enter to add each action"><TagInput value={recentActions} onChange={setRecentActions} placeholder="e.g. sold_HY_bond_fund" /></Field>
        </>
      }
    />
  )
}
