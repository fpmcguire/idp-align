# Tech Lead Review - STEP-09

**Step:** STEP-09 - Population-Specific Divergence Scenario
**Review date:** 2026-09-27
**Reviewer:** Codex, acting as Tech Lead  
**Implementation package reviewed:** Current uncommitted Development Team STEP-09 implementation after A-072 implementation-plan approval
**Verdict:** Hold for Moderator decision before QA

---

## Findings

### Must Fix / Gate Decision

**TL-STEP09-001 - Required E2E gate is red before QA can begin.**
`mod-w/step-09.md` requires `npm run test:e2e` to pass, and A-072 did not waive that gate. The Development Team reports 44 E2E tests passed and 2 failed. The reported failures are outside STEP-09 scope and reproduce on clean `HEAD`, but they still mean the accepted quality gate is not green:

- `about.spec.ts:22` expects 3 external links but finds 5 after an earlier About-page link change.
- `documentation.spec.ts:89` flags "official" in the Sport Auto Plus research-reference row as an endorsement-pattern match.

I do not recommend changing STEP-09 implementation code for this finding. Moderator should either authorize a narrow pre-QA cleanup/override for the two pre-existing E2E failures, or hold QA until a separately approved fix makes `npm run test:e2e` pass.

### Could Fix Later

**TL-STEP09-002 - Compared-observation counting duplicates detector boundary knowledge.**
`src/app/features/dashboard/identity-slice-states.ts` calculates compared observations as observations at or after `referenceWindow.to`, mirroring the current detector split. This is intentionally done without changing detector code and is covered by tests, so it is acceptable for STEP-09. A later cleanup could expose the split from domain output or a shared helper to reduce future drift.

---

## Scope And Approval Check

Required approvals are present:

- A-069 approves the Product/domain-language update for Population-Specific Divergence.
- A-070 approves the research-evidence update.
- A-071 approves STEP-09 for Development Team briefing and planning.
- A-072 approves the Development Team implementation plan with conditions.

The implementation follows A-072 Option A:

- Existing Alpha Office Supplies invoice Divergence is preserved.
- New records are appended after existing document fixture IDs.
- New suppliers are fictional and synthetic.
- The current Aug-Sep cadence is preserved.
- README, About, roadmap, register, QA, detector code, thresholds, reference-window semantics, dimensions, mappers, workflow replay, packages, backend/proxy, and chart libraries are unchanged.

The work remains CAV Level 1. I found no new root-cause, risk, failure, correctness, Declared Intention, Attribution, remediation, or cross-stream causality claim in the reviewed implementation.

---

## Implementation Review

The fixture change is aligned with STEP-09:

- Document replay now has five Supplier x Invoice Identity Slices: Alpha, Beta, Gamma, Delta, and Epsilon.
- Delta and Epsilon are fictional synthetic peers.
- Existing records `1001` through `1038` are unchanged.
- Alpha Evidence remains `1024`, `1027`, `1030`, and `1035`.
- Tests assert exactly one document Divergence, on Alpha amount-value.
- Peer suppliers do not surface the same Divergence.

The dashboard implementation is within architecture:

- Dashboard still reads through the facade/repository path.
- Shared UI components are presentational.
- No replay fixture import was added to dashboard or shared UI production code.
- Population summaries are factual slice counts, not aggregate stability conclusions.
- Identity Slice state copy avoids "stable", "normal", "healthy", "correct", severity/risk, and claim-overreach wording.

The slice-state UI may render for workflow too, which A-072 allowed if generic. The workflow summary uses workflow name grouping and does not introduce new workflow claims.

---

## Tests And Evidence

Development Team reported:

- `npm run lint` - pass.
- `npm run build` - pass.
- `npm test -- --watch=false` - pass, 33 files / 541 tests.
- `npm run test:e2e` - 44 passed, 2 failed.

Tech Lead spot checks:

- `git diff --check` - pass.
- Static review of changed fixture, facade, dashboard, shared UI components, unit specs, and E2E spec completed.

I did not rerun the full lint/build/unit/E2E suite during this review. The E2E result is already reported red by Development Team and must be resolved or explicitly dispositioned before QA.

---

## QA Handoff Status

Not ready for QA until Moderator dispositions TL-STEP09-001.

If Moderator authorizes a narrow fix or override for the two pre-existing E2E failures, QA should review STEP-09 against:

- `mod-w/step-09.md`
- A-071 and A-072
- this `review.md`
- the Development Team handoff
- the current working tree implementation

QA should pay particular attention to:

