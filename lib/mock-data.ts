// MOCK DATA — ported from data.jsx. Use this in place of window.MOCK.

export const MOCK = {
  rm: {
    name: "Priya Sharma",
    role: "Retail RM · Mumbai N",
    portfolio: 47,
    initials: "PS",
  },
  manager: {
    name: "Vikram Joshi",
    role: "Cluster Head",
    quote: "Mehta first, NPA second, Q4 prep critical for tomorrow.",
    aligned: "ALIGNED 4/4 · 3 taps to lock",
  },

  briefingStats: [
    { label: "TIER-1 REPLIES SENT",   value: "12",     sub: "across email & WhatsApp" },
    { label: "CRM RECORDS UPDATED",   value: "5",      sub: "auto-synced overnight" },
    { label: "KYC REMINDERS FIRED",   value: "2",      sub: "pre-filled forms dispatched" },
    { label: "TIME SAVED OVERNIGHT",  value: "1h 48m", sub: "vs your weekly baseline" },
  ],

  priorities: [
    {
      n: "01",
      time: "09:30",
      customer: "Mehta Group",
      headline: "₹3.2 Cr sanction call",
      context: "Sentiment cooling 12%. Lead with locked rate, then prepayment waiver.",
      contextLong: "₹3.2 Cr facility. Sentiment cooling. Lock-in rate question. Customer asked about prepayment waiver Aug 14.",
      why: "HIGHEST RISK",
      whyTone: "danger",
      status: "PREP READY",
      statusTone: "warning",
      prep: { icon: "ClipboardList", label: "Prep pack ready", detail: "Customer 360, terms, NBA scripted.", tag: "AUTO-PREPARED ✓" },
      expanded: [
        { k: "Outstanding facility", v: "₹2.4 Cr" },
        { k: "Proposed sanction",    v: "₹3.2 Cr" },
        { k: "Tenor",                v: "84 months" },
        { k: "Locked rate",          v: "10.25% (held until 11 May)" },
        { k: "Sentiment",            v: "Cooling — 12% (last 14 days)" },
        { k: "Last touch",           v: "14 Apr — prepayment waiver query" },
      ],
    },
    {
      n: "02",
      time: "11:00",
      customer: "NPA Committee",
      headline: "your call",
      context: "Score 92. 4 cases on the docket. Avatars dispatched to Standup & Credit.",
      contextLong: "Score 92. 4 cases on the docket. Outcome will set tone for the quarter.",
      why: "DECISION-GRADE",
      whyTone: "info",
      status: "ALIGNED",
      statusTone: "info",
      prep: { icon: "Users", label: "Avatars dispatched", detail: "Standup (48), Credit (87) — debrief at 11:45.", tag: "EMPLOYEE.AI ✓" },
      expanded: [
        { k: "Cases on docket",      v: "4" },
        { k: "Pre-read ready",       v: "12-page brief auto-summarized" },
        { k: "Avatars dispatched",   v: "Standup 09:00 · Credit 09:30" },
        { k: "Recommended outcome",  v: "Restructure 2 · Write-off 1 · Hold 1" },
      ],
    },
    {
      n: "03",
      time: "15:00",
      customer: "Q4 Portfolio review",
      headline: "sign-off",
      context: "Document Intelligence drafted; 2 sections await your judgement.",
      contextLong: "Drafted. 2 sections need judgement. Branch + cluster figures consolidated.",
      why: "90 MIN SAVED",
      whyTone: "success",
      status: "DRAFTED",
      statusTone: "warning",
      prep: { icon: "FileCheck2", label: "Sources verified", detail: "Salesforce + Core Banking + Compliance.", tag: "DOC INTEL ✓" },
      expanded: [
        { k: "Pages drafted",        v: "14 of 14" },
        { k: "Awaiting judgement",   v: "§4 commentary, §7 risk outlook" },
        { k: "Sources",              v: "Salesforce · Core Banking · Compliance" },
        { k: "Reviewer",             v: "Cluster Head — due 16:00" },
      ],
    },
    {
      n: "04",
      time: "16:00",
      customer: "Iyer family",
      headline: "wealth cross-sell",
      context: "NBA flagged a high-signal moment. RD maturing — pitch ready.",
      contextLong: "Conservative tone. RD maturing — high signal moment.",
      why: "NBA",
      whyTone: "info",
      status: "SURFACED",
      statusTone: "info",
      prep: { icon: "MessageSquareQuote", label: "Pitch script ready", detail: "Tone-tuned for family preference.", tag: "DOC INTEL ✓" },
      expanded: [
        { k: "Maturing RD",          v: "₹38L on 14 May" },
        { k: "Suggested product",    v: "FIRST Wealth Conservative · 6.8% blended" },
        { k: "Tone signal",          v: "Family-led decisions, formal Hindi" },
        { k: "Last conversation",    v: "28 Apr — son's college planning" },
      ],
    },
  ],

  comms: [
    { time: "04:12", title: "Auto-replied to Patel Industries.", detail: "Confirmed receipt of facility renewal docs. Cc'd Risk team.", status: "SENT", tone: "success",
      detailFull: {
        kind: "Email · auto-reply",
        to: "ravi.patel@patelindustries.in",
        cc: "risk-team@idfcfirstbank.com",
        subject: "Re: Renewal package · CC-22841 · received",
        body: "Dear Mr. Patel,\n\nThanking you for sharing the renewal documentation for facility CC-22841. I confirm receipt of all 14 attachments. Risk team has been copied for parallel review.\n\nWe will revert with the consolidated quote by Fri 9 May, 17:00 IST.\n\nWarm regards,\nPriya Sharma\nIDFC FIRST Bank · Mumbai N",
        meta: [{ k: "Template", v: "Renewal acknowledgement v3.1" }, { k: "Risk score", v: "Low (0.18)" }, { k: "Tier", v: "1 — fully autonomous" }],
      }
    },
    { time: "05:48", title: "Drafted reply to Joshi & Co.", detail: "Awaiting your nuance — pricing question. Held for 09:15.", status: "REVIEW", tone: "warning", needsAction: true,
      detailFull: {
        kind: "Email · drafted (held for review)",
        to: "amit.joshi@joshi-co.in",
        cc: "—",
        subject: "Re: Pricing — working capital limit Q4",
        body: "Dear Mr. Joshi,\n\nThank you for the call yesterday. On the working-capital limit question — based on your usage profile (avg utilization 64%, peak 91%), we can offer:\n\n  • Tranche A · ₹4 Cr at MCLR + 1.85%\n  • Tranche B · ₹2 Cr at MCLR + 2.20% (event-linked)\n\n[AI NOTE: this is the standard quote. Recommend manual nuance — the customer hinted at a competitor offer 18 bps lower; consider adding the FX hedging waiver as relationship sweetener.]\n\nKind regards,\nPriya",
        meta: [{ k: "Why held", v: "Pricing query · risk score 0.62 (above tier-1 ceiling)" }, { k: "Suggested edit", v: "Mention FX hedging waiver" }, { k: "If approved", v: "Sends within 30 sec" }],
      }
    },
    { time: "06:02", title: "KYC reminder · Singh Trading.", detail: "Form pre-filled with last year's data. Expires in 7 days.", status: "SENT", tone: "success",
      detailFull: { kind: "WhatsApp + Email · KYC reminder", to: "harpreet.singh@singhtrading.com · +91 ••••• ••27", cc: "—", subject: "Annual KYC refresh · 7 days remaining",
        body: "Hi Harpreet,\n\nQuick reminder — your annual KYC refresh is due by 15 May. We've pre-filled the form with last year's data; please review and e-sign.\n\nLink: idfcfirstbank.com/kyc/sign/SG-22841 (valid 7 days)\n\nThanks,\nIDFC FIRST",
        meta: [{ k: "Pre-filled fields", v: "12 of 14" }, { k: "Customer effort", v: "~90 seconds" }, { k: "Channels", v: "WhatsApp + Email" }] }
    },
    { time: "06:14", title: "KYC reminder · Mehra Logistics.", detail: "Expires in 11 days. Tier-1 template, low risk.", status: "SENT", tone: "success",
      detailFull: { kind: "Email · KYC reminder", to: "ops@mehralogistics.com", cc: "—", subject: "KYC refresh · 11 days",
        body: "Standard tier-1 template. Pre-filled, low-risk customer.",
        meta: [{ k: "Risk", v: "Low (0.12)" }, { k: "Template", v: "Tier-1 KYC v2" }] }
    },
    { time: "06:30", title: "WhatsApp · Verma Capital.", detail: "Out-of-office acknowledgement, follow-up scheduled 10:00.", status: "SENT", tone: "success",
      detailFull: { kind: "WhatsApp · auto-acknowledge", to: "+91 ••••• ••12", cc: "—", subject: "OOO bounce-back",
        body: "Thanks for your message. Priya is in a customer meeting until 09:30. Your query has been logged — she'll respond by 10:00.",
        meta: [{ k: "Triggered by", v: "OOO calendar block 09:00-09:30" }, { k: "Follow-up scheduled", v: "10:00 IST" }] }
    },
    { time: "07:12", title: "Birthday greeting · Rajesh Mehta.", detail: "Personalized by relationship tier (Priority).", status: "SENT", tone: "success",
      detailFull: { kind: "Email · greeting", to: "rajesh@mehtagroup.in", cc: "—", subject: "Wishing you a wonderful birthday, Mr. Mehta",
        body: "Dear Mr. Mehta,\n\nOn behalf of the IDFC FIRST family, wishing you a wonderful year ahead — health, joy, and continued success.\n\nWith warm regards,\nPriya Sharma & team",
        meta: [{ k: "Tier", v: "Priority" }, { k: "Tone", v: "Formal warm" }] }
    },
    { time: "07:45", title: "FD maturity reminder · Lakshmi Iyer.", detail: "Renewal options pre-filled, dispatched via email.", status: "SENT", tone: "success",
      detailFull: { kind: "Email · FD renewal", to: "lakshmi.iyer@gmail.com", cc: "—", subject: "Your FD matures 22 May · renewal options",
        body: "Dear Mrs. Iyer,\n\nYour FD #FD-44219 (₹12,00,000) matures on 22 May 2026. Renewal options:\n  • 24 months · 7.05%\n  • 36 months · 7.20%\n  • 60 months · 7.40%\n\nReply YES + tenor to lock today's rate.",
        meta: [{ k: "Maturity amount", v: "₹12,00,000 + ₹84,600 interest" }, { k: "Today's best rate", v: "7.40% (60m)" }] }
    },
    // Additional communications
    { time: "03:22", title: "Auto-replied to Goyal Pharma.", detail: "Site visit confirmation sent, calendar block created.", status: "SENT", tone: "success",
      detailFull: { kind: "Email · auto-reply", to: "anand.goyal@goyalpharma.in", cc: "—", subject: "Re: Site visit confirmation · 9 May",
        body: "Dear Mr. Goyal,\n\nConfirming Priya's visit on 9 May at 14:00. Calendar invite attached. Please ensure the operations team is available for a 20-min floor walk.\n\nWarm regards,\nPriya Sharma · IDFC FIRST Bank",
        meta: [{ k: "Calendar block", v: "9 May 14:00-15:00" }, { k: "Tier", v: "1 — autonomous" }] }
    },
    { time: "03:45", title: "Diwali greeting batch · 38 customers.", detail: "Tier-personalized, queued for 09:15 your review.", status: "REVIEW", tone: "warning", needsAction: true,
      detailFull: { kind: "Email batch · greeting (held for review)", to: "38 customers · Priority + Wealth tiers", cc: "—", subject: "Diwali greetings · personalized batch",
        body: "Batch of 38 greeting emails personalized by relationship tier, language preference, and last interaction. Priority customers get hand-written style. Wealth customers get formal English.\n\n[AI NOTE: Held for your review at 09:15. 3 emails flagged for extra care — Mehta, Iyer family, Sharma Industries.]",
        meta: [{ k: "Total batch", v: "38 emails" }, { k: "Flagged for review", v: "3 (Priority tier)" }, { k: "Languages", v: "English (28), Hindi (8), Marathi (2)" }] }
    },
    { time: "05:20", title: "Nair Exports · FX rate alert sent.", detail: "USD/INR moved to 84.2 — opportunity window 4hrs.", status: "SENT", tone: "success",
      detailFull: { kind: "WhatsApp · rate alert", to: "+91 ••••• ••43", cc: "—", subject: "USD/INR opportunity window — 4hr",
        body: "Good morning. USD/INR touched 84.2 at 05:15 — within your preferred booking range. Window estimated 4 hrs. Shall I block ₹50L at today's rate?\n\n— IDFC FIRST FX desk, on behalf of Priya",
        meta: [{ k: "Rate", v: "84.2 (USD/INR)" }, { k: "Window estimate", v: "4 hours" }, { k: "Exposure", v: "$120K open" }] }
    },
    { time: "06:55", title: "Anand Sons · NRI query pre-answered.", detail: "Account opening checklist pre-filled, WhatsApp sent.", status: "SENT", tone: "success",
      detailFull: { kind: "WhatsApp · query response", to: "+91 ••••• ••61", cc: "—", subject: "NRI account query — walk-in today",
        body: "Hello! We received your query about NRI account opening. I've attached a pre-filled checklist based on the details you provided. When you visit today, please bring:\n1. Passport (original + copy)\n2. Overseas address proof\n3. PAN card\n\nI'll personally attend to you. — Priya",
        meta: [{ k: "Query type", v: "NRI account opening" }, { k: "Walk-in time", v: "Today 10:50" }, { k: "Pre-filled fields", v: "7 of 12" }] }
    },
  ],

  systemUpdates: [
    { time: "04:48", title: "Salesforce notes synced.", detail: "Yesterday's Mehta call notes formatted, tagged & saved.", status: "DONE", tone: "success",
      detailFull: { kind: "CRM update · Salesforce", to: "Mehta Group account", cc: "—", subject: "Call notes · 8 May 16:30 — sentiment cooling",
        body: "Auto-formatted notes from voice memo (4 min 22 sec).\n\nKey points:\n  • Customer raised prepayment waiver question (14 Apr follow-up)\n  • Sentiment cooling — concerns on rate movement\n  • Mentioned competitor (HDFC) approach\n  • Action: send revised term sheet by Fri",
        meta: [{ k: "Source", v: "Voice memo · transcribed" }, { k: "Tags applied", v: "sanction, prepayment, competitor-mentioned" }, { k: "Linked to", v: "Opp #OPP-9912" }] }
    },
    { time: "05:14", title: "Pipeline updated · Sharma Industries.", detail: "Stage moved to \"verbal commit\". Confidence 82%.", status: "DONE", tone: "success",
      detailFull: { kind: "CRM update · pipeline stage", to: "Sharma Industries · Opp #OPP-9904", cc: "—", subject: "Stage: Negotiation → Verbal commit",
        body: "Trigger: customer's email line \"we are good to proceed\" matched verbal-commit pattern with 82% confidence.",
        meta: [{ k: "Stage moved", v: "Negotiation → Verbal commit" }, { k: "Confidence", v: "82%" }, { k: "Deal value", v: "₹12 Cr" }] }
    },
    { time: "06:02", title: "SLA risk · Kapoor Group KYC.", detail: "48-hr breach predicted. Suggesting reassignment to Amit.", status: "REVIEW", tone: "warning", needsAction: true,
      detailFull: { kind: "Risk · SLA breach prediction", to: "Kapoor Group · KYC ticket #KYC-3389", cc: "Amit Verma (proposed)", subject: "Predicted SLA breach in 48 hrs · auto-reassign?",
        body: "Ticket has been open 7 days. Customer has not responded to 3 outreach attempts. Standard SLA = 9 days; predicted breach 12 May 14:00.\n\nSuggested action: reassign to Amit Verma (Mumbai S, currently 4 open KYC tickets vs your 11). Amit has historical 1.4× faster close rate on Kapoor-tier accounts.",
        meta: [{ k: "Predicted breach", v: "12 May 14:00 IST" }, { k: "Confidence", v: "0.91" }, { k: "Suggested owner", v: "Amit Verma · Mumbai S" }, { k: "If approved", v: "Reassigns + handoff note auto-sent" }] }
    },
    { time: "06:24", title: "Cross-sell signal · Iyer family.", detail: "Recurring deposit maturing — wealth product fit. NBA prepped.", status: "FLAGGED", tone: "danger", needsAction: true,
      detailFull: { kind: "Next-best-action · cross-sell", to: "Iyer family · Wealth", cc: "—", subject: "RD ₹38L maturing 14 May · wealth fit",
        body: "RD maturing 14 May. Customer profile (conservative, family-led) maps to FIRST Wealth Conservative product (6.8% blended yield).\n\nAI prepared a 4-paragraph pitch script tone-tuned for the Iyer family preference (formal Hindi greeting, son's college planning context from last conversation).",
        meta: [{ k: "Trigger", v: "RD maturity in 5 days" }, { k: "Recommended product", v: "FIRST Wealth Conservative" }, { k: "Pitch ready", v: "Yes — 4 paragraphs, tone-tuned" }, { k: "Expected uplift", v: "₹38L → wealth book + 0.6% margin" }] }
    },
    { time: "06:48", title: "T&E ready · Pune trip.", detail: "OCR extracted 12 receipts. Submission pre-filled.", status: "READY", tone: "info",
      detailFull: { kind: "Expense submission · ready", to: "Concur · T&E", cc: "—", subject: "Pune trip · 7–8 May · ₹14,820",
        body: "OCR processed 12 receipts (cab, hotel, meals). All matched to calendar entries. Ready for one-click submit.",
        meta: [{ k: "Total", v: "₹14,820" }, { k: "Receipts processed", v: "12 of 12" }, { k: "Policy violations", v: "0" }] }
    },
    { time: "03:58", title: "Mehta Group prep pack assembled.", detail: "Customer 360, competitor rate sheet, prepayment waiver clause.", status: "DONE", tone: "success",
      detailFull: { kind: "Prep pack · automated assembly", to: "Mehta Group · Opp #OPP-9912", cc: "—", subject: "Prep pack ready: 09:30 call",
        body: "Auto-assembled prep pack:\n\n1. Customer 360: ₹2.4 Cr outstanding, 84m tenor, 10.25% locked rate (held until 11 May)\n2. Last 3 touches: 8 May call (sentiment cooling), 4 May email (rate query), 14 Apr prepayment waiver request\n3. Competitor intelligence: HDFC offering 10.07% — 18 bps lower. Counter-lever: prepayment waiver + relationship discount\n4. Talk-track: open with rate lock confirmation, pivot to waiver before customer raises it\n5. NBA: once facility signed, cross-sell trade finance (₹80L limit, usage-linked)",
        meta: [{ k: "Sentiment", v: "-12% (cooling)" }, { k: "Competitor", v: "HDFC · 10.07%" }, { k: "Talk-track confidence", v: "0.88" }] }
    },
    { time: "07:00", title: "Weekly MIS report compiled.", detail: "Portfolio AUM ₹84 Cr · 47 customers · 3 NPAs flagged.", status: "READY", tone: "info",
      detailFull: { kind: "MIS · weekly report", to: "vikram.joshi@idfcfirstbank.com", cc: "—", subject: "Weekly MIS · Mumbai N · Priya Sharma · 6-9 May",
        body: "Weekly performance summary:\n\n• Portfolio: ₹84 Cr AUM, 47 customers\n• Week wins: Sharma Industries ₹12 Cr, Mehta sanction progressed\n• Pipeline: ₹8.4 Cr in negotiation, ₹3.2 Cr in verbal commit\n• SLA: 0 breaches (Kapoor reassigned proactively)\n• Points: 2418 (Rank #3 Mumbai N)\n\nReady to send on your approval.",
        meta: [{ k: "Coverage", v: "6-9 May 2026" }, { k: "Awaiting approval", v: "Yes — 1-tap send" }] }
    },
  ],

  defaultRules: [
    { id: "tier1-replies",   label: "Send tier-1 replies automatically",         desc: "Routine acknowledgements, OOO bounce-backs, document receipts.", on: true,  threshold: "Risk < 0.30" },
    { id: "kyc-low",         label: "Auto-fire KYC reminders for low-risk tier", desc: "Pre-filled forms dispatched 7/14/21 days before expiry.",        on: true,  threshold: "Risk < 0.40" },
    { id: "salesforce-sync", label: "Auto-sync call notes to Salesforce",         desc: "Voice memo → transcript → tagged record.",                       on: true,  threshold: "Always" },
    { id: "sla-reassign",    label: "Suggest reassignment for predicted breach",  desc: "Hold for your approval before any reassignment.",                on: true,  threshold: "Confidence > 0.85" },
    { id: "birthday",        label: "Birthday & anniversary greetings",          desc: "Tier-personalized for Priority and Wealth customers.",           on: true,  threshold: "Always" },
    { id: "fd-renewal",      label: "FD/RD maturity renewal options",            desc: "Email + WhatsApp 14 days before maturity.",                      on: true,  threshold: "Always" },
    { id: "pipeline-move",   label: "Move pipeline stage on signal",             desc: "Verbal-commit pattern, contract signed, kickoff scheduled.",     on: false, threshold: "Confidence > 0.80" },
    { id: "te-submit",       label: "Auto-submit expense reports",               desc: "After OCR + policy check, no violations.",                       on: false, threshold: "Violations = 0" },
  ],

  debriefStats: [
    { label: "CUSTOMER TIME", value: "5h 42m", sub: "of 8h" },
    { label: "AUTO-ACTIONS",  value: "142",    sub: "" },
    { label: "SLA BREACHES",  value: "0",      sub: "" },
  ],

  debriefTimeline: [
    { time: "09:30", headline: "Mehta call · sentiment swung warm", detail: "+18 points; sanction sign-off cleared at 15:48.",       outcome: "WIN",        tone: "success",  date: "9 May" },
    { time: "10:00", headline: "Sharma Industries · ₹12 Cr closed", detail: "Chairman video congratulation delivered in 27 min.",    outcome: "WIN",        tone: "success",  date: "8 May" },
    { time: "11:00", headline: "3 meetings, 1 you",                 detail: "Avatars debriefed. Zero context lost.",                 outcome: "MULTIPLIED", tone: "gold",     date: "8 May" },
    { time: "12:30", headline: "Kapoor KYC · breach prevented",      detail: "Reassigned to Amit 48 hrs ahead of risk window.",       outcome: "SAVED",      tone: "info",     date: "7 May" },
    { time: "16:00", headline: "Iyer family · wealth pitch landed",  detail: "Cross-sell signal converted, follow-up next Wed.",      outcome: "SURFACED",   tone: "redbright", date: "28 Apr" },
  ],

  leaderboard: {
    week: [
      { rank: 1, name: "Anjali Desai",       streak: "12d", points: 2840, delta: "→",   deltaTone: "secondary" },
      { rank: 2, name: "Rohit Kulkarni",     streak: "9d",  points: 2612, delta: "▲ 1", deltaTone: "success" },
      { rank: 3, name: "Priya Sharma · you", streak: "7d",  points: 2418, delta: "▼ 1", deltaTone: "danger", you: true },
      { rank: 4, name: "Vikram Joshi",       streak: "5d",  points: 2308, delta: "→",   deltaTone: "secondary" },
      { rank: 5, name: "Neha Iyer",          streak: "3d",  points: 2140, delta: "▲ 2", deltaTone: "success" },
      { rank: 6, name: "Arjun Patel",        streak: "1d",  points: 2012, delta: "▼ 2", deltaTone: "danger" },
    ],
    month: [
      { rank: 1, name: "Rohit Kulkarni",     streak: "23d", points: 11240, delta: "▲ 1", deltaTone: "success" },
      { rank: 2, name: "Priya Sharma · you", streak: "18d", points: 10982, delta: "▲ 2", deltaTone: "success", you: true },
      { rank: 3, name: "Anjali Desai",       streak: "21d", points: 10840, delta: "▼ 2", deltaTone: "danger" },
      { rank: 4, name: "Neha Iyer",          streak: "12d", points: 9410,  delta: "→",   deltaTone: "secondary" },
      { rank: 5, name: "Vikram Joshi",       streak: "9d",  points: 8980,  delta: "▼ 1", deltaTone: "danger" },
      { rank: 6, name: "Arjun Patel",        streak: "7d",  points: 8412,  delta: "→",   deltaTone: "secondary" },
    ],
    quarter: [
      { rank: 1, name: "Anjali Desai",       streak: "47d", points: 32140, delta: "→",   deltaTone: "secondary" },
      { rank: 2, name: "Rohit Kulkarni",     streak: "42d", points: 31822, delta: "▲ 1", deltaTone: "success" },
      { rank: 3, name: "Neha Iyer",          streak: "38d", points: 30640, delta: "▲ 3", deltaTone: "success" },
      { rank: 4, name: "Priya Sharma · you", streak: "35d", points: 29918, delta: "▼ 1", deltaTone: "danger", you: true },
      { rank: 5, name: "Vikram Joshi",       streak: "29d", points: 28210, delta: "▼ 2", deltaTone: "danger" },
      { rank: 6, name: "Arjun Patel",        streak: "22d", points: 26080, delta: "▼ 1", deltaTone: "danger" },
    ],
  },

  navItems: [
    { section: "TODAY", items: [
      { id: "briefing",    label: "Morning Briefing", icon: "Sun",        path: "/morning-briefing" },
      { id: "priority",    label: "Priority Stack",   icon: "ListChecks", path: "/priority-stack" },
      { id: "actions",     label: "Auto-actions",     icon: "Sparkles",   path: "/auto-actions" },
      { id: "debrief",     label: "Daily Debrief",    icon: "Moon",       path: "/daily-debrief" },
    ]},
    { section: "CUSTOMERS", items: [
      { id: "portfolio",   label: "Portfolio",        icon: "Users",      path: "/portfolio" },
      { id: "book",        label: "Consolidated Book", icon: "Wallet",   path: "/consolidated-book" },
    ]},
    { section: "PERFORMANCE", items: [
      { id: "leaderboard", label: "Leaderboard",      icon: "Trophy",     path: "/leaderboard" },
    ]},
  ],
}
