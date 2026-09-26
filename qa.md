# QA Review - STEP-08

**Project:** IDP-Align  
**Step:** STEP-08 - Quality Gate Completion And Documentation  
**QA date:** 2026-09-26  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, tests, `review.md`, `mod-w/roadmap.md`, or the Moderator Register. QA probes were written and run only in a scratch directory outside the repository.  
**Repository state reviewed:** `master` `12f1903` ("docs(step-08): accept tech lead review"), clean working tree before and after QA runs.  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-08, verdict "Pass for QA", accepted by the Moderator in A-063 (`12f1903`)  
**Verdict:** **Pass with notes.** All applicable acceptance checks pass. There are no blocking findings and no findings above Info. STEP-08 is ready for Product Owner review of the About/reference copy and `mod-w/docs/research-references.md`, and then for a Moderator final gate. QA does not mark STEP-08 complete and does not give Product Owner or Moderator approval.

The STEP-07 QA record is preserved in git at `273d66f` and `12f1903` (no `step-07` tag exists). `qa.md` at `12f1903` is the STEP-07 record.

---

## Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-060 | Present. Committed in `b389389`, before any STEP-08 implementation. |
| Implementation-plan approval | A-062 (after A-061 non-approval) | Present. Committed in `3095e05` (09:30:39) together with the plan and `review.md`, before the implementation commits `ae01eda` (09:30:51) and `64bd924` (09:31:04). See QA-034. |
| Tech Lead review acceptance before QA | A-063 | Present. Committed in `12f1903`. It accepts `review.md` "Pass for QA" with no Must Fix or Could Fix Later findings and authorizes QA. |

---

## Scope Of Review

`b389389..12f1903` changes 21 files:

- **Governance (Moderator/Tech Lead):** `mod-w/step-08-implementation-plan.md`, `mod-w/validation/moderator-register.md` (A-061, A-062, A-063), `review.md`.
- **Documentation:** `README.md`, `mod-w/docs/research-references.md` (new), `src/app/features/about/about.component.html`, `src/app/features/about/about.component.spec.ts`.
- **E2E:** `playwright.config.ts`; `e2e/example.spec.ts` deleted; new `e2e/support/{fixtures.ts, claim-text.ts, serve-dist.mjs}` and nine specs (`about`, `claim-guardrails`, `dashboard-document`, `dashboard-workflow`, `divergence-analysis`, `documentation`, `filters-sorting`, `responsive`, `stream-tabs-a11y`).

This matches the affected-files list in section 10 of the implementation plan exactly.

The following have **no diff** in `b389389..12f1903`: `src/app/domain/`, `src/app/data/` (including replay fixtures), `src/app/shared/`, `src/app/features/dashboard/`, `src/app/app.routes.ts`, `src/index.html`, `package.json`, `package-lock.json`, and `angular.json`.

**About spec changes:** the only removed assertion is `expect(dashboard).toContain('STEP-01 foundation')`. It is replaced by current-state assertions. Five tests are added: current-state wording, References links (PO-1), safe external links, and the reference boundary sentence. The overclaim-pattern and boundary-negation tests are unchanged. No spec was weakened.

---

## Automated Command Results (Node.js v26.0.0 via fnm)

All commands were run by QA as `fnm exec --using=v26.0.0 npm.cmd …` inside the sandbox. No outside-sandbox rerun was needed.

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | `v26.0.0` |
| `npm run lint` | **Passed.** "All files pass linting." Exit 0. |
| `npm run build` | **Passed.** No warnings. Initial total 266.65 kB raw / 76.41 kB transfer. Lazy `dashboard-component` 251.42 kB / 70.30 kB. `about-component` 11.24 kB / 3.22 kB (STEP-07: 10.41 kB; the increase is the References section and copy). Exit 0. Matches `review.md` exactly. |
| `npm test -- --watch=false` | **Passed.** 30 test files, 500 tests (STEP-07: 496; +4 net About tests: 5 added, 1 assertion replaced in place). Exit 0. Matches `review.md`. |
| `npm run test:e2e` | **Passed.** 42 tests, Chromium only, 2 workers, 52.1 s. Exit 0. Runs `npm run build && node e2e/support/serve-dist.mjs` and serves on `http://127.0.0.1:4300`. Matches `review.md` (42 tests). |
| `git diff --check b389389..64bd924` | Flags `review.md:3` and `review.md:6` for trailing whitespace. See QA-033. No other file is flagged. |