- exactly one surfaced document Divergence;
- five fictional Supplier x Invoice Identity Slices;
- no real customer names or customer data in replay fixtures;
- population-summary and slice-state wording;
- Evidence Trace and Divergence Analysis for Alpha;
- peer supplier filters showing no Divergence;
- no CAV Level 2+, Attribution, business judgment, aggregate-stability, severity/risk, alert/anomaly, or root-cause claims;
- preservation of workflow behavior.

Approval record needed before QA may proceed: Moderator acceptance of this Tech Lead review plus either resolution or explicit disposition of TL-STEP09-001.

---

MOD-W v5.0.1

---

## QA Blocker Disposition - QA-STEP09-001

**Assessment date:** 2026-09-27
**Finding assessed:** `qa.md` QA-STEP09-001 - E2E gate is red.
**Tech Lead recommendation:** Approve a separate, narrow cleanup outside STEP-09 implementation scope.

### Scope Conclusion

I confirm QA's scope conclusion.

Both E2E failures are outside STEP-09 scope and pre-date implementation commit `538ae62`:

- At `538ae62`, E2E reports 44 passed and 2 failed.
- At parent commit `0d94e20`, E2E reports 40 passed and the same 2 failed.
- STEP-09 added 4 E2E tests, and QA reports all 4 pass.
- STEP-09 did not change `src/app/features/about/`, `mod-w/docs/research-references.md`, `e2e/about.spec.ts`, or `e2e/documentation.spec.ts`.

The failures are still a final-acceptance blocker because STEP-09 requires `npm run test:e2e` to pass and A-073 did not waive that final quality gate.

### Recommended Disposition

Recommend option (a): a separate, narrow cleanup approved outside STEP-09 scope.

I do not recommend explicit acceptance of the red E2E gate. Keeping known E2E failures would weaken the STEP-09 final gate and make later browser regressions harder to detect.

### Cleanup Briefing For Development Team

**Role:** Development Team

**Task:** Perform a narrow E2E cleanup for QA-STEP09-001 only. Do not change STEP-09 implementation behavior.

**Authority required before work starts:** Moderator must record an approval entry authorizing this cleanup before Development Team edits files.

**Allowed files:**

- `e2e/about.spec.ts`
- `e2e/documentation.spec.ts`
- `mod-w/docs/research-references.md`, only if the Moderator and Product Owner approve touching A-070 research-reference content

**Forbidden files/areas:**

- STEP-09 implementation files under `src/app/data/replay/fixtures/`, `src/app/features/dashboard/`, and `src/app/shared/ui/identity-slice-states/`
- detector, baseline, divergence, dimensions, mappers, repositories, and workflow replay behavior
- `src/app/features/about/about.component.html` and other About component files
- `README.md`
- `mod-w/roadmap.md`
- `mod-w/step-09.md`
- `qa.md`
- `mod-w/validation/moderator-register.md`

#### Failure 1 - About External Link Count

`e2e/about.spec.ts` expects 3 external links but the About page now has 5 after an intentional prior content change.

Required cleanup:

- Update the stale count expectation to match the rendered external-link set, or make the expectation derive from the specific links asserted in the test plus the known repository/author links.
- Preserve coverage that every external link on the About page has:
  - `target="_blank"`
  - `rel` containing `noopener`
  - `rel` containing `noreferrer`
- Do not remove safe-link checks.
- Do not edit About component copy or links as part of this cleanup.

#### Failure 2 - Documentation Guardrail False Positive

`e2e/documentation.spec.ts` flags "official" in the Sport Auto Plus research-reference relevance cell: "Describes official notices for minor traffic offences..."

Preferred cleanup:

- Reword the `mod-w/docs/research-references.md` Sport Auto Plus relevance cell to avoid the word "official" while preserving the factual source meaning and A-070 research boundary.
- Suggested direction: use wording such as "authority-issued notices for minor traffic offences..." or "traffic-offence notices and other violation documents..." if Product Owner accepts the wording.

Reasoning:

- Narrowing the endorsement pattern would weaken a useful guardrail across future documentation.
- The false positive is caused by one non-essential word in A-070 research-reference content.
- Rewording the cell is the smallest durable fix, but because it touches approved A-070 Product Owner research evidence, Moderator approval should include Product Owner input or explicitly record Product Owner approval for the wording.

Alternative if Product Owner/Moderator reject content rewording:

- Narrow the endorsement pattern so "official" is not treated as endorsement in all contexts, but only with DocuWare/approval/partnership context. This requires clear justification because it weakens a guardrail.

#### Verification Required

Run under Node.js v26.0.0:

- `npm run lint`
- `npm run build`
- `npm test -- --watch=false`
- `npm run test:e2e`

