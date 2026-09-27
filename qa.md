# QA Review - STEP-09

**Project:** IDP-Align  
**Step:** STEP-09 - Population-Specific Divergence Scenario (initial scenario: Supplier Invoice Population Divergence)  
**QA date:** 2026-09-27  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, tests, `review.md`, `mod-w/roadmap.md`, `mod-w/step-09.md`, or the Moderator Register. QA probes were written and run only in the session scratch directory outside the repository. A temporary git worktree for the parent-commit baseline was created in the scratch directory and removed afterwards.  
**Repository state reviewed:** `master` `538ae62` ("feat: add population-specific divergence scenario"). The working tree was clean before and after the QA runs.  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-09, verdict "Hold for Moderator decision before QA". The Moderator accepted it for QA in A-073, with TL-STEP09-001 made a QA-review condition.

**Verdict:** **Blocked for final acceptance, on one acceptance check only.** The STEP-09 behavior itself is **Pass with notes**. All required scenario behaviors, guardrails, architecture boundaries, lint, build, and unit/component tests pass. The acceptance check "`npm run test:e2e` passes under the project-approved Node.js version" is **not met**. Two E2E tests fail. QA reproduced both at `538ae62` and at the STEP-09 parent commit `0d94e20`. STEP-09 adds no new failure, and both failures are outside STEP-09 scope (QA-STEP09-001). QA does not round this check up to Pass. The Moderator must decide on a separately approved narrow cleanup or an explicit acceptance before the final gate. One Medium claim-boundary note (QA-STEP09-002) is referred to Product Owner review.

The STEP-08 QA record that this file replaces is preserved in git (`qa.md` at `538ae62` and earlier).

---

## 1. Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-071 | Present. Committed in `4d326a3`. |
| Implementation-plan approval before code | A-072 | Present. Committed in `0d94e20`, before implementation commit `538ae62`. |
| Tech Lead review accepted before QA | A-073 | Present, in `538ae62` together with the implementation and `review.md`. It authorizes QA and makes TL-STEP09-001 a QA-review condition. It does not waive the final quality gate. |

Note: A-073's "next authorized action" says to commit the implementation package, and QA may begin after that commit. `538ae62` contains the A-073 entry, `review.md`, and the implementation together. QA takes that commit as the authorized QA start point.

---

## 2. Scope Reviewed

### Commit and artifacts

- Commit `538ae62`: 24 files, +1152/-114.
- `mod-w/step-09.md`, `mod-w/validation/moderator-register.md` (A-071, A-072, A-073), `review.md`, `mod-w/domain-language.md`, and the Development Team handoff as summarized in A-073 and `review.md`.
- Changed production files:
  - `src/app/data/replay/fixtures/document-replay.fixture.ts`
  - `src/app/features/dashboard/{dashboard.facade.ts, dashboard.component.ts, dashboard.component.html, identity-slice-states.ts}`
  - `src/app/shared/ui/identity-slice-states/*` (model, `IdentitySliceStatesComponent`, `PopulationSummaryComponent`, and their templates and styles)
- Changed tests:
  - `replay-fixtures.spec.ts`, `replay-divergence-detection.spec.ts`, `replay-stream-observation.repository.spec.ts`
  - `dashboard.component.spec.ts`, `dashboard.facade.spec.ts`, `identity-slice-states.spec.ts`
  - the two shared-component specs
  - `e2e/population-divergence.spec.ts` (new) and `e2e/dashboard-document.spec.ts` (KPI `1 of 6` changed to `1 of 8`)

### Must-be-unchanged boundary (A-072)

`git diff 538ae62~1 538ae62` shows **no change** to `README.md`, `src/app/features/about/`, `src/app/domain/` (detector, thresholds, reference-window and baseline semantics, dimensions), `src/app/data/replay/*mapper*`, the workflow replay fixture, `package.json`, `package-lock.json`, or `mod-w/roadmap.md`. `git diff --check` for the commit is clean.

### Commands (Node.js v26.0.0 via `fnm exec --using=v26.0.0 npm.cmd ...`)

