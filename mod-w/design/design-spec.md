# Design Spec - IDP-Align Dashboard

**Date:** 2026-09-21  
**Designer:** Claude Design (Haiku 4.5)  
**Authored in:** Claude Design  
**Prototype:** `prototype/`

---

## Authority Boundary

After Product Owner and Moderator approval, this spec is authoritative for user-facing visual behavior, interaction intent, screen composition, component states and variants, accessibility expectations, and approved user-facing terminology and content presentation.

It is not independently authoritative for production file paths, service or module boundaries, framework or library choices, canonical domain types, internal implementation names, test implementation strategy, or technical component decomposition. Those decisions remain under Tech Lead authority in `architecture.md`, `domain-language.md`, and `step-xx.md`.

The prototype is evidence for this spec, not an authoritative production source.

---

## Approval Record

### Product Owner review

- **Status:** Pending
- **Reviewer:** —
- **Date:** —
- **Conditions or findings:** —

### Tech Lead feasibility pre-review

- **Status:** Pending
- **Reviewer:** —
- **Date:** —
- **Feasibility concerns:** —
- **Architecture questions:** —

### Moderator gate

- **Status:** Pending
- **Moderator:** —
- **Date:** —
- **Conditions:** —

Product Owner and Moderator approval are required before this spec becomes authoritative within its boundary. Tech Lead pre-review is advisory and does not transfer architecture authority. Approval of this spec does not make the prototype authoritative.

---

## DESIGN.md Policy

`design-spec.md` is the canonical MOD-W design artifact. A separate `DESIGN.md` is optional project documentation for broader design-system foundations, brand language, or durable visual principles. None currently exists for IDP-Align.

---

## Design Principles

- **Explainable:** Every divergence finding carries reconstructable evidence and context.
- **Consistent:** Both document and workflow streams use identical CAV Level 1 vocabulary and layout patterns.
- **Scannable:** Summary KPIs and identity-slice grouping allow quick assessment of system health.
- **Transparent:** Baselines and observed values are clearly labeled; no confusion between observation and intention.

---

## 1. Visual Identity

### 1.1 Color Palette

**Neutral foundation:**
- Background: `#141413` (Slate dark)
- Surface: `#1F1E1C` (card/panel)
- Text primary: `#FFFFFF`
- Text secondary: `#A8A5A0`
- Border: `#3A3A3A`

**Semantic colors:**
- Divergence (ongoing): `#F97316` (Orange, alerts attention)
- Resolved: `#22C55E` (Green, affirms resolution)
- Baseline reference: `#3B82F6` (Blue, informational)
- Dimension highlight: `#A855F7` (Purple, emphasis)

**Status badges:**
- Ongoing: Orange background, white text
- Resolved: Green background, white text
- Under review: Gray background, lighter text

### 1.2 Typography

- **Display:** 28px, 600 weight (screen titles)
- **Heading:** 20px, 600 weight (section heads)
- **Body:** 14px, 400 weight (prose, labels)
- **Caption:** 12px, 400 weight (secondary info, timestamps)
- **Monospace:** `Courier New` for evidence traces and values

Font stack: System fonts preferred (not specified in prototype; Angular app will use global font stack).

### 1.3 Spacing & Layout System

- **Grid:** 8px base unit
- **Gaps:** 8px (tight), 16px (normal), 24px (spacious)
- **Padding:** 16px (normal), 24px (spacious)
- **Margins:** 16px between major sections, 24px between tabs/views

### 1.4 Borders, Radius & Elevation

- **Border radius:** 8px (cards, buttons), 4px (inputs)
- **Border width:** 1px
- **Elevation:** Subtle drop shadow on cards (0 2px 8px rgba(0,0,0,0.3))

### 1.5 Tone & Personality

Professional and transparent. Language emphasizes observed facts ("X vendors diverged," "Baseline established from N observations") over judgment. Visual design avoids drama; alerts are clear but not sensational.

---

## 2. Accessibility Baseline

- **WCAG AA compliance** for all interactive elements
- **Keyboard navigation:** Full tab order through divergence list, detail, and actions
- **Visible focus states:** 2px outline on focused elements
- **Color contrast:** 4.5:1 minimum for text; 3:1 for UI components
- **Icon labels:** Icon-only buttons carry `aria-label`
- **Semantic HTML:** `<button>`, `<a>`, proper heading hierarchy

---

## 3. Component Library

### 3.1 Divergence Card (Summary)

- **Purpose:** Summarize divergences for a single identity slice in one compact display.
- **States:**
  - Default: full information display
  - Hover: subtle background shift, pointer indicates clickability
  - Active/selected: highlighted border, background tint
- **Variants:**
  - Ongoing: Orange border/badge
  - Resolved: Green border/badge