Expected E2E result after cleanup:

- `npm run test:e2e` passes with 46/46 tests.

#### Development Team Handoff Required

The handoff must list:

- changed files;
- exact fix for each E2E failure;
- confirmation that no STEP-09 implementation file was changed;
- verification command output;
- any residual risk or question for Tech Lead review.

### Moderator Approval Record Needed

Before Development Team starts, Moderator should add a register entry authorizing a narrow QA-STEP09-001 E2E cleanup outside STEP-09 implementation scope.

The approval should specify:

- the allowed files;
- whether Product Owner approves rewording the A-070 Sport Auto Plus research-reference relevance cell;
- that no STEP-09 implementation behavior may change;
- that successful cleanup returns to Tech Lead re-review before QA re-run.

### Follow-Up Gates

1. Moderator approval for the narrow cleanup.
2. Development Team cleanup and handoff.
3. Tech Lead re-review of the cleanup.
4. QA re-run of `npm run test:e2e` and any necessary focused checks.
5. Product Owner review of STEP-09 per A-072, including QA-STEP09-002 and QA-STEP09-003.
6. Final Moderator gate for STEP-09.

---

## Re-Review - QA-STEP09-001 Narrow E2E Cleanup (A-074)

**Re-review date:** 2026-09-27
**Reviewer:** Codex, acting as Tech Lead
**Cleanup reviewed:** Current uncommitted Development Team cleanup after A-074 approval
**Verdict:** Accepted for QA re-run

### Scope Confirmation

The cleanup is within A-074 scope.

`git status` / `git diff --name-only` show only these files changed:

- `e2e/about.spec.ts`
- `mod-w/docs/research-references.md`

No STEP-09 implementation files changed. I found no changes to fixtures, dashboard implementation, shared identity-slice-state UI, detector/baseline/divergence/dimension code, replay mappers/repositories, workflow replay, About component files, README, roadmap, `mod-w/step-09.md`, `qa.md`, or the Moderator Register.

`src/testing/claim-guardrail-patterns.ts` was not changed, so the endorsement guardrail was not narrowed.

### Fix Assessment

**Failure 1 - About external-link count:** Accepted.

- `e2e/about.spec.ts` updates the external-link count from 3 to 5.
- The updated comment matches the current About page link set: IDP-Align repository, CAV repository, two DocuWare API references, and author profile.
- The per-link loop remains in place and still asserts `target="_blank"` and `rel` containing `noopener` and `noreferrer` for every external link.
- The CAV repository href assertion remains unchanged.
- Residual risk: the count is still fixed, so a later intentional About link change will require another test update. This is acceptable for this narrow cleanup because deriving the count from a broader expected-link list would expand the change.

**Failure 2 - Sport Auto Plus relevance wording:** Accepted.

- `mod-w/docs/research-references.md` changes "official notices" to "authority-issued notices" in the Sport Auto Plus relevance cell.
- The factual source meaning is preserved: the row still describes minor traffic-offence and other violation notices, state-authority-specific variations, and support for `Authority x Traffic Notice`.
- The A-070 boundary remains intact: research motivation only, no claim that Sport Auto Plus experienced the simulated Divergence, and no customer data reproduced.
- This follows the Product Owner-approved wording direction recorded in A-074.

### Verification

Verification run under Node.js v26.0.0:

- `fnm exec --using=v26.0.0 npm.cmd run lint` - Pass. All files pass linting.
- `fnm exec --using=v26.0.0 npm.cmd run build` - Initial sandbox run hit known Angular/esbuild `spawn EPERM`; outside-sandbox rerun passed.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` - Initial sandbox run hit known Angular/esbuild `spawn EPERM`; outside-sandbox rerun passed: 33 files, 541 tests.
- `fnm exec --using=v26.0.0 npm.cmd run test:e2e` - Initial sandbox run hit `spawn EPERM`; outside-sandbox rerun passed: 46 tests.

`git diff --check -- review.md` was clean before this section was added; run final diff checks before committing.

### Findings

No blocking findings.

**TL-STEP09-CLEANUP-001 - Fixed About external-link count remains brittle.**
Severity: Info. The fixed count is acceptable under the narrow A-074 cleanup, but future intentional About link additions/removals will need a test update. This does not block QA re-run.

### Recommended Next Gate

Moderator may accept this Tech Lead re-review and authorize QA to re-run the E2E gate for QA-STEP09-001.

QA should verify at minimum:

- `npm run test:e2e` passes at 46/46;
- the About safe-link assertions still cover every external link;
- the documentation guardrail no longer flags the Sport Auto Plus relevance row;
- no STEP-09 implementation behavior changed.