| Command | Result |
| --- | --- |
| `node --version` | `v26.0.0` |
| `npm run lint` | **Pass.** "All files pass linting." Exit 0. |
| `npm run build` | **Pass.** Initial total 267.38 kB raw / 76.58 kB transfer. Exit 0. |
| `npm test -- --watch=false` | **Pass.** 33 test files, 541 tests. Exit 0. Matches the Development Team report. |
| `npm run test:e2e` at `538ae62` | **Fail.** 44 passed, 2 failed, exit 1. The failures are `about.spec.ts:22` and `documentation.spec.ts:89`. All 4 new `population-divergence.spec.ts` tests pass, and so do `dashboard-document`, `dashboard-workflow`, `divergence-analysis`, `filters-sorting`, `responsive`, `stream-tabs-a11y`, and `claim-guardrails`. |
| `npm run test:e2e` at parent `0d94e20` (scratch worktree) | **Fail.** 40 passed, the **same 2** failed. STEP-09 adds 4 E2E tests, all passing, and introduces no new failure. |

### Browser / E2E evidence (QA-only scratch probes)

A scratch Playwright config served the committed `dist` build on `127.0.0.1:4301` (Chromium, 1280x720 unless stated). It swept the rendered Document, Workflow, and About pages. The results are cited per check below. One probe errored because QA used a wrong test ID (`stream-source-info`); it was corrected and re-run. That was a probe defect, not a product defect. No console or page errors were recorded on the Document stream.

---

## 3. Findings

### QA-STEP09-001 - E2E gate is red. Two pre-existing failures are outside STEP-09 scope.

- **Severity:** High (gate). This is an unmet STEP-09 acceptance check, not a STEP-09 defect.
- **Location:** `e2e/about.spec.ts:22` (assertion at line 36) and `e2e/documentation.spec.ts:89`.
- **Reproduction:** `fnm exec --using=v26.0.0 npm.cmd run test:e2e` at `538ae62`, and the same at `0d94e20`.
- **Expected:** `npm run test:e2e` passes (STEP-09 acceptance check, not waived by A-073).
- **Actual:**
  1. `about.spec.ts:22` expects `a[href^="http"]` to have count 3 and receives 5. The About page gained the repository and author links in `f713989` ("docs: add About repository and author links"), after the STEP-08 final gate (`90b6526`, 42/42 E2E pass). The spec stops at the count assertion, so its `target`/`rel` loop never runs. QA checked all 5 links directly: each has `target="_blank"` and `rel="noopener noreferrer"`. No unsafe link is present.
  2. `documentation.spec.ts:89` flags the endorsement pattern `/...|official|.../i` in the relevance cell of the "Case Study: Sport Auto Plus GmbH" row of `mod-w/docs/research-references.md`. The matched text is "Describes official notices for minor traffic offences...". That row was added in `d97d010` (A-070 research evidence). In context "official" describes authority-issued notices, not an endorsement claim, so this is a pattern false positive. The cell is still IDP-Align relevance copy that the guardrail scans.
- **Scope:** Outside STEP-09. `538ae62` touches neither the About component, `research-references.md`, nor either spec, and both failures reproduce at the parent commit.
- **Should it block final acceptance?** Yes, until the Moderator records a disposition. Leaving the gate red would also hide any future E2E regression behind two known failures.
- **Recommended disposition:** a **separate, narrow, Moderator-approved cleanup before the STEP-09 final gate**, routed Tech Lead -> Development Team and outside STEP-09 scope. QA does not prescribe the fix, but notes two points:
  - (a) the About link count is a stale test expectation for an intentional content change;
  - (b) the documentation match needs a content or guardrail decision, either rewording the approved research-reference cell (A-070 content, so Product Owner/Moderator input applies) or narrowing the pattern.

  The alternative is explicit Moderator acceptance of the red gate in the register. After any cleanup, QA should re-run `npm run test:e2e`.

### QA-STEP09-002 - The Credit note population summary does not show that no Credit note Identity Slice has an Observed Baseline.

