'use client'
import { useState } from 'react'
import { AgentPage, Field, TextInput, NumberInput, SelectInput, CheckboxGroup } from '@/components/agents/AgentShell'

const PURPOSES = [{ value: 'quarterly_review', label: 'Quarterly Review' }, { value: 'annual_review', label: 'Annual Review' }, { value: 'product_pitch', label: 'Product Pitch' }, { value: 'onboarding', label: 'Onboarding' }, { value: 'renewal', label: 'Renewal' }, { value: 'escalation', label: 'Escalation' }]
const CHANNELS = [{ value: 'in_person', label: 'In Person' }, { value: 'video', label: 'Video Call' }, { value: 'phone', label: 'Phone' }]
const DEPTHS = [{ value: 'summary', label: 'Summary' }, { value: 'detailed', label: 'Detailed' }]
const SECTIONS = [{ value: 'portfolio_snapshot', label: 'Portfolio Snapshot' }, { value: 'last_meeting_notes', label: 'Last Meeting Notes' }, { value: 'open_actions', label: 'Open Actions' }, { value: 'market_context', label: 'Market Context' }, { value: 'compliance_flags', label: 'Compliance Flags' }]

export default function MeetingPreparerPage() {
  const [clientId, setClientId] = useState('CLI-883201')
  const [meetingId, setMeetingId] = useState('MTG-2026-05-12-001')
  const [scheduledAt, setScheduledAt] = useState('2026-05-12T09:00')
  const [duration, setDuration] = useState('45')
  const [channel, setChannel] = useState('in_person')
  const [purpose, setPurpose] = useState('quarterly_review')
  const [depth, setDepth] = useState('detailed')
  const [include, setInclude] = useState(['portfolio_snapshot', 'last_meeting_notes', 'open_actions', 'market_context', 'compliance_flags'])
  const [attendeeName, setAttendeeName] = useState('Jane Tan')
  const [attendeeRole, setAttendeeRole] = useState('CIO')

  const buildPayload = () => {
    if (!clientId || !meetingId || !scheduledAt) return null
    return {
      agent: 'meeting_preparer', version: '1.0', rm_id: 'RM-04812',
      meeting: {
        meeting_id: meetingId, client_id: clientId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_min: Number(duration), channel,
        attendees: [
          ...(attendeeName ? [{ name: attendeeName, role: attendeeRole, side: 'client' }] : []),
          { name: 'Priya Sharma', role: 'RM', side: 'bank' },
        ],
      },
      meeting_purpose: purpose, depth, include,
    }
  }

  return (
    <AgentPage
      agentId="meeting_preparer" label="Meeting Preparer" icon="CalendarCheck"
      tagline="Pre-meeting brief with agenda, open actions & market context" color="#2563eb" latency="~20s"
      buildPayload={buildPayload}
      form={
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Customer ID"><TextInput value={clientId} onChange={setClientId} placeholder="CLI-883201" /></Field>
            <Field label="Meeting ID"><TextInput value={meetingId} onChange={setMeetingId} placeholder="MTG-2026-05-12-001" /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Scheduled At"><input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} style={{ height: 42, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} /></Field>
            <Field label="Duration (minutes)"><NumberInput value={duration} onChange={setDuration} min={15} max={180} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Channel"><SelectInput value={channel} onChange={setChannel} options={CHANNELS} /></Field>
            <Field label="Meeting Purpose"><SelectInput value={purpose} onChange={setPurpose} options={PURPOSES} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Brief Depth"><SelectInput value={depth} onChange={setDepth} options={DEPTHS} /></Field>
          </div>
          <Field label="Key Attendee (Customer Side)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <TextInput value={attendeeName} onChange={setAttendeeName} placeholder="Name" />
              <TextInput value={attendeeRole} onChange={setAttendeeRole} placeholder="Role (e.g. CIO)" />
            </div>
          </Field>
          <Field label="Sections to Include"><CheckboxGroup value={include} onChange={setInclude} options={SECTIONS} /></Field>
        </>
      }
    />
  )
}
