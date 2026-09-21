# Architecture Notes - IDP-Align Dashboard

**Date:** 2026-09-21  
**Author:** Designer + Prototyper (Claude Design)  
**Status:** Advisory - input to Tech Lead Architecture Definition. **Not authoritative.**

---

> This document records observations from the Prototype Ceremony for the Tech Lead's consideration during Architecture Definition.
>
> It is **advisory**, not constraint. Confidence describes the prototyper's certainty in an observation; it is not architectural authority. The Tech Lead may accept, modify, or reject any possible implication. Material divergences should be recorded in `architecture.md` section "Decisions That Diverge From Prototype" with rationale.

---

## 1. Component Composition Patterns That Worked

### OBS-001 — Two-Column Layout Scales to Both Streams

| Field | Notes |
| ----- | ------ |
| Observation | The two-column list-and-detail layout (Arize-inspired) works equally well for document and workflow streams without requiring stream-specific layout changes. Same container structure supports both divergence types. |
| Evidence | Dashboard.dc.html and WorkflowDashboard.dc.html use identical layout, just different summary KPI cards and divergence card content. |
| Prototype location | `prototype/Dashboard.dc.html`, `prototype/WorkflowDashboard.dc.html` |
| Reproduction conditions | Both screens render at 1440×900 desktop viewport. Same responsive structure proposed for tablet/mobile. |
| Confidence | High |
| Possible architectural implication | Consider a single reusable Stream View component that accepts a stream config (document or workflow) and renders the appropriate KPI cards, filter options, and divergence card format. Avoid separate codebases per stream. |

### OBS-002 — Divergence Card Component is Highly Reusable

| Field | Notes |
| ----- | ------ |
| Observation | The Divergence Card component (DS-004) uses the same structure and visual hierarchy for both document-stream and workflow-stream divergences by abstracting the comparison semantics. "Baseline" and "Observed" values apply equally to amount vs. task duration. |
| Evidence | Cards in Dashboard.dc.html show `$12,000 ± $1.2K` vs. `$15,450` (document). Cards in WorkflowDashboard.dc.html show `2.5 hours ±45m` vs. `4.2 hours` (workflow). No layout changes required. |
| Prototype location | `prototype/Dashboard.dc.html` (document example), `prototype/WorkflowDashboard.dc.html` (workflow example) |
| Reproduction conditions | Both card types render identically in browser viewport. Only content differs. |
| Confidence | High |
| Possible architectural implication | Consider a single Divergence Card component that accepts a config object: `{ identitySlice, dimension, baseline, observed, magnitude, onset, duration, status }`. No need for separate component implementations per stream. This simplifies testing and maintenance. |

### OBS-003 — Evidence Trace Component Spans Both Streams

| Field | Notes |
| ----- | ------ |
| Observation | The Evidence Trace component (DS-007) uses an identical timeline/chronological structure for both document and workflow evidence, with only the event descriptions and summary statistics differing. The visual hierarchy remains consistent. |
| Evidence | EvidenceTrace.dc.html demonstrates a document stream trace. The structure (onset marker, cohort threshold crossed, sustained divergence confirmed, ongoing) would apply identically to workflow traces, only with different event descriptions (e.g., "Error rate spike," "Task duration threshold exceeded"). |
| Prototype location | `prototype/EvidenceTrace.dc.html` |
| Reproduction conditions | Trace shown at 800×700 viewport; scrollable list demonstrating 4 timeline events. |
| Confidence | High |
| Possible architectural implication | Design a single Evidence Trace component that accepts an array of observations; let stream-specific wrappers supply the event labels and context. Avoid duplicating timeline logic. |

### OBS-004 — Chart.js Analysis View Demonstrates Production Charting

| Field | Notes |
| ----- | ------ |
| Observation | Chart.js library integrates cleanly for production-quality time-series visualization. The Divergence Analysis screen (DS-015) shows area charts with confidence bands, baseline overlays, and proper axes without framework coupling. |
| Evidence | DivergenceAnalysis.dc.html uses Chart.js via CDN; demonstrates metric-switchable UI where button clicks update the chart data. |
| Prototype location | `prototype/DivergenceAnalysis.dc.html` |
| Reproduction conditions | Chart loads with mock data; metric buttons update chart dataset without full reload. Dark theme colors match IDP-Align palette. |
| Confidence | High |
| Possible architectural implication | Plan Chart.js as the production charting library. Encapsulate chart initialization and data-binding logic in a dedicated service or directive. Consider lazy-loading Chart.js for slower connections. |

