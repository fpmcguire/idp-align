# STEP-07 - Workflow Stream Parity And Cross-Stream Consistency

---

## Goal

Bring the Workflow stream to the same CAV Level 1 dashboard quality as the Document stream, while preserving workflow-specific dimensions, Evidence wording, and replay-domain meaning.

This Step is a parity and consistency pass. It should verify and close gaps where workflow data, workflow-specific copy, workflow Evidence rendering, filtering/sorting behavior, detail context, and analysis behavior lag behind the Document stream or diverge from shared architecture. It must not introduce cross-stream reconciliation, CAV Level 2 claims, new detection algorithms, fixture value changes, live DocuWare access, or user action workflows.

---

## Related Requirements

- R3 - Ingest or replay workflow event observations shaped from the Workflow Analytics API, including task duration, decision agent, response time, error/route, and total runtime where available.
- R4 - Build Observed Truth and observed behavioral baselines from historical workflow runs; detect sustained divergence by relevant Identity Slice such as step, route, or decision agent.
- R6 - Angular dashboard presenting the document and workflow streams as separate but consistently modeled Level 1 views.
- R9 - Use canonical CAV v1.0 vocabulary: Observed Truth, Identity Slice, Observed Baseline, Divergence, Evidence; preserve standard MOD-W artifact structure and STEP-xx build trail.

---

## Related Design IDs

| Design ID | Design element                             | Design intent to preserve                                                                                               | Product requirement |
| --------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------- |
| DS-001    | Dashboard home layout                      | Keep the shared dashboard shell equally usable for Document and Workflow streams.                                       | R6                  |
| DS-002    | Stream selector tabs                       | Preserve accessible switching between independent streams.                                                              | R6                  |
| DS-003    | Summary KPI cards                          | Ensure workflow KPI labels and counts are workflow-specific without diverging from shared summary patterns.             | R6                  |
| DS-004    | Divergence card                            | Use shared Divergence card behavior with workflow-specific Identity Slice and Dimension copy.                           | R5, R6              |
| DS-005    | Divergence detail pane                     | Present full workflow Divergence context with the same explainability quality as document detail.                       | R5, R6              |
| DS-006    | Baseline reference panel                   | Show workflow Observed Baseline reference windows and sample context without implying intended targets.                 | R4, R5              |
| DS-007    | Evidence trace                             | Render workflow task counts, routes, timing metrics, decision agents, and error behavior as Evidence context.           | R5                  |
| DS-008    | Filter/sort bar                            | Ensure filters and sorting operate coherently for workflow Identity Slices, statuses, dimensions, and times.            | R6                  |
| DS-010    | Workflow stream summary metrics            | Preserve workflow-specific summary intent for steps/routes, decision agents, and workflow dimensions.                   | R3, R4, R6          |
| DS-011    | Empty state                                | Keep no-Divergence and filtered-empty workflow states truthful.                                                         | R6                  |
| DS-012    | Loading state                              | Preserve source-neutral loading/unavailable workflow states.                                                            | R6                  |
| DS-013    | Status badges                              | Keep lifecycle status semantics consistent across streams.                                                              | R5, R6              |
| DS-014    | Evidence detail row                        | Ensure workflow Evidence rows are reconstructable and readable.                                                         | R5                  |
| DS-015    | Divergence Analysis Chart.js detailed view | Ensure workflow analysis uses the same production analysis surface and metric switching semantics as document analysis. | R5, R6              |

DS-009 remains document-stream summary context and should not be changed unless needed for a shared parity test. No new design surface is expected.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** A-053  
**Status:** Approved by Moderator for Development Team briefing and implementation planning.

Development Team may be briefed on STEP-07 and may prepare an implementation plan. Code changes remain unauthorized until the Moderator approves that implementation plan in the Moderator Register.

---

## Scope

- Audit the current Workflow stream against the Document stream for CAV Level 1 parity:
  - summary KPI labels, counts, and trend/context wording;
  - Divergence card fields and workflow-specific value formatting;
  - detail pane completeness and ordering;
  - Observed Baseline reference context;
  - Evidence trace content, labels, timestamps, and reconstructability;
  - filtering, sorting, hidden-selection, empty, loading, unavailable, and retry behavior;
  - analysis view reachability, metric switching, side context, chart/table summaries, and back/focus behavior.
