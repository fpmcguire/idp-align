# STEP-06 - Divergence Analysis Chart View

---

## Goal

Add a focused Divergence Analysis view for inspecting the selected Divergence's observed behavior against its Observed Baseline over time.

This Step implements the DS-015 Chart.js analysis intent using bundled dependencies and the existing source-agnostic dashboard data boundary. The analysis must support metric switching for the selected stream and Divergence while preserving CAV Level 1 language: it visualizes observed values, Observed Baseline context, confidence/range context where available, magnitude, onset, duration, and supporting Evidence. It must not introduce business-rule conformance, CAV Level 2+ claims, user action workflows, live integration, or detector changes.

---

## Related Requirements

- R5 - Every detected sustained Divergence is surfaced with explainable and reconstructable Evidence, baseline context, observed behavior/value, magnitude/distance, onset, duration, and supporting observations.
- R6 - Angular dashboard presenting the document and workflow streams as separate but consistently modeled Level 1 views.
- R11 - Automated unit and E2E coverage for baseline/divergence logic and dashboard behavior, consistent with MOD-W quality gates.

---

## Related Design IDs

| Design ID | Design element | Design intent to preserve | Product requirement |
| --- | --- | --- | --- |
| DS-015 | Divergence Analysis Chart.js detailed view | Show observed values, Observed Baseline, confidence/range context, metric switching, and summary/timeline context for deeper investigation. | R5, R6 |
| DS-005 | Divergence detail pane | Keep selected Divergence context coherent and connected to baseline/evidence details. | R5, R6 |
| DS-006 | Baseline reference panel | Reuse observed baseline reference semantics in chart side context. | R2, R4, R5 |
| DS-007 | Evidence trace | Preserve reconstructable Evidence connection without duplicating or mutating evidence. | R5 |
| DS-013 | Status badges | Continue lifecycle-status semantics in analysis context. | R5, R6 |

DS-009 and DS-010 stream summary chart concepts remain dashboard KPI enhancements unless explicitly needed to support the selected Divergence analysis. User action controls from DS-004/DS-005 remain out of scope.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** A-048  
**Status:** Approved by Moderator for Development Team briefing and implementation planning.

Development Team may be briefed on STEP-06 and may prepare an implementation plan. Code changes remain unauthorized until the Moderator approves that implementation plan in the Moderator Register.

---

## Scope

- Implement a production Angular analysis surface for the selected Divergence:
  - may be a routed child view, an in-page analysis section, or another accessible view pattern proposed by Development Team and approved in the implementation plan;
  - must remain reachable from the dashboard/detail context without adding action workflows;
  - must provide a clear path back to the dashboard selection context.
- Add a Chart.js-based time-series visualization for the selected metric:
  - observed values;
  - Observed Baseline value or range;
  - confidence band or observed baseline range context when the baseline data supports it;
  - data point markers and readable axes;
  - onset marker or visual indication when practical with the bundled annotation plugin.
- Support metric switching using the selected stream's available Divergence dimensions:
  - document examples may include amount behavior, vendor format, date format, currency, or invoice type when backed by existing Divergence/baseline data;
  - workflow examples may include task duration, error route/behavior, routing frequency, or response time when backed by existing Divergence/baseline data;
  - metric options must be derived from existing selected-stream data, not hardcoded fake chart-only scenarios.
- Build chart-ready data through the facade/repository/domain boundary:
  - dashboard and chart components must not import replay fixtures directly;
  - chart code may transform an existing Divergence's baseline/evidence into chart points for presentation;
  - chart code must not recompute Observed Baselines or sustained Divergence detection.
- Present side context for the selected metric:
  - affected observations count or share when derivable from existing evidence;
  - baseline summary;
  - observed summary;
  - magnitude/distance from Observed Baseline;
  - onset, duration, latest observed time, and lifecycle status.
- Handle numeric and categorical Divergences truthfully:
  - numeric metrics should render a line/area chart against baseline mean/range where available;
  - categorical metrics may render a step/timeline, categorical encoded series, or a truthful non-numeric chart/table hybrid if a line chart would misrepresent the data;
  - if a confidence band is not meaningful for a categorical baseline, show an explicit observed-baseline distribution/range context instead.
- Keep analysis accessible and responsive:
  - chart canvas must have an accessible name and adjacent text/table summary for non-visual review;
  - metric toggles must expose selected state;
  - keyboard focus must remain predictable when switching metrics or navigating back;
  - desktop may use chart plus side summary; tablet/mobile must remain readable without clipped chart controls.
- Use bundled `chart.js` and `chartjs-plugin-annotation` only; no CDN or runtime third-party script loading.
- Use canonical `domain-language.md` terminology exactly for CAV concepts.

---

## Out Of Scope