---

## 2. State Management Patterns That Worked

### OBS-005 — Stream Selection as Top-Level Route/Tab State

| Field | Notes |
| ----- | ------ |
| Observation | The stream selector (document vs. workflow tabs) works naturally as a top-level route or persistent tab state. Clicking the tab switches the entire view, including KPI cards, divergence list, and filter options. No mid-screen partial updates needed. |
| Evidence | Both Dashboard.dc.html and WorkflowDashboard.dc.html show stream tabs at the top; clicking one switches to that stream's full view. Each maintains its own filter state and selected divergence. |
| Prototype location | Header section of both `Dashboard.dc.html` and `WorkflowDashboard.dc.html` |
| Reproduction conditions | Tab selection emulated via button click handlers. Dashboard shows document selected; WorkflowDashboard shows workflow selected. |
| Confidence | High |
| Possible architectural implication | Consider stream selection as a route parameter (`/dashboard?stream=document` or `/dashboard/document`), not a component-level toggle. This allows direct linking and bookmarking. Alternatively, persistent tab state with URL sync (via Angular signals and query params). |

### OBS-006 — Divergence Selection and Detail Pane Population Works Cleanly

| Field | Notes |
| ----- | ------ |
| Observation | Clicking a divergence card populates the detail pane with full context (baseline reference, evidence summary, quick stats, actions). This is a straightforward selection model: divergence ID → detail payload. No complex inter-component communication needed. |
| Evidence | Dashboard.dc.html shows detail pane populated when a card is "selected" (simulated via onclick handler). All necessary context is available without additional fetches. |
| Prototype location | `prototype/Dashboard.dc.html` (right pane labeled "Divergence Detail") |
| Reproduction conditions | Card click updates visible detail pane content. Same pattern applies to modal view on mobile. |
| Confidence | High |
| Possible architectural implication | Use a simple selection state (selected divergence ID or object) in a shared service or component. Avoid complex Redux-style action chains. Angular signals (one-way bindings, lazy computed) should work well here. |

### OBS-007 — Filter State Impacts List Rendering Only

| Field | Notes |
| ----- | ------ |
| Observation | Filter changes (identity slice, time range, severity) re-render only the divergence list, not the detail pane. This keeps state management simple: filters → filtered list, selection → detail. Two independent concerns. |
| Evidence | Filter bar (dropdown selects) shown in Dashboard.dc.html and WorkflowDashboard.dc.html; applying a filter would update the left-pane card list without affecting the right pane. |
| Prototype location | Filter bar section in both dashboards. |
| Reproduction conditions | Filter select elements present but not wired to backend in prototype. Behavior would be: user selects filter → component applies predicate to cached divergence array → list re-renders. |
| Confidence | High |
| Possible architectural implication | Keep filter state separate from selection state. Use Angular signals: `filterState.signal` (read-only computed derived from input) → triggers list re-render. `selectedDivergence.signal` → triggers detail render. Two independent signals/subscriptions. |

### OBS-008 — Metric Switching in Analysis View is a Stateful Toggle

| Field | Notes |
| ----- | ------ |
| Observation | The Divergence Analysis screen (DS-015) demonstrates metric selection as a simple state variable: active metric → triggers chart data swap. Button clicks update the state; the chart re-renders with new dataset for that metric. |
| Evidence | DivergenceAnalysis.dc.html has buttons for [Amount, Vendor format, Date format, Currency, Invoice type]. Clicking one would (in production) setState({ activeMetric: 'amount' }) and the chart would re-render with that metric's time series. |
| Prototype location | `prototype/DivergenceAnalysis.dc.html` (bottom button row) |
| Reproduction conditions | Buttons present and styled; click handlers wired to state update (simulated). |
| Confidence | High |
| Possible architectural implication | Use a single `activeMetric` signal to drive chart data selection. Pre-fetch or lazy-load all metric datasets when the Analysis view opens. Avoid re-fetching data on every button click if datasets are reasonably sized. |

---

## 3. Integration Shapes Surfaced During Prototyping

### OBS-009 — KPI Cards Need Aggregated, Time-Windowed Data

