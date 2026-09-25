# QA Review - STEP-03

**Project:** IDP-Align  
**Step:** STEP-03 - Observed Baseline And Sustained Divergence Logic  
**QA date:** 2026-09-25  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, `step-03.md`, `review.md`, or the register.  
**Repository state reviewed:** `master` `164abb6` ("feat: add step 03 divergence logic"), clean working tree  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-03, verdict "Pass for QA"  
**Verdict:** **Pass with notes.** All 21 acceptance checks pass. AC10 and AC11 pass with notes. There are no blocking findings. QA-018 (Medium) and QA-019 (Low) need a Moderator disposition before the final gate. QA-020 to QA-022 are Info.

The STEP-01 QA record is preserved at tag `step-01`. The STEP-02 QA record is preserved at tag `step-02`; `qa.md` at that tag is identical to `qa.md` at `164abb6`.

---

## Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-029 | Present. Approves `step-03.md` for briefing and planning only. |
| Development Team implementation-plan approval | A-030 | Present. Adopts the Tech Lead conditions: QA-014, scope, detection defaults, `resolved`, date behavior, `decisionAgent`, amount/currency, and credit notes. |
| Tech Lead review acceptance before QA | A-031 | Present. Accepts `review.md` "Pass for QA" and names the QA focus areas. |

No process blocker. See QA-022 for a traceability note on the commit.

---

## Scope Of Review

`164abb6` changes 18 files:

- **New production domain files:** `baseline-statistics.ts`, `divergence-dimension.ts`, `observed-baseline.ts`, `evidence.ts`, `divergence.ts`, and `divergence-detection.ts`.
- **Changed production domain file:** `observation.ts` gains only `byObservedAt`, in 5 added lines.
- **Specs:** a focused spec for each new domain file, plus `domain-terminology.spec.ts` and `src/app/data/replay/replay-divergence-detection.spec.ts`.
- **Test-only helper:** `src/testing/observation-builders.ts`. It is imported only by specs.
- **Role artifacts:** `review.md` (Tech Lead) and `moderator-register.md` (A-030, A-031).

Not changed: dashboard components and templates, the dashboard facade, repositories, replay adapters, fixtures, About files, routes, styles, and package metadata.

---

## Automated Command Results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | **Passed.** "All files pass linting." Exit 0. |
| `fnm exec --using=v26.0.0 npm.cmd run build` | **Passed.** Exit 0, no warnings. There was no `spawn EPERM` in this run. Initial total 256.96 kB raw / 73.44 kB transfer. `dashboard-component` is 10.87 kB and `about-component` is 10.41 kB, both the same as at the STEP-02 re-check. The new domain code is not bundled yet because no production code imports it. |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | **Passed.** 20 test files, 268 tests. Exit 0. Matches `review.md`. |

---

## Supplementary Probes

QA ran the domain functions directly against inputs that the specs do not cover. The probe scripts live in the session scratchpad and were bundled with the repo's `esbuild`. They import the repo modules read-only. QA did not add or change any file in the repository to run them.

| Probe | Input | Observed result |
| --- | --- | --- |
| P1 | 10 reference invoices for "Kappa Paper (synthetic)". 4 later invoices for "Kappa Paper GmbH (synthetic)". Slices built the way the replay mapper builds them. | Two Identity Slices. The new name gets its own slice, with no baseline and no Divergence. **Divergences: none.** (QA-018) |
| P2 | The same reference, then 3 invoices for "KAPPA PAPER (SYNTHETIC)" (case only). Slices built with `uniqueSlices`. | One `vendor-representation` Divergence. Its Identity Slice label and vendor are **"KAPPA PAPER (SYNTHETIC) · Invoice"**, which is the new representation, not the established one. (QA-018) |
| P3 | 12 later invoices, two in three of them in USD, repeating USD, USD, EUR. | **Divergences: none.** A EUR invoice always interrupts the run before it reaches three. (QA-020) |
| P4 | Amount 1500 ×3, then 1010 ×1, then 1500 ×3. | Two Divergences on `amount-value`. The first is `resolved` and the second is `ongoing`. The resolved record's Evidence is c0 to c2 only, so the returning observation is not referenced. (QA-019) |
| P5 | Amount 1500 ×5, then 1010 ×1 as the latest observation. | One Divergence, marked **`resolved`** by that single returning observation. (QA-019) |
| P6 | The full `CLAIM_GUARDRAIL_PATTERNS` set plus the `intent` pattern from `domain-terminology.spec.ts`, run over `JSON.stringify` of the real replay detection output for both streams. | **No matches** in either stream. The document stream has 12 baselines and 1 Divergence. The workflow stream has 9 baselines and 3 Divergences. |