E2E test count per spec: `about` 3, `claim-guardrails` 7 (3 rendered and 4 synthetic controls), `dashboard-document` 3, `dashboard-workflow` 4, `divergence-analysis` 3, `documentation` 7, `filters-sorting` 6, `responsive` 6, `stream-tabs-a11y` 3. Total 42.

### QA-only independent probes (scratch directory, not committed)

| Probe | Result |
| --- | --- |
| **Guard negative controls.** A scratch Playwright config served the same `dist` on port 4301 and imported the committed guarded `test` from `e2e/support/fixtures.ts`. A clean control test, then three probes: a `fetch('https://example.com/…')`, a `console.error(…)`, and a `throw` inside `setTimeout`. | Clean control **passed**. All three probes **failed in fixture teardown** with the intended messages: `no external network requests` (received `https://example.com/qa-probe`), `no console or page errors` (received `console: qa-probe console error`), and `no console or page errors` (received `console: ERROR Error: qa-probe page error`). See QA-036. |
| **QA-029 condition.** Opened analysis for every Divergence in both streams at 1280, 1279, and 375 px, and measured the nearest overflow container of `analysis-table`. | `scrollWidth == clientWidth` in all 12 cases (1198/1198, 1197/1197, 309/309). The table does not scroll horizontally, so the QA-029 condition still does not occur. |
| **Source verification.** Fetched all 13 cited URLs in `mod-w/docs/research-references.md`. | All 13 were retrieved. Each page supports the stated relevance. See the R10 section. |

---

## Checks By QA Focus Area

### 1. E2E targets the local production build, not `playwright.dev`

- `playwright.config.ts`: `baseURL` is `http://127.0.0.1:4300`; `webServer.command` is `npm run build && node e2e/support/serve-dist.mjs`; `reuseExistingServer: false`; `retries: 0`; one `chromium` project; reporter `html` with `open: 'never'`.
- `e2e/support/serve-dist.mjs`: `node:http` only, no package. It binds `127.0.0.1`, serves `dist/idp-align/browser`, blocks path traversal (403), returns 404 for missing files that have an extension, and falls back to `index.html` for extensionless routes.
- `e2e/example.spec.ts` is deleted. `grep playwright.dev e2e/` finds nothing. The only `playwright.dev` string left is a documentation-comment URL in `playwright.config.ts:9`, which is not a test target.
- Chromium is the only engine, as A-062 approves. No cross-engine evidence was supplied; it is optional.

**Pass.**

### 2. Dashboard and About flow coverage

