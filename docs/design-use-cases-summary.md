# IDP-Align Design — Use Cases & User Flow Summary

**Date:** 2026-09-21  
**Purpose:** Map product use cases to prototype UI/UX screens and interactions  
**Audience:** Product Owner, UX Reviewers, Tech Lead  
**Status:** Design research output — describes proposed user journeys

---

## Overview

The IDP-Align prototype implements three primary use cases from `product.md`, each demonstrated through a specific user flow in the dashboard. This document maps scenarios → screens → interactions → design elements.

**Personas served:**
1. AP/Finance Ops Reviewer (document stream focus)
2. Workflow/Process Owner (workflow stream focus)
3. AI Model Quality Engineer (both streams, comparison view)

---

## Use Case 1: Document-Stream Divergence Detection & Investigation

**From product.md Scenario 1:**
> Historical invoice observations for a vendor establish an observed pattern for selected index fields. New invoices begin producing a materially different vendor representation, currency/amount pattern, date representation, or other selected field behavior.
>
> IDP-Align groups the observations by identity slice, distinguishes one-off variation from sustained change, confirms divergence, and shows the evidence supporting the finding.

### User Persona
**AP/Finance Ops Reviewer**
- Goal: Trust extracted values without manually re-checking every document
- Need: See evidence when behavior changes materially
- Context: Reviews invoices routed through Purchase-to-Pay

### User Flow: "Why did these Acme Corp invoices look different?"

#### Step 1: Open Dashboard (DS-001, DS-002, DS-003)
**Screen:** Document Stream Dashboard  
**What they see:**
- KPI cards showing: 8 total divergences, 5 ongoing, 3 resolved
- 7-day trend chart showing divergence count progression (3→4→5→6→6→5→8)
- Status donut showing 62.5% ongoing, 37.5% resolved
- Divergence list sorted by onset (most recent first)

**What they do:**
- Click on "Acme Corp — Amount behavior" divergence card

---

#### Step 2: View Divergence Summary (DS-004, DS-009)
**Screen:** Still on Dashboard, right pane populates  
**What they see:**
- Identity slice: "Vendor: Acme Corp"
- Dimension: "Amount behavior"
- Baseline: "$12,000 ± $1.2K"
- Observed: "$15,450" (orange highlight)
- Magnitude: "+28.8%"
- Timeline: "Onset: 2026-09-19 14:32 | Duration: 3 days 2 hours"
- Status badge: "Ongoing"

**Design elements enabling this (DS-004 Divergence Card):**
- Compact card shows identity slice, dimension, baseline, observed, magnitude at a glance
- Color-coded status (orange = ongoing attention needed)
- Mini-sparkline showing 7-day trend in that card
- Left pane stays visible for quick scanning

**User thought:** "OK, so Acme's invoices are 28% higher than usual. Let me see the details."

---

#### Step 3: Investigate Baseline & Context (DS-005, DS-006)
**Screen:** Detail pane expands  
**What they see:**
- **Baseline Reference Panel:**
  - "Established from 2026-08-01 to 2026-09-18 (240 invoices)"
  - "Method: Historical mean ± 2 standard deviations"
  - "Value: $12,000 ± $1,200 (confidence band: $10,800–$13,200)"

- **Quick Stats:**
  - "Onset: 2026-09-19 at 14:32 UTC"
  - "Duration: 3 days, 2 hours (ongoing)"
  - "Distance from baseline: 2.88 standard deviations (98th percentile)"

- **Cohort Breakdown:**
  - "Total invoices in this vendor slice: 12"
  - "Diverged (outside baseline): 8 (67%)"
  - "Within baseline: 4 (33%)"

**Design elements (DS-005, DS-006):**
- Baseline labeled as "Observed Baseline" (not "expected" or "required")
- Reference window explicitly shown (avoids confusion about which historical period was used)
- Confidence band clearly marked (±2 standard deviations)
- Cohort ratio shows this is a sustained pattern, not one outlier

**User thought:** "So this isn't just one invoice spike. 67% of Acme's recent invoices are high. And they've been like this for 3 days straight. This is a real pattern, not noise."

---

#### Step 4: Review Supporting Evidence (DS-007, DS-014)
**Screen:** Scroll down or click "View Evidence Trace"  
**What they see (Evidence Timeline):**