P6 also confirms the replay magnitudes. Approval task duration has a baseline mean of about 273 min and an observed mean of about 1389 min. Response time goes from about 51 min to about 105 min. Workflow runtime goes from about 316 min to about 1431 min. Every Evidence item is out of baseline and in chronological order. These values agree with the QA-014 description of the fixture.

---

## Acceptance Check Results (`mod-w/step-03.md`)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| AC1 | Register has the STEP-03 Step approval before briefing | Pass | A-029, `moderator-register.md` line 1110. |
| AC2 | Canonical types for Observed Baseline, Divergence, Divergence Dimension, Divergence Status, Evidence / Evidence Trace items | Pass | `ObservedBaseline` at `observed-baseline.ts:89`. `DivergenceDimension` at `divergence-dimension.ts:16-19`. `DivergenceStatus` at `divergence.ts:21`. `Divergence` at `divergence.ts:77-92`. `EvidenceTraceItem` and `Evidence` at `evidence.ts:39-54`. |
| AC3 | Canonical terms in names, comments, tests, copy | Pass | The names follow the Code column of `domain-language.md`. The statuses are `ongoing`, `reviewed`, `resolved`, and `muted` (`divergence.ts:21-28`). No user-visible copy was added. |
| AC4 | No reserved Level 3+ terms describe current behavior | Pass | QA grepped the STEP-03 files for reserved, alert, anomaly, judgment, intent, and target terms. The only hits are explicit non-claims: `divergence-detection.ts:43`, `divergence-dimension.ts:37`, `divergence.ts:19`, `evidence.ts:16`, `observed-baseline.ts:87`, and the guardrail specs. P6 found no matches in the runtime output. |
| AC5 | Baseline derivation is pure and deterministic over observations | Pass | `deriveObservedBaseline` (`observed-baseline.ts:120-182`) reads only its arguments. It sorts a copy of its input and does not mutate. `observed-baseline.spec.ts:220` checks that input order does not matter. Baselines come only from observations inside the reference window (`divergence-detection.ts:57`). Nothing declared or configured per slice is used. See QA-021 for a tie-break note. |
| AC6 | Baseline carries stream kind, Identity Slice, dimension, reference window, method, sample size, version/stable ID, and value/range/distribution | Pass | `observed-baseline.ts:42-83`. The stable ID includes the slice, dimension, and window (line 134), and `version` is 1. Numeric baselines carry mean, SD, median, min, max, and range. Categorical baselines carry the dominant value, its share, and the distribution. `referenceObservationIds` are included. `observed-baseline.spec.ts:50` asserts every field. |
| AC7 | Sustained detection is pure and deterministic over baselines and candidates | Pass | `detectSustainedDivergences` (`divergence.ts:106-137`) and `detectStreamDivergences` (`divergence-detection.ts:45-79`). `divergence.spec.ts:95` checks that input order does not matter. |
| AC8 | A single out-of-baseline observation does not create a Divergence | Pass | `divergence.spec.ts:62-73`. Every document dimension is covered at `divergence-detection.spec.ts:110-120`, and task, response, error exit, and runtime at `:226-231`. In replay, the single 2026-08-21 error exit stays in reference history (`replay-divergence-detection.spec.ts:83-94`). |
| AC9 | Divergence carries stream kind, Identity Slice, dimension, baseline context, observed summary, magnitude, onset, duration, status, Evidence | Pass | `divergence.ts:77-92`. The baseline snapshot is embedded, and the sustained criteria are recorded on each record. Asserted at `divergence.spec.ts:37-60`. |
| AC10 | Evidence references source observations/records needed to reconstruct the finding, chronologically | **Pass with note** | Each item carries `observationId`, `sources`, `value`, `withinBaseline`, the distance from the mean, and context (`evidence.ts:39-48`). `evidence.spec.ts:85-128` rebuilds the baseline from `referenceObservationIds` and matches each item to its source observation. Order is chronological. **Note (QA-019):** for `resolved` findings, the observation that set the status is not referenced, so the status cannot be reconstructed from the record. |
| AC11 | Document tests cover vendor representation, amount/currency, date-related behavior | **Pass with note** | `divergence-detection.spec.ts:61-120` covers all four dimensions, including amount and currency kept separate (`:83-101`). Date representation is excluded, with a comment explaining why (`divergence-dimension.ts:99-101`), as A-030 requires. The document-date-to-storage-time dimension is tested. **Note (QA-018):** vendor representation can only detect variants that produce the same Identity Slice ID. |
| AC12 | Workflow tests cover task duration, response time, decision/route/error behavior, workflow runtime | Pass | `divergence-detection.spec.ts:184-231`. `task-outcome` covers decisions and error exit routes. The spec checks that response time has no baseline on the automated step (`:184-195`, and replay `:96-104`). |
| AC13 | QA-014 handled explicitly and tested | Pass | See the QA-014 section below. |
| AC14 | Decision agent, route, and runtime context are Evidence or Identity Slice fields only, with no Attribution | Pass | Decision agent is not a dimension (`divergence-dimension.ts:36-37`, spec `:35`). It appears only in `WorkflowTaskEvidenceContext` (`evidence.ts:18-25`). Asserted at `divergence-detection.spec.ts:233-240` and replay `:121-128`. |
| AC15 | Repository/facade access, if added, preserves the source-agnostic boundary | Pass (not added) | A-030 excluded facade changes, and none were made. The replay-level spec reads through `StreamObservationRepository` and imports no fixture files (`replay-divergence-detection.spec.ts:5-11`). No production module outside `src/app/domain/` imports the new files. |
| AC16 | STEP-01 and STEP-02 behavior intact, with no Divergence UI rendering | Pass | No dashboard, About, shell, route, or style file changed. The `observation.ts` change only adds a function. All 268 tests pass, including the STEP-01 and STEP-02 specs. Lazy chunk sizes are the same as at the STEP-02 re-check. |
| AC17 | Fixtures stay synthetic, with no live DocuWare calls | Pass | No fixture file changed. The STEP-03 files contain no `fetch`, `HttpClient`, host, token, or secret strings. |
| AC18 | Dashboard guardrail tests still cover endorsement, private access, production readiness, business judgment, reserved terms, alert/anomaly | Pass | `dashboard.component.spec.ts:228` still iterates over every `CLAIM_GUARDRAIL_PATTERNS` entry. It is unchanged and passing. |
| AC19 | `npm run lint` passes under v26.0.0 | Pass | See above. |
| AC20 | `npm run build` passes under v26.0.0 | Pass | See above. |
| AC21 | `npm test -- --watch=false` passes under v26.0.0 | Pass | 20 files, 268 tests. |