| Area | Evidence (spec › test) |
| --- | --- |
| Both streams load; KPIs | `dashboard-document` checks `/` redirects to `/dashboard`, the Document tab is selected, and KPIs are 1 / 1 / 0 / "1 of 6" / "—" (5 cards). `dashboard-workflow` checks KPIs 3 / 3 / 0 / "2 of 4" / "—" and that no Document KPI cards appear. |
| Accessible tabs | `stream-tabs-a11y` checks `tablist "Streams"`, `aria-selected`, roving `tabindex`, `aria-controls` → `stream-panel-*`, `aria-labelledby`, ArrowRight/ArrowLeft wrap, Home/End, and focus kept on the tab after a click. |
| Selection, detail, Observed Baseline, Evidence | Document: `aria-current`, detail Identity Slice and Dimension, baseline method, reference window, and sample size, 4 Evidence items with time, value, and source, and the baseline indicator. Workflow: 3 cards in onset order, single `aria-current`, 6 Evidence items, and Step and Decision agent context fields. |
| Filters, sorting, hidden, filtered-empty, clear | `filters-sorting`: Identity Slice and Status filters, KPI unchanged under filters, Time range note and `aria-describedby`, sort by Dimension and back to onset, hidden selection (`detail-hidden`, no `aria-current`) restored by Clear filters, Document filtered-empty, Clear filters `aria-disabled` and focus, and per-stream filter/sort state in both directions. |
| Stream independence | `dashboard-workflow` › "keeps each stream's selection and filters out of the other stream". |
| Analysis open/back and focus | `divergence-analysis`: focus moves to the "Divergence Analysis" heading, the list is removed, the canvas has non-zero size, 4 table rows, Back returns focus to `open-analysis`. |
| Workflow Approval metric switching | Toggle group "Dimension", `aria-pressed` swaps, caption changes Task duration → Response time, `data-divergence-id` contains `:response-time:`, 6 rows, and the selected metric carries over to list and detail after Back. |
| Stream-switch closure | Analysis closes on tab switch, focus stays on the tab, and analysis is not open on return. |
| 1280 / 1279 / 375 px | `responsive`: side by side at 1280 (both streams), stacked at 1279 (both streams), all regions and analysis at 375, About at 375, and no page-level horizontal scroll at all three widths including analysis. |
| About navigation | `about` › reachable from the Primary nav with `aria-current="page"`, and returns to the Dashboard. |

**Pass.**

### 3. Guardrails for external requests, console errors, and page errors; About link safety

- `e2e/support/fixtures.ts` routes `**/*`. It aborts and records any request whose origin is not the app origin (except `data:` and `blob:`). It records `console` errors and `pageerror`, and asserts both lists are empty after every test. Every browser spec imports this `test`. `documentation.spec.ts` uses the base `test` but opens no page.
- QA probes confirm the guard fails a test for an external request, a console error, and an uncaught error. See QA-036.
- `about.spec.ts` checks that References has exactly two links with the expected text and `href`, and that every `a[href^="http"]` on About (3 links, including the CAV repository) has `target="_blank"` and `rel` containing `noopener` and `noreferrer`. No link is clicked, so no external navigation happens.
- The E2E run passed with no guard failures.

**Pass.**

### 4. About (PO-1) and README

- **PO-1:** `about.component.html` adds `<section data-testid="about-references">` with links to `…/default-web-service-docuware-platform-api` and `…/workflow-analytics-api`, both with `target="_blank" rel="noopener noreferrer"`. A `data-boundary` sentence says the links imply no DocuWare review or endorsement.
- **Current-state copy:** exactly the four statements routed in section 4 of the plan are changed ("will be modeled" → "is modeled"; the STEP-01 foundation paragraph; "Domain (planned)"; "Data (planned)"), plus the new References section. No other About text changed. The new copy is accurate against the implemented app: detection, per-stream Observed Baselines, KPIs, filters and sorting, list and detail, Evidence Trace, analysis chart, shared presentational components, and a replay adapter as the only adapter. It makes no live-access or production claim.
- **README:** "dashboard foundation" → "dashboard", "two planned streams" → "two independent streams", "Current Step" (STEP-01) → "Current State", updated MOD-W artifact pointers, and added `lint` and `test:e2e` commands with an E2E note. The new copy says "does not connect to any DocuWare system" and "It is not production software". A claim-term scan of README finds only pre-existing negations ("not affiliated with, reviewed by, or endorsed by"; "not a judgment of failure, defect, or non-conformance"). This is within A-062 and adds no CAV claim.

**Pass.** Product Owner review of this copy is still required.

### 5. `mod-w/docs/research-references.md`