```
Timeline:
├─ 2026-09-19 14:32 — ONSET
│  "First observation above 95th percentile"
│  Invoice INV-2026-09-19-001: $15,250 (96th percentile vs baseline)
│
├─ 2026-09-19 16:45 — COHORT THRESHOLD CROSSED (22 minutes later)
│  "3 invoices now above threshold"
│  All 3 from Acme Corp, all 90th+ percentile
│
├─ 2026-09-20 12:30 — SUSTAINED DIVERGENCE CONFIRMED (22 hours later)
│  "8 invoices across 24 hours"
│  Confirmed sustained pattern (not one-off spike)
│
└─ 2026-09-21 08:15 — ONGOING (now)
   "Pattern continues; 12 total invoices in divergence cohort"
   Duration: 3 days 18 hours, no sign of reversal
```

**Design elements (DS-007, Timeline/Evidence Trace):**
- Chronological narrative (not just raw data)
- Clear progression: onset → cohort confirmation → sustained → ongoing
- Exact timestamps allow correlation with business events
- Each observation tied to supporting evidence (invoice IDs, counts)

**User thought:** "This started very suddenly. Within hours I had 3 invoices at odd prices. By the next day it was confirmed as a sustained pattern. Whatever caused this, it started on Sep 19 at 2:32 PM. Maybe I should check with Acme about pricing changes that day."

---

#### Step 5: Take Action (Proposed)
**Prototype shows these buttons but doesn't implement:**
- [ ] **Copy Details** → Share with Acme or procurement team
- [ ] **Mute 24h** → "Acknowledge but don't alert me again for 24 hours"
- [ ] **Mark Reviewed** → "I've seen this, I'm investigating"
- [ ] (Future) **Open Investigation** → Link to external tools (email, Slack, etc.)

**User behavior:** They might export these details and email the Acme account manager: "Your recent invoices are showing higher amounts than usual. Can you confirm pricing change on Sep 19?"

---

## Use Case 2: Workflow-Stream Divergence Detection & Investigation

**From product.md Scenario 2:**
> Historical Purchase-to-Pay workflow runs establish observed behavior for a selected step, route, or decision-agent slice.
>
> Task duration, routing, response time, or error behavior begins to differ persistently from the established observed baseline.
>
> IDP-Align confirms sustained divergence and presents the affected identity slice, baseline context, onset, duration, magnitude, and evidence.

### User Persona
**Workflow / Process Owner**
- Goal: Know when a workflow step or cohort begins behaving differently
- Need: Evidence to justify root-cause investigation or remediation
- Context: Owns approval-routing behavior, task timing, decision agents

### User Flow: "Why is Manager Approval taking so long?"

#### Step 1: Switch to Workflow Stream (DS-002)
**Screen:** Dashboard (same layout as document stream)  
**What they do:**
- Click "Workflow" tab in header

**What changes:**
- KPI cards now show workflow metrics: 4 total divergences, 2 ongoing, 2 resolved
- Summary pane shows: "Steps affected," "Decision agents with deviations," "Most common dimensions"
- Divergence list populated with workflow divergences instead of document divergences

**Design element (DS-002, Stream Tab):**
- Same two-column layout, just different data
- No redesign needed; CAV Level 1 pattern applies equally

---

#### Step 2: Identify Step-Level Divergence (DS-004)
**Screen:** Workflow Dashboard divergence list  
**What they see:**
```
DIVERGENCE CARD 1:
├─ Step: Manager Approval
├─ Dimension: Task duration anomaly
├─ Baseline: 2.5 hours ± 45 minutes
├─ Observed: 4.2 hours
├─ Magnitude: +68%
├─ Onset: 2026-09-18 08:00
├─ Duration: 4 days 4 hours
└─ Status: Ongoing
```

**What they do:**
- Click the card to see details

---

#### Step 3: Investigate Baseline & Root Cause Context (DS-005, DS-006)
**Screen:** Detail pane for workflow divergence  
**What they see:**
- **Baseline Reference Panel:**
  - "Established from 2026-07-20 to 2026-09-17 (1,847 workflow runs)"
  - "Method: Historical median ± IQR (interquartile range)"
  - "Baseline range: 1.9 to 3.1 hours (middle 50%)"