### A-030 Condition Check

| Condition | Result |
| --- | --- |
| Detection defaults: 28 days, min 4, 3 SD / 5% floor, share 0.1, 3 consecutive | Met. `divergence-detection.ts:19-26`, asserted at spec `:24-33`. |
| `resolved` is a lifecycle state only | Met in wording. `divergence.ts:15-20` and `divergence.spec.ts:85-93`. For the resolution rule itself, see QA-019. |
| Date representation unsupported; `document-date-lag` is the date dimension | Met. `divergence-dimension.ts:99-101`. |
| `amount-value` and `amount-currency` are separate | Met. Specs `:83-101`. |
| Credit notes get no baseline | Met. `divergence-detection.spec.ts:122-135` and replay `:53-63`. |
| No About copy or test changes | Met. |
| File list | Met, with two additions the Tech Lead disclosed: `byObservedAt` in `observation.ts` and `src/testing/observation-builders.ts`. Neither is in the A-030 file list. Both are small and in scope. |

---

## QA-014 Verification

A-030 chose **emit both, unlinked**. QA confirmed the following:

- **Code.** Each Identity Slice and dimension is evaluated on its own baseline (`divergence-detection.ts:56-76`). No step correlates, deduplicates, or suppresses records across slices. The comment at lines 39-44 states the no-Attribution reason.
- **Synthetic tests.** `divergence-detection.spec.ts:243-321` has three tests:
  - When both slices meet the criteria, both are emitted.
  - The record keys are an exact closed set, so there is no `related`, `derived`, or `cause` field, and the serialized output does not match `/attribut|cause|derived|related/i`.
  - When runtime stays within its baseline, only the step Divergence is emitted. This shows each slice is judged independently rather than always paired.
