# STEP-04 - Divergence List, Detail, Baseline, And Evidence Trace

---

## Goal

Render the sustained Divergences produced by STEP-03 in the dashboard through reusable CAV UI components: Divergence cards, selected Divergence detail, Observed Baseline context, status badges, and chronological Evidence Trace.

This Step makes the STEP-03 domain records visible and selectable. It does not add filtering/sorting behavior, Chart.js analysis, live integration, or user action workflows.

---

## Related Requirements

- R5 - Every detected sustained Divergence is surfaced with an explainable and reconstructable Evidence trace: identity slice, baseline reference/context, dimension, observed behavior/value, magnitude/distance, onset, duration, and supporting observations as applicable. The surfaced finding does not itself classify the behavior as failure, defect, non-conformance, or violation of business intent.
- R6 - Angular dashboard presenting the document and workflow streams as separate but consistently modeled Level 1 views.
- R12 - Persist enough evidence to reconstruct a divergence finding from its source observations and baseline context.

---

## Related Design IDs

| Design ID | Design element | Design intent to preserve | Product requirement |
| --- | --- | --- | --- |
| DS-001 | Dashboard home layout | Preserve the two-column list/detail dashboard composition already established by STEP-01. | R6 |
| DS-003 | Summary KPI cards | Replace placeholder KPI values with aggregate counts derived from STEP-03 Divergence records. | R6 |
| DS-004 | Divergence card | Render compact selectable Divergence summaries with Identity Slice, dimension, baseline reference, observed value, magnitude/distance, onset, duration, and status. | R5, R6 |
| DS-005 | Divergence detail pane | Populate selected Divergence detail with full context, quick stats, baseline context, and evidence. | R5, R6 |
| DS-006 | Baseline reference panel | Render Observed Baseline method, reference window, sample size, and baseline range/distribution. | R2, R4, R5 |
| DS-007 | Evidence trace | Render chronological Evidence items for the selected Divergence. | R5 |
| DS-009 | Document stream summary metrics | Surface document-stream Divergences using document-specific labels and context. | R1, R2, R6 |
| DS-010 | Workflow stream summary metrics | Surface workflow-stream Divergences using workflow-specific labels and context. | R3, R4, R6 |
| DS-011 | Empty state | Show a truthful empty state if a stream has no Divergences after detection. | R6 |
| DS-013 | Status badges | Render status badges for `ongoing` and any other status present, without implying remediation or Convergence. | R5, R6 |
| DS-014 | Evidence detail row | Render Evidence rows with source/context values needed to understand the finding. | R5 |

DS-008 filtering/sorting, DS-012 loading skeleton expansion, and DS-015 Chart.js analysis remain later Steps.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** A-034 - STEP-04 Step Approval Before Development Team Briefing  
**Status:** Approved for Development Team briefing and implementation planning only.

Development Team may be briefed on STEP-04 and may prepare an implementation plan. Development Team may not write code until the Moderator approves the Development Team implementation plan in the Moderator Register.

---

## Scope

- Use the STEP-03 detector to compute Divergences for both streams from repository-provided Identity Slices and observations.
- Extend the dashboard facade or a dashboard-facing service so the dashboard can consume:
  - stream source info;
  - Divergence lists by stream;
  - selected Divergence by active stream;
  - aggregate KPI counts needed in this Step.
- Render real Divergence list content in the existing dashboard list region:
  - one selectable card per Divergence;
  - default ordering by onset or source order must be deterministic and documented in tests;
  - selected card state and keyboard/focus behavior must be accessible.
- Render real selected Divergence detail in the existing detail region:
  - Identity Slice and dimension;
  - status badge;
  - onset, latest observed time, duration;
  - observed summary and magnitude/distance;
  - Observed Baseline reference panel;
  - chronological Evidence Trace.
- Render stream KPI values from the computed Divergence records:
  - total Divergences;
  - ongoing count;
  - resolved count if any records are resolved;
  - trend may remain non-chart textual placeholder if Chart.js analysis remains out of scope.