- **Severity:** Medium (claim boundary, wording). Referred to Product Owner review.
- **Location:** `src/app/shared/ui/identity-slice-states/population-summary.component.ts` (line text) and `dashboard.component.html:71-73` (placement). Rendered: Document stream, above the filter bar.
- **Reproduction:** Open `/dashboard` -> Document stream. Read the population summary, then scroll to "Identity Slice states". Optionally filter to any "- Credit note" Identity Slice.
- **Expected (QA focus item 6):** Credit-note populations communicate "No Observed Baseline", not "No Divergence" or an equivalent conflation.
- **Actual:**
  - The per-Identity-Slice table is correct. All three Credit note rows show 2 reference observations (below `minReferenceSampleSize: 4`), "0 of 4 dimensions", and "No Observed Baseline".
  - The population summary reads "Credit note: 3 Identity Slices observed / 0 with surfaced Divergence". That has the same form as the Invoice line, where every Identity Slice was actually compared. It is literally accurate, but a reader can take "0 with surfaced Divergence" to mean the Credit note populations were compared and did not diverge.
  - At 1280x720 the summary sits at about y=603 (first screen), and the "No Observed Baseline" rows sit at about y=2273, roughly three screens lower.
  - Filtering to a Credit note Identity Slice shows the same "No matching Divergences" empty state as filtering to a compared peer invoice population.
- **Recommended disposition:** the Product Owner review already required by A-072 should decide whether this wording is acceptable. If a change is wanted, route it Tech Lead -> Development Team. QA does not treat this as blocking on its own, because no rendered text is false and the per-Identity-Slice state is exact.

### QA-STEP09-003 - Gamma x Invoice could not surface a sustained Divergence because it has too few compared observations.

- **Severity:** Low (demo-narrative note, not a defect).
- **Location:** `document-replay.fixture.ts` (pre-existing Gamma invoice records, unchanged per A-072) and the Identity Slice states table.
- **Reproduction:** Document stream -> Identity Slice states -> Gamma Facilities Care (synthetic) - Invoice row.
- **Expected:** Peers do not surface the same Divergence (met).
- **Actual:**
  - Gamma shows 4 reference and **2** compared observations. That is below `minConsecutiveObservations: 3` (`divergence-detection.ts:25`), so Gamma's "No surfaced Divergence" state would hold whatever its compared values were.
  - Its compared values are inside its own Observed Baseline, which `replay-divergence-detection.spec.ts` asserts for every peer.
  - Beta has exactly 3 compared observations, the minimum.
  - The "enough compared observations" test covers only Delta and Epsilon.
  - The compared-observations column shows the count, but not what it implies.
- **Recommended disposition:** no change required. A-072 keeps existing records unchanged. The Product Owner may want to know this before using Gamma as a demo peer. Delta and Epsilon are the strongest peer examples.

### QA-STEP09-004 - Tech Lead's TL-STEP09-002 is confirmed as consistent today.

- **Severity:** Info.
- **Location:** `src/app/features/dashboard/identity-slice-states.ts` (`comparedObservationCount`).
- **Actual:** It uses `observedAt >= referenceWindow.to` and `isInReferenceWindow`, which match the detector split at `divergence-detection.ts:57-59` exactly. The rendered counts match the fixture (Alpha 8/4, Beta 5/3, Delta 6/4, Epsilon 6/4, Gamma 4/2).
- **Recommended disposition:** agree with the Tech Lead's "could fix later". Nothing is needed for STEP-09.

---