- **Quick Stats:**
  - "Onset: 2026-09-18 08:00 UTC"
  - "Duration: 4 days, 4 hours (ongoing)"
  - "Observed median: 4.2 hours (vs. 2.5-hour baseline)"
  - "Percentile: 99th (almost all Manager Approval steps are now slower)"

- **Cohort Breakdown:**
  - "Total workflow runs through Manager Approval: 62"
  - "Affected (outside baseline): 62 (100%)"
  - "Within baseline: 0 (0%)"
  - "**Note:** 100% deviation suggests systemic issue, not random variation"

- **Correlations (from architecture-notes observation):**
  - "Correlates with system load increase on backend (see ops logs)"
  - "Not correlated with invoice amount or vendor"
  - "Suggests infrastructure or process bottleneck, not business logic"

**Design elements (DS-005, DS-006):**
- "Observed Baseline" clearly labeled (this is what normally happens, not what should happen)
- IQR used instead of mean ± SD (appropriate for task durations with natural skew)
- 100% divergence rate is striking and actionable
- Correlation note (from architecture) helps narrow root cause

**User thought:** "All 62 Manager Approval tasks in the last 4 days are slow. Not just some. And it correlates with backend load. This isn't a policy change or workflow logic change—it's a system performance issue. I should escalate to infrastructure."

---

#### Step 4: Review Workflow Evidence (DS-007, DS-010)
**Screen:** Evidence trace for workflow divergence  
**What they see:**

```
Timeline:
├─ 2026-09-18 08:00 — ONSET
│  "Task duration > 3.1 hours (upper baseline)"
│  Workflow WF-2026-09-18-001: Manager Approval took 4.5 hours
│
├─ 2026-09-18 14:00 — COHORT THRESHOLD CROSSED (6 hours later)
│  "12 workflow runs all above baseline"
│  All 12 routed to different managers, all slow
│
├─ 2026-09-19 12:30 — SUSTAINED DIVERGENCE CONFIRMED
│  "All Manager Approval tasks in last 24 hours above baseline"
│  62 runs across 4 days, 100% affected
│
└─ 2026-09-21 08:00 — ONGOING
   "Pattern continues, no improvement"
```

**Design elements (DS-007, Workflow Evidence):**
- Same timeline structure as document stream
- Workflow-specific context (workflow IDs, manager assignments)
- 100% divergence rate is striking and actionable

**User thought:** "This didn't hit one step or one manager. It hit all 62 workflow runs, all managers, all timing metrics. Something infrastructure-level changed on Sep 18 at 8 AM. I need logs from that time."

---

#### Step 5: Deep Analysis - Chart.js View (DS-015)
**Screen:** Click "View Detailed Analysis" button  
**What they see (Divergence Analysis screen):**

```
Main Chart (Chart.js Area Chart):
├─ X-axis: Time (Sep 14 → Sep 21, 6-hour buckets)
├─ Y-axis: Task Duration (hours)
├─ Blue dashed line: Observed baseline (2.5 hours)
├─ Shaded band: Confidence range (1.9–3.1 hours)
├─ Orange line/area: Observed task durations
│   Sep 14–17: hovering around 2.3–2.7 hours (normal)
│   Sep 18 08:00 onwards: jumps to 4.0–4.3 hours (sustained high)
│
└─ Bottom buttons:
   [Task Duration] ← ACTIVE
   [Error Rate]
   [Routing Frequency]
   [Response Time]
   [Queue Length] (if available)
```

**Right-side metrics panel:**
- Health gauge: 100% of tasks affected
- Cohort breakdown: 62 total, 62 diverged, 0 normal
- Baseline: "Median 2.5h, range 1.9–3.1h"
- Observed median: 4.2h
- Timeline: Onset Sep 18 08:00, 4+ days ongoing

**What they do:**
- Click "Error Rate" button to see if errors correlate with slowness

**What they see (chart switches):**
- Error rate chart shows: normal 0.8% through Sep 18, then spikes to 2.3% on Sep 18 at 08:00
- Perfect correlation with task duration spike

**User thought:** "Task duration AND error rate both spiked at exactly the same time. This is definitely a system event, not a business change. Let me check the deployment log for Sep 18 08:00."

---

## Use Case 3: Cross-Stream Review (AI Model Quality Engineer)