- Fill workflow-specific presentation gaps using existing workflow observations, baselines, Divergences, and Evidence records.
- Preserve shared components and configuration-driven stream differences:
  - prefer typed stream configuration, formatters, view-model helpers, and tests over forking the dashboard;
  - shared Divergence UI components must stay presentational;
  - dashboard and shared UI code must not import replay fixtures directly.
- Ensure workflow copy uses canonical terms and does not overstate interpretation:
  - workflow `decision agent`, route, error, response-time, task-duration, and runtime fields may appear as Evidence context;
  - those fields must not be presented as root cause, Attribution, violation, failure, risk, or business correctness.
- Improve or add workflow-focused tests where current coverage is document-heavy:
  - component/facade specs for workflow filters, sorting, selection, detail, Evidence rows, analysis options, and guardrail copy;
  - rendered or browser checks for workflow happy path, metric switching on the Workflow Approval Identity Slice, filter-hidden behavior, keyboard/focus flow, and responsive breakpoints.
- Preserve the STEP-06 categorical coverage limitation unless a categorical workflow Divergence already exists through current data:
  - do not add or alter fixture values solely to create a browser-visible categorical case;
  - if categorical workflow behavior remains spec-only, keep that limitation explicit for QA.
- Carry forward accepted non-blocking notes without rerouting them into implementation:
  - QA-028 uneven duration chart tick formatting remains future polish unless separately approved;
  - QA-029 potential keyboard access for a future horizontally scrolling chart table remains future accessibility work unless the Step introduces real horizontal scrolling.

---

## Out Of Scope

- Cross-stream reconciliation, correlation, comparison, or CAV Level 2 Multi-Dimensional Observed Alignment claims.
- CAV Level 3+ concepts including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance.
- Attribution/root-cause correlation or claims that a decision agent, route, worker, model, or configuration caused a Divergence.
- New sustained-divergence algorithms, changed thresholds, changed reference windows, changed status lifecycle semantics, or replay fixture value changes.
- Adding new mock scenarios solely to improve demo richness.
- Live DocuWare API integration, Workflow Analytics API calls, OAuth, authentication, backend/proxy implementation, secrets, tenant configuration, or non-replay adapters.
- User action workflows such as copy details, mute, mark reviewed, resolve, export, open investigation, comments, assignments, or persisted reviewed/muted state.
- About copy, About tests, PO-1 About References, MOD-W role/harness/About-flowchart content, or README/research documentation changes unless the Moderator separately routes documentation work.
- Chart.js dependency changes, new chart libraries, zoom/pan interactions, or chart polish unrelated to workflow parity.
- QA-028 duration tick-step polish and QA-029 scroll-container keyboard remediation unless the Development Team identifies an actual workflow parity blocker and obtains Moderator approval.

---

## Inputs