| Field | Notes |
| ----- | ------ |
| Observation | Summary KPI cards (DS-003) require aggregate metrics: total count, ongoing count, resolved count, 7-day trend. These are not individual divergence records but rolled-up statistics. |
| Evidence | Dashboard.dc.html shows KPI cards with hardcoded values (8 total, 5 ongoing, 3 resolved, ↑ +2 trend). These would be computed from a backend query spanning the stream's divergences over the time window. |
| Prototype location | Summary KPI section in both `Dashboard.dc.html` and `WorkflowDashboard.dc.html` |
| Reproduction conditions | Mockdata; production would fetch aggregate summaries from backend (e.g., GET `/api/streams/{stream}/divergences/summary?period=7d`). |
| Confidence | High |
| Possible architectural implication | Separate data shapes: (1) divergence list item (minimal: identity slice, dimension, magnitude, status, onset) and (2) aggregate summary (total, ongoing, resolved, trend). Backend should expose both endpoints. Frontend caches divergence list in a signal; computes aggregate from that list OR fetches separately if performance requires. |

### OBS-010 — Evidence Trace Requires Nested, Chronological Observation Records

| Field | Notes |
| ----- | ------ |
| Observation | Evidence Trace (DS-007) requires an array of timestamped observations, each with an event type (onset, cohort threshold crossed, sustained divergence, ongoing), description, and supporting details. This is not a flat list but a structured timeline. |
| Evidence | EvidenceTrace.dc.html shows 4 observations: onset (2026-09-19 14:32), cohort threshold (2026-09-19 16:45), sustained divergence (2026-09-20 12:30), ongoing (2026-09-21 08:15). Each carries a summary and expandable detail. |
| Prototype location | `prototype/EvidenceTrace.dc.html` |
| Reproduction conditions | Mockdata; production backend would return divergence record with nested `observations` array. Each observation carries timestamp, type, description, and metrics. |
| Confidence | Medium–High |
| Possible architectural implication | Divergence data model includes an `observations` array (or `evidenceTrace` field). Each observation is a distinct record with timestamp, type, and supporting metrics. Backend constructs this array during divergence detection (as evidence accumulates). Frontend renders it as a timeline. Consider pagination or lazy-loading if a single divergence has hundreds of observations. |

### OBS-011 — Baseline Reference Panel Needs Historical Window Metadata

| Field | Notes |
| ----- | ------ |
| Observation | Baseline Reference Panel (DS-006) displays the reference period (start/end dates, sample size) and calculation method. This metadata is part of the divergence record, not derived from other sources. |
| Evidence | DivergenceDetail.dc.html shows "Observed Baseline" panel with period (2026-08-01 to 2026-09-18), sample size (240 invoices), and method (mean ± 2 SD). |
| Prototype location | `prototype/DivergenceDetail.dc.html`, `prototype/Dashboard.dc.html` (right pane) |
| Reproduction conditions | Mockdata populated statically. Production: backend includes baseline definition in divergence record. |
| Confidence | High |
| Possible architectural implication | Divergence record includes a `baseline` object: `{ referenceStart, referenceEnd, sampleSize, method, calculatedValue, confidence }`. This is immutable once created (historical record) and allows frontend to display baseline context without additional lookups. |

### OBS-012 — Chart.js Data Requires Pre-Computed Time Series

| Field | Notes |
| ----- | ------ |
| Observation | Divergence Analysis chart (DS-015) needs pre-computed time-series data: arrays of {timestamp, observed, baseline, upperConfidence, lowerConfidence} for each metric. Inline computation on render would be too slow for production. |
| Evidence | DivergenceAnalysis.dc.html hard-codes arrays like `observedValues = [15250, 15450, 15800, ...]` for the selected metric. In production, these would be fetched from backend or computed server-side. |
| Prototype location | `prototype/DivergenceAnalysis.dc.html` (chart data initialization) |
| Reproduction conditions | Mock arrays initialized in Chart.js initialization function. |
| Confidence | High |
| Possible architectural implication | Backend should expose an endpoint like GET `/api/divergences/{id}/metrics/{metric}/timeseries?resolution=hourly&window=7d` that returns pre-computed arrays. Frontend passes these to Chart.js. Consider caching the response or computing it once per divergence-metric pair. |

---

## 4. Streaming / Performance Observations

### OBS-013 — Real-Time Updates May Benefit from Incremental Timeline

