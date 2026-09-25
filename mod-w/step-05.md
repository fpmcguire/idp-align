# STEP-05 - Filtering, Sorting, Empty, Loading, And Error States

---

## Goal

Complete the primary dashboard interaction and state layer for the STEP-04 Divergence dashboard: functional filters, deterministic sorting, truthful loading/empty/error states, keyboard/focus refinements, and responsive state behavior.

This Step makes the existing dashboard easier to inspect and operate. It does not add Chart.js analysis, user action workflows, live integration, backend/proxy work, fixture changes, detector changes, or About copy changes.

---

## Related Requirements

- R6 - Angular dashboard presenting the document and workflow streams as separate but consistently modeled Level 1 views.
- R11 - Automated unit and E2E coverage for baseline/divergence logic and dashboard behavior, consistent with MOD-W quality gates.

---

## Related Design IDs

| Design ID | Design element | Design intent to preserve | Product requirement |
| --- | --- | --- | --- |
| DS-001 | Dashboard home layout | Preserve desktop two-column list/detail behavior and tablet/mobile stacked behavior while interaction states change. | R6 |
| DS-002 | Stream selector tabs | Keep accessible stream switching and fix any stale tab-panel references. | R6 |
| DS-008 | Filter/sort bar | Make dashboard filters and sorting functional using the existing Divergence records. | R6 |
| DS-011 | Empty state | Show truthful empty states for no data and for filter combinations with no matches. | R6 |
| DS-012 | Loading state | Add loading treatment while repository-backed stream data is still resolving. | R6 |
| DS-004 | Divergence card | Preserve selectable Divergence summaries after filtering and sorting. | R5, R6 |
| DS-005 | Divergence detail pane | Keep selected detail coherent when filters remove or restore cards. | R5, R6 |
| DS-013 | Status badges | Allow status filtering without changing lifecycle semantics. | R5, R6 |

DS-015 Chart.js analysis remains STEP-06. Action controls from DS-004/DS-005 remain out of scope unless separately routed.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** Pending  
**Status:** Authored by Tech Lead; pending Moderator approval before Development Team briefing.

Development Team may not be briefed on STEP-05 and may not prepare or implement an implementation plan until the Moderator approves this Step definition in the Moderator Register.

---

## Scope

- Replace disabled filter placeholders with functional dashboard controls:
  - Identity Slice filter scoped to the active stream.
  - Time range filter using preset values appropriate to the replay window.
  - Status filter over `DivergenceStatus` values present in the active stream, plus an all-status option.
  - Clear filters control that resets filter state for the active stream.
- Add a functional sort control:
  - default sort remains deterministic and consistent with STEP-04 onset ordering unless the user changes it;
  - supported options should include onset, Identity Slice, dimension, and status;
  - sorting must be stable for equal keys.
- Keep filter state separate from selected Divergence state:
  - switching streams must keep each stream's own filter/sort and selection state, or reset deliberately with tests documenting the chosen behavior;
  - if the current selection is filtered out, the detail pane must show a truthful no-selection or filtered-out state rather than stale detail;
  - clearing filters should restore available Divergences without inventing new selection semantics.
- Introduce explicit dashboard data state modeling for loading, ready, empty, filtered-empty, and unavailable/error states.
- Render loading states while repository-backed stream data is unresolved:
  - loading skeletons or accessible loading text are acceptable;
  - loading copy must not imply live DocuWare access.
- Render error/unavailable states when repository calls fail:
  - show a truthful message and an inert or functional retry control only if retry is implemented through the facade/repository boundary;
  - do not add contact-support links or external links.
- Preserve empty-state distinctions:
  - no detected Divergences in the active stream;
  - filters exclude all Divergences;
  - stream data unavailable.
- Improve keyboard/focus behavior:
  - preserve tablist arrow/Home/End behavior;
  - fix the pre-existing inactive stream-tab `aria-controls` reference to an unrendered panel id, or document and test a different accessible tab-panel pattern;
  - after stream/filter/sort changes, focus should remain predictable and must not strand keyboard users on removed controls;
  - visible focus states must remain.
- Preserve STEP-04 responsive behavior:
  - desktop from 1280px uses list/detail columns;
  - tablet 768-1279px stacks list and detail;
  - mobile below 768px remains a single stacked flow unless a separate Moderator approval scopes modal/push overlay work.
- Preserve source-agnostic boundaries:
  - dashboard components must not import replay fixtures directly;
  - filtering and sorting may operate on already-computed `Divergence` records, but must not recompute Observed Baselines or sustained Divergences;
  - repository/facade boundaries from `architecture.md` D13 must remain intact.
- Use canonical `domain-language.md` terminology exactly for CAV concepts.

---

## Out Of Scope