- `mod-w/product.md` v1.3
- `mod-w/architecture.md` D1, D2, D3, D4, D5, D6, D9, D11, and D13
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/step-06.md`
- `review.md` STEP-06 Tech Lead review, especially workflow analysis and metric-switching notes
- `qa.md` STEP-06 QA review, especially QA-028, QA-029, QA-030, categorical browser-coverage limitation, workflow browser evidence, and STEP-05 regression notes
- `mod-w/validation/moderator-register.md` A-052
- `mod-w/design/design-spec.md` DS-001, DS-002, DS-003, DS-004, DS-005, DS-006, DS-007, DS-008, DS-010, DS-011, DS-012, DS-013, DS-014, DS-015
- Current domain types and helpers under `src/app/domain/`
- Current replay repository/adapters under `src/app/data/`
- Current dashboard facade/component/analysis implementation under `src/app/features/dashboard/`
- Current shared Divergence UI components under `src/app/shared/ui/divergence/`

### Source Conflict Resolution

Known conflict disposition:

- Product Scenario 3 allows reviewing both streams side by side conceptually, but STEP-07 must not implement cross-stream reconciliation or claim CAV Level 2. The goal is parity across two independent Level 1 streams.
- Design examples mention workflow metrics such as error rate, routing frequency, task duration, and response time. STEP-07 may surface only dimensions backed by existing workflow Divergence/baseline/Evidence data.
- Architecture lists workflow lifecycle statuses including reviewed and muted as possible domain values. STEP-07 must not add user workflows to change those statuses.
- The STEP-06 browser data has multi-option metric switching only for Workflow Approval and exposes no categorical Divergences. STEP-07 may improve coverage through tests, but fixture changes require separate Moderator approval.
- QA-028 and QA-029 are accepted Info-level carry-forward notes. They are not STEP-07 requirements unless an approved implementation plan explicitly routes them and explains why parity depends on them.

---

## Expected File Changes

- Possible updates to dashboard stream configuration, workflow display helpers, or view-model mapping under `src/app/features/dashboard/`.
- Possible updates to shared presentational Divergence UI components only where needed to render workflow Evidence or workflow labels consistently.
- Possible small domain/dashboard-local formatting helpers for workflow durations, routes, decision agents, or runtime values, without changing domain detection.
- Focused tests for workflow stream parity, workflow-specific Evidence/detail rendering, filter/sort behavior, analysis metric switching, accessibility attributes, guardrail copy, and responsive behavior.
- `review.md` after Tech Lead review.
- `qa.md` after QA review.

Do not modify About copy or About tests as part of STEP-07. Do not change replay fixture values, baseline builders, sustained detection algorithms, or package dependencies unless separately approved by the Moderator before implementation.

---

## Reference Implementation

**Location:** Prototype evidence exists under `mod-w/design/project/` for the dashboard, Divergence list/detail, Evidence Trace, workflow summary examples, and Divergence Analysis concepts.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Adopt the approved design intent that both Document and Workflow streams share one Level 1 dashboard model and layout pattern.
- Implement production Angular signals, typed view models/configuration, SCSS, accessibility, and tests rather than copying prototype HTML/scripts.
- Use existing workflow Divergence, Observed Baseline, and Evidence data through the facade/repository boundary.
- Keep workflow-specific wording factual and bounded to observed workflow behavior.
- Do not implement cross-stream analysis, action workflows, live calls, or prototype-only severity/risk/action concepts.

### Prototype Assumption Disposition

Accepted prototype assumptions:

- Document and Workflow streams should feel like equal first-class dashboard streams.
- Workflow Evidence may include task counts, routing patterns, timing metrics, error behavior, and decision-agent context.
- The same Divergence cards, detail, baseline, Evidence, status, filter/sort, and analysis concepts apply to workflow records.

Modified prototype assumptions:

- Workflow examples must come from existing typed data and domain records, not static demo-only cases.
- Severity/risk language is replaced by lifecycle status and observed-difference language.
- Any side-by-side review remains independent Level 1 stream navigation, not cross-stream CAV reconciliation.

Rejected prototype assumptions:

- User action controls are functional in this Step.
- Workflow agent/route/error fields imply causal Attribution.
- Any workflow Divergence is treated as a violation, failure, alert, anomaly, defect, or non-conformance.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-07 Step approval entry before Development Team briefing.
- [ ] Workflow stream uses the same shared dashboard layout, tabs, filter/sort controls, list/detail structure, Evidence Trace, Baseline Reference Panel, status badge, and analysis surface as Document stream unless a workflow-specific difference is explicitly justified and tested.
- [ ] Workflow summary KPI labels and values are workflow-specific and data-backed; they do not reuse misleading document concepts.
- [ ] Workflow Divergence cards show correct workflow Identity Slice, Dimension, magnitude/distance, onset, duration, lifecycle status, and accessible labels.
- [ ] Workflow detail pane shows Observed Baseline context, observed behavior/value, magnitude/distance, onset, duration, latest observed time where available, lifecycle status, and reconstructable Evidence.
- [ ] Workflow Evidence Trace rows expose workflow-relevant context such as step, route, decision agent, task duration, response time, error behavior, or runtime when present in existing Evidence.
- [ ] Workflow Evidence context does not imply Attribution, root cause, business judgment, violation, failure, defect, non-conformance, alert, anomaly, severity, or risk.
- [ ] Workflow filters for Identity Slice, time range, and status operate correctly and do not affect Document stream state unexpectedly.
- [ ] Workflow sorting remains deterministic and stable for equal keys.
- [ ] Workflow hidden-selection, filtered-empty, no-Divergence, loading, unavailable, and retry states remain truthful and source-neutral.
- [ ] Stream switching preserves or resets per-stream filter/sort/selection state according to the existing documented behavior, with workflow coverage added where missing.
- [ ] Workflow analysis opens from selected workflow Divergences, provides a clear accessible back path, and closes coherently on stream switch or hidden selection.
- [ ] Workflow analysis metric options derive from visible same-Identity-Slice workflow Divergences; Workflow Approval metric switching remains coherent.
- [ ] Workflow chart/table summaries use existing Divergence, Observed Baseline, and Evidence data and do not import replay fixtures directly.
- [ ] Categorical workflow behavior is either browser-verified if naturally available through current data or remains covered by component/view-model specs with the limitation recorded for QA.
- [ ] Shared UI components remain presentational and do not call repositories, detectors, adapters, or fixture files.
- [ ] Dashboard code does not recompute Observed Baselines or sustained Divergences inline.
- [ ] No About copy or About tests are changed.
- [ ] No fixtures, detection algorithms, thresholds, reference windows, status lifecycle semantics, live DocuWare calls, credentials, OAuth, backend/proxy code, non-replay adapters, package dependencies, or chart libraries are introduced unless separately approved by the Moderator before implementation.
- [ ] No current behavior claims CAV Level 2+, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, Attribution, business judgment, defect, non-conformance, violation, alert, anomaly, or severity-as-risk.
- [ ] Existing Document stream behavior does not regress while workflow parity changes are made.
- [ ] Existing STEP-05 and STEP-06 behavior does not regress, including filters, sorting, analysis open/back, chart lifecycle, metric switching, hidden-selection handling, tab accessibility, and 1279px/1280px responsive behavior.
- [ ] Relevant unit/component tests cover workflow summary, workflow cards, workflow detail, workflow Evidence rows, workflow filters/sorting, workflow analysis options, guardrail copy, accessibility attributes, and categorical spec coverage if browser data remains numeric-only.
- [ ] Browser or rendered-component checks cover the workflow happy path, Workflow Approval metric switching, filter-hidden behavior, keyboard/focus flow, and desktop/tablet/mobile responsive layouts.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.

---

## Plan

1. Confirm the STEP-07 approval entry exists in `mod-w/validation/moderator-register.md` before briefing the Development Team.
2. Ask Development Team to audit current Workflow stream parity against Document stream and identify concrete workflow-specific gaps before proposing code changes.
3. Preserve shared dashboard architecture while adding or adjusting workflow configuration, formatting, and view-model mapping as needed.
4. Ensure Workflow cards, detail, Evidence Trace, summary KPIs, filters, sorting, empty/state handling, and analysis behavior use existing workflow domain records.
5. Add workflow-focused unit/component coverage and guardrail tests without weakening existing Document, STEP-05, or STEP-06 tests.
6. Add browser or rendered checks for workflow happy path, Workflow Approval metric switching, focus/back behavior, filter-hidden states, and 1440px/1280px/1279px/768px/375px layouts where practical.
7. Verify no cross-stream reconciliation, Level 2+, Attribution, action workflows, fixture/detector changes, About changes, live calls, credentials, backend/proxy work, or chart dependency changes are introduced.
8. Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0 via `fnm`.

---

## Change Notes

| Date       | Change                   | Reason                                                                                                   |
| ---------- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| 2026-09-26 | Initial STEP-07 authored | Begin workflow stream parity and cross-stream consistency planning after STEP-06 final acceptance A-052. |

---

## Review Notes

Tech Lead review must verify that STEP-07 improves Workflow stream parity without converting independent Level 1 streams into cross-stream reconciliation.

Review must pay special attention to:

- whether workflow copy and Evidence context remain factual and non-causal;
- whether workflow decision-agent, route, error, duration, response-time, and runtime fields are treated as Evidence context rather than Attribution;
- whether shared component boundaries remain presentational and source-agnostic;
- whether workflow parity changes preserve Document stream behavior;
- whether STEP-05 and STEP-06 interaction, accessibility, chart lifecycle, metric switching, and responsive behavior remain intact;
- whether categorical coverage remains honestly described if replay browser data stays numeric-only.

---

## QA Notes

QA should perform browser or rendered-component checks because STEP-07 validates parity across interactive workflow surfaces.

QA should verify workflow summary, card/detail, Evidence Trace, filter/sort behavior, analysis open/back, Workflow Approval metric switching, hidden-selection behavior, keyboard focus, guardrail copy, and responsive behavior at 1280px and 1279px.

QA should also verify that no UI copy or code introduces cross-stream CAV Level 2 claims, Attribution, severity/risk, alert/anomaly wording, business judgment, live access claims, or user action workflows.

---

MOD-W v5.0.1