- **Replay.** `replay-divergence-detection.spec.ts:106-119` covers the real fixture. The Approval `task-duration` and `response-time` Divergences both have onset 2026-09-05T07:00Z. The Workflow runtime Divergence has onset 2026-09-05T07:03Z. All are `ongoing`, with 6 Evidence items each.
- **Onset timing.** Onset is the confirmation time of the first changed task: an instance started on 2026-09-04 at 08:30 and confirmed about 21.8 h later. This agrees with the 2026-09-04 fixture change noted in QA-014.
- **Shared instances.** The same instance IDs appear in both Evidence traces, as observed context only. Nothing presents one Divergence as explaining the other.

**QA-014 is closed for STEP-03.** How a later UI shows the two records side by side without implying cause belongs to STEP-04 or later.

**QA-015** stays a future adapter/BFF note. STEP-03 adds no adapter code and does not touch `sourceKind`.

---

## Findings

### QA-018 - Medium (product coverage): vendor representation changes that start a new Identity Slice are never surfaced

- **Where:** `identity-slice.ts:36-44` builds the document slice ID from `slug(vendor)`. `document-replay.mapper.ts:41,56` assigns each observation to the slice for its own raw vendor text. `divergence-dimension.ts:136-137` reads `vendor-representation` as that same raw text.
- **Effect:** A vendor representation can only differ from the baseline inside one slice when the new text has the same slug, which means a change in case, spacing, or punctuation. A materially different name, such as "Kappa Paper GmbH (synthetic)" in place of "Kappa Paper (synthetic)", starts a new Identity Slice. That slice has no reference history and gets no baseline, so no Divergence is surfaced (probe P1). The only vendor-representation test uses a case-only variant (`divergence-detection.spec.ts:56,76-81`).
- **Related effect (P2):** When a case-only variant is detected, `uniqueSlices` (`replay-fixture.ts:33-35`) keeps the *last* slice object for a shared ID. The Divergence's Identity Slice label and vendor therefore show the new representation. When this is rendered, the slice would appear to be named after the divergent value.
- **Product reference:** `product.md:27` and `:130` describe "persistent changes in vendor-name representation" and "a materially different vendor representation" as the document-stream case to surface.
- **Why this does not fail AC11:** As written, AC11 asks only that tests cover vendor representation. They do. The replay fixture does not contain a vendor-representation change (A-018), so the demo path is not affected.
- **Route:** Moderator disposition. The options are:
  - (a) Accept the narrow meaning ("representation variants within one slice") and record it in the Step or domain notes.
  - (b) Route to the Tech Lead to decide whether document slices should key on a normalized vendor identity while `vendor-representation` keeps the raw text. That decision touches STEP-02 slice identity, so it probably belongs in a later Step.

### QA-019 - Low (detection semantics / reconstruction): one returning observation resolves a sustained Divergence

- **Where:** `divergence.ts:119-123` ends a run on any single within-baseline observation. `divergence.ts:129-135` marks every ended run `resolved`. `divergence.ts:166-169` builds Evidence from the run only.
- **Effect:**
  - After five sustained out-of-baseline observations, one in-baseline value marks the Divergence `resolved` (probe P5).
  - If the change continues, a second Divergence with a new ID and a new onset is emitted. One continuing change becomes two findings (probe P4, and `divergence.spec.ts:75-83`).
  - A single observation can therefore end a Divergence, although STEP-03 requires three to start one. This is the one-off sensitivity that D5 and `product.md:161` rule out for detection.
  - The observation that set `resolved` is not in the Evidence, and the record has no resolution time. So the `resolved` status cannot be reconstructed from the record (R12, D6).