**From product.md Scenario 3:**
> An AI Model Quality Engineer opens the dashboard and reviews document-stream and workflow-stream divergence side by side.
>
> The two streams share canonical Level 1 concepts and reusable evidence/detail components, but IDP-Align does not claim that simply displaying both streams constitutes Level 2 multi-source reconciliation or Level 4 cross-stream intent alignment.

### User Persona
**AI Model Quality Engineer**
- Goal: Inspect continuous, explainable evidence of behavioral divergence across document and workflow outputs
- Need: Side-by-side comparison without false claims about alignment
- Context: Evaluates quality of AI-assisted systems (OCR, intelligent indexing, workflow agents)

### User Flow: "Are the AI models diverging together?"

#### Step 1: Open Document Stream (DS-001, DS-002, DS-003)
**Screen:** Dashboard  
**What they see:**
- Document divergences: 8 total, 5 ongoing, 3 resolved
- Top divergence: "Vendor: Acme Corp — Amount behavior (+28.8%)"
- Sparkline: 7-day trend shows increase starting Sep 19

**User note:** "Interesting—document extraction amounts shifted on Sep 19 14:32"

---

#### Step 2: Switch to Workflow Stream (DS-002)
**Screen:** Same dashboard, different data  
**What they see:**
- Workflow divergences: 4 total, 2 ongoing, 2 resolved
- Top divergence: "Step: Manager Approval — Task duration (+68%)"
- Sparkline: 7-day trend shows increase starting Sep 18 08:00 (different onset time!)

**User note:** "Wait, workflow slowness started Sep 18 08:00, but document amount divergence started Sep 19 14:32. Different times, different causes likely."

---

#### Step 3: Investigate Each Stream Separately (DS-007, DS-015)
**What they do:**
1. Click into document divergence → review evidence trace → all observations about Acme invoices
2. Switch to workflow → click into workflow divergence → review evidence trace → all observations about system performance
3. Open Chart.js analysis for document stream → metric buttons show Amount | Vendor Format | Date Format
4. Switch analysis to workflow stream → metric buttons show Task Duration | Error Rate | Routing Frequency

**What they observe:**
- **Document stream:** Divergence is vendor+amount specific. Only Acme Corp affected. Likely business event (pricing change).
- **Workflow stream:** Divergence is system-wide. All managers, all vendors, all steps slow. Likely infrastructure event.

---

#### Step 4: Draw Conclusions (NO CLAIMS OF LEVEL 2/4)
**What they conclude:**
- ✅ Document extraction divergence is NOT due to workflow slowness (different timeline, different scope)
- ✅ Workflow slowness is NOT due to document extraction changes (affects all docs, not just Acme)
- ❌ Do NOT claim these are "aligned" or "cross-validated"—they are two independent Level 1 observations
- ❌ Do NOT imply the system detects "root cause" or "convergence"—Level 1 only observes divergence

**Design elements that prevent false claims (DS-001, DS-002):**
- Streams are visually/functionally separate (two tab panes, not fused)
- Each stream shows its own KPIs, list, detail, evidence independently
- No "cross-stream reconciliation" UI or language
- Each divergence finding stands alone with its own baseline + evidence

---

## Use Case 4: Future Intent Extension (Out of Scope for Level 1)

**From product.md Scenario 4:**
> A future version could introduce explicit business expectations as machine-readable Intent Artifacts. That would begin a Level 3 extension. Comparing those intent artifacts formally with observed state and evaluating tolerance envelopes would be Level 4.
>
> This scenario documents the architectural direction only; it is not part of the current implementation.

### What the Current Prototype Does NOT Do
- ❌ Show "expected" amounts (Level 3 Intent Registry)
- ❌ Show "tolerance envelopes" around expectations (Level 4 formal deltas)
- ❌ Claim "the system should have been 2% under budget" (declared intention)
- ❌ Show convergence or enforcement (Level 6)

### What Level 3 Would Look Like (Future Design Direction)
If business rules were added:

```
Example Future UI (NOT IN CURRENT PROTOTYPE):

DIVERGENCE DETAIL (if Level 3 existed):
├─ Observed Baseline: $12,000 ± $1.2K
├─ Declared Intention: "Acme Corp invoices must be ≤ $13,500" ← Level 3
├─ Observed Value: $15,450
├─ Intent Violation: YES (15,450 > 13,500)
├─ Envelope Breach: +1,950 over limit
└─ Formal Delta: 15% above declared intent ← Level 4
```

