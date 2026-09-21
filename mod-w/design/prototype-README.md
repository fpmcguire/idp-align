# Prototype - IDP-Align Dashboard

**Status:** Research artifact. **Non-authoritative.**

**Location:** Interactive design canvas at https://claude.ai/artifact/8XnkSmtqhjbEkzqTq32zDD

---

This folder contains a clickable prototype produced by the **Designer + Prototyper** role (Claude Design) during the Project Kickoff Prototype Ceremony.

## What This Is

A working demonstration that the design works under realistic conditions. The prototype simulates the product's primary workflows, demonstrates every screen in `design-spec.md` scope, and exists as evidence the design is buildable.

The prototype is an interactive canvas showing:
- The main dashboard layout (two-column list-and-detail)
- Both document and workflow stream views
- Divergence card hierarchy and detail panels
- Evidence trace timeline
- Production-quality Chart.js analysis view with metric switching
- Empty state (no divergences)

All interactions are simulated in the design canvas; no backend integration is present. Charts use Chart.js library for production-ready visualization.

---

## How to View the Prototype

### Online (Recommended)
Open the interactive design canvas in your browser:
**https://claude.ai/artifact/8XnkSmtqhjbEkzqTq32zDD**

The canvas shows multiple artboards arranged on an infinite pan/zoom surface. Click on any artboard to view it, or use the toolbar's Play button to see it full-screen.

### In This Directory
The prototype source files are included here:
- `project/canvas.json` — Canvas index and artboard metadata
- `project/Dashboard.dc.html` — Document stream dashboard
- `project/WorkflowDashboard.dc.html` — Workflow stream dashboard
- `project/DivergenceDetail.dc.html` — Detail pane (shown in right column)
- `project/DivergenceAnalysis.dc.html` — Chart.js analysis view with metric switching
- `project/EvidenceTrace.dc.html` — Evidence timeline
- `project/EmptyState.dc.html` — No divergences detected state

These are design-tool HTML files (not executable as a web app directly). Open them in the design canvas viewer to see them rendered.

---

## Prototype Inventory

### Screens or Routes Included

| Screen / Route | Design IDs | Notes |
| -------------- | ---------- | ----- |
| Document Stream Dashboard | DS-001, DS-002, DS-003, DS-004, DS-008 | Main two-column view showing document divergences, KPIs with charts, filter bar, and summary metrics. |
| Workflow Stream Dashboard | DS-001, DS-002, DS-003, DS-004, DS-008 | Identical layout to document stream; divergence cards show workflow-specific metrics (task duration, error rate, routing frequency). |
| Divergence Detail Panel | DS-005, DS-006, DS-007 | Right-pane detail view showing identity slice context, baseline reference, evidence summary, and actions. |
| Evidence Trace Timeline | DS-007, DS-014 | Chronological timeline of observations supporting a divergence; demonstrates expandable observation detail. |
| Divergence Analysis | DS-015 | Production-quality Chart.js visualization with metric-switchable time-series (observed vs. baseline), confidence bands, and right-panel metrics breakdown. |
| Empty State | DS-011 | Success state showing no divergences detected; includes filter reset option. |

### States Demonstrated

- **Divergence Card states:**
  - Default (at rest)
  - Ongoing (orange badge)
  - Resolved (green badge, faded)
  - Hover (subtle background shift)
  - Selected (highlighted in detail pane)

- **Detail Pane states:**
  - Populated (selected divergence shows full context)
  - Empty prompt (no divergence selected)
  - Loading (skeleton shown; not implemented in prototype)
  - Error (not implemented in prototype)

- **List states:**
  - With divergences (3 cards shown per screen)
  - Empty (no divergences; empty state screen)
  - Loading (skeleton cards; not implemented)

- **Evidence Trace states:**
  - Timeline with 4 observations (onset, cohort threshold, sustained, ongoing)
  - Each observation shown with summary
  - Expandable detail (structure present, expand/collapse simulated)

- **Chart states (Analysis view):**
  - Area chart with observed, baseline, and confidence bands
  - Multiple metrics selectable via buttons
  - Hover tooltips ready for implementation

### Simulated Integrations