- **Retrieved and read:** QA fetched all 13 cited URLs on 2026-09-26. Every page was reachable, and every stated relevance matches the page:
  - AI Hub: "global AI research and development center"; focus on "intelligent document processing".
  - IDP introduction: splitting, classification, and extraction of "invoice number … vendor name … total amount" into index fields.
  - Platform API: "Access your file cabinets and documents …", with Route/Path, Command, and HTTP body (sample).
  - Workflow Analytics API: instance duration and status (Running, Completed, Failed, Stopped), task durations, the decision and the user who chose it, and assigned-to-picked-up time.
  - Purchase-to-Pay: requisitions, invoice capture, "reconciles data between invoices, quotes, delivery notes", and approval routing.
  - Invoice processing: receipt, capture/indexing, verification, and rules-based routing.
  - Evidently: current vs reference, with a method "chosen automatically based on the column type".
  - Arize: "Drift is measured using a reference data set"; "the most impactful features degrading your model".
  - Soda: monitors that "track key data quality metrics over time", anomaly detection on historical patterns, and alerts.
  - River ADWIN: sub-window comparison, significance δ, citing Bifet and Gavaldà (2007).
  - River PageHinkley: CUSUM control chart, up/down/both mode, and a minimum number of instances.
  - CAV repository: "CAV Manifesto v1.0 is the current canonical public definition"; L1 is Observed-State Divergence.
  - MOD-W repository: Moderator, Product Owner, Tech Lead, Development Team, and QA roles with gated Steps.
- **Relevance and limits:** every row has "How it informed IDP-Align scope" and "Limits of the claim". Adjacent tools are framed as prior art. Their terms (anomaly, alert, drift detected, degrading) appear only in Limits cells as those tools' terms, and a boundary bullet says so.
- **Omitted candidates:** the "Candidates Not Cited" section lists the ACM survey (HTTP 403), NannyML (not fetched), the DocuWare developer portal (not fetched), and `docs/design-api-summary.md` (advisory, not a source). "Unrecorded Pre-Build Research" does not reconstruct the 2026-09-16/17 sources.
- **No implied access, endorsement, confidentiality, readiness, or defect/gap:** all seven boundary bullets are negations (checked by `documentation.spec.ts`). QA read the full document and found no statement implying private access, endorsement, confidential information, production readiness, or a DocuWare defect or gap. The Status line correctly says it is a draft awaiting Product Owner review.

**Pass.**

### 6. CAV Level 1 guardrails across UI, About, README, docs, and E2E

- `claim-guardrails.spec.ts` scans the rendered `main` text of About and of every Divergence in both streams, with analysis closed and open. It uses `CLAIM_GUARDRAIL_PATTERNS` (endorsement, private access, production readiness, defect/gap, Levels 2–6, Attribution/root cause, certification, business judgment, reserved Level 3+ terms, alert/anomaly), `SEVERITY_RISK_PATTERN`, cross-stream/reconcile/correlate, baseline-as-target, and `FAIL_WORDING`. All pass.
- Boundary removal is limited to `[data-boundary]`. QA confirmed that no dashboard or shared template has `data-boundary`, so all dashboard copy is scanned. Only About's negation paragraphs are excluded, as in the existing About spec.
- **Instance state:** `claim-text.ts` removes an Evidence context field only when its `dt` is exactly "Instance state" and its `dd` is exactly one of Completed, Running, Failed, or Stopped. The rendered runtime Divergence shows only `Instance state: Completed` (`dashboard-workflow.spec.ts:49`, `claim-guardrails.spec.ts:62`). No test requires "Failed" to render. Synthetic controls accept `Instance state: Failed`, and reject "Divergence failure", `Instance state: failure of approval`, and `Approval outcome: Failed`. This matches A-059, A-060, and A-062. See QA-035.
- README and the research doc: see sections 4 and 5. E2E copy uses canonical terms only.

**Pass.**

### 7. `src/testing` helpers only in tests and E2E

`grep` for imports of `testing/` in non-spec `.ts` under `src/` finds none. The only importers are `*.spec.ts` files and `e2e/claim-guardrails.spec.ts` and `e2e/documentation.spec.ts`. **Pass.**

### 8. No unapproved changes