- **Why Low:** A-030 allows the detector to set `resolved`, and the wording condition is met. All replay Divergences are `ongoing`, so the demo path is not affected.
- **Route:** Moderator disposition. The options are:
  - (a) Accept as MVP behavior and record it as a known limitation.
  - (b) Tech Lead defines a resolution rule, for example N consecutive within-baseline observations, and adds the resolving observation reference. This could happen in STEP-03 rework or before STEP-04 renders statuses.

### QA-020 - Info (detection coverage): intermittent sustained change is not surfaced

- The approved criterion is 3 *consecutive* out-of-baseline observations. A lasting change in mix therefore never qualifies if a baseline value appears at least every third observation. For example, a vendor now invoicing two in three documents in USD is not surfaced (probe P3).
- This is the approved A-030 behavior, not a defect. It is recorded because `architecture.md` D5 allows "repeated or windowed evidence" and because the product scenario at `product.md:130` includes currency pattern changes.
- **Route:** For Tech Lead consideration in later detection tuning. No STEP-03 action is needed.

### QA-021 - Info (determinism): the chronological tie-break is locale-sensitive

- `byObservedAt` (`observation.ts:71`) breaks timestamp ties with `a.id.localeCompare(b.id)`. That order depends on the runtime's locale collation. `frequencyDistribution` (`baseline-statistics.ts:35`) deliberately uses code-point comparison instead.
- The two differ only for equal timestamps, and the replay fixtures have none that matter. It is a small inconsistency in a Step that claims determinism.
- **Route:** Optional cleanup with a later change to these files.

### QA-022 - Info (process / traceability): one commit holds all three roles' artifacts

- `164abb6` bundles Development Team code with the Tech Lead's `review.md` and the Moderator's A-030 and A-031 entries. This is the same pattern as QA-001 and QA-016.
- `review.md` and A-031 both describe the reviewed package as the *uncommitted working tree*. QA cannot show from git history that the committed tree is exactly the reviewed tree.
- QA checked the committed tree independently. The test count (268) and bundle sizes (256.96 kB) match `review.md` exactly, which is consistent with the same package.
- `review.md` now holds only the STEP-03 review. The STEP-02 review is preserved at tag `step-02`.

---

## Regressions Or Risks

- No functional regressions. The STEP-01 and STEP-02 specs pass. The dashboard, About view, shell, facade, and fixtures are unchanged, and the lazy chunk sizes are unchanged.
- **Risk:** QA-019 matters once STEP-04 renders statuses. A `resolved` badge set by one returning observation, followed by a second card for the same continuing change, could be misread.
- **Risk:** QA-018 matters if a later fixture or live data introduces renamed vendors. The rename would show as a new Identity Slice rather than as a Divergence.

---

## Manual Checks Required

- **Moderator:** disposition QA-018 and QA-019, and optionally QA-020 to QA-022.
- **No browser check is needed for STEP-03.** No rendered output changed, and the dashboard and About chunks are the same size as at the STEP-02 re-check. The STEP-02 browser evidence still applies.

---

## Known Limitations

- QA probed behavior with scratch scripts outside the repository. It did not mutation-test the specs, because that would require editing implementation files.
- Detection parameters were checked for conformance to A-030, not for statistical suitability. That remains a Tech Lead and Product Owner concern.
- The reference window is stream-wide and fixed to the first 28 days. Baselines are not recalculated over time, and later observations never become reference history. This agrees with A-030 and the immutable-snapshot decision, and is noted for later Steps.

---

## Recommended Routing

Per MOD-W, QA does not implement fixes. Proposed route:

1. The Moderator records QA acceptance of this review and dispositions QA-018 to QA-022.
2. If any finding is routed to rework, the Tech Lead defines it in `review.md`. The Development Team plans it, the Moderator approves the plan, and the Development Team implements. The Tech Lead then re-reviews, and a fresh QA session re-checks.
3. If none is routed to rework, the STEP-03 final gate follows. Product Owner sign-off applies if required.

QA does not accept its own review.

MOD-W v5.0.1