- New sustained-divergence algorithms, changed thresholds, changed reference windows, or fixture value changes.
- Recomputing, editing, or mutating Observed Baselines from the analysis view.
- CAV Level 2 cross-stream analysis or reconciliation.
- CAV Level 3+ concepts including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance.
- Attribution/root-cause correlation.
- User action workflows such as copy details, mute, mark reviewed, resolve, export, open investigation, comments, assignments, or persisted reviewed/muted state.
- Live DocuWare API integration, OAuth, authentication, backend/proxy implementation, secrets, or live tenant configuration.
- About copy, About tests, PO-1 About References, or MOD-W role/harness/About-flowchart content.
- Dashboard KPI sparklines/ring charts unless explicitly scoped as minimal navigation or context for DS-015.
- Zoom/pan interactions; design-spec marks them future.

---

## Inputs

- `mod-w/product.md` v1.3
- `mod-w/architecture.md` D2, D3, D6, D7, D9, D11, D13
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/step-05.md`
- `review.md` STEP-05 Tech Lead review and QA-026 rework addendum
- `qa.md` STEP-05 QA review and QA-026 re-check, especially QA-027 and replay/browser coverage notes
- `mod-w/validation/moderator-register.md` A-047
- `mod-w/design/design-spec.md` DS-015, DS-005, DS-006, DS-007, DS-013
- Current dashboard facade/component/filter implementation under `src/app/features/dashboard/`
- Current domain types and divergence/evidence/baseline helpers under `src/app/domain/`
- Current shared Divergence UI components under `src/app/shared/ui/divergence/`

### Source Conflict Resolution

Known conflict disposition:

- Design DS-015 describes a "full-screen" analysis. Production may implement a routed view or accessible in-page analysis pattern if the implementation plan explains the choice and preserves the investigation intent.
- Design DS-015 names confidence bands. Numeric baselines may show mean/range/band context; categorical baselines must not fake a numeric confidence band and should instead show truthful distribution/range context.
- Design examples include metric names that may not all exist in replay data. STEP-06 metric toggles must come from existing stream/Divergence data unless the Moderator separately approves fixture changes.
- Design action examples such as copy, mute, and mark reviewed remain out of scope. Lifecycle statuses may be displayed only as existing finding status.
- Product and domain language supersede any design wording that implies alerts, anomalies, business correctness, defects, non-conformance, or risk severity.
- Architecture D7 supersedes prototype CDN usage: Chart.js and plugins must be bundled.

---

## Expected File Changes

- New chart/analysis component, directive, or route under `src/app/features/dashboard/` or `src/app/shared/ui/` if it remains presentational.
- Updates to dashboard facade/services to expose chart-ready projections or selected-Divergence analysis state through existing repository/domain boundaries.
- Possible small domain or dashboard-local chart types such as `MetricTimeSeries`, `AnalysisMetricOption`, or `DivergenceAnalysisViewModel`.
- Updates to dashboard component/template/styles for navigation to, or embedding of, the analysis view.
- Focused tests for chart data mapping, metric switching, selected-Divergence behavior, numeric and categorical handling, accessibility labels/summaries, guardrail copy, and lifecycle cleanup of Chart.js instances.
- `review.md` after Tech Lead review.
- `qa.md` after QA review.

Do not modify About copy or About tests as part of STEP-06.

---

## Reference Implementation

**Location:** Prototype evidence exists under `mod-w/design/project/` for `DivergenceAnalysis.dc.html`.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Adopt the approved DS-015 investigation intent: charted observed behavior against Observed Baseline context with metric switching and side summary.
- Implement production Angular components, signals, typed state, SCSS, accessibility, and tests rather than copying prototype HTML/scripts.
- Use bundled Chart.js and annotation plugin; do not load scripts from CDN.
- Use existing Divergence, Observed Baseline, and Evidence records as the data source.
- Do not add chart-only mock data or dashboard fixture imports.
- Do not implement user action workflows.

### Prototype Assumption Disposition

Accepted prototype assumptions:

- A selected Divergence can be inspected in a richer analysis view.
- The main visual compares observed behavior with Observed Baseline context.
- Metric switching is part of the analysis experience.
- The side context should summarize baseline, observed behavior, magnitude, onset, duration, and status.

Modified prototype assumptions:

- "Full-screen" can be a routed or in-page accessible production pattern approved in the implementation plan.
- Confidence bands are numeric-only unless existing categorical baseline data supports an honest equivalent distribution view.
- Metric options are derived from current stream data instead of static demo-only buttons.
- Mobile/tablet behavior must be production responsive, not fixed-board prototype layout.

Rejected prototype assumptions:

- CDN Chart.js loading.
- Inline script or inline style implementation.
- Action workflows as part of the analysis view.
- Severity, risk, alert, anomaly, failure, defect, non-conformance, or business-intent judgment language.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-06 Step approval entry before Development Team briefing.
- [ ] Analysis view is reachable from the selected dashboard Divergence and has a clear, accessible path back to the dashboard context.
- [ ] Chart.js and any annotation plugin are imported from bundled dependencies; no CDN or runtime third-party script loading is introduced.
- [ ] Analysis uses existing selected-stream Divergence, Observed Baseline, and Evidence data; dashboard/chart code does not import replay fixtures directly.
- [ ] Analysis code does not recompute Observed Baselines or sustained Divergence detection.
- [ ] Numeric Divergences render observed values against Observed Baseline context with readable axes, markers, and baseline/range/band treatment where data supports it.
- [ ] Categorical Divergences use a truthful categorical visualization or summary and do not fake numeric confidence bands.
- [ ] Metric toggle options are derived from current selected-stream data and switching metrics updates the chart and summary coherently.
- [ ] Analysis side context shows baseline summary, observed summary, magnitude/distance, onset, duration, latest observed time, and lifecycle status where available.
- [ ] Analysis includes accessible non-canvas summary text or tabular data for the active metric.
- [ ] Metric toggles expose selected state and remain keyboard-operable.
- [ ] Chart lifecycle is managed cleanly: existing chart instances update or are destroyed without leaking duplicate canvases/listeners.
- [ ] Selection behavior is coherent if the user switches stream, changes filters, or lands without an available Divergence.
- [ ] Loading, unavailable, no-Divergence, and filtered-hidden states remain truthful and do not produce broken chart rendering.
- [ ] Responsive behavior remains usable at desktop, tablet, and mobile widths without clipped chart controls or overlapping text.
- [ ] Existing STEP-05 dashboard filters, sorting, empty/loading/error states, keyboard behavior, and 1279px/1280px layout behavior do not regress.
- [ ] Shared Divergence UI components remain presentational and do not call repositories or detectors.
- [ ] No About copy or About tests are changed.
- [ ] No fixtures, detection algorithms, live DocuWare calls, credentials, OAuth, backend/proxy code, or non-replay adapters are introduced unless separately approved by the Moderator before implementation.
- [ ] No current behavior claims CAV Level 2+, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, Attribution, business judgment, defect, non-conformance, violation, alert, anomaly, or severity-as-risk.
- [ ] Relevant unit/component tests cover chart data mapping, metric switching, selected-Divergence routing/state, accessibility labels/summaries, numeric/categorical handling, and Chart.js lifecycle.
- [ ] Browser or rendered-component checks cover chart rendering, metric switching, keyboard operation, and desktop/tablet/mobile responsiveness.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.

---

## Plan

1. Confirm the STEP-06 approval entry exists in `mod-w/validation/moderator-register.md` before briefing the Development Team.
2. Ask Development Team to propose the analysis-view pattern: routed view, in-page section, or equivalent accessible production pattern.
3. Define chart-ready analysis view models derived from existing Divergence baseline/evidence data.
4. Implement the Chart.js wrapper/component with bundled imports, lifecycle cleanup, accessible labels, and non-canvas summary.
5. Add metric switching based on selected-stream data without chart-only fixtures.
6. Add side-context summary for baseline, observed behavior, magnitude, timeline, and status.
7. Preserve dashboard filter/sort/selection behavior and responsive breakpoints.
8. Add focused tests and browser/rendered checks for chart rendering, metric switching, accessibility, guardrails, and regressions.
9. Verify no user actions, fixture/detector changes, About changes, live integration, or Level 2+ claims are introduced.
10. Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0 via `fnm`.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-26 | Initial STEP-06 authored | Begin Chart.js Divergence Analysis planning after STEP-05 final acceptance A-047. |

---

## Review Notes

Tech Lead review must verify that STEP-06 visualizes existing CAV Level 1 evidence without changing the detector, baseline semantics, fixtures, or repository boundary.

Review must pay special attention to:

- whether categorical data is represented truthfully;
- whether Chart.js lifecycle and accessibility are production-safe;
- whether metric switching is data-backed rather than demo-only;
- whether the view implies severity, risk, business correctness, causation, Attribution, or Level 2+ analysis;
- whether STEP-05 interaction and responsive behavior remains intact.

---

## QA Notes

QA should perform browser or rendered-component checks because STEP-06 adds a canvas-based visual surface.

QA should verify chart rendering for at least one numeric Divergence and one categorical Divergence if both are available in replay data. If replay data cannot produce both in the browser, QA should verify the missing category through component tests and record the coverage limitation.

QA should also verify metric switching, keyboard operation, non-canvas summaries, responsive behavior, guardrail copy, and that no live-access, business-judgment, Level 2+, or Attribution claims are introduced.

---

MOD-W v5.0.1
