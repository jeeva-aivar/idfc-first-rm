export type Badge = 'SENT' | 'REVIEW' | 'DONE' | 'FLAGGED' | 'READY' | 'APPROVED'

export type ActionItem = {
  id: string
  which: 'c' | 's'
  time: string
  title: string
  detail: string
  badge: Badge
  needsAction?: boolean
  ai: {
    kind: string
    to?: string
    cc?: string
    subject?: string
    originalEmail?: string
    aiDraft?: string
    confidence?: number
    reasoning?: string[]
    deck?: string
    metaItems?: { k: string; v: string }[]
  }
}

export const COMMS_DATA: ActionItem[] = [
  {
    id: 'c0', which: 'c',
    time: '04:12', title: 'Auto-replied to Patel Industries.', detail: 'Confirmed receipt of facility renewal docs. Cc\'d Risk team.',
    badge: 'SENT',
    ai: {
      kind: 'TIER-1 AUTO-REPLY', to: 'Rajesh Patel <cfo@patelindustries.in>', cc: 'risk.team@idfcfirstbank.com', subject: 'RE: Facility Renewal Documentation – Acknowledgement',
      originalEmail: `From: Rajesh Patel <cfo@patelindustries.in>
Date: 04:01 IST · 10 May 2026
Subject: Facility Renewal Documentation

Dear Priya,

Please find attached the complete renewal pack for our ₹6.5 Cr Working Capital facility — includes audited FY26 financials, Form 16C, and GST returns for the last 3 quarters.

Let me know if anything is missing.

Regards,
Rajesh Patel
CFO, Patel Industries`,
      aiDraft: `Dear Mr. Patel,

Thank you for promptly submitting the facility renewal documents. We have received the complete package including audited FY26 financials, Form 16C, and GST returns.

Your submission has been forwarded to our Risk & Credit team (cc'd above) for review. You can expect an acknowledgement from them within 2 business days.

I will personally follow up on the status by 13 May 2026.

Warm regards,
Priya Sharma
Relationship Manager – IDFC FIRST Bank`,
      confidence: 94,
      reasoning: [
        'Document set appears complete — 3 of 3 required items detected',
        'Tier-1 customer, auto-reply threshold met (facility > ₹5 Cr)',
        'Risk team CC policy active for renewal packets',
        'No pricing or negotiation elements detected — safe to auto-send',
      ],
      metaItems: [{ k: 'Facility', v: '₹6.5 Cr WC OD' }, { k: 'Stage', v: 'Docs received' }, { k: 'SLA', v: 'Response within 4 hrs ✓' }],
    },
  },
  {
    id: 'c1', which: 'c',
    time: '05:48', title: 'Drafted reply to Joshi & Co.', detail: 'Awaiting your nuance — pricing question. Held for 09:15.',
    badge: 'REVIEW', needsAction: true,
    ai: {
      kind: 'DRAFT HELD FOR REVIEW', to: 'Amit Joshi <amit@joshico.com>', subject: 'RE: CC Pricing – Your Query',
      originalEmail: `From: Amit Joshi <amit@joshico.com>
Date: 05:31 IST · 10 May 2026
Subject: CC Pricing – Your Query

Hi Priya,

We've received an offer from HDFC at 9.25% for our ₹3 Cr CC renewal. Can IDFC match or better this? We're keen to stay but need the numbers to make sense.

Thanks,
Amit`,
      aiDraft: `Dear Amit,

Thank you for your transparency on the competitive offer. I understand the importance of getting the right pricing for your business.

I'm currently reviewing this with our credit and pricing team and will revert with our best offer by 10:00 IST today. Our relationship and your track record with us are important factors that I'll be highlighting internally.

Please hold on any decision until you hear from me.

Warm regards,
Priya Sharma`,
      confidence: 61,
      reasoning: [
        'Competitor pricing mentioned — auto-send policy suspended for price-sensitive comms',
        'HDFC benchmark at 9.25% requires credit approval before counter-offer',
        'Customer history: 3yr relationship, clean repayment — strong case for pricing exception',
        'Recommended: approve after verifying current pricing band with your credit desk',
      ],
      deck: 'Joshi & Co — Retention Pricing Brief (auto-generated) · 4 slides',
      metaItems: [{ k: 'Competitor', v: 'HDFC at 9.25%' }, { k: 'Our current rate', v: '9.75% (needs exception)' }, { k: 'Held since', v: '05:48 IST' }],
    },
  },
  {
    id: 'c2', which: 'c',
    time: '06:02', title: 'KYC reminder · Singh Trading.', detail: 'Form pre-filled with last year\'s data. Expires in 7 days.',
    badge: 'SENT',
    ai: {
      kind: 'KYC REMINDER — AUTO-SENT', to: 'Harpreet Singh <hs@singhtrading.com>', subject: 'KYC Renewal Required – Action by 17 May 2026',
      aiDraft: `Dear Mr. Singh,

This is a reminder that your KYC documentation is due for renewal by 17 May 2026 (7 days from today).

We've pre-filled the renewal form using your last year's submission to save you time. Only your latest address proof and a current photograph will be needed.

Please click the secure link below to review and submit: [SECURE LINK]

For any assistance, please call our branch directly on 022-XXXX-XXXX.

Warm regards,
Priya Sharma`,
      confidence: 97,
      reasoning: [
        'KYC expiry in 7 days — within auto-reminder SLA window',
        'Form pre-populated from last submission (address unchanged, same business type)',
        'Standard trade customer — no exceptions required',
        'WhatsApp link also dispatched at 06:03',
      ],
      metaItems: [{ k: 'KYC Expiry', v: '17 May 2026' }, { k: 'Days remaining', v: '7' }, { k: 'Form pre-fill', v: '85% complete' }],
    },
  },
  {
    id: 'c3', which: 'c',
    time: '06:14', title: 'KYC reminder · Mehra Logistics.', detail: 'Expires in 11 days. Tier-1 template, low risk.',
    badge: 'SENT',
    ai: {
      kind: 'KYC REMINDER — AUTO-SENT', to: 'Deepak Mehra <deepak@mehralogistics.in>', subject: 'KYC Renewal Required – Action by 21 May 2026',
      aiDraft: `Dear Mr. Mehra,

Your KYC is due for renewal by 21 May 2026. We've initiated the process early to ensure no disruption to your banking facilities.

A pre-filled renewal form has been prepared. Please confirm your current registered address and submit one recent photograph to complete the renewal.

Secure link: [SECURE LINK]

Warm regards,
Priya Sharma`,
      confidence: 98,
      reasoning: ['KYC expiry in 11 days — proactive reminder window', 'Tier-1 template applied (AUM > ₹2 Cr)', 'No address change detected in last 2 years'],
      metaItems: [{ k: 'KYC Expiry', v: '21 May 2026' }, { k: 'Days remaining', v: '11' }, { k: 'Risk', v: 'Low' }],
    },
  },
  {
    id: 'c4', which: 'c',
    time: '06:30', title: 'WhatsApp · Verma Capital.', detail: 'Out-of-office acknowledgement, follow-up scheduled 10:00.',
    badge: 'SENT',
    ai: {
      kind: 'WHATSAPP AUTO-REPLY', to: 'Anand Verma (WhatsApp · +91 99100 77777)', subject: 'WhatsApp Auto-acknowledgement',
      aiDraft: `Hi Anand,

Thank you for your message. Priya is currently in a morning briefing and will get back to you by 10:00 IST today.

If this is urgent, please call the branch directly: 022-XXXX-XXXX.

— IDFC FIRST AI Assistant (on behalf of Priya Sharma)`,
      confidence: 99,
      reasoning: ['WhatsApp received at 06:28 while RM unavailable', 'Standard OOO policy applied', 'Follow-up reminder set for 09:55 IST'],
      metaItems: [{ k: 'Channel', v: 'WhatsApp Business' }, { k: 'Follow-up set', v: '09:55 IST' }, { k: 'Customer tier', v: 'Priority' }],
    },
  },
  {
    id: 'c5', which: 'c',
    time: '07:15', title: 'Birthday greeting · Rajesh Mehta.', detail: 'Personalised WhatsApp + email sent. No gift card attached.',
    badge: 'SENT',
    ai: {
      kind: 'BIRTHDAY GREETING — AUTO-SENT', to: 'Rajesh Mehta <cmd@mehtagroup.in>', subject: 'Many Happy Returns — from Priya & Team IDFC FIRST',
      aiDraft: `Dear Rajiv,

Warmest birthday wishes from me and the entire IDFC FIRST family! We are grateful for your continued trust and partnership.

May this year bring you excellent health, happiness, and many more milestones for Mehta Group.

Warm regards,
Priya Sharma`,
      confidence: 99,
      reasoning: ['Birthday date in CRM — annual trigger', 'Personal tone template applied for Priority tier', 'Sent at 07:15 to land before business hours'],
      metaItems: [{ k: 'Event', v: 'Birthday — Rajiv Mehta (CMD)' }, { k: 'Channel', v: 'Email + WhatsApp' }, { k: 'Gift card', v: 'None (policy)' }],
    },
  },
  {
    id: 'c6', which: 'c',
    time: '08:04', title: 'Follow-up · Desai Group term sheet.', detail: 'Gentle nudge sent — no response in 72 hrs.',
    badge: 'SENT',
    ai: {
      kind: 'FOLLOW-UP NUDGE — AUTO-SENT', to: 'Nitin Desai <nitin@desaigroup.com>', subject: 'RE: Term Sheet – Checking In',
      aiDraft: `Dear Nitin,

I wanted to follow up on the term sheet we shared on 7 May. I understand you may be reviewing it with your board.

Do let me know if you have any questions or need any adjustments — I'm happy to arrange a quick call at your convenience.

Warm regards,
Priya Sharma`,
      confidence: 88,
      reasoning: ['No response to term sheet in 72 hrs — follow-up SLA triggered', 'Polite nudge tone applied (not pushy)', 'Deal value ₹4.8 Cr — Priority escalation threshold'],
      deck: 'Desai Group — Term Sheet Summary (auto-generated) · 6 slides',
      metaItems: [{ k: 'Deal stage', v: 'Term sheet sent' }, { k: 'Last contact', v: '7 May 2026' }, { k: 'Deal value', v: '₹4.8 Cr' }],
    },
  },
]

