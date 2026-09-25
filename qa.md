# QA Review - STEP-02

**Project:** IDP-Align  
**Step:** STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures  
**QA date:** 2026-09-25  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files.  
**Repository state reviewed:** original QA at `master` `ddcde42`; re-check at `master` `3ab913b` (the only working-tree change is the Moderator's uncommitted A-023 register entry)  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-02, verdict "Pass for QA"; re-review verdict "Pass for fresh QA re-check"  
**Verdict (re-check):** **Pass with notes.** QA-010 and QA-011 are resolved, and AC8 and AC9 now pass. QA-012 to QA-016 are still open and need a Moderator disposition. See [Re-Check - QA-010 And QA-011 Rework](#re-check---qa-010-and-qa-011-rework).  
**Original verdict (`ddcde42`):** Fail (AC8, QA-010).

The STEP-01 QA record is preserved at tag `step-01` (`qa.md`).

---

## Re-Check - QA-010 And QA-011 Rework

**Re-check date:** 2026-09-25  
**QA session:** A fresh Claude Code QA session. It did not plan, implement, or revert any rework, and it did not edit implementation files, `step-02.md`, `review.md`, or the register.  
**Delta checked:** `ac790fb..3ab913b`. The implementation changes are all in Development Team commit `032fe2f`. `72f548a` is A-022. `3ab913b` holds the Tech Lead `step-02.md` correction and the `review.md` re-review.  
**Tech Lead input:** `review.md` "Re-Review Result", verdict "Pass for fresh QA re-check, with build/test verification limitation noted below"

### Gate check

| Gate | Evidence | Result |
| --- | --- | --- |
| QA finding dispositions and rework routing | A-021 | Present |
| Rework-plan approval before code | A-022 (QA-010 plan, and QA-011 included by Moderator decision) | Present; `72f548a` and `032fe2f` share a commit timestamp, the same pattern QA-016 noted |
| Tech Lead re-review acceptance before QA re-check | A-023 | Present in the working tree but **not yet committed** |

QA may proceed. The Moderator should commit A-023 together with this `qa.md` so the gate record matches the order of events.

### Delta integrity

- `032fe2f` changes exactly the four files that A-022 approved: `docuware-replay.types.ts` (comments only), `document-replay.fixture.ts` (header comment and metadata notes), `workflow-replay.fixture.ts` (`timeSpan()` comment and metadata notes), and `replay-fixtures.spec.ts`.
- No fixture values, IDs, record shapes, or types changed. `document-replay.mapper.ts` is unchanged, as the plan said.
- No template, style, component, facade, repository, route, About, or shell file changed.
- No code path reads the fixture metadata `notes` at runtime. They ship in `main` as data, but no template renders them, so the rework cannot change visible copy.

### Automated results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `npm run lint` | **Passed.** "All files pass linting." |
| `npm run build` | **Passed.** Initial total 256.96 kB raw / 73.45 kB transfer (was 256.48 / 73.23 kB; the growth is the longer metadata notes). `dashboard-component` 10.87 kB and `about-component` 10.41 kB are unchanged. No warnings. |
| `npm test -- --watch=false` | **Passed.** Test Files 12 passed (12); Tests 158 passed (158). Vitest v4.1.11. That is 154 + 4 net new tests: the document fixture replaces 1 test with 3, and the workflow fixture adds 2. |

These results satisfy the A-023 condition, which exists because the Tech Lead sandbox hit `spawn EPERM` on build and test.

### Public-source re-check

QA re-fetched both cited pages with curl on 2026-09-25 and compared every documentation claim in the reworked notes and comments against them.

**Platform REST API** (`/docs/default-web-service-docuware-platform-api`):

| String | Occurrences | Reworked claim | Result |
| --- | --- | --- | --- |
| `"FieldName"` | 4 | "The cited page documents index fields as a FieldName with a single Item value." | Supported. The sample is `{ "FieldName": "COMPANY", "Item": "Peter's Engineering" }` … `{ "FieldName": "DOCUMENT_DATE", "Item": "2020-01-01" }`. |
| `COMPANY` / `DOCUMENT_DATE` | 6 / 3 | "COMPANY and DOCUMENT_DATE follow the documented sample field names" | Supported. `DOCUMENT_TYPE`, `AMOUNT`, and `CURRENCY` are now explicitly synthetic. |
| `ItemElementName` | 0 | Approximation note | Correctly marked as an approximation |
| `Decimal` | 0 | Approximation note (typing list includes Decimal) | Correctly marked as an approximation |
| `/Date(` | 0 | Approximation note, which also states that the cited sample is an ISO date string | Correctly marked as an approximation |
| `DWSTOREDATETIME` | 0 | Approximation note | Correctly marked as an approximation |

**Workflow Analytics API** (`/docs/workflow-analytics-api`):

| Item | Evidence | Reworked claim | Result |
| --- | --- | --- | --- |
| `/Date(` | 3 occurrences | "the documented /Date(ms)/ date form" | Supported |
| `00:00:34.6158214` | 3 occurrences | "the documented hh:mm:ss.fffffff duration form" | Supported |
| `d.hh:mm:ss` day-prefixed durations | 0 matches for `"\d+\.\d{2}:\d{2}:\d{2}` | Approximation note: "durations of 24 hours or more use a d. day prefix (TimeSpan-style) that the cited page does not show" | Correctly marked as an approximation |

The earlier false note "WorkflowRuntimes rows use the documented fields and value formats" is gone. Every remaining note or comment that says "documented" cites something the page shows.

### Test quality of the new assertions

- **Document fixture:** `should use the documented FieldName and Item pair on every index field` checks the documented pair and the two sample field names on every record. `should add only the approximated ItemElementName to the documented pair` keeps the exact key-set check under an accurate name. `should record approximated typing, date encoding, and DWSTOREDATETIME in metadata` requires all four approximation terms in `Approximation:` notes. It also fails if any note containing "documented" mentions them again, so the QA-010 regression is guarded.
- **Workflow fixture:** `should use the documented duration form below 24 hours and a day prefix only above it` covers every `WorkflowRuntimes.runtime`, `TaskExecutionTimes.executionTime`, and `TaskReactionTimes.reactionTime`. It ties the prefix to `parseTimeSpan(...) >= 24 h` in both directions. `should record the duration day prefix as an approximation in metadata` requires the approximation note and forbids "d. day prefix" and "value formats" in any "documented" note, so the QA-011 regression is guarded.
- The durations that A-022 required to stay unchanged are unchanged. `timeSpan()` itself was not modified.

### Regression spot-checks

- About files (`src/app/features/about/`) and the shell (`app.ts`, `app.html`) are unchanged since tag `step-01`, so PO-1 still holds.
- The dashboard guardrail specs (all `CLAIM_GUARDRAIL_PATTERNS`, both streams) pass.
- The fixture secret-pattern and URL guardrail tests pass. The only URLs are the two cited `knowledgecenter.docuware.com/docs/` pages.
- QA did not repeat the browser run. The delta has no rendering-path change (see Delta integrity), so the `ddcde42` browser evidence below still applies.

### Acceptance checks affected by the rework

| # | Check | Original | Re-check | Notes |
| --- | --- | --- | --- | --- |
| AC8 | Document fixtures are synthetic and shaped from public Platform REST API concepts | Fail | **Pass** | The documented `FieldName` / `Item` pair and sample field names are claimed as documented. `ItemElementName` (with Decimal typing), `/Date(ms)/`, and `DWSTOREDATETIME` are recorded as approximations. There is no false documentation claim. |
| AC9 | Workflow fixtures are synthetic and shaped from public Workflow Analytics concepts | Pass with note | **Pass** | QA-011 is resolved. The `d.` prefix is recorded as an approximation. |
| AC15 | Unit tests cover fixture validity and guardrails | Pass | **Pass** | The inherited false claim in the test name is gone, and the new tests guard both traceability regressions. |
| AC17–AC19 | Lint / build / test under Node.js v26.0.0 | Pass | **Pass** | Re-run on `3ab913b`; 158 tests. |

All other acceptance checks keep their original results, recorded below, because the delta does not touch them.

### Finding status

| Finding | Status |
| --- | --- |
| QA-010 (Medium) | **Resolved.** `step-02.md` Source Conflict Resolution now matches the cited page. |
| QA-011 (Low) | **Resolved.** |
| QA-012 to QA-016 | **Open.** They await Moderator disposition (A-021, A-022, A-023). None blocks STEP-02 acceptance in QA's view, because each is Low or Info and none is an acceptance-check failure. The Moderator should still disposition QA-012, the stale KPI note, before the 2026-09-28 demo. |

### New finding

#### QA-017 - Info (process / traceability): `step-02.md` Change Notes do not record the Source Conflict correction

- **Where:** `mod-w/step-02.md` Change Notes table. Its last row is dated 2026-09-24.
- **Evidence:** `3ab913b` rewrites the first "Known conflict disposition" bullet in Source Conflict Resolution, which is a substantive change to the controlling-source statement. No Change Notes row records it or cites QA-010 or A-021.
- **Route:** The Tech Lead adds a Change Notes row. This is a documentation-only change, and it does not block acceptance.

### Re-check conclusion

The QA-010 and QA-011 rework does what A-022 approved and nothing more. Every documentation claim in the replay fixtures now traces to the cited public pages, and each source-shape assumption is labeled as an approximation. Lint, build, and tests pass under Node.js v26.0.0. STEP-02 is ready for QA acceptance. QA does not accept its own review: the Moderator records QA acceptance.

**Next:** The Moderator records QA acceptance and dispositions QA-012 to QA-017. Product Owner sign-off, if applicable, and the STEP-02 final gate follow.

---

## Original QA Review (`ddcde42`)

The sections below are the original QA review. They are unchanged except for this heading.

## Summary

Fail

The STEP-02 implementation stays within scope. It adds domain types, a source-agnostic repository interface, synthetic replay fixtures, a replay adapter, a dashboard facade, one neutral replay source line, and the QA-006 guardrail expansion. It adds no Observed Baseline calculation, no sustained Divergence detection, no Evidence Trace behavior, no Level 3+ concepts, no live DocuWare calls, and no credentials. Lint, build, and tests pass under Node.js v26.0.0, and the browser run showed no external requests.

The failing check is traceability, not safety. The document fixture metadata says index fields "use the documented FieldName / Item / ItemElementName structure". The Platform REST API page the fixture cites contains no `ItemElementName`, no `/Date(...)/` values, and no `DWSTOREDATETIME`. Its only date sample is the ISO string `"2020-01-01"`, but the fixture's `DOCUMENT_DATE` uses `/Date(ms)/`. `step-02.md` makes the public documentation the controlling source and requires approximated fields to be recorded in fixture metadata. Neither happened.

The root cause is partly upstream. `step-02.md` Source Conflict Resolution (line 120) states that the public Platform REST API documentation represents index fields with `ItemElementName`, and the Development Team followed that text. QA escalates this conflict between the approved Step and its cited source to the Moderator and does not resolve it.

---

## Gate Check

| Gate | Evidence | Result |
| --- | --- | --- |
| Step approval before briefing | A-017 | Present |
| Implementation-plan approval before code | A-018 (2026-09-25) | Present |
| Sass tooling separated from STEP-02 | A-019; `839f9e0` touches only `package.json` and `package-lock.json` | Present; excluded from this QA |
| Tech Lead review acceptance before QA | A-020, `review.md` verdict "Pass for QA" | Present |

QA may proceed.

---

## Scope Of Review

- Delta `step-01..ddcde42`, excluding `839f9e0` (A-019). Every STEP-02 implementation file is in `ddcde42`.
- About files (`src/app/features/about/`) and the app shell (`app.ts`, `app.html`) have no changes since tag `step-01`. The PO-1 exclusion is respected.
- `src/testing/claim-guardrail-patterns.ts` is imported only by specs, as A-018 requires.

---

## Automated Command Results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `npm run lint` | **Passed.** "All files pass linting." |
| `npm run build` | **Passed.** Initial total 256.48 kB raw / 73.23 kB transfer; `dashboard-component` 10.87 kB, `about-component` 10.41 kB. No warnings. Matches `review.md`. |
| `npm test -- --watch=false` | **Passed.** Test Files 12 passed (12); Tests 154 passed (154). Vitest v4.1.11. Matches A-020. |

The shell default is Node v24.13.0. QA switched to v26.0.0 explicitly with `fnm use 26.0.0`. The A-013 follow-up to pin the Node version is still open.

---

## Static Checks

| Check | Method | Result |
| --- | --- | --- |
| No live network APIs in browser code | Searched non-spec `src` for `HttpClient`, `provideHttpClient`, `fetch(`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` | None found |
| Fixtures imported only by the replay adapter | Searched `src` for `fixtures/` | Only `replay-stream-observation.repository.ts` |
| Dashboard depends on the interface | `dashboard.facade.ts` imports only `stream-observation.repository.ts`; `dashboard.component.ts` imports the facade and domain types | Pass |
| URLs in `src` | Every URL in the fixtures is a `knowledgecenter.docuware.com/docs/` page; the About CAV link is unchanged | Pass |
| Reserved Level 3+ terms and alert/anomaly wording in new runtime code | Searched non-spec STEP-02 files | Only the test-only pattern constants match |
| Synthetic identifiers | Vendor names, workflow name, and decision agents end in "(synthetic)"; instance IDs are `00000000-0000-4000-8000-…`; document IDs are 1001–1038 | Pass |
| Credentials, tokens, email addresses, live hosts | Code reading plus `FIXTURE_SECRET_PATTERNS` tests | None found |

---

## Public-Source Traceability Check

QA fetched both cited pages (WebFetch, then raw HTML with curl) on 2026-09-25.

**Workflow Analytics API** (`/docs/workflow-analytics-api`):

- The page documents eight projection types. The fixture uses six of them with the exact names: TaskExecutionTimes, TaskReactionTimes, TaskDecisions, TaskDecisionUsers, WorkflowErrorExits, and WorkflowRuntimes. It uses no `WorkflowRuns`.
- The `WorkflowRuntimes` fields match the published example exactly: `instanceId`, `workflowVersion`, `docId`, `runtime`, `state`, `startTime`, `timeOfCompletion`.
- The state values match: Completed, Running, Failed, Stopped.
- The date format `/Date(ms)/` and the duration format `00:00:34.6158214` match.
- The page publishes no example payload for any task-level projection. The fixture metadata marks the task-level field names as approximations, as the Step requires.
- Exception: the `d.` day prefix on durations is not in the page. See QA-011.

**Platform REST API** (`/docs/default-web-service-docuware-platform-api`, 1.0 MB of HTML, server-rendered):

| String | Occurrences |
| --- | --- |
| `COMPANY` | 6 |
| `DOCUMENT_DATE` | 3 |
| `2020-01-01` (ISO date sample) | 3 |
| `ItemElementName` | **0** |
| `/Date(` | **0** |
| `DWSTOREDATETIME` | **0** |
| `Decimal` | **0** |

The published sample is `{ "FieldName": "DOCUMENT_DATE", "Item": "2020-01-01" }`. See QA-010.

---

## Manual Browser Evidence

Method: `ng serve` on port 4310 under Node v26.0.0, driven by headless Chromium through Playwright scripts. The scripts and screenshots stay in the QA session scratchpad and are not committed. The console showed only Vite and Angular dev-mode messages, with no errors or warnings.

| Check | Result |
| --- | --- |
| `/` redirects to `/dashboard`; title `IDP-Align` | Pass |
| Foundation note | "Dashboard foundation: synthetic replay data is loaded, but no Divergences are shown yet." |
| Document replay line | "Replay source: 38 synthetic document observations across 6 Identity Slices, 3 Aug–11 Sep 2026 (UTC). Observed Baselines and sustained Divergence detection are added in later Steps." |
| Workflow replay line (after the tab switch) | "Replay source: 80 synthetic workflow observations across 4 Identity Slices, 3 Aug–12 Sep 2026 (UTC). …" The source note and heading switch to the Workflow text. |
| KPI cards | Four cards show "—" with the note "Pending replay data" (see QA-012) |
| Filters | 3 of 3 selects are disabled; note: "Filters become available in a later Step." |
| List and detail placeholders | Intact; no Divergence rows, statuses, severity, or rankings |
| Network | Every request went to `localhost:4310`; there were **no external requests**, and none to DocuWare |
| 375 px width | No horizontal scroll |
| About view regression | `h1` "About IDP-Align" and 8 × `h2`; surfacing-boundary text unchanged from the STEP-01 re-check |

The replay line gives source facts only: count, Identity Slice count, date range, UTC. It uses none of the A-018 avoid-words, and it states that Observed Baselines and Divergence detection come later. It cannot reasonably be read as a completed finding.

---

## Acceptance Check Results (`mod-w/step-02.md`)

| # | Check | Result | Notes |
| --- | --- | --- | --- |
| AC1 | Register contains the STEP-02 approval entry before briefing | Pass | A-017 (2026-09-24) predates A-018 and the code. |
| AC2 | Canonical domain types exist: document/workflow observations, Observed Truth, Identity Slice, Stream, replay source metadata | Pass | `stream.ts` (`StreamKind`), `identity-slice.ts`, `observation.ts`, `observed-truth.ts`, `source-reference.ts`; `ReplayFixtureMetadata` in `replay-fixture.ts`; `StreamSourceInfo` in `stream-observation.repository.ts`. |
| AC3 | Type names and user-visible labels use `domain-language.md` terms exactly | Pass with note | The code names `ObservedTruth`, `IdentitySlice`, `StreamKind`, `ReplayFixture` match. The UI casing of "Identity Slices" differs from the glossary UI column ("Identity slice"). See QA-013. |
| AC4 | No reserved Level 3+ terms describe current behavior | Pass | Static search plus rendered-copy guardrail tests. |
| AC5 | Source-agnostic repository interfaces exist | Pass | `StreamObservationRepository` has no source-specific methods; the contract spec `describeRepositoryContract` is reusable. See QA-015 for the `sourceKind` literal. |
| AC6 | Dashboard code depends on interfaces or facades, not fixture imports | Pass | `DashboardFacade` injects `StreamObservationRepository`; the provider is bound at route level in `app.routes.ts`. |
| AC7 | A local replay adapter implements the interface for both streams | Pass | `ReplayStreamObservationRepository`; the contract spec runs for both streams. |
| AC8 | Document fixtures are synthetic and shaped from public Platform REST API concepts | **Fail** | The data is synthetic and uses the documented `FieldName` / `Item` pair and the sample names `COMPANY` and `DOCUMENT_DATE`. The metadata, however, claims a documented `ItemElementName` structure that the cited page does not contain. `DOCUMENT_DATE` uses `/Date(ms)/`, which contradicts the cited ISO sample. Neither item is recorded as an approximation. See QA-010. |
| AC9 | Workflow fixtures are synthetic and shaped from public Workflow Analytics concepts | Pass with note | The projection names, the `WorkflowRuntimes` fields, the states, and the formats match the source, and the task-level approximations are marked. Four duration values use an undocumented `d.` prefix, and the metadata calls the value formats "documented". See QA-011. |
| AC10 | No credentials, tokens, private URLs, customer data, or live-call configuration | Pass | Static checks plus fixture guardrail tests. |
| AC11 | Browser code performs no live DocuWare calls | Pass | Static search; `fetch` and XHR spy test in the repository spec; browser run showed no external requests. |
| AC12 | Dashboard-visible data is limited to neutral stream metadata or counts | Pass | The replay line matches A-018 Option B; KPIs show "—", filters are disabled, placeholders are intact. |
| AC13 | Dashboard guardrail tests cover endorsement, private access, production readiness, business judgment, reserved terms, and alert/anomaly wording | Pass | `dashboard.component.spec.ts` runs every `CLAIM_GUARDRAIL_PATTERNS` entry on the rendered text of both streams, with a sanity check that the scanned text includes "DocuWare" and "Replay source:". The earlier reserved-term test was replaced by this broader set with no loss of coverage. |
| AC14 | Unit tests cover the repository contract and replay adapter for both streams | Pass | `replay-stream-observation.repository.spec.ts`, mapper specs, `dashboard.facade.spec.ts`. |
| AC15 | Unit tests cover fixture validity and guardrails | Pass | `replay-fixtures.spec.ts`; the "documented index field structure" test inherits the QA-010 claim. |
| AC16 | Existing STEP-01 dashboard and About behavior remains intact | Pass | About files unchanged; tabs, ARIA, `h1`, placeholders, and redirects verified in browser; STEP-01 specs still pass. See QA-012 on stale KPI copy. |
| AC17 | `npm run lint` passes under Node.js v26.0.0 | Pass | See above. |
| AC18 | `npm run build` passes under Node.js v26.0.0 | Pass | See above. |
| AC19 | `npm test -- --watch=false` passes under Node.js v26.0.0 | Pass | 12 files, 154 tests. |

Design IDs: DS-001 and DS-002 are preserved (browser-verified). DS-009 and DS-010 are supported at the data level: document observations carry vendor, document type, amount/currency, and date; workflow observations carry task duration, response time, decision, decision agent, error exit, and runtime/state. No summary metrics are shown yet, which is correct for STEP-02.

---

## Findings

Numbering continues from STEP-01 (QA-001 to QA-009).

### QA-010 - Medium (traceability): document fixture claims a documented shape the cited source does not show

- **Where:** `src/app/data/replay/fixtures/document-replay.fixture.ts` lines 75–80 and note on line 98; `docuware-replay.types.ts` lines 4–9; `replay-fixtures.spec.ts` line 68 (test name "should use the documented index field structure"); `document-replay.mapper.ts` line 24.
- **Evidence:** The cited page `https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api` contains no `ItemElementName`, no `/Date(`, no `DWSTOREDATETIME`, and no Decimal example. Its `DOCUMENT_DATE` sample is `"Item": "2020-01-01"`.
- **Why it matters:** `step-02.md` makes the cited public documentation the controlling source for fixture shape and requires approximated replay fields to be recorded in fixture metadata. The Step Review Notes require fixture shape to be traceable. The metadata currently claims documentation support that the cited source does not give. Reviewers are told this data is "modeled on public DocuWare Platform REST API documentation", so a false traceability claim is a credibility risk.
- **Upstream conflict:** `step-02.md` line 120 asserts that the public docs show `ItemElementName`. The Development Team followed the approved Step. The Moderator needs to decide which source controls.
- **Possible routes (for the Moderator and Tech Lead to choose; QA does not pick the fix):** (a) cite a public DocuWare source that does document `ItemElementName` and `/Date(ms)/` index values, or (b) mark `ItemElementName`, the `/Date(ms)/` date encoding, and the `Decimal` typing as approximations in the metadata and rename the test, or (c) change `DOCUMENT_DATE` to the ISO form of the cited sample. In every route, the Tech Lead corrects `step-02.md` line 120.

### QA-011 - Low (traceability): undocumented `d.` day prefix on workflow durations

- **Where:** `workflow-replay.fixture.ts` `timeSpan()` (lines 103–112); `docuware-replay.types.ts` lines 16–17; metadata note "WorkflowRuntimes rows use the documented fields and value formats".
- **Evidence:** The documented format is `00:00:34.6158214` only. Four fixture values exceed 24 h and use the `1.hh:mm:ss.fffffff` form: the `WorkflowRuntimes` runtime on 2026-09-07, 09-09, and 09-11, and the Approval `TaskExecutionTimes` value on 2026-09-09.
- **Note:** The .NET TimeSpan convention is a reasonable inference, but the metadata should record it as an approximation rather than call it documented.

### QA-012 - Low (copy accuracy): KPI card note "Pending replay data" is stale

- **Where:** `dashboard.component.html` line 56; the STEP-01 assertion at `dashboard.component.spec.ts` line 157 keeps the text in place.
- **Evidence:** The rendered page says "synthetic replay data is loaded" in the header, and the replay line shows 38 and 80 observations. All four KPI cards still say "Pending replay data".
- **Impact:** The page contradicts itself; it does not overclaim. The KPI values are pending CAV logic, not replay data. A-018 required the KPIs to stay "—" but did not address this note. Tech Lead disposition needed. This is a copy change and falls outside the PO-1 About exclusion.

### QA-013 - Low (terminology consistency): "Identity Slice" casing in UI copy

- **Where:** The replay line "across 6 Identity Slices", the STEP-01 filter label "Identity Slice (vendor / document type)", and the STEP-01 option "All identity slices".
- **Evidence:** The UI column in `domain-language.md` gives "Identity slice". The dashboard now uses both casings on one screen. A-018 kept the existing "Identity Slice" copy unchanged but did not reconcile it with the glossary.
- **Route:** The Tech Lead either updates the glossary UI column or schedules a copy alignment. AC3 is recorded as Pass with note because the canonical term is used and STEP-01 accepted the same casing.

### QA-014 - Info (fixture design, for STEP-03 planning): the workflow change shows in two Identity Slices

- A-018 asked for "one neutral change in behavior per stream, in one Identity Slice each". The document stream has one, in Alpha Office Supplies · Invoice, from 2026-08-31.
- The workflow change sits in the Approval step: reaction time roughly 45–60 min becomes 95–118 min, and duration roughly 247–305 min becomes 1310–1492 min, from 2026-09-04. Because runtime is the sum of task durations, the **Workflow runtime** slice also moves, from 294–347 min to 1353–1534 min. There is also one single-instance error exit on 2026-08-21.
- This is physically consistent, but a STEP-03 detector will see changes in two workflow slices. The Tech Lead should confirm this is intended before authoring STEP-03 expected outputs.

### QA-015 - Info (future Steps): source-kind handling is hard-coded to replay

- The `StreamSourceInfo.sourceKind` type is the literal `'replay'`. The dashboard template renders "Replay source: … synthetic …" without reading `sourceKind` or `synthetic`.
- A future BFF adapter would need an interface change, and until the template reads those fields, real data could be labeled "synthetic replay".
- A dashboard spec named "with a non-replay repository" (`dashboard.component.spec.ts` line 237) actually supplies `sourceKind: 'replay'`.
- None of this is a STEP-02 defect. It belongs in future adapter Step planning.

### QA-016 - Info (process / traceability)

- `roadmap.md` (STEP-02 row and R1, R3, R8, R9) still says the implementation plan approval is pending. A-018 recorded this as a Moderator or Tech Lead correction; it is still open.
- Commit `ddcde42` ("feat: add step 02 replay domain") bundles Development Team code with the Tech Lead's `review.md` and the Moderator's A-018 and A-020 register entries. As with QA-001, role artifacts are harder to trace when they share a commit.

---

## Regressions Or Risks

- No functional regressions were found. The STEP-01 specs pass, and the About view and shell are unchanged.
- Risk: the traceability gap in QA-010 and QA-011 is reviewer-visible, because the dashboard says the data is "modeled on public DocuWare … documentation".
- Risk: the stale KPI note in QA-012 is seen on the demo path. The Moderator confirmed a demo on 2026-09-28.

---

## Manual Checks Required

- **Moderator:** decide QA-010 route (a), (b), or (c), including the conflict between the Step and its cited source.
- **After rework:** a fresh QA session re-checks AC8 against the cited source, and AC9 if QA-011 is addressed.
- **Optional:** a visual review of the replay line at tablet width. QA checked 375 px and 1280 px only; the tablet breakpoint is still subject to QA-007.

---

## Known Limitations

- QA checked the public pages on 2026-09-25. DocuWare may change them later.
- QA did not check other public DocuWare sources (for example developer portal samples) that might document `ItemElementName` or `/Date(ms)/` index values. Only the sources cited in `step-02.md` and the fixture metadata were checked.
- The browser checks ran in headless Chromium only.

---

## Moderator Disposition

A-021 (2026-09-25) routes QA-010 to the Tech Lead for rework definition and the Step correction, and then to the Development Team. QA-011 to QA-016 are not yet dispositioned.

## Recommended Routing

Per MOD-W, QA does not implement fixes. Proposed route:

1. The Moderator records dispositions for QA-010 to QA-016 in the register.
2. The Tech Lead corrects `step-02.md` line 120 and writes the rework into `review.md`.
3. The Development Team plans the rework, the Moderator approves the plan, and the Development Team implements it.
4. The Tech Lead re-reviews.
5. A fresh QA session re-checks.

---

## Re-Check - QA-012 Rework

**Re-check date:** 2026-09-25  
**QA session:** A fresh Claude Code QA session. It did not plan, implement, or review the rework, and it edited only `qa.md`. It did not edit implementation files, `step-02.md`, `review.md`, or the register, and it did not commit.  
**Repository state reviewed:** `master` `09adf09`, clean working tree.  
**Delta checked:** `9ad49e1..09adf09`. The implementation change is Development Team commit `0fed7ba`. `2932e5d` is A-025, `02a80c3` is the Tech Lead re-review in `review.md`, and `09adf09` is A-026.  
**Tech Lead input:** `review.md` "QA-012 Re-Review", verdict "Pass for fresh QA re-check" with no findings.  
**Verdict:** **Pass.** QA-012 is resolved. No new findings.

This record is appended at the end of the file, as A-026 directs. The file header verdict (line 9) and the earlier records are left unchanged.

### Gate check

| Gate | Evidence | Result |
| --- | --- | --- |
| QA-012 disposition and rework routing | A-024 (committed in `9ad49e1`) | Present |
| Rework-plan approval before code | A-025 (`2932e5d`) | Present. `2932e5d` and `0fed7ba` share the commit time 08:11:51 +0200, the same pattern as QA-016. Commit order puts A-025 first. The timestamps alone cannot show that approval came before the code was written. |
| Tech Lead re-review acceptance before QA re-check | A-026 (`09adf09`, 08:16:32), after `02a80c3` (08:13:45) | Present and committed |

QA may proceed.

### Delta integrity

`git diff --stat 9ad49e1..HEAD` lists four files. Each commit touched only these files:

| Commit | Role | Files |
| --- | --- | --- |
| `2932e5d` | Moderator | `mod-w/validation/moderator-register.md` (+24, A-025) |
| `0fed7ba` | Development Team | `src/app/features/dashboard/dashboard.component.html` (1 line changed), `src/app/features/dashboard/dashboard.component.spec.ts` (+2 / −1) |
| `02a80c3` | Tech Lead | `review.md` (+38 / −2: header lines and the new "QA-012 Re-Review" section) |
| `09adf09` | Moderator | `mod-w/validation/moderator-register.md` (+36, A-026) |

- `0fed7ba` changes only the text of the `.kpi-note` element (`dashboard.component.html` line 56) and the assertion block at `dashboard.component.spec.ts` lines 157–158. The approved plan is copy only, and the diff is copy only.
- None of these paths changed in `9ad49e1..HEAD`: `src/app/features/about/`, `src/app/data/` (fixtures, mapper, repository), `src/app/domain/`, `src/testing/`, `app.ts`, `app.html`, `app.routes.ts`, the dashboard `.ts`, `.scss`, and facade. So there is no change to About files or About tests (PO-1), fixtures, calculations, Observed Baseline logic, sustained Divergence detection, filters, Evidence Trace, live DocuWare calls, or credentials.
- QA-013 casing is untouched. The replay line "Identity Slices" (line 45) and the filter option "All identity slices" (line 65) are not in the diff.

### Stale copy removal

| Search | Result |
| --- | --- |
| `grep -rn "Pending replay data" src/` | 1 match: `dashboard.component.spec.ts` line 158, the new `not.toContain` guard. No match in any template, component, or other runtime source. |
| Whole repo, excluding `node_modules`, `.git`, `.angular` | Also matches `qa.md`, `review.md`, the register (historical records), and `coverage/idp-align/app/features/dashboard/dashboard.component.html.html`. `coverage/` is generated, ignored by `.gitignore` line 36, and untracked, so it is not source. |
| `grep -rni "pending"` in non-spec `src` `.html` / `.ts` | 1 match: `dashboard.component.html` line 56, `Pending Divergence detection` |

### Copy accuracy of "Pending Divergence detection"

| Surface (`dashboard.component.html`) | Copy | Agreement with the KPI note |
| --- | --- | --- |
| Header, line 6 | "Dashboard foundation: synthetic replay data is loaded, but no Divergences are shown yet." | Agrees. Replay data is loaded, and the Divergence-derived KPIs are pending. The QA-012 contradiction is gone. |
| Replay source line, lines 44–46 | "… Observed Baselines and sustained Divergence detection are added in later Steps." | Agrees. It says detection is not yet present, and it sits directly above the KPI cards in the same panel. |
| Empty state, lines 86–88 | "No Divergences to show yet … once sustained Divergence detection is added in a later Step." | Agrees |
| KPI labels (`dashboard.component.ts` line 48) | "Total Divergences", "Ongoing", "Resolved", "Trend" | Each label depends on Divergence detection, so the note gives the correct dependency. |

- The note says the KPI values wait on detection. It states no count, status, or result, and the values stay "—", so it does not claim that detection is complete.
- "Divergence" matches the UI column in `mod-w/domain-language.md` line 21. The copy contains no avoid-term (alert, anomaly, violation, breach) and no reserved Level 3+ term. The copy also drops one user-facing use of "replay data", which the glossary marks "Not normally shown" (line 34).
- The KPI note leaves out "sustained", which the replay line and empty state use. The glossary defines a Divergence as sustained, so the meaning does not change. QA records this as an observation, not a defect.

### KPI placeholders and spec assertions

- `dashboard.component.html` line 55 still renders `—` with `aria-hidden="true"`. No binding or computed value was added.
- `dashboard.component.spec.ts` lines 151–160, "should not show computed-looking counts in either stream", loops over `document` and `workflow`. For each stream it asserts:
  - `not.toMatch(/\d/)` on the KPI section text (line 156, kept);
  - `toContain('Pending Divergence detection')` (line 157, new copy expected);
  - `not.toContain('Pending replay data')` (line 158, stale-copy guard).
- The digit check is also kept in "should keep the KPI placeholders and disabled filters alongside replay data" (line 206).
- The QA-006 claim guardrails (lines 212–235) run every `CLAIM_GUARDRAIL_PATTERNS` entry against the full rendered text of both streams, so the new note is covered. They pass.

### Automated results (Node.js v26.0.0 via fnm)

The shell default is Node v24.13.0. QA ran each command with `fnm exec --using=v26.0.0 … npm.cmd`, and `fnm exec --using=v26.0.0 node --version` printed `v26.0.0`.

| Command | Result |
| --- | --- |
| `npm run lint` | **Passed.** Exit 0. "All files pass linting." |
| `npm run build` | **Passed.** Exit 0. Initial total 256.96 kB raw / 73.46 kB transfer (the previous re-check recorded 73.45 kB). `dashboard-component` 10.87 kB and `about-component` 10.41 kB are unchanged. No warnings. |
| `npm test -- --watch=false` | **Passed.** Exit 0. Test Files 12 passed (12); Tests 158 passed (158). Vitest v4.1.11. The count is unchanged from the previous re-check because the rework adds an assertion, not a test. |

These results match A-026 (12 files, 158 tests). QA did not hit the sandbox `spawn EPERM` issue that the Tech Lead reported. The working tree was still clean after the runs.

### Acceptance checks affected by the rework

| # | Check | Previous | Re-check | Notes |
| --- | --- | --- | --- | --- |
| AC3 | Canonical terms in user-visible labels | Pass with note | **Pass with note** | The new copy uses "Divergence" canonically. The QA-013 casing note is unchanged and carried per A-024. |
| AC4 | No reserved Level 3+ terms | Pass | **Pass** | Guardrail specs pass on both streams. |
| AC12 | Dashboard-visible data is neutral and implies no completed CAV logic | Pass | **Pass** | The KPIs stay "—" with no digits, and the note says detection is pending. |
| AC13 | Dashboard guardrail tests | Pass | **Pass** | Unchanged patterns now cover the new copy. |
| AC16 | STEP-01 dashboard and About behavior intact | Pass (QA-012 note) | **Pass** | The QA-012 note is resolved. About is unchanged, and only the approved KPI note text changed. |
| AC17–AC19 | Lint / build / test under Node.js v26.0.0 | Pass | **Pass** | Re-run on `09adf09`; 12 files, 158 tests. |

All other acceptance checks keep their earlier results, because the delta does not touch them.

### Finding status

| Finding | Status |
| --- | --- |
| QA-012 (Low) | **Resolved.** The stale note is gone from source, the new copy agrees with the header, the replay line, and the empty state, and a regression guard is in place. |
| QA-013 to QA-016 | Unchanged. Dispositioned by A-024 and not touched by this rework. |

### New findings

None. The next free number is still QA-018.

### Regressions or risks

- No functional regressions. All 158 tests pass, and no rendering path other than the KPI note text changed.
- Residual risk (low): read alone, for example in a cropped screenshot, "Pending" could suggest detection that is queued or running. On the page, the replay line directly above says detection is "added in later Steps", and the empty state says the same, so QA does not rate this as an overclaim. The Moderator chose this copy in A-025.
- Process: the plan-approval and code commits share a timestamp (see Gate check). This is the same pattern as QA-016, which A-024 already accepted as a process note.

### Manual checks required

- **Visual check of the KPI card copy at desktop width (for example 1280 px).** The note is 28 characters, up from 19. The cards use `repeat(auto-fit, minmax(200px, 1fr))` (`dashboard.component.scss` lines 87–91), and `.kpi-note` (lines 112–116) does not set `nowrap`, so the text should wrap rather than overflow. QA did not check this in a browser.
- **Visual check at the 768 px breakpoint.** Confirm that the note wraps cleanly and that card heights stay aligned in both streams. The tablet breakpoint is still subject to QA-007.
- QA did not run the app in a browser in this session. The `ddcde42` browser evidence still applies to every region except the KPI note text.

### Known limitations

- QA checked the regression guard by reading the spec. It did not mutation-test the guard, because that would require editing implementation files.
- QA did not repeat the public-source checks, because the delta does not touch fixtures.

### Re-check conclusion

The QA-012 rework does what A-025 approved and nothing more. It changes one line of KPI note copy and the directly affected assertion. The stale "Pending replay data" copy is gone from dashboard source and guarded against. The KPIs stay "—" with no digits in either stream. The new "Pending Divergence detection" copy agrees with the rest of the page and claims no completed detection. Lint, build, and tests pass under Node.js v26.0.0. QA does not accept its own review; the Moderator records QA acceptance.

**Next:** The Moderator records QA acceptance of this re-check. The browser checks above are done or explicitly carried. Then the STEP-02 final gate follows.

MOD-W v5.0.1