| Integration | Simulation Approach | Files |
| ----------- | ------------------- | ----- |
| Stream selection (document / workflow) | Tab/button click switches entire view | `Dashboard.dc.html`, `WorkflowDashboard.dc.html` |
| Divergence selection | Card click highlights and populates detail pane | `Dashboard.dc.html` (right pane) |
| Filter application | Dropdown selects shown but not wired to backend | Filter bar section in dashboards |
| Evidence detail expansion | Structural markup present; expand/collapse logic simulated | `EvidenceTrace.dc.html` |
| Metric switching in Analysis view | Buttons change which metric's chart is displayed | `DivergenceAnalysis.dc.html` (Chart.js) |
| Action buttons (Copy, Mute, Mark reviewed) | Button UI present; no backend handler | Footer of detail pane |

### Prototype-Only Controls

- **Stream tabs** (Document / Workflow): clicking switches between the two stream dashboards
- **Divergence card click**: simulates selection and detail pane update
- **Filter dropdowns**: shown but not functional (would filter list in production)
- **Metric buttons** (Amount, Vendor format, Date format, Currency, Invoice type): shown and styled; clicking updates simulated Chart.js data
- **Action buttons** (Copy, Mute, Mark reviewed): UI present but non-functional
- **Reset filters button** (empty state): UI present but non-functional

### Prototype Features

#### Charts & Visualizations
- **Summary KPI section:** 
  - Status donut chart (Ongoing vs. Resolved)
  - 7-day trend area chart (divergence count over time)
  - Small sparklines in divergence cards (observed vs. baseline mini-charts)

- **Analysis view (Chart.js):**
  - Large area chart: observed values (orange) vs. baseline (blue dashed) with confidence bands (±2σ)
  - Proper time-series axes with gridlines and data point markers
  - Right-panel health gauge: % of observations affected
  - Cohort breakdown and statistical summary
  - Metric toggle buttons at bottom for chart switching

#### Interaction Patterns
- Two-column list-and-detail layout for easy scanning and deep dives
- Dark theme optimized for extended viewing (eyes-friendly blues and oranges)
- Clear visual distinction between ongoing (orange) and resolved (green) divergences
- Baseline always labeled as "Observed Baseline" to avoid confusion with declared intent
- Evidence traces show chronological progression (onset → sustained → ongoing)

---

## Known Limitations

1. **No backend integration:** All data is mockdata hardcoded in the prototype. Production would fetch divergence data from a backend API.
2. **No real-time updates:** Evidence trace and divergence list do not update in real-time. Production would use WebSocket or polling.
3. **No filter logic:** Dropdowns are rendered but do not filter the list. Production filtering logic would be in the component or backend.
4. **No pagination:** Divergence list shows 3 items; production may need pagination or virtual scrolling for large lists.
5. **No mobile view:** Prototype shows desktop layout only (1440px viewport). Responsive behavior is designed but not fully prototyped.
6. **Simplified evidence trace:** Shows 4 observation events; production traces might be longer and require virtualization.
7. **Chart.js via CDN:** Prototype loads Chart.js from CDN. Production may prefer bundling for offline availability.

---

## Explicitly Out-of-Scope Behavior

- Authentication and user identity
- Settings or preferences UI
- Bulk actions (mute multiple, select multiple)
- Export / download divergences
- Historical divergence archive or time-machine view
- Alerts, notifications, or webhooks
- Admin or configuration interfaces
- Multi-tenant features or tenant switching
- Divergence resolution workflows or corrective actions (Level 6 convergence)
- Multi-metric side-by-side comparison (future feature)
- Custom time ranges beyond presets (future feature)

---

## Architecturally Relevant Files

| File | Why It Matters |
| ---- | -------------- |
| `project/Dashboard.dc.html` | Demonstrates the core two-column layout pattern (list pane + detail pane) and KPI card structure with charts. Reusable pattern for both streams. |
| `project/WorkflowDashboard.dc.html` | Proves the same layout works for workflow stream without modification; only content changes. |
| `project/DivergenceDetail.dc.html` | Shows the detail pane structure in isolation; useful for understanding component composition. |
| `project/DivergenceAnalysis.dc.html` | Demonstrates Chart.js integration and metric-switching pattern. Shows production charting approach with time-series, confidence bands, and multi-dataset handling. **Key file for understanding charting strategy.** |
| `project/EvidenceTrace.dc.html` | Demonstrates the evidence timeline pattern; useful for understanding how to render chronological observations. |
| `project/canvas.json` | Index defining artboard layout, frame sizes, and navigation. Useful for understanding the prototype's information architecture. |