export const SYS_DATA: ActionItem[] = [
  {
    id: 's0', which: 's',
    time: '04:48', title: 'Salesforce notes synced.', detail: 'Yesterday\'s Mehta call notes formatted, tagged & saved.',
    badge: 'DONE',
    ai: {
      kind: 'CRM SYNC — COMPLETE',
      reasoning: ['Call transcript auto-transcribed and summarised', '3 action items extracted and added to task queue', 'CRM record updated with latest interaction date'],
      metaItems: [{ k: 'Record', v: 'Mehta Group' }, { k: 'Notes', v: '3 action items extracted' }, { k: 'Tags applied', v: 'CC-renewal, follow-up, risk' }],
    },
  },
  {
    id: 's1', which: 's',
    time: '05:14', title: 'Pipeline updated · Sharma Industries.', detail: 'Stage moved to "verbal commit". Confidence 82%.',
    badge: 'DONE',
    ai: {
      kind: 'PIPELINE UPDATE — COMPLETE',
      reasoning: ['Email sentiment analysis detected positive buying signal', 'Keyword "we\'re aligned" in last email — stage upgraded', 'Confidence model based on 6 previous similar deals'],
      metaItems: [{ k: 'Customer', v: 'Sharma Industries' }, { k: 'Stage', v: 'Verbal commit (was: proposal sent)' }, { k: 'Confidence', v: '82%' }],
    },
  },
  {
    id: 's2', which: 's',
    time: '06:02', title: 'SLA risk · Kapoor Group KYC.', detail: '48-hr breach predicted. Suggesting reassignment to Amit.',
    badge: 'REVIEW', needsAction: true,
    ai: {
      kind: 'SLA RISK — NEEDS YOUR REVIEW',
      reasoning: [
        'KYC docs pending — customer unreachable for 4 days',
        'SLA breach predicted in 48 hrs at current pace',
        'Amit Kulkarni has prior relationship with this group (FY24)',
        'Auto-reassign blocked pending your approval',
      ],
      deck: 'Kapoor Group — KYC Risk Summary · 2 slides',
      metaItems: [{ k: 'Customer', v: 'Kapoor Group' }, { k: 'KYC deadline', v: '12 May 2026' }, { k: 'Suggested action', v: 'Reassign to Amit Kulkarni' }],
    },
  },
  {
    id: 's3', which: 's',
    time: '06:24', title: 'Cross-sell signal · Iyer family.', detail: 'Recurring deposit maturing — wealth product fit. NBA prepped.',
    badge: 'FLAGGED',
    ai: {
      kind: 'CROSS-SELL OPPORTUNITY — FLAGGED',
      reasoning: [
        'Recurring deposit of ₹38L matures in 12 days',
        'Customer has ₹12.1 Cr AUM — wealth product fit score: 87/100',
        'NBA engine recommends PMS reinvestment pitch',
        'Prep pack auto-generated for your use',
      ],
      deck: 'Iyer Family — RD Maturity Pitch Pack · 5 slides',
      metaItems: [{ k: 'Customer', v: 'Iyer Family' }, { k: 'Event', v: 'RD maturity · ₹38L · 22 May 2026' }, { k: 'Recommended product', v: 'Wealth PMS / ULIP' }],
    },
  },
  {
    id: 's4', which: 's',
    time: '06:48', title: 'T&E ready · Pune trip.', detail: 'OCR extracted 12 receipts. Submission pre-filled.',
    badge: 'READY',
    ai: {
      kind: 'T&E SUBMISSION — READY TO SEND',
      reasoning: ['Email attachments detected as receipts from Pune trip dates', 'OCR extracted amounts and merchant names', 'Submission form pre-filled — pending your digital signature'],
      metaItems: [{ k: 'Trip', v: 'Pune client visit · 7–8 May' }, { k: 'Receipts', v: '12 extracted via OCR' }, { k: 'Total amount', v: '₹14,820' }],
    },
  },
]

export const ALL_ITEMS: ActionItem[] = [...COMMS_DATA, ...SYS_DATA]

export const BADGE_STYLE: Record<Badge, { color: string; border: string }> = {
  SENT:     { color: '#16a34a', border: '#16a34a' },
  REVIEW:   { color: '#dc2626', border: '#dc2626' },
  DONE:     { color: '#6b7280', border: '#9ca3af' },
  FLAGGED:  { color: '#b45309', border: '#d97706' },
  READY:    { color: '#2563eb', border: '#3b82f6' },
  APPROVED: { color: '#16a34a', border: '#16a34a' },
}