- **Layout:**
  - Top: identity slice label + dimension (e.g., "Vendor: Acme Corp — Amount behavior")
  - Middle: KPI row — baseline reference, observed value, magnitude/distance
  - Bottom: timeline row — onset, duration, trend sparkline
  - Right: status badge and action menu (copy details, mute, mark as reviewed)
- **data-testid:** `divergence-card-{{identity-slice}}-{{dimension}}`

### 3.2 Summary KPI Card

- **Purpose:** Display aggregate metrics for a stream (document or workflow).
- **States:**
  - Default: static display
  - Hover: shows trend details in tooltip
- **Variants:**
  - Total divergences: count + severity distribution (pie or ring chart)
  - Active (ongoing) divergences: highlighted subset
  - Resolved: grayed but retained for audit trail
- **Components:**
  - Large number (count)
  - Smaller descriptive text
  - Sparkline or small chart showing trend over last 7 days
- **data-testid:** `kpi-card-{{stream}}-{{metric}}`

### 3.3 Evidence Trace (Timeline View)

- **Purpose:** Show supporting observations for a divergence chronologically.
- **States:**
  - Default: scrollable list of observations
  - Collapsed observation: summary visible, detail expandable
  - Expanded observation: full context and values shown
- **Variants:**
  - Document trace: shows document count, field values, cohort breakdown
  - Workflow trace: shows task counts, routing patterns, timing metrics
- **Components:**
  - Timestamp / onset marker
  - Observation summary (e.g., "12 invoices from Vendor X showed amount > 99th percentile")
  - Expandable detail row (breakdown by value, count, percentage change)
- **data-testid:** `evidence-trace-{{divergence-id}}-{{observation-index}}`

### 3.4 Baseline Reference Panel

- **Purpose:** Show the baseline definition and historical reference window for context.
- **States:**
  - Default: closed, shows one-line summary
  - Expanded: shows baseline calculation method, reference window, sample size
  - Hover on dates: shows exact observations included
- **Components:**
  - Baseline period: "Established from {{start_date}} to {{end_date}} (N observations)"
  - Calculation method: "Historical mean ± 2 standard deviations" or "Continuously inferred"
  - Link to baseline history (future feature)
- **data-testid:** `baseline-panel-{{identity-slice}}`

### 3.5 Stream Tab

- **Purpose:** Select between Document and Workflow streams.
- **States:**
  - Active: bold text, bottom border, full opacity
  - Inactive: lighter text, no border, 60% opacity
  - Hover: background tint
- **Accessibility:** Tab key navigates, Enter/Space activates
- **data-testid:** `stream-tab-{{document|workflow}}`

### 3.6 Filter/Sort Bar

- **Purpose:** Narrow or order divergence list.
- **Components:**
  - Identity slice selector (multi-select dropdown or tag input)
  - Time range picker (last 7 days / 30 days / custom)
  - Severity filter (ongoing only / all / resolved only)
  - Sort options (onset date, magnitude, identity slice)
- **States:**
  - Default: reset
  - Active: highlight applied filters as badges
- **data-testid:** `filter-bar-{{filter-name}}`

---

## 4. Screen Layouts

### 4.1 Dashboard Home (Stream View)

**Layout structure:**

1. **Header** (fixed top)
   - Title: "IDP-Align — Continuous Alignment Verification"
   - Stream selector tabs: Document | Workflow
   - User menu / settings (future)

2. **Summary section** (below header)
   - KPI cards in a grid: Total divergences | Active | Resolved | Trend (7-day sparkline)
   - One set of cards per active stream

3. **Filter/Sort bar** (sticky below summary)
   - Identity slice filter, time range, severity, sort options
   - Clear filters button

4. **Main content** (two-column layout, desktop; single-column, mobile)
   - **Left column (List pane):**
     - Divergence cards in vertical stack, ordered by active sort
     - Empty state: "No divergences detected" or "Apply different filters"
     - Loading state: skeleton cards
     - Error state: message + retry button
   - **Right column (Detail pane):**
     - When a card is selected: expanded detail view
     - Baseline reference panel
     - Evidence trace (timeline)
     - Action buttons: Copy details, Mute alert, Mark as reviewed
     - When no card selected: prompt "Select a divergence to view details"

5. **Footer** (informational)
   - Last updated timestamp
   - Data freshness indicator (e.g., "Updated 2 minutes ago")

**Responsive behavior:**
- Desktop (1280px+): two-column (list | detail) side-by-side
- Tablet (768–1279px): stacked, detail expands full-width when selected
- Mobile (< 768px): single column, detail as modal or push overlay

### 4.2 Divergence Detail View (Right Pane / Modal)

**Components shown when a divergence card is selected:**

1. **Header**
   - Identity slice: "Vendor: Acme Corp"
   - Dimension: "Amount behavior"
   - Status badge: Ongoing / Resolved
   - Close button (X)