## 4. STEP-09 Validation Results

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Population summary | **Pass** | Rendered: "Invoice: 5 Identity Slices observed / 1 with surfaced Divergence" and "Credit note: 3 Identity Slices observed / 0 with surfaced Divergence". The list is a `<ul aria-label="Identity Slices per population">`. Counts are computed from detector output in `toPopulationSummaries`. The Credit note wording is QA-STEP09-002. |
| 2 | Alpha is the only Invoice population with a surfaced Divergence | **Pass** | One Divergence card in the Document stream: Alpha Office Supplies (synthetic) - Invoice, Amount, Ongoing. Magnitude +659.65 (+54.1%, +28.6 SD). Onset 31 Aug 2026, duration 10 d 0 h. KPI "Identity Slices with Divergences 1 of 8". The unit test asserts `divergences.length === 1`, on `[ALPHA_INVOICE, 'amount-value']`. |
| 3 | Beta, Delta, Epsilon, and Gamma Invoice surface no Divergence | **Pass** | Each row shows "No surfaced Divergence" with 4 of 4 dimension baselines. The unit test asserts each peer's compared amounts are inside its own baseline. The four amount-baseline means are distinct. See QA-STEP09-003 on Gamma. |
| 4 | Alpha Evidence and Divergence Analysis | **Pass** | The Evidence Trace lists 4 items, oldest first, with observation IDs `document/1024`, `1027`, `1030`, `1035` and sources `docuware-platform-rest-api / Document / 10xx`. The accepted Alpha Evidence IDs are preserved. All 4 items are "Outside Observed Baseline". The Baseline Reference Panel shows 8 reference observations, mean 1,218.65, SD 23.09, range 1,149.38 to 1,287.92, and reference window 3 Aug to 31 Aug 2026 (end exclusive). Analysis opens, the chart canvas is visible with `role="img"` and a descriptive `aria-label`, and the table has 4 rows matching the Evidence. The unit test reconstructs each item from source observations. |
| 5 | Peer filters: no-matching state without judgment | **Pass** | For each peer the page shows "Showing 0 of 1 Divergence" and "No matching Divergences -- No Divergences in the Document stream match the current filters. 1 Divergence is hidden. Use Clear filters to show them." The detail pane says "No Divergence to show under the current filters." No claim-pattern hits (stable, normal, healthy, correct, and similar). The summary stays unfiltered. |
| 6 | Credit note: "No Observed Baseline", not conflated | **Pass with note** | All 3 Credit note rows show "No Observed Baseline" and "0 of 4 dimensions" (2 reference observations each, below the minimum sample size of 4). The population-summary line is QA-STEP09-002, referred to Product Owner. |
| 7 | CAV Level 1 only | **Pass** | A rendered sweep of Document and Workflow `main` for cause/causal, root-cause, risk, severity, alert, anomaly, fail, defect, violation, non-conformance, intent/Declared Intention, blame, Attribution, remediation, breach, drift, Level 2+, stable/stability, normal, healthy, and correct found only the boundary negation "...do not assess business correctness." The Identity Slice states note says a state "describes one Identity Slice, not the stream as a whole", and no aggregate-stability claim appears. The E2E test `keeps population copy factual in both streams` passes. |
| 8 | Real-customer name and data guardrails | **Pass** | Supplier names are Alpha, Beta, Gamma, Delta, and Epsilon, each suffixed "(synthetic)". No Giebeler, Feuerschutz, Piening, or Sport Auto appears in `src/` or `e2e/` except the negative-guard regex in `replay-fixtures.spec.ts:17`. Fixture metadata says `synthetic: true`. The values are invented amounts on an Aug-Sep 2026 cadence, not case-study data. The rendered About page contains no customer names or case-study text. |

### Additional acceptance checks