- Replace STEP-02/STEP-03 placeholder copy that says Divergences are added in later Steps with truthful copy reflecting that sustained Divergence detection is now active.
- Preserve the existing stream tabs and two independent streams. Switching streams should show that stream's Divergence list and selected detail. Selection may default to the first Divergence in the active stream or to no selection if no Divergence exists; the behavior must be tested.
- Preserve source-agnostic boundaries:
  - dashboard components must not import replay fixtures directly;
  - dashboard components must not recompute baseline or Divergence logic inline;
  - source data should flow through repository/facade/domain helpers consistent with `architecture.md` D13.
- Use canonical `domain-language.md` terminology exactly for CAV concepts.
- Treat `resolved` carefully per QA-019:
  - if a `resolved` Divergence appears, the UI must describe it only as a finding lifecycle state, not remediation, correction, Convergence, or business resolution;
  - the detail view must not imply the Evidence includes a resolving observation unless the record actually carries one;
  - tests must cover the user-facing wording or rendering behavior for any `resolved` status path introduced in this Step.
- Treat QA-014 carefully:
  - the Approval step and Workflow runtime Divergences may both appear in the workflow stream;
  - UI must not visually or textually imply one caused the other;
  - shared workflow `instanceId` values may appear as Evidence context only.
- Keep `decisionAgent`, route, runtime, and instance fields as Evidence context, not causal Attribution.

---

## Out Of Scope

- Filter and sort controls becoming functional. Existing controls may remain disabled or placeholder-only until STEP-05.
- Custom time ranges, identity-slice multi-select behavior, status filtering, or clear-filter behavior.
- Chart.js analysis, metric toggles, confidence bands, or sparkline/ring charts.
- User actions such as Copy details, Mute, Mark reviewed, Resolve, Export, Open investigation, or persistence of user action state.
- Editing, recalculating, or mutating Observed Baselines.
- Changing STEP-03 detection algorithms or replay fixture values.
- Vendor rename/entity matching from QA-018.
- Resolution-rule changes from QA-019. STEP-04 may constrain rendering/wording, but should not change detector semantics unless separately approved.
- CAV Level 2 multi-source reconciliation.
- CAV Level 3+ concepts including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance.
- Attribution/root-cause correlation.
- Real DocuWare API integration, OAuth, authentication, backend/proxy implementation, secrets, or live tenant configuration.
- PO-1 About References unless separately routed.
- PO-4, QA-007, and QA-008 unless a later Moderator approval changes their timing.

---

## Inputs

