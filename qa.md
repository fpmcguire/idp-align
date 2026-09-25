# QA Review - STEP-02

**Project:** IDP-Align  
**Step:** STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures  
**QA date:** 2026-09-25  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files.  
**Repository state reviewed:** `master` `ddcde42`, clean working tree  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-02, verdict "Pass for QA"  
**Verdict:** **Fail.** One acceptance check (AC8) is not met: the document fixture traceability is wrong. All other checks pass, some with notes. The rework is small. See [QA-010](#qa-010---medium-traceability-document-fixture-claims-a-documented-shape-the-cited-source-does-not-show).

The STEP-01 QA record is preserved at tag `step-01` (`qa.md`).

---

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

MOD-W v5.0.1