---

## What This Is NOT

- **Not production code.** Do not import from this folder into `src/`. The prototype uses a design-tool DSL and is not executable as an Angular application.
- **Not architecturally canonical.** Patterns here are research output. The authoritative architecture lives in `mod-w/architecture.md`, authored by the Tech Lead.
- **Not a Reference Implementation by default.** A Reference Implementation status is granted only when the Tech Lead explicitly disposes of a specific prototype component in a `step-xx.md` section "Reference Implementation" block.

---

## How This Folder Is Used Downstream

1. The Tech Lead (Codex) inspects this folder during Architecture Definition as one of the kickoff inputs.
2. The Tech Lead must inspect the complete prototype inventory, run or view every in-scope flow, read all files listed as architecturally relevant, and sample supporting files as needed.
3. The Tech Lead may reference specific files here in `step-xx.md` as a Reference Implementation with one of three dispositions: `Adopt as-is`, `Adopt with modifications`, or `Reject`.
4. The Development Team reads dispositions in `step-xx.md` and proceeds accordingly. The Dev Team reads prototype files only when the approved Step names them as relevant.

---

## Key Testing Flows

### Flow 1: View Document Stream with Divergences
1. Open Dashboard.dc.html
2. Verify KPI cards display: 8 total, 5 ongoing, 3 resolved
3. Verify trend chart shows 7-day progression
4. Verify status donut chart shows 62.5% ongoing, 37.5% resolved
5. Click on first divergence card (Acme Corp Amount behavior)
6. Verify detail pane populates with baseline, stats, and evidence summary
7. Click another card and verify detail updates

### Flow 2: Switch Streams
1. Open Dashboard.dc.html (document selected by default)
2. Click "Workflow" tab in header
3. Verify screen switches to WorkflowDashboard.dc.html
4. Verify KPI cards show workflow metrics (4 total, 2 ongoing, 2 resolved)
5. Verify divergence cards show workflow data (task duration, error rate)
6. Click back to "Document" and verify switch reverses

### Flow 3: View Evidence Timeline
1. Open EvidenceTrace.dc.html
2. Verify 4 timeline events visible: onset, cohort threshold, sustained, ongoing
3. Verify each event has timestamp and description
4. Verify visual hierarchy (markers, timeline line, event boxes)

### Flow 4: Analyze Single Divergence with Charts
1. Open DivergenceAnalysis.dc.html
2. Verify Chart.js area chart displays with:
   - Orange line/area for observed values
   - Blue dashed line for baseline
   - Shaded confidence band (±2σ)
   - Proper time-axis and value-axis labels
3. Click each metric button (Amount, Vendor format, Date format, Currency, Invoice type)
4. Verify buttons highlight when active
5. Verify right sidebar shows: health gauge (70%), cohort breakdown, stats, timeline

### Flow 5: View Empty State
1. Open EmptyState.dc.html
2. Verify success message "No divergences detected"
3. Verify KPI cards show 0 across all metrics
4. Verify "Reset filters" button is visible
5. Verify footer indicates "0 divergences detected"

---

## Notes for Reviewers

### For Product Owner
- **Focus on:** Screens 1–4 (dashboards, detail, evidence, analysis)
- **Check:** Does the UI match your mental model of the product? Are the divergence cards clear? Is the two-stream layout intuitive?
- **Question:** Are the CAV terms (Observed Baseline, Divergence, Evidence) used correctly per your product requirements?

### For Tech Lead (Architecture)
- **Focus on:** DivergenceAnalysis.dc.html (charting) and architecture-notes.md observations
- **Check:** Are the component boundaries clear? Is the data flow understandable? Which patterns would you adopt, modify, or reject?
- **Question:** Do you see integration points or architectural dependencies the prototype doesn't address?

### For Moderator (Design Approval)
- **Focus on:** Design-spec.md and full prototype flow
- **Check:** Does the spec match the prototype? Are all Design IDs present? Is scope bounded correctly?
- **Question:** Does this design faithfully implement the approved product requirements (R1–R6)?

---

## Lifecycle

- **Created:** 2026-09-21 during the Prototype Ceremony.
- **Frozen:** At the Architecture Handoff. Once `architecture.md` is approved, this folder is read-only except for explicitly approved backfill notes.
- **Retained:** For the life of the project, as historical context.

---

MOD-W v5.0.1