**Current prototype shows:** Just the observed baseline and observed value.  
**Why:** CAV Level 1 only observes; Level 3+ requires machine-readable business rules.

---

## Summary: UI/UX Design Elements by Use Case

### Use Case 1: Document Divergence (AP/Finance Ops)

| User Need | Design Element | Implementation |
| ---------- | -------------- | -------------- |
| Quick overview | KPI cards + trend chart | DS-003: aggregate counts + 7d sparkline |
| Spot divergence | Divergence list with identity slice + magnitude | DS-004: compact card layout |
| Understand context | Baseline reference panel + baseline metadata | DS-006: reference period, method, sample size |
| See evidence | Evidence trace timeline | DS-007: chronological observations |
| Investigate deep | Chart.js analysis with metric switching | DS-015: time-series with confidence bands |

### Use Case 2: Workflow Divergence (Process Owner)

| User Need | Design Element | Implementation |
| ---------- | -------------- | -------------- |
| Identify affected steps | Divergence list filtered by workflow step | DS-004: step name + dimension |
| Quantify impact | Magnitude + cohort % affected | DS-004: "+68% (100% of tasks)" |
| Pinpoint root cause | Correlations + timeline | DS-007: onset time + DS-006: baseline context |
| Decide escalation | Evidence weight (100% divergence = systemic) | DS-014: cohort ratio makes issue clear |
| Deep analysis | Chart.js with metric switching (Task Duration → Error Rate) | DS-015: multiple metrics per stream |

### Use Case 3: Cross-Stream Review (QE)

| User Need | Design Element | Implementation |
| ---------- | -------------- | -------------- |
| Compare streams | Tabbed interface (Document | Workflow) | DS-002: stream tabs |
| Avoid false claims | Independent streams (no fusion) | DS-001: two-column layout stays same |
| Evidence per stream | Separate evidence traces | DS-007: document trace ≠ workflow trace |
| Detect correlation | Timeline comparison | DS-007 onset times: Sep 19 vs. Sep 18 |
| Make safe conclusions | Clear Level 1 boundary | Design avoids "alignment," "convergence," "root cause" |

---

## Design Principles Applied to User Flows

1. **Explainability:** Every divergence finding links to concrete evidence (timestamps, counts, samples)
2. **Transparency:** Baseline explicitly labeled as "Observed," not "Expected"
3. **Conservative claims:** UI never claims Level 2+ capability (no cross-stream reconciliation)
4. **Actionability:** Timelines and magnitudes enable business decisions without system control
5. **Consistency:** Document and workflow streams use identical information architecture

---

## User Flow Summary (One-Page Reference)

```
FINANCIAL REVIEWER:                    PROCESS OWNER:                      QE ENGINEER:
(Document Divergence)                  (Workflow Divergence)               (Both Streams)

1. Open Dashboard              1. Open Dashboard → Workflow Tab   1. Open Dashboard
2. See 8 divergences,          2. See 4 divergences,             2. Review document divergences
   5 ongoing                      2 ongoing                          (note onsets/magnitudes)
3. Click Acme Corp amount       3. Click Manager Approval duration 3. Switch to Workflow tab
4. View baseline: $12K ±1.2K    4. View baseline: 2.5h ± 45m      4. Review workflow divergences
5. See observed: $15.45K        5. See observed: 4.2 hours           (note different pattern)
6. Review evidence timeline     6. Review evidence timeline        5. Compare evidence traces
   (onset → sustained →            (onset → sustained →              (document sep 19 14:32 vs
    ongoing)                        ongoing)                         workflow sep 18 08:00)
7. Note: Acme-specific,         7. Note: system-wide,           6. Conclude: independent
   business event likely           infrastructure event likely      events, no false claims
8. Copy details, email Acme    8. Escalate to infrastructure   7. Document findings without
                                                                    claiming causation
```

---

## Next Steps

- **Product Owner:** Verify these flows match your expectations and user needs
- **Tech Lead:** Identify infrastructure/backend requirements from these flows (e.g., what baselines are pre-computed? What evidence is persisted?)
- **Development Team:** Use these flows as acceptance criteria when implementing each Design ID

---

MOD-W v5.0.1 — Design Use Cases & User Flows

**Attachment:** Reference back to `mod-w/product.md` scenarios for complete requirements.
