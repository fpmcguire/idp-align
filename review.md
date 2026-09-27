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