- `mod-w/product.md` v1.3
- `mod-w/architecture.md` D1, D2, D3, D5, D6, D9, D11, D13
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/step-03.md`
- `review.md` STEP-03 Tech Lead review
- `qa.md` STEP-03 QA review, especially QA-014, QA-018, QA-019
- `mod-w/validation/moderator-register.md` A-033
- `mod-w/design/design-spec.md` DS-001, DS-003, DS-004, DS-005, DS-006, DS-007, DS-009, DS-010, DS-011, DS-013, DS-014
- Current STEP-03 domain implementation under `src/app/domain/`
- Current dashboard shell under `src/app/features/dashboard/`

### Source Conflict Resolution

Known conflict disposition:

- Design examples mention actions such as "Mute alert" and "Mark as reviewed." Product and Architecture control for STEP-04: action workflows are out of scope, and the UI must not use `alert` as the CAV finding name.
- Design examples include Chart.js/sparklines. Chart analysis is explicitly STEP-06, so STEP-04 should render textual KPI/detail values without charts unless an existing placeholder remains inert.
- QA-019 notes that STEP-03 can mark a Divergence `resolved` after one returning observation and that the resolving observation is not in Evidence. STEP-04 must avoid over-explaining `resolved`; changing the detector is not part of this Step.
- QA-018 notes broader vendor rename/entity matching is not implemented. STEP-04 must not claim vendor rename detection beyond the Divergences actually produced by STEP-03.

---

## Expected File Changes

- New shared UI components under `src/app/shared/ui/` or feature-local components under `src/app/features/dashboard/` for:
  - Divergence Card;
  - Divergence Detail;
  - Baseline Reference Panel;
  - Evidence Trace;
  - Status Badge.
- Updates to `src/app/features/dashboard/dashboard.facade.ts` or dashboard-facing services to compute and expose Divergence data from repository observations and STEP-03 domain helpers.
- Updates to `src/app/features/dashboard/dashboard.component.ts/html/scss` to render real list/detail/KPI content.
- Focused component/facade/unit tests for rendering, selection state, stream switching, empty state, claim guardrails, and source-boundary behavior.
- Existing dashboard guardrail tests updated so they still reject endorsement, private access, production readiness, business-judgment claims, reserved Level 3+ terms, and alert/anomaly wording.
- `review.md` after Tech Lead review.
- `qa.md` after QA review.

Do not modify About copy or About tests for PO-1 as part of STEP-04.

---

## Reference Implementation

**Location:** Prototype evidence exists under `mod-w/design/project/` for Divergence cards, Divergence detail, Baseline panel, Evidence Trace, and related layout patterns.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Adopt the approved design intent from DS-004, DS-005, DS-006, DS-007, DS-013, and DS-014.
- Implement production Angular components, typed inputs, signals, templates, SCSS, and tests rather than copying prototype HTML/scripts.
- Use STEP-03 domain records as the source of truth for rendered values; do not hardcode prototype Divergences.
- Omit or keep inert any prototype action controls unless this Step explicitly scopes them.
- Replace any prototype `alert` language with canonical `Divergence` language.
- Maintain responsive behavior consistent with the existing dashboard shell and design spec; do not introduce nested card-in-card layouts.

### Prototype Assumption Disposition

Claude Code is assigned. Claude Design is not implementing this Step.

Accepted prototype assumptions:

- Divergences are shown as selectable summary cards with a detail pane.
- Detail includes quick stats, baseline context, and Evidence trace.
- Status is visible as a badge.

Modified prototype assumptions:

- Action buttons are omitted or inert because user action workflows are out of scope.
- Chart/sparkline elements are omitted or left as non-chart textual placeholders because Chart.js analysis is STEP-06.
- Alert/anomaly terminology is replaced by canonical CAV language.

Rejected prototype assumptions:

- Any implication that a Divergence is bad, defective, a violation, or a business-intent breach.
- Any implication that workflow runtime Divergence is caused by an Approval step Divergence.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-04 Step approval entry before Development Team briefing.
- [ ] Dashboard-facing code computes Divergences from repository-provided Identity Slices and observations using STEP-03 domain helpers.
- [ ] Dashboard components do not import replay fixture files directly.
- [ ] Dashboard components do not implement baseline or Divergence calculation logic inline.
- [ ] Document stream renders the STEP-03 document Divergence list, including the Alpha Office Supplies amount-value Divergence from replay data.
- [ ] Workflow stream renders the STEP-03 workflow Divergence list, including Approval task-duration, Approval response-time, and Workflow runtime Divergences from replay data.
- [ ] Divergence cards render Identity Slice, dimension, observed summary or value, magnitude/distance, onset or duration, and status.
- [ ] Selecting a Divergence updates the detail pane and applies an accessible selected state to the corresponding card.
- [ ] Stream switching updates the list, KPI values, selection/detail behavior, and stream-specific labels without leaking state incorrectly across streams.
- [ ] Detail pane renders Identity Slice, dimension, status, onset, latest observed time, duration, observed summary, and magnitude/distance.
- [ ] Baseline Reference Panel renders method, reference window, sample size, and numeric range or categorical distribution summary as applicable.
- [ ] Evidence Trace renders Evidence items in chronological order with observation timestamp, compared value, source/context fields, and within/out-of-baseline indication.
- [ ] Evidence context may show workflow `instanceId`, route, runtime, and decision-agent fields only as observed Evidence context, not Attribution.
- [ ] QA-014 is respected: the workflow stream may show both Approval and Workflow runtime Divergences, but UI copy/structure does not imply either caused the other.
- [ ] QA-019 is respected: if `resolved` is rendered, user-facing copy presents it only as a finding lifecycle status and does not imply remediation, correction, Convergence, or business correctness.
- [ ] QA-018 is respected: UI copy does not imply broader vendor rename/entity matching than the STEP-03 detector supports.
- [ ] KPI values reflect the rendered stream's computed Divergence records without introducing chart behavior.
- [ ] Empty state is truthful for any stream with no Divergences and does not appear when Divergences are present.
- [ ] Existing filter controls remain disabled or placeholder-only; no filtering/sorting behavior is introduced.
- [ ] No user actions such as copy, mute, mark reviewed, resolve, export, or open investigation are introduced as functional behavior.
- [ ] No About copy or About tests are changed.
- [ ] No fixtures, detection algorithms, live DocuWare calls, credentials, OAuth, backend/proxy code, or non-replay adapters are introduced.
- [ ] No current behavior claims CAV Level 2+, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, Attribution, business judgment, defect, non-conformance, or violation.
- [ ] Dashboard guardrail tests still cover endorsement, private access, production readiness, business-judgment claims, reserved Level 3+ terms, and alert/anomaly wording.
- [ ] Relevant component/facade tests cover rendering, selection, stream switching, empty/detail states, baseline panel, evidence trace, status wording, and QA-014/QA-019 copy constraints.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.

---

## Plan

1. Confirm the STEP-04 approval entry exists in `mod-w/validation/moderator-register.md` before briefing the Development Team.
2. Extend the dashboard facade/service boundary to derive stream Divergences from repository data and STEP-03 domain helpers.
3. Add reusable UI components for Divergence card, status badge, detail, baseline reference, and evidence trace.
4. Replace placeholder Divergence list/detail content with real computed stream data.
5. Replace placeholder KPI values with STEP-04 aggregate counts and truthful non-chart trend placeholder if needed.
6. Implement selection state and stream-switch behavior with accessible markup and tests.
7. Add tests for document and workflow stream rendering, QA-014 non-causal presentation, QA-019 `resolved` wording, and guardrail patterns.
8. Verify no filter/sort behavior, charting, user actions, About changes, fixtures, live calls, credentials, or Level 2+ claims are introduced.
9. Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0 via `fnm`.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-25 | Initial STEP-04 authored | Begin UI surfacing of STEP-03 Divergence, Observed Baseline, and Evidence records after STEP-03 final acceptance A-033. |
| 2026-09-25 | Updated approval status after A-034 | Moderator approved STEP-04 for Development Team briefing and implementation planning only. |

---

## Review Notes

Tech Lead review must verify that dashboard UI consumes the STEP-03 domain records through the approved boundary and does not reimplement CAV logic in components.

Review must pay special attention to QA-014 and QA-019:

- QA-014: multiple workflow Divergences may share instance context without implying causation.
- QA-019: `resolved` must be presented only as a lifecycle status and must not imply remediation, Convergence, correctness, or complete reconstruction unless the record carries that evidence.

Review must also verify that disabled filters, chart analysis, user action workflows, About copy, and live integration remain out of scope.

---

## QA Notes

QA should perform a browser or rendered-component check because STEP-04 changes user-visible dashboard content.

QA should verify the document stream and workflow stream both show real Divergences from replay data, that selecting cards updates the detail pane, that Evidence is chronological and reconstructable from rendered fields, and that UI wording does not make business-judgment, Attribution, or higher-level CAV claims.

---

MOD-W v5.0.1