2. **Quick stats row**
   - Onset: "Started 2026-09-19 at 14:32 UTC"
   - Duration: "Ongoing (3 days, 2 hours)"
   - Magnitude: "Observed: $15,450 | Baseline: $12,000 ± $1,200 (90th percentile)"

3. **Baseline reference** (collapsible panel)
   - Reference window: dates and observation count
   - Baseline definition: "Historical mean ± 2 SD"
   - Sample: "Established from 240 historical invoices"

4. **Evidence trace** (scrollable list)
   - Chronological observations supporting the divergence
   - Each item: timestamp, summary, expandable detail

5. **Actions**
   - Copy divergence details (JSON or readable summary)
   - Mute this divergence for 24/48/7 days
   - Mark as reviewed (acknowledge but keep visible)
   - Open investigation (future: links to external tools)

**Empty state:** "No divergence selected. Choose one from the list to view details."

**Loading state:** Skeleton layout matching the detail structure.

**Error state:** Message + retry button.

### 4.3 Document Stream Summary (Example)

**Stream-specific KPI cards:**
- Total document divergences detected
- Vendors affected (count + breakdown by divergence type)
- Document types affected
- Most common divergence dimensions (amount, date, vendor name, etc.)

### 4.4 Workflow Stream Summary (Example)

**Stream-specific KPI cards:**
- Total workflow divergences detected
- Steps or routes affected
- Decision agents with deviations
- Most common divergence dimensions (task duration, routing frequency, error rate, etc.)

### 4.5 Divergence Analysis (Chart.js Detailed View)

**Full-screen analysis for deep investigation:**

1. **Header**
   - Title: "Divergence Analysis"
   - Subtitle: "Vendor: Acme Corp • Dimension: Amount behavior"

2. **Main area chart** (Chart.js)
   - Observed values (orange line/area)
   - Baseline (blue dashed line)
   - Confidence bands (±2σ shaded region)
   - Proper time-series axes with gridlines
   - Data point markers

3. **Right sidebar**
   - Health gauge: % of observations affected
   - Cohort breakdown: total, diverged, within baseline
   - Statistical summary: baseline, observed median, magnitude
   - Divergence timeline: onset, duration, status

4. **Metric toggle buttons** (bottom)
   - Document stream examples: Amount, Vendor format, Date format, Currency, Invoice type
   - Workflow stream examples: Task duration, Error rate, Routing frequency, Response time
   - Clicking a button switches the main chart to that metric

---

## 5. Interaction Patterns

### 5.1 Selection and Navigation

- **Click divergence card:** highlight it, populate detail pane (desktop) or show modal (mobile)
- **Tab key:** navigate through divergence list, then detail actions
- **Escape key:** close detail pane or modal
- **Stream tab click:** switch to document or workflow stream, reset filters

### 5.2 Filtering and Sorting

- **Apply filter:** immediately re-render list without reload
- **Multi-select identity slice:** add/remove tags, list updates in real-time
- **Change sort:** list re-orders, active sort option highlighted
- **Clear filters:** button resets all to defaults

### 5.3 Hover and Focus States

- **Divergence card hover:** subtle background lighten, pointer cursor
- **Button hover:** opacity increase or slight background shift (no color change)
- **Focus state:** 2px outline, visible on all interactive elements
- **Evidence trace item hover:** highlight the item, show expand/collapse icon

### 5.4 Loading and Empty States

- **Initial load:** skeleton cards shown while data streams in
- **No divergences:** centered message "No divergences detected in this stream" + filter reset button
- **Error loading:** message with retry button + contact support link
- **Evidence loading:** placeholder text "Loading trace..." + spinner

### 5.5 Chart Interaction (Analysis View)

- **Metric button click:** main chart updates to show selected metric's observed vs baseline
- **Chart hover (future):** tooltip shows exact values at that timestamp
- **Zoom/pan (future):** ability to focus on time ranges

---

## 6. Design Traceability

Every screen, major component, and significant interaction maps to at least one Product requirement (R1–R6).