- Chart.js analysis, metric toggles, confidence bands, sparklines, ring charts, or chart interaction.
- User action workflows such as copy details, mute, mark reviewed, resolve, export, open investigation, or persistence of reviewed/muted state.
- Editing, recalculating, or mutating Observed Baselines.
- Changing STEP-03 detection algorithms, sustained criteria, status lifecycle semantics, or replay fixture values.
- Better duration formatting from QA-024 unless the Moderator separately routes it into STEP-05. The finding is carried as a known display limitation, not a STEP-05 requirement.
- Vendor rename/entity matching from QA-018.
- Cross-stream reconciliation or CAV Level 2 claims.
- CAV Level 3+ concepts including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance.
- Attribution/root-cause correlation.
- Real DocuWare API integration, OAuth, authentication, backend/proxy implementation, secrets, or live tenant configuration.
- About copy, About tests, PO-1 About References, or MOD-W role/harness/About-flowchart content.

---

## Inputs

- `mod-w/product.md` v1.3
- `mod-w/architecture.md` D1, D2, D3, D6, D9, D11, D13
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/step-04.md`
- `review.md` STEP-04 Tech Lead review
- `qa.md` STEP-04 QA review, especially QA-023 through QA-025 and the noted inactive tab `aria-controls` issue
- `mod-w/validation/moderator-register.md` A-039
- `mod-w/design/design-spec.md` DS-001, DS-002, DS-004, DS-005, DS-008, DS-011, DS-012, DS-013
- Current dashboard/facade implementation under `src/app/features/dashboard/`
- Current shared Divergence UI components under `src/app/shared/ui/divergence/`

### Source Conflict Resolution

Known conflict disposition:

- Design DS-008 names a "severity filter"; current CAV domain records expose lifecycle `status`, not severity. STEP-05 implements a Status filter and must not introduce severity scoring or imply business risk.
- Design examples mention action buttons such as Copy details, Mute, and Mark as reviewed. Product and current Step scope control: user action workflows remain out of scope.
- Design loading/error examples mention contact support. IDP-Align is a local research/demo app, so STEP-05 should use local, truthful unavailable/error copy and must not add support claims or external service links.
- Design mobile behavior allows modal or push overlay. STEP-05 preserves the current single stacked mobile flow unless the Moderator separately approves modal/push overlay interaction work.
- QA-024 duration precision is accepted as a known STEP-04 display limitation. STEP-05 does not fix it unless explicitly rerouted.

---

## Expected File Changes

- Updates to `src/app/features/dashboard/dashboard.facade.ts` or dashboard-facing services to expose stream loading/error state and filtered/sorted projections.
- Updates to `src/app/features/dashboard/dashboard.component.ts/html/scss` to render functional filter/sort controls, loading states, filtered-empty states, unavailable/error states, and keyboard/focus refinements.
- New small dashboard-local types or helpers for filter/sort state if useful.
- Focused tests for filter behavior, sort behavior, empty/loading/error states, stream switching, selection behavior under filters, keyboard/focus behavior, and claim guardrails.
- Existing shared Divergence UI components may be updated only as needed for accessibility/state integration; they must remain presentational.
- `review.md` after Tech Lead review.
- `qa.md` after QA review.

Do not modify About copy or About tests as part of STEP-05.

---

## Reference Implementation

**Location:** Prototype evidence exists under `mod-w/design/project/` for the filter/sort bar, loading/empty states, stream tabs, and dashboard layout.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Adopt the approved design intent from DS-008, DS-011, DS-012, and DS-002.
- Implement production Angular controls, signals, typed state, templates, SCSS, and tests rather than copying prototype HTML/scripts.
- Filter and sort already-computed `Divergence` records. Do not duplicate baseline derivation or sustained detection in components.
- Replace prototype severity wording with status wording aligned to `DivergenceStatus`.
- Keep action controls omitted unless separately scoped.

### Prototype Assumption Disposition

Claude Code is assigned. Claude Design is not implementing this Step.

Accepted prototype assumptions:

- The dashboard includes a filter/sort bar above the list/detail region.
- Empty and loading states are first-class UI states.
- Stream tabs remain the primary top-level stream selector.

Modified prototype assumptions:

- Severity filtering becomes lifecycle-status filtering.
- Error state copy is local and demo-appropriate, with no contact-support claim.
- Mobile remains stacked rather than introducing a modal unless separately approved.

Rejected prototype assumptions:

- Action workflows are functional in this Step.
- Filtering or sorting conveys risk severity, business correctness, or CAV Level 2+ interpretation.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-05 Step approval entry before Development Team briefing.
- [ ] Dashboard filter controls are functional and no longer disabled placeholders.
- [ ] Identity Slice filtering narrows the active stream's Divergence list and does not affect the inactive stream unexpectedly.
- [ ] Time range filtering narrows Divergences by a documented timestamp choice, such as onset or latest observed time, and tests cover the chosen behavior.
- [ ] Status filtering narrows by `DivergenceStatus` without introducing severity or business-risk language.
- [ ] Clear filters resets the active stream's filters and restores matching Divergences.
- [ ] Sort control reorders the visible list by supported options with stable ordering for equal keys.
- [ ] Default ordering remains deterministic and consistent with STEP-04 unless the user selects a different sort.
- [ ] KPI counts either clearly reflect the unfiltered stream total or the filtered visible result; the chosen behavior is explicit in copy and tests.
- [ ] Selection/detail behavior remains coherent when filters or stream switching hide the previously selected Divergence.
- [ ] Empty state distinguishes no detected Divergences from no matches under current filters.
- [ ] Loading state renders before repository-backed Divergence data is ready and uses accessible non-live-access copy.
- [ ] Error/unavailable state renders when repository data cannot be read, without implying live DocuWare failure.
- [ ] Retry behavior is either implemented through the facade/repository boundary and tested, or omitted/inert with truthful copy.
- [ ] Stream tab accessibility remains valid; inactive tabs do not point to missing tab panels unless the pattern is documented and tested as accessible.
- [ ] Keyboard navigation through stream tabs, filters, list cards, and detail remains predictable, with visible focus states.
- [ ] Responsive behavior remains: 1280px+ two-column, 768-1279px stacked, below 768px single stacked flow.
- [ ] Dashboard components do not import replay fixture files directly.
- [ ] Dashboard components do not implement Observed Baseline derivation or sustained Divergence detection inline.
- [ ] Shared Divergence UI components remain presentational and do not call repositories or detectors.
- [ ] No About copy or About tests are changed.
- [ ] No fixtures, detection algorithms, live DocuWare calls, credentials, OAuth, backend/proxy code, or non-replay adapters are introduced.
- [ ] No current behavior claims CAV Level 2+, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, Attribution, business judgment, defect, non-conformance, or violation.
- [ ] Dashboard guardrail tests still cover endorsement, private access, production readiness, business-judgment claims, reserved Level 3+ terms, alert/anomaly wording, and no severity-as-risk wording.
- [ ] Relevant component/facade tests cover filtering, sorting, stream switching, selection/detail under filters, empty/loading/error states, accessibility attributes, and responsive breakpoint preservation where practical.
- [ ] Browser or rendered-component checks cover at least the replay happy path, filtered-empty state, stream switching after filters, keyboard focus, and the 1279px/1280px breakpoint.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.

---

## Plan

1. Confirm the STEP-05 approval entry exists in `mod-w/validation/moderator-register.md` before briefing the Development Team.
2. Define dashboard filter/sort state and data-state types behind the dashboard facade or component boundary.
3. Expose filtered/sorted visible Divergences and clear state transitions without recomputing CAV domain logic.
4. Replace disabled filter placeholders with functional controls and add a sort control.
5. Add loading, filtered-empty, no-divergence, and unavailable/error rendering.
6. Resolve the inactive stream-tab `aria-controls` issue or document and test a valid accessible pattern.
7. Preserve STEP-04 list/detail selection behavior under filters, sort changes, stream switching, and responsive layouts.
8. Add focused unit/component tests and browser or rendered-component checks for the acceptance criteria.
9. Verify no charts, user actions, About changes, fixture/detector changes, live calls, credentials, or Level 2+ claims are introduced.
10. Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0 via `fnm`.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-25 | Initial STEP-05 authored | Begin dashboard filtering, sorting, and interaction-state work after STEP-04 final acceptance A-039. |

---

## Review Notes

Tech Lead review must verify that STEP-05 filters and sorts rendered Divergence records only, without duplicating domain detection logic or crossing fixture boundaries.

Review must pay special attention to state semantics:

- filtering and sorting must not imply severity, business correctness, causation, or Attribution;
- loading/error copy must remain local and replay/source-neutral;
- tab, filter, card, and detail focus behavior must remain accessible;
- STEP-04 responsive breakpoint behavior must not regress.

Review must also verify that Chart.js analysis, user action workflows, About copy, fixture changes, detector changes, and live integration remain out of scope.

---

## QA Notes

QA should perform browser or rendered-component checks because STEP-05 changes interactive dashboard behavior.

QA should verify functional filters, sorting, clear filters, filtered-empty states, loading/error states if feasible through test doubles, keyboard focus behavior, stream switching after filters, and responsive behavior at 1279px and 1280px.

QA should also verify that no UI copy introduces severity/risk judgment, business correctness, CAV Level 2+ claims, or Attribution.

---

MOD-W v5.0.1