| Field | Notes |
| ----- | ------ |
| Observation | As new evidence arrives (new observations for an ongoing divergence), the Evidence Trace timeline should update incrementally without re-rendering the entire list. The prototype shows a static trace, but live data would benefit from efficient partial updates. |
| Evidence | Prototype EvidenceTrace.dc.html has 4 observations. In production, a new observation might arrive (e.g., "divergence resolved" at 2026-09-21 20:00), and the timeline should add it without flashing or re-rendering prior items. |
| Prototype location | `prototype/EvidenceTrace.dc.html` |
| Reproduction conditions | Not tested in prototype (mockdata is static). Would require integrating WebSocket or server-sent events. |
| Confidence | Medium |
| Possible architectural implication | Consider using RxJS observables or Angular signals with efficient change detection for the Evidence Trace list. Use `OnPush` change detection and trackBy on `*ngFor` if using traditional templates, or signals-based computed properties for computed-value traces. Paginate or virtualize very long traces (>100 observations) to avoid DOM bloat. |

### OBS-014 — Divergence List Rendering at Scale

| Field | Notes |
| ----- | ------ |
| Observation | Divergence list (left pane of Dashboard) shown with 3 cards in prototype. At scale (50+ divergences), rendering and scrolling performance should be verified. Angular's change detection and DOM operations could be a bottleneck. |
| Evidence | Prototype Dashboard.dc.html shows 3 divergence cards in a scrollable container. No performance testing done. |
| Prototype location | `prototype/Dashboard.dc.html` (left pane) |
| Reproduction conditions | Prototype shows only 3 items; production may have 50–500+ depending on stream size and time window. |
| Confidence | Medium |
| Possible architectural implication | Use virtual scrolling (CDK virtual scroll) for divergence lists >20 items. Implement trackBy to optimize re-renders. Consider pagination or lazy-loading: show first 20, load more on scroll. Use signals-based `computed` to filter/sort efficiently; avoid expensive operations in templates. |

### OBS-015 — Chart.js Rendering Performance

| Field | Notes |
| ----- | ------ |
| Observation | Chart.js renders smoothly in prototype for a single metric. If Analysis view is expected to show multiple charts simultaneously (side-by-side comparison) or frequently switched metrics, performance should be validated. |
| Evidence | DivergenceAnalysis.dc.html loads and renders one Chart.js chart without lag. |
| Prototype location | `prototype/DivergenceAnalysis.dc.html` |
| Reproduction conditions | Not stress-tested; single metric, 7 data points. |
| Confidence | Medium |
| Possible architectural implication | If multiple charts are shown at once (future feature), consider lazy-rendering or canvas-based solutions. For metric switching, consider keeping chart instance and updating data via `Chart.js` update API instead of destroying and re-creating. Profile on low-end devices if performance is a concern. |

---

## 5. Failed Approaches

None observed in prototype. The design follows established patterns (Arize, Soda, Bio-Align) and did not require major rework.

---

## 6. Open Questions for the Tech Lead

1. **Baseline versioning:** Should the baseline definition be versioned (e.g., if the reference period or calculation method changes)? Or is the current baseline always immutable and historical baselines are discarded? Implication: impacts divergence record schema and historical trace lookups.

2. **Divergence lifecycle state machine:** What are the valid state transitions for a divergence? (e.g., Detected → Ongoing → Reviewed → Resolved → Archived). Should certain actions (mute, mark as reviewed) be tracked as state transitions or separate audit events? Implication: impacts API design and backend state model.

3. **Real-time updates and WebSocket vs. polling:** The prototype shows static mockdata. For production, should the dashboard subscribe to real-time divergence updates (WebSocket, Server-Sent Events) or poll periodically (every N seconds)? Implication: backend integration shape and frontend subscription strategy.

4. **Export / bulk actions:** The prototype does not show export or bulk selection. Should the MVP support exporting divergences as CSV/JSON, or bulk actions like "mute all for this vendor"? Implication: scope for initial implementation.

5. **Historical divergence archive:** Should users be able to view divergences from prior time windows (e.g., "all divergences from last month")? Or focus on "current and recent divergences only"? Implication: data retention and query strategy.

6. **Baseline comparison view:** Should users be able to compare baseline definitions across two identity slices (e.g., "Vendor A amount baseline vs. Vendor B amount baseline")? This is out of scope for Level 1 but might be valuable for investigations. Implication: future feature but worth clarifying scope boundary now.

7. **Chart.js library bundling:** Should Chart.js be bundled with the app or loaded from CDN? Prototype uses CDN; production might prefer bundling for offline availability or performance. Implication: build config and dependency management.

---

MOD-W v5.0.1