| Design ID | Design element | Product requirement | Prototype evidence | First implementation Step | Notes |
| --------- | -------------- | ------------------- | ------------------- | ----------------------- | ----- |
| DS-001 | Dashboard home layout (two-column list + detail) | R6 | `Dashboard.dc.html` | TBD | Core frame for both streams |
| DS-002 | Stream selector tabs (Document / Workflow) | R6 | `Dashboard.dc.html` | TBD | Controls active stream display |
| DS-003 | Summary KPI cards (total, active, resolved, trend) | R6 | `Dashboard.dc.html`, `KPISummary.dc.html` | TBD | R6 aggregate view |
| DS-004 | Divergence card (compact display) | R5, R6 | `DivergenceCard.dc.html`, `DivergenceList.dc.html` | TBD | Primary interaction unit; shows identity slice + dimension + magnitude |
| DS-005 | Divergence detail pane (full context) | R5, R6 | `DivergenceDetail.dc.html` | TBD | R5 explainable evidence; baseline + timeline |
| DS-006 | Baseline reference panel | R2, R4, R5 | `BaselinePanel.dc.html` | TBD | Shows observed baseline definition and reference window |
| DS-007 | Evidence trace (timeline of observations) | R5 | `EvidenceTrace.dc.html` | TBD | R5 supporting evidence; per-stream format (document or workflow) |
| DS-008 | Filter/sort bar | R6 | `FilterBar.dc.html` | TBD | Narrows list by identity slice, time, severity |
| DS-009 | Document stream summary metrics | R1, R2, R6 | `DocumentStreamSummary.dc.html` | TBD | R1 document observations; R2 baseline + divergence per vendor/type |
| DS-010 | Workflow stream summary metrics | R3, R4, R6 | `WorkflowStreamSummary.dc.html` | TBD | R3 workflow observations; R4 baseline + divergence per step/route |
| DS-011 | Empty state (no divergences detected) | R6 | Multiple screens | TBD | Scaffolding when list is empty |
| DS-012 | Loading state (skeleton cards) | R6 | Multiple screens | TBD | Scaffolding during data fetch |
| DS-013 | Status badges (Ongoing, Resolved) | R5, R6 | `DivergenceCard.dc.html` | TBD | Visual distinction of divergence lifecycle |
| DS-014 | Evidence detail row (expandable observation) | R5 | `EvidenceTrace.dc.html` | TBD | R5 reconstructable, explainable evidence |
| DS-015 | Divergence Analysis (Chart.js detailed view) | R5, R6 | `DivergenceAnalysis.dc.html` | TBD | Production-ready charting; metric-switchable time-series with baseline |

---

## 7. Domain Language Proposals

All terms below are proposals for the Tech Lead to ratify, modify, or reject during Architecture Definition. Do not treat any term here as canonical pending approval.

| Proposed term | Form | Definition | Rationale | First appearance |
| ------------- | ---- | ---------- | --------- | ---------- |
| Divergence Card | UI component | Compact visual summary of one divergence: identity slice, dimension, baseline, observed value, magnitude, onset, duration | Distinguishes this UI unit from the concept of Divergence itself; "Card" signals a reusable component | DS-004 |
| Baseline Reference Panel | UI component | Collapsible panel showing baseline definition, reference window, and sample size | Clarifies that the panel is distinct from the Observed Baseline concept; reserves term for the data model | DS-006 |
| Evidence Trace | UI component | Timeline or chronological list of supporting observations for a divergence | Distinguishes this UI representation from Evidence concept; "Trace" implies a narrative or chain | DS-007 |
| Stream | Dashboard concept | One of two independent CAV Level 1 views: Document stream or Workflow stream | Simplifies reference to "document stream" or "workflow stream" without ambiguity | DS-001, DS-002 |
| Identity Slice Selector | UI component | Filter UI allowing users to narrow divergences by one or more identity slices | Clarifies that the selector is a UI affordance, distinct from the Identity Slice concept | DS-008 |

**Note:** All other terms in this spec use canonical CAV vocabulary per `CAV-MANIFESTO.md` and `product.md` domain language section: Observed Truth, Identity Slice, Observed Baseline, Divergence, Evidence.

---

## 8. Scope Rules

- Only define components required for both document and workflow streams' Level 1 implementation
- Do not design beyond approved PRODUCT scope (CAV Level 1 only; no Levels 3–6 features)
- Each in-scope screen, major component, and significant interaction has a Design ID and Product requirement mapping
- Prototype demonstrates every Design ID in a realistic scenario
- When `roadmap.md` exists, Design IDs will be connected to the first implementation Step

---

## 9. UI Scope Rules

- Prototype implements every Design ID screen and major component
- Interaction states (hover, focus, active, disabled) are designed but interaction handlers are simulation-only (no production integration)
- Evidence trace and baseline panel are populated with realistic mock data
- No authentication, settings, or multi-user features in prototype scope
- No export/reporting features in this phase

---

## 10. Open Questions

| Question | Owner | Status |
| -------- | ----- | ------ |
| Should divergences be dismissible or only marked as reviewed? | Tech Lead | Pending |
| Is there a need for a bulk action (mute multiple, mark multiple as reviewed)? | Product Owner | Pending |
| Should baseline definitions be editable in the UI, or only via backend API? | Tech Lead | Pending |
| Should users be able to compare across two identity slices side-by-side? (e.g., Vendor A vs. Vendor B in same stream) | Product Owner | Pending—future feature, not in Level 1 scope |
| Should the dashboard support custom time ranges beyond 7/30 days? | Product Owner | Pending—simplified to presets for MVP |

---

MOD-W v5.0.1 — IDP-Align Design Spec