| Check | Result | Evidence |
| --- | --- | --- |
| Exactly one surfaced document Divergence | Pass | See #2. |
| At least five fictional Supplier x Invoice Identity Slices | Pass | Five Invoice Identity Slices, plus three Credit note Identity Slices (8 total). |
| Enough history per supplier for an Observed Baseline | Pass | Invoice reference counts are 8, 5, 6, 6, and 4, all at or above the minimum of 4. Credit notes are intentionally baseline-less (#6). |
| Existing detector used, no scenario-specific semantics | Pass | No diff under `src/app/domain/` or the mappers. |
| Existing Alpha Evidence IDs preserved | Pass | `1024`, `1027`, `1030`, `1035`. New records are appended after `1038`. |
| Population summary and state UI are factual and accessible | Pass | The table has a `<caption>`, `th scope="col"`, and `th scope="row"` for each Identity Slice, and no controls. The heading order is H1 -> H2 "Document stream" -> H3 detail -> H3 "Identity Slice states". At 375 px there is 0 px horizontal page overflow and the table scrolls inside `.table-scroll`. The E2E responsive tests pass. |
| Dashboard uses the facade/repository only; shared UI stays presentational | Pass | The facade computes states from `detectStreamDivergences`. The shared components take `input.required` only and import only their model. No fixture import in dashboard or shared UI. |
| `Producer x Document Type` is not a new primitive | Pass | The population is derived from the existing `documentType` or `workflowName` fields and is documented as presentation-only. |
| Workflow stream does not regress | Pass | 3 Divergence cards. The summary reads "Invoice approval (synthetic): 4 Identity Slices observed / 2 with surfaced Divergence", which A-072 allows as generic. `dashboard-workflow` E2E passes. |
| Filtering, sorting, selection, empty states, tabs, and analysis open/back do not regress | Pass | The `filters-sorting`, `stream-tabs-a11y`, `divergence-analysis`, and `responsive` E2E suites all pass. |
| About gains no case-study material | Pass | No diff, and the rendered sweep is clean. |
| README unchanged | Pass | No diff. |
| Unit/component coverage for the scenario | Pass | Fixture, repository, detection, facade, component, state helper, and shared-component specs were added. The Gamma coverage gap is QA-STEP09-003. |
| E2E demo path | Pass | `population-divergence.spec.ts`, 4 tests, all passing. |
| lint / build / unit | Pass | See section 2. |
| `npm run test:e2e` passes | **Fail** | QA-STEP09-001. The failures are pre-existing and out of scope. |
| Development Team handoff | Pass (as summarized) | QA reviewed the handoff through A-073 and `review.md`. The verification figures QA reproduced match the handoff (541 tests; 44/2 E2E). |

---

## 5. Manual Checks Still Recommended

- A Product Owner read-through of the demo path (summary -> Alpha -> Evidence -> Analysis -> peer filters -> Identity Slice states) for demo quality, including QA-STEP09-002 and QA-STEP09-003.
- A screen-reader pass over the new table and list. QA checked the structure (caption, scopes, aria-label) but not with an assistive-technology session.

---

## 6. Required Next Gate

1. The **Moderator** accepts or returns this QA review.
2. The **Moderator** dispositions QA-STEP09-001. QA recommends a separate, narrow, approved E2E cleanup routed Tech Lead -> Development Team, followed by a QA re-run of `npm run test:e2e`. The alternative is an explicit recorded acceptance of the red gate.
3. **Product Owner review** is required after QA and before the final Moderator gate (A-072), including QA-STEP09-002 and QA-STEP09-003.
4. The **final Moderator gate** decides STEP-09 completion.

QA does not mark STEP-09 complete, does not update the roadmap or register, and has not committed this file.

---

## 7. Re-Review - QA-STEP09-001 Narrow E2E Cleanup (A-074 / A-075)

**Re-review date:** 2026-09-27
**QA role:** Claude Code, acting as QA. QA did not edit application code, tests, documentation, `review.md`, or the Moderator Register. This section is the only change QA made.
**Scope:** QA-STEP09-001 only. This is not a re-review of STEP-09 behavior, a Product Owner review, or the final Moderator gate.
**Commit reviewed:** `master` `7f50a12` ("test: clean up step 09 e2e gate"). The working tree was clean before and after the QA runs.
**Authority:** A-074 (cleanup approval), A-075 (Tech Lead re-review accepted, QA re-run authorized), and the `review.md` section "Re-Review - QA-STEP09-001 Narrow E2E Cleanup (A-074)".

### Change surface

- `git show --stat 7f50a12`: `e2e/about.spec.ts` (+3/-2), `mod-w/docs/research-references.md` (+1/-1), `mod-w/validation/moderator-register.md` (A-075), and `review.md` (Tech Lead re-review).
- `git diff --stat 538ae62 7f50a12`: the only non-workflow files changed since the STEP-09 implementation commit are `e2e/about.spec.ts` and `mod-w/docs/research-references.md`. The other changes are `qa.md`, `review.md`, and the Moderator Register.
- No file under `src/` changed. `src/testing/claim-guardrail-patterns.ts` was last changed in `dcd0e80`, so `CLAIM_GUARDRAIL_PATTERNS` was **not narrowed**. `e2e/documentation.spec.ts` is unchanged (last changed in `64bd924`), so the guardrail scan of relevance cells, including the `crossStream` pattern, is unchanged.

### Fix verification

| Item | Result | Evidence |
| --- | --- | --- |
| About external-link count updated from 3 to 5 | Pass | `e2e/about.spec.ts:37` expects `a[href^="http"]` to have count 5. The comment lists the 5 links: IDP-Align repository, CAV repository, two DocuWare references, and author profile. This matches the 5 links QA found on the rendered page in the original review. |
| Safe-link assertions still cover every external link | Pass | The loop over `external.all()` is unchanged. It asserts `target="_blank"` and `rel` matching `\bnoopener\b` and `\bnoreferrer\b` on every link. Now that the count passes, the loop runs; before the fix, the count assertion stopped the test first. The CAV repository `href` assertion is unchanged. |
| Sport Auto Plus relevance cell reworded | Pass | Line 69 of `research-references.md` now reads "Describes authority-issued notices for minor traffic offences and other violations...". The word "official" no longer appears in the cell. This is the first wording direction the Product Owner approved in A-074. |
| Factual source meaning intact | Pass | The row still describes minor traffic-offence and other violation notices, the absence of a single unified German notification form, state-authority-specific variations, and support for `Authority x Traffic Notice`. Source, URL, publisher, and access date are unchanged. |
| A-070 boundary intact | Pass | The limits cell is byte-identical: "Research motivation only. IDP-Align must not claim Sport Auto Plus experienced the sustained Divergence simulated by IDP-Align, and no customer data is reproduced." |
| No STEP-09 implementation behavior changed | Pass | No `src/` changes, and no fixture, dashboard, identity-slice-state, detector/domain, replay mapper/repository, workflow replay, About component, README, roadmap, or `mod-w/step-09.md` changes. Unit/component results match the original QA run exactly (541 tests). |

### Commands (Node.js v26.0.0 via `fnm exec --using=v26.0.0 npm.cmd ...`)

| Command | Result |
| --- | --- |
| `node -v` | `v26.0.0` |
| `npm run test:e2e` | **Pass.** 46 passed, 0 failed (1.5m). This includes all 3 `about.spec.ts` tests, the documentation guardrail tests (`documentation.spec.ts`), and all 4 `population-divergence.spec.ts` tests. |
| `npm run lint` | **Pass.** "All files pass linting." |
| `npm run build` | **Pass.** Bundle generation completed. |
| `npm test -- --watch=false` | **Pass.** 33 test files, 541 tests. |

QA ran all four commands in the local shell with no sandbox `spawn EPERM`. QA did not need the outside-sandbox reruns that the Tech Lead needed.

### Original failures

1. `about.spec.ts:22` (count 3 vs 5): **resolved.** The test passes, and its safe-link loop now runs over all 5 links.
2. `documentation.spec.ts:89` (endorsement pattern matching "official" in the Sport Auto Plus relevance cell): **resolved.** The test passes against the unchanged `CLAIM_GUARDRAIL_PATTERNS`, so the content was fixed and the guardrail was not weakened.

### Scope assessment

The cleanup stayed within A-074 scope. Only the approved files changed, and `research-references.md` changed only in the Sport Auto Plus relevance cell. `e2e/documentation.spec.ts` was approved for change but was not touched, which is acceptable because rewording the content resolved the failure. QA agrees with TL-STEP09-CLEANUP-001 (Info): the fixed count of 5 will need updating if the About links change intentionally. It is not a defect.

### QA-STEP09-001 disposition

**Resolved - Pass.** The STEP-09 acceptance check "`npm run test:e2e` passes under the project-approved Node.js version" is now **met** at `7f50a12` (46/46). This updates the **Fail** row in section 4 and the E2E part of the header verdict. That text is kept unchanged as the historical record of the original review.

QA-STEP09-002 and QA-STEP09-003 are unaffected and remain referred to Product Owner review. Sections 6.3 and 6.4 still apply: Product Owner review (A-072) and then the final Moderator gate. QA does not mark STEP-09 complete, does not update the roadmap or register, and has not committed this file.

---

MOD-W v5.0.1
