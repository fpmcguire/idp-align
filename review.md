# Tech Lead Review - STEP-05

**Project:** IDP-Align  
**Step:** STEP-05 - Filtering, Sorting, Empty, Loading, And Error States  
**Review date:** 2026-09-25  
**Reviewer:** Codex, Tech Lead  
**Implementation package reviewed:** Current uncommitted Development Team STEP-05 work after A-041 implementation-plan approval  
**Verdict:** Pass for QA

---

## QA-026 Rework Review Addendum

**Review date:** 2026-09-26  
**Reviewed package:** Current STEP-05 QA-026 rework after A-043 approval  
**Verdict:** Pass for QA re-check after Moderator disposition A-044.

### Findings

#### Must Fix Now

**TL-STEP05-RW-001 - Out-of-scope `qa.md` modification remains in the reviewed working tree**

A-043 approved a narrow QA-026 rework and explicitly kept `qa.md` out of scope. The reviewed working tree still includes a `qa.md` diff alongside the approved dashboard implementation files and the A-043 register entry.

Impact: process/scope only. The dashboard implementation is not affected, but the current package cannot be treated as the approved QA-026 rework package unless the `qa.md` change is removed from the handoff or the Moderator explicitly approves carrying it.

Required disposition before QA acceptance: either remove the `qa.md` modification from this rework package, or record a Moderator disposition authorizing that documentation change separately from QA-026.

**Resolution:** Resolved by A-044. The Moderator approved carrying the current `qa.md` modification separately from the QA-026 rework implementation. The QA-026 code scope remains limited to the A-043 Time range `aria-describedby`/`time-range-note` fix.

#### Could Fix Later

None.

### Gate Verification

`mod-w/validation/moderator-register.md` contains A-043, which approves the STEP-05 QA-026 rework plan before implementation. A-043 authorizes the Development Team to implement the narrow accessibility fix and hand the completed diff and verification evidence back for Tech Lead review before QA acceptance.

### Implementation Check

The dashboard code changes match the approved A-043 plan:

- `dashboard.component.ts` adds `shownTimeRangeNote`, a computed value that returns the time range note only when no controls note replaces it.
- `dashboard.component.html` uses `shownTimeRangeNote()` for both the Time range select `aria-describedby` attribute and the `#time-range-note` paragraph render condition.
- The empty list state still renders only the controls note and does not render a second time range note.
- The existing ready-state assertion still verifies that the Time range select references `time-range-note` when the note renders.
- The no-Divergences stream spec now verifies that `filter-timerange` has no `aria-describedby`, `[data-testid="time-range-note"]` is not rendered, and no `#time-range-note` element exists.

No domain logic, facade behavior, filter/sort helper behavior, fixtures, About files, Chart.js analysis, user action workflow, live integration, QA-027 handling, or review acceptance gate behavior is changed by the implementation files.

### Verification

