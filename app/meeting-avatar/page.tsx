'use client';

import { useState } from 'react';
import { AppShell } from '@/components/shared/AppShell';

const MEETINGS = [
  {
    id: 1,
    title: 'NPA Committee',
    score: 92,
    state: 'YOU ATTEND' as const,
    time: '11:00 – 11:45',
    agenda: ['Mehta provisioning review', 'Kapoor regularization', 'Verma exit assessment', 'Q3 portfolio review'],
    attendees: [{ initials: 'RK', color: '#8B1A1A' }, { initials: 'SM', color: '#1a3a8b' }, { initials: 'PV', color: '#1a7a3a' }, { initials: 'AN', color: '#7a1a8b' }],
  },
  {
    id: 2,
    title: 'Branch Standup',
    score: 48,
    state: 'AVATAR ATTENDS' as const,
    time: '11:00 – 11:30',
    debrief: '11:35',
    agenda: ['Daily ops update', 'KPI flash report', 'Weekend coverage roster'],
    attendees: [{ initials: 'DM', color: '#1a3a8b' }, { initials: 'FS', color: '#7a1a8b' }, { initials: 'GR', color: '#1a7a3a' }],
  },
  {
    id: 3,
    title: 'Credit Committee · Sharma ₹12 Cr',
    score: 87,
    state: 'STANDBY' as const,
    time: '11:00 – 12:00',
    agenda: ['Final sanction vote', 'Pricing nuance possible'],
    attendees: [{ initials: 'VS', color: '#8B1A1A' }, { initials: 'KP', color: '#1a3a8b' }, { initials: 'LN', color: '#7a1a8b' }],
  },
  {
    id: 4,
    title: 'Quarterly Review · Mehta Group',
    score: 71,
    state: 'AVATAR ATTENDS' as const,
    time: '14:00 – 15:00',
    debrief: '15:10',
    agenda: ['Portfolio review', 'Rebalancing proposal'],
    attendees: [{ initials: 'AM', color: '#1a7a3a' }, { initials: 'RS', color: '#8B1A1A' }],
  },
];

const STATE_STYLES: Record<string, { border: string; label: string; pill: string }> = {
  'YOU ATTEND': { border: '2px solid var(--idfc-red)', label: 'var(--idfc-red)', pill: 'var(--idfc-red)' },
  'AVATAR ATTENDS': { border: '2px dashed var(--border-subtle)', label: 'var(--text-secondary)', pill: '#2a4a2a' },
  'STANDBY': { border: '1.5px solid var(--border-subtle)', label: 'var(--text-tertiary)', pill: '#2a2a3a' },
};

function AttendeeCircles({ attendees }: { attendees: { initials: string; color: string }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {attendees.map((a, i) => (
        <div key={i} style={{
          width: 28, height: 28, borderRadius: '50%', background: a.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#fff',
          fontWeight: 700, marginLeft: i > 0 ? -8 : 0,
          border: '2px solid var(--bg-card)', zIndex: attendees.length - i,
        }}>{a.initials}</div>
      ))}
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: typeof MEETINGS[0] }) {
  const s = STATE_STYLES[meeting.state];
  return (
    <div style={{
      background: 'var(--bg-card)', border: s.border, borderRadius: 12,
      padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: s.label, fontWeight: 700 }}>{meeting.state}</span>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 36, fontWeight: 700, color: meeting.score >= 80 ? 'var(--idfc-red-bright)' : 'var(--text-secondary)', lineHeight: 1 }}>{meeting.score}</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{meeting.title}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{meeting.time}</div>
      </div>
      <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {meeting.agenda.map((item, i) => (
          <li key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <AttendeeCircles attendees={meeting.attendees} />
        <div style={{
          background: s.pill, borderRadius: 20, padding: '4px 10px',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
          color: '#fff', letterSpacing: '0.08em',
        }}>
          {meeting.state === 'YOU ATTEND' && `LIVE · ${meeting.time}`}
          {meeting.state === 'AVATAR ATTENDS' && `AVATAR DISPATCHED · DEBRIEF AT ${(meeting as any).debrief}`}
          {meeting.state === 'STANDBY' && 'STANDBY · PULLED IN IF NEEDED'}
        </div>
      </div>
    </div>
  );
}

export default function MeetingAvatarPage() {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  async function dispatch() {
    if (!link.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/avatar/join-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_url: link }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Header strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-tertiary)' }}>{now}</span>
          {[`AVATARS DISPATCHED · 2`, `LIVE ATTENDANCE · 1`].map(pill => (
            <span key={pill} style={{
              background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 20,
              padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: 'var(--text-secondary)', letterSpacing: '0.1em', fontWeight: 700,
            }}>{pill}</span>
          ))}
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.15 }}>
            Your meetings, <em style={{ color: 'var(--idfc-red)', fontStyle: 'italic' }}>scored &amp; routed.</em>
          </h1>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 40px', maxWidth: 620, lineHeight: 1.6 }}>
          The AI scores each meeting against your priorities. You attend the one that matters. Avatars take notes and debrief.
        </p>

        {/* Meeting cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
          {MEETINGS.map(m => <MeetingCard key={m.id} meeting={m} />)}
        </div>

        {/* Dispatch panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '28px 28px 24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 16 }}>DISPATCH AVATAR TO A MEETING</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <input value={link} onChange={e => setLink(e.target.value)} placeholder="Paste Teams or Google Meet link…"
              style={{ flex: 2, minWidth: 240, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 14px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-primary)', outline: 'none' }} />
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Meeting title"
              style={{ flex: 1, minWidth: 160, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 14px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-primary)', outline: 'none' }} />
            <button onClick={dispatch} disabled={status === 'loading' || !link.trim()}
              style={{ background: 'var(--idfc-red)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', cursor: link.trim() ? 'pointer' : 'not-allowed', opacity: link.trim() ? 1 : 0.5, whiteSpace: 'nowrap' }}>
              {status === 'loading' ? 'DISPATCHING…' : 'DISPATCH AVATAR'}
            </button>
          </div>
          <div style={{ marginTop: 12, fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-tertiary)' }}>
            {status === 'success' && <span style={{ color: '#22c55e' }}>Avatar dispatched. Debrief will arrive after the meeting.</span>}
            {status === 'error' && <span style={{ color: 'var(--idfc-red-bright)' }}>Dispatch failed. Check the link and try again.</span>}
            {status === 'idle' && 'Avatar will join, take notes, and send you a debrief.'}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