No diff to fixtures or data, domain or detectors, baselines, dashboard or shared UI production code, packages, `angular.json`, routes, or `index.html`. No backend, proxy, connector, live access, credentials, OAuth, user action, Attribution, or cross-stream reconciliation code or copy is added. `grep fixture` in non-spec `src/app/features` and `src/app/shared` finds nothing. **Pass.**

### 9. QA-028, QA-029, and categorical workflow behavior

- **QA-028** (uneven duration tick values): not reopened. No chart code changed, so it remains an accepted Info-level carry-forward note.
- **QA-029** (non-focusable table scroll container): not reopened. The QA probe shows the analysis table does not scroll horizontally at 1280, 1279, or 375 px, so the condition still does not occur. It remains an accepted latent note.
- **Categorical workflow behavior** remains **spec-covered only**. No categorical fixture was added and nothing was made browser-visible. Section 3 of the implementation plan and `review.md` record this, and the STEP-07 component specs that cover it are unchanged and passing.

**Pass.**

### 10. `review.md` trailing spaces

The two flagged lines are intentional Markdown hard breaks. See QA-033. **No cleanup routed.**

---

## Acceptance Check Results (`mod-w/step-08.md`)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| AC1 | Register has the STEP-08 Step approval before briefing | Pass | A-060, committed in `b389389`. |
| AC2 | Separate plan approval before any code/doc change | Pass with note | A-062 in `3095e05`, committed before `ae01eda` and `64bd924`. See QA-034. |
| AC3 | Limited to approved R10/R11 scope | Pass | 21 changed files match plan section 10. See Scope Of Review. |
| AC4 | Starter tests removed; no dependency on external starter sites | Pass | `example.spec.ts` deleted; no `playwright.dev` target. |
| AC5 | `test:e2e` runs against the local app | Pass | `webServer` builds and serves `dist` on `127.0.0.1:4300`; 42 passed. |
| AC6 | Initial load, Document KPI/list/detail/Evidence, About navigation | Pass | `dashboard-document` (3), `about` › navigation. |
| AC7 | Workflow KPI/list/detail/Evidence, tab a11y, no cross-stream contamination | Pass | `dashboard-workflow` (4), `stream-tabs-a11y` (3). |
| AC8 | Filters, sorting, hidden, filtered-empty, clear, per-stream state | Pass | `filters-sorting` (6): Workflow and Document. |
| AC9 | Analysis open/back, focus, metric switch, chart, stream-switch closure | Pass | `divergence-analysis` (3). |
| AC10 | 1280 / 1279 / 375 px | Pass | `responsive` (6). |
| AC11 | No console errors or unexpected external requests | Pass | Guarded fixture on every browser test; QA negative controls prove it fails (QA-036). |
| AC12 | CAV domain and dashboard unit tests pass and are not weakened | Pass | 500 passed; only one About assertion replaced with stronger current-state checks. |
| AC13 | STEP-05 to STEP-07 behavior covered with no regression | Pass | Unit/component suite unchanged and passing (including loading, unavailable, and retry); E2E adds browser coverage of filters, tabs, analysis, metric switch, and breakpoints. |
| AC14 | About References links the two DocuWare API pages | Pass | `about-references`; unit and E2E. |
| AC15 | Safe external-link attributes | Pass | All 3 external links: `_blank` and `noopener noreferrer`. |
| AC16 | No "planned" / "later Steps" current-state copy | Pass | Four statements replaced; stale phrases absent (unit and E2E). |
| AC17 | Docs cite public sources without implied access, endorsement, confidentiality, readiness, or defect | Pass | 13 sources verified by QA fetch; boundary section. |
| AC18 | Durable `mod-w/docs/` artifact covering the R10 topics, relevance, and bounded framing | Pass | `research-references.md`, 7 topics; `documentation.spec.ts` (7). |
| AC19 | Docs imply no private access, endorsement, confidential info, readiness, or defect/gap | Pass | Full read by QA; negation-only boundaries. |
| AC20 | Only CAV Level 1 claimed as implemented | Pass | Rendered guardrail scan; README and research-doc read. |
| AC21 | Observed Baseline not a target, intent, policy, requirement, or truth | Pass | `baselineAsTarget` plus existing specs; README wording unchanged. |
| AC22 | Divergence not an alert, anomaly, …, or root cause | Pass | Pattern set in `claim-guardrails.spec.ts`; all pass. |
| AC23 | Workflow context stays factual, no Attribution | Pass | Instance state context rule and `attribution` pattern. See QA-035. |
| AC24 | No cross-stream, Level 2+, Intent, Delta, Envelope, Breach, Velocity, Convergence, or Attribution | Pass | `crossStream`, `higherCavLevels`, and `reservedTerms` patterns; static read. |
| AC25 | Categorical workflow remains spec-covered only | Pass | No fixture change; limitation recorded. |
| AC26 | QA-028 / QA-029 stay non-blocking carry-forward notes | Pass | Not routed; QA-029 condition absent (probe). |
| AC27 | No fixture, algorithm, dependency, live-access, or other forbidden change | Pass | Empty diff on all listed paths. |
| AC28 | Shared UI remains presentational | Pass | No diff under `src/app/shared`. |
| AC29 | Dashboard uses the facade/repository boundary with no direct fixture import | Pass | No diff under `features/dashboard`; fixture grep empty. |
| AC30 | `npm run lint` passes (Node v26.0.0) | Pass | Run by QA. |
| AC31 | `npm run build` passes (Node v26.0.0) | Pass | Run by QA. |
| AC32 | `npm test -- --watch=false` passes (Node v26.0.0) | Pass | 30 files, 500 tests. |
| AC33 | `npm run test:e2e` passes (Node v26.0.0) with STEP-08 evidence | Pass | 42 Chromium tests, 52.1 s. |
| AC34 | Handoff lists files, E2E/doc changes, carry-forwards, and verification | Pass | `review.md` Verification and Review Notes; plan sections 9-11. |
| AC35 | Tech Lead review done and accepted before QA | Pass | `review.md`; A-063 in `12f1903`. |
| AC36 | QA review done in `qa.md` before the final gate is requested | Pass | This document. |
| AC37 | Product Owner review after QA, before the final gate | Not applicable to QA (pending) | Must follow this QA review. It covers the About/reference copy and `research-references.md` (A-062, A-063). |