- `fnm exec --using=v26.0.0 npm.cmd run lint`: passed. Angular lint reports all files pass linting.
- `fnm exec --using=v26.0.0 npm.cmd run build`: passed after rerun outside the sandbox; the sandboxed run hit the known Angular/esbuild `spawn EPERM` limitation. Initial total remains 264.78 kB raw / 75.91 kB estimated transfer. `dashboard-component` is 50.67 kB raw / 12.07 kB estimated transfer.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false`: passed after rerun outside the sandbox; the sandboxed run hit the same Angular/esbuild `spawn EPERM` limitation. 27 test files and 408 tests passed.

### Approval Needed Before QA May Proceed

A-044 resolves TL-STEP05-RW-001. The needed approval record before QA may proceed is Moderator acceptance of this QA-026 Tech Lead rework review, authorizing QA to re-check the approved fix against A-043, A-044, and the verification evidence.

---

## Findings

### Must Fix Now

None.

### Could Fix Later

None.

---

## Gate Verification

`mod-w/validation/moderator-register.md` contains the required approvals:

- A-040 approves `mod-w/step-05.md` as the active STEP-05 definition before Development Team briefing.
- A-041 approves the Development Team STEP-05 implementation plan and records the accepted Tech Lead decisions and conditions.

A-041 includes a recording note that the Moderator approved the implementation plan in session before code was written and that the Development Team recorded the entry afterwards at the Moderator's explicit instruction for this instance only. That resolves the process concern for this review.

The working tree is intentionally uncommitted per the Development Team handoff.

---

## Scope Check

The implementation is within STEP-05 scope:

- Adds dashboard-local filter/sort helpers for already-computed `Divergence` records.
- Extends `DashboardFacade` with per-stream loading/unavailable/ready state, retry, filters, sort, visible Divergences, unfiltered counts, and selection behavior under filters.
- Replaces disabled filter placeholders with functional Identity Slice, time range, status, sort, and clear-filter controls.
- Adds loading, unavailable, no-divergence, filtered-empty, hidden-selection, result-count, and unfiltered-KPI copy states.
- Fixes the inactive stream-tab `aria-controls` issue by assigning `aria-controls` only on the active tab.
- Preserves STEP-04 responsive breakpoint behavior, with `.list-detail-container` still stacking at `max-width: 1279px`.

No About files, fixtures, domain detector logic, replay data, data adapters, live DocuWare integration, credentials, OAuth, backend/proxy code, Chart.js analysis, or user action workflows were changed.

---

## Acceptance Check Mapping

- STEP-05 approval entry before briefing: met. A-040 is present.
- Implementation-plan approval before review: met. A-041 is present, including Moderator recording note.
- Functional filters: met. Identity Slice, time range, status, and clear filters are implemented and tested.
- Functional sort: met. Onset, Identity Slice, dimension, and status sorting are implemented as stable sorts over visible records.
- Time range semantics: met. Filtering uses `latestObservedAt` anchored to the stream's latest observation, with helper tests for edge cases.
- Status semantics: met. Status filtering uses `DivergenceStatus` and avoids severity/risk language.
- KPI semantics: met. Counts remain unfiltered, and UI copy states that filters do not change them.
- Selection under filters: met. Hidden selected Divergences are not shown as stale detail, and clearing filters restores the selected Divergence.
- Stream switching: met. Filters, sort, and selection are preserved per stream as approved in A-041.
- Loading state: met by test evidence. Replay data does not visibly pause in the browser, but Subject-backed tests cover loading UI.
- Unavailable/error state: met by test evidence. Retry re-reads through the repository and avoids support/live-access copy.
- Empty and filtered-empty states: met. The states are distinct and tested.
- Accessibility: met. Active-tab `aria-controls`, tab keyboard behavior, clear-filter focus safety, retry focus handoff, and panel focus behavior are tested.
- Responsive behavior: met by code inspection and Development Team browser evidence; QA should re-check 1279px/1280px.
- Source boundary: met. Components do not import replay fixtures, and filtering/sorting do not derive baselines or sustained runs.
- Guardrails: met. Dashboard copy tests include the existing claim patterns plus dashboard-only severity/risk wording.
- Out-of-scope boundaries: met. No Chart.js analysis, user action workflow, About change, fixture change, detector change, live call, credential, backend/proxy, or CAV Level 2+ behavior was introduced.

---

## Architecture And Domain Check

- `architecture.md` D1/D2 are preserved: the dashboard remains one reusable stream view with shared Divergence components.
- `architecture.md` D3/D6 are preserved: the UI continues to surface canonical Divergence, Observed Baseline, and Evidence records.
- `architecture.md` D9 is respected: no CAV Level 2+ or reserved Level 3+ behavior is introduced.
- `architecture.md` D11 is satisfied with focused helper, facade, and component coverage.
- `architecture.md` D13 is preserved: dashboard components consume the facade and do not import replay fixtures or live adapters.
- `domain-language.md` is respected. Filter/sort UI uses lifecycle status, not severity or business-risk scoring.

---

## Verification

Run with Node.js v26.0.0 via `fnm`:

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | Pass - `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | Pass - all files pass linting |
| `fnm exec --using=v26.0.0 npm.cmd run build` | Pass after rerun outside sandbox; sandboxed run failed with known Angular/esbuild `spawn EPERM` |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | Pass after rerun outside sandbox; 27 test files and 408 tests passed |

Build output:

- Initial total: 264.78 kB raw / 75.89 kB estimated transfer.
- Lazy chunks: `dashboard-component` 50.59 kB raw / 12.06 kB estimated transfer; `about-component` 10.41 kB raw / 3.06 kB estimated transfer.

Development Team also reported 18 of 18 browser checks passing with throwaway Playwright evidence. I did not independently rerun the browser script during this Tech Lead review.

---

## QA Handoff Status

STEP-05 is ready for QA review after Moderator accepts this Tech Lead review.

QA should pay special attention to:

- A-041 process traceability and its recording note;
- functional filters and sort behavior across both streams;
- per-stream retention of filters, sort, and selection;
- hidden-selection detail behavior when filters hide a selected Divergence;
- loading, unavailable, empty, and filtered-empty states through test doubles where needed;
- retry copy and behavior staying local and repository-backed;
- absence of severity/risk, business judgment, Attribution, CAV Level 2+, or live-access claims;
- responsive behavior at 1279px and 1280px.

MOD-W v5.0.1
