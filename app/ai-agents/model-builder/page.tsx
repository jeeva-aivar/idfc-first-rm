'use client'
import { useState } from 'react'
import { AgentPage, Field, TextInput, NumberInput, SelectInput, CheckboxGroup, TagInput } from '@/components/agents/AgentShell'

const MODEL_TYPES = [{ value: 'portfolio_optimization', label: 'Portfolio Optimisation' }, { value: 'monte_carlo', label: 'Monte Carlo' }, { value: 'fixed_income_ladder', label: 'Fixed Income Ladder' }, { value: 'dcf', label: 'DCF Valuation' }]
const CURRENCIES = [{ value: 'USD', label: 'USD' }, { value: 'INR', label: 'INR' }, { value: 'SGD', label: 'SGD' }, { value: 'EUR', label: 'EUR' }, { value: 'GBP', label: 'GBP' }]
const OBJECTIVES = [{ value: 'maximize_sharpe', label: 'Maximise Sharpe Ratio' }, { value: 'min_volatility', label: 'Minimise Volatility' }, { value: 'max_return', label: 'Maximise Return' }, { value: 'risk_parity', label: 'Risk Parity' }]
const OUTPUT_FORMATS = [{ value: 'allocation_table', label: 'Allocation Table' }, { value: 'efficient_frontier', label: 'Efficient Frontier' }, { value: 'scenarios', label: 'Scenarios' }]

export default function ModelBuilderPage() {
  const [clientId, setClientId] = useState('CLI-883201')
  const [modelType, setModelType] = useState('portfolio_optimization')
  const [currency, setCurrency] = useState('USD')
  const [horizon, setHorizon] = useState('36')
  const [objective, setObjective] = useState('maximize_sharpe')
  const [holdingsUri, setHoldingsUri] = useState('s3://rm-data/cli883201_holdings.csv')
  const [cmaUri, setCmaUri] = useState('s3://rm-data/cma_2026q2.json')
  const [maxSingleName, setMaxSingleName] = useState('5')
  const [maxSector, setMaxSector] = useState('25')
  const [minCash, setMinCash] = useState('2')
  const [esgMin, setEsgMin] = useState('6.5')
  const [excludeTickers, setExcludeTickers] = useState(['XOM', 'RTX'])
  const [outputFormats, setOutputFormats] = useState(['allocation_table', 'efficient_frontier', 'scenarios'])

  const buildPayload = () => {
    if (!clientId) return null
    return {
      agent: 'model_builder', version: '1.0', rm_id: 'RM-04812',
      model_type: modelType,
      target: { client_id: clientId, base_currency: currency, horizon_months: Number(horizon) },
      inputs: {
        current_holdings_uri: holdingsUri,
        capital_market_assumptions_uri: cmaUri,
        constraints: {
          max_single_name_pct: Number(maxSingleName),
          max_sector_pct: Number(maxSector),
          min_cash_pct: Number(minCash),
          esg_minimum_score: Number(esgMin),
          exclude_tickers: excludeTickers,
        },
        objective,
      },
      output_format: outputFormats,
    }
  }

  return (
    <AgentPage
      agentId="model_builder" label="Model Builder" icon="BarChart3"
      tagline="Portfolio optimisation with allocation deltas, trade list & scenarios" color="#7c3aed" latency="~35s"
      buildPayload={buildPayload}
      form={
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Customer ID"><TextInput value={clientId} onChange={setClientId} placeholder="CLI-883201" /></Field>
            <Field label="Model Type"><SelectInput value={modelType} onChange={setModelType} options={MODEL_TYPES} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Base Currency"><SelectInput value={currency} onChange={setCurrency} options={CURRENCIES} /></Field>
            <Field label="Horizon (months)"><NumberInput value={horizon} onChange={setHorizon} min={6} max={120} /></Field>
          </div>
          <Field label="Optimisation Objective"><SelectInput value={objective} onChange={setObjective} options={OBJECTIVES} /></Field>
          <Field label="Current Holdings (S3 URI)" hint="CSV of current portfolio positions"><TextInput value={holdingsUri} onChange={setHoldingsUri} placeholder="s3://rm-data/..." /></Field>
          <Field label="Capital Market Assumptions (S3 URI)" hint="JSON file with return/vol/correlation assumptions"><TextInput value={cmaUri} onChange={setCmaUri} placeholder="s3://rm-data/..." /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Max Single Name (%)" hint="Per-security cap"><NumberInput value={maxSingleName} onChange={setMaxSingleName} min={1} max={100} /></Field>
            <Field label="Max Sector (%)" hint="Per-sector cap"><NumberInput value={maxSector} onChange={setMaxSector} min={1} max={100} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Min Cash (%)" hint="Minimum liquidity floor"><NumberInput value={minCash} onChange={setMinCash} min={0} max={50} /></Field>
            <Field label="ESG Minimum Score" hint="0–10 scale"><NumberInput value={esgMin} onChange={setEsgMin} min={0} max={10} /></Field>
          </div>
          <Field label="Exclude Tickers" hint="Tickers to exclude from the model — press Enter to add"><TagInput value={excludeTickers} onChange={setExcludeTickers} placeholder="e.g. XOM" /></Field>
          <Field label="Output Formats"><CheckboxGroup value={outputFormats} onChange={setOutputFormats} options={OUTPUT_FORMATS} /></Field>
        </>
      }
    />
  )
}