### Design ID check

DS-001 through DS-010 and DS-013 through DS-015 are covered by the E2E specs as mapped in section 3 of the plan and in section 2 above. DS-011 is covered by browser filtered-empty and unit empty states. DS-012 (loading, unavailable, and retry) and DS-006/DS-013/DS-014 edge cases stay covered by the unchanged component specs, because current replay data cannot produce them in the browser. No production UI changed, so no Design ID regressed.

---

## Findings

No Blocker, Major, or Minor findings. No rework is routed to the Tech Lead.

### QA-033 - Info (formatting): `review.md` trailing spaces are intentional Markdown hard breaks

`git diff --check b389389..64bd924` flags `review.md:3` and `review.md:6`. Lines 3-6 of `review.md` (Step, Review date, Reviewer, Implementation package) all end with exactly two spaces. Line 7 (Verdict), the last line of the block, does not. Only lines 3 and 6 are flagged, because lines 4 and 5 are unchanged from the STEP-07 `review.md`, which uses the same two-space pattern. The STEP-07 `qa.md` header uses the same convention. The pattern forces line breaks in the rendered metadata block. **Disposition:** intentional. No cleanup is needed and nothing is routed.

### QA-034 - Info (process / traceability): plan approval and the Tech Lead plan review are committed with the implementation batch

A-061, A-062, the plan, and `review.md` were committed in `3095e05` 12 seconds before the implementation commits. So git order is correct, but git alone cannot show that approval came before the work was written. The register text records the sequence. A-062 also cites a "Tech Lead Review - STEP-08 Implementation Plan" in `review.md`. That plan review was never committed: `3095e05` already contains the implementation review, so the plan review exists only as the TL-PLAN-01 references in the plan and register. This is the same pattern as QA-030 (STEP-06) and QA-032 (STEP-07). It does not affect the implementation. **Disposition:** Moderator awareness only; no rework.

### QA-035 - Info (test design): E2E pins runtime Instance state to "Completed"

`claim-guardrails.spec.ts:62` asserts that the set of Instance state fields equals exactly `{'Instance state: Completed'}`, and `dashboard-workflow.spec.ts:49` asserts the first value is "Completed". Neither requires "Failed" to render, as A-062 requires. They snapshot the current fixed replay data, so a future, separately approved fixture change that made "Failed" visible would need these assertions updated, even though "Failed" is an accepted source-state value. The contextual allow rule is independently proven by the synthetic controls. **Disposition:** acceptable as written; no rework.

### QA-036 - Info (test coverage): the E2E guard has no committed negative control

The suite proves the guard passes clean flows but has no committed test proving it fails. QA confirmed independently, outside the repository, that it fails for an external `fetch`, a `console.error`, and an uncaught error. Inside the Angular app, an uncaught error thrown in a zone task reaches the guard through Angular's `ErrorHandler` as a console error rather than as `pageerror`. Either path fails the test. **Disposition:** the acceptance check is met; no rework.

### Carry-forward notes (not reopened)

- **QA-028** (uneven duration tick values): accepted Info-level polish note. No chart code changed in STEP-08.
- **QA-029** (non-focusable table scroll container): accepted latent accessibility note. The QA probe confirms the table does not scroll horizontally at 1280, 1279, or 375 px.
- **QA-031** ("Failed" source-state label): handled as A-059 and A-062 require. Not browser-visible; accepted if present under "Instance state" only.
- QA-014, QA-019, and QA-024 (day-scale duration precision) are unchanged. QA-027, QA-030, and QA-032 remain process notes.

---

## Regressions Or Risks

- **No regressions found.** No production dashboard, shared UI, domain, or data code changed. Unit tests went from 496 to 500 and the build output is unchanged except for the About chunk.
- **E2E is tied to current replay values** (KPI numbers, card order, "Completed"). This is intended for a deterministic gate. Any future approved fixture change must update the E2E specs.
- **`test:e2e` rebuilds before serving** (about 7 s build plus about 45 s tests). This is accepted in the plan.
- **External reference URLs can move.** Both DocuWare pages were live on 2026-09-26. The E2E checks attributes only and does not detect link rot.

---

## Manual Checks Required

- **Product Owner (required before the final gate, A-062/A-063):** review the About References section, the four replaced About statements, and `mod-w/docs/research-references.md` (source choice, relevance wording, Limits cells that quote adjacent tools' terms, and the unrecorded pre-build research note). QA verified accuracy and boundaries; wording approval belongs to the Product Owner.
- **Moderator:** note QA-033 to QA-036 (Info, no rework), record QA acceptance, then run the STEP-08 final gate after Product Owner review.
- Optional, not required by A-062: cross-engine (Firefox/WebKit) E2E evidence.

---

## Known Limitations

- **Categorical workflow behavior is spec-covered only.** Replay data exposes only numeric workflow Divergences (Task duration, Response time, Workflow runtime). Categorical Decision or route outcome and Error exit rendering are covered by component specs with the test-only builder. STEP-08 did not change this and was not authorized to.
- **Loading, unavailable, and retry states, resolved-status Divergences, and "Instance state: Failed"** cannot occur in the browser with current replay data. They are component/spec-covered only.
- **QA-028 and QA-029** remain accepted non-blocking notes.
- **Chromium only.** Other engines were not run.
- **Research sources** reflect pages as retrieved on 2026-09-26. The original 2026-09-16/17 research sources are unrecorded, as the artifact states.

---

MOD-W v5.0.1
