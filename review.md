# Tech Lead Review - STEP-02

**Project:** IDP-Align  
**Step:** STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures  
**Review date:** 2026-09-25  
**Reviewer:** Codex, Tech Lead  
**Implementation package reviewed:** STEP-02 implementation commit `ddcde42`, QA review at `ac790fb`, Development Team QA-010/QA-011 rework commit `032fe2f`, QA-012 rework commit `0fed7ba`, and approval records through A-025; excluding Sass tooling commit `839f9e0` per A-019  
**Verdict:** Pass for fresh QA re-check of QA-012

---

## QA-012 Re-Review

**Reviewed delta:** `2932e5d..0fed7ba`  
**Approval checked:** A-025 is present in `mod-w/validation/moderator-register.md` and approves the copy-only QA-012 rework before implementation.  
**Verdict:** Pass for fresh QA re-check.

### Findings

No blocking, major, minor, or low findings.

### Scope And Acceptance

The QA-012 rework matches A-024 and A-025:

- `dashboard.component.html` changes only the KPI note copy from "Pending replay data" to "Pending Divergence detection".
- KPI values remain `—`; no calculations, Observed Baseline logic, sustained Divergence detection, filters, Evidence Trace behavior, fixtures, live DocuWare calls, credentials, About files, or About tests changed.
- `dashboard.component.spec.ts` updates the directly affected assertion, keeps the no-digit check, and adds a regression guard that the stale "Pending replay data" copy does not return.

The new copy is bounded and accurate for STEP-02: it says the KPI cards are pending Divergence detection without implying detection exists.

### Verification

Run under Node.js v26.0.0:

| Command | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run build` | Pass after rerun outside the sandbox; the sandboxed run hit the known esbuild `spawn EPERM` limitation |
| `npm test -- --watch=false` | Pass after rerun outside the sandbox; 12 files and 158 tests passed |

### Next Gate

The Moderator should record Tech Lead re-review acceptance for QA-012 before fresh QA re-check. Suggested next register entry: A-026, approving this Tech Lead re-review and authorizing QA to re-check QA-012 against commit `0fed7ba` plus this `review.md` update.

---

## Gate Verification

`mod-w/validation/moderator-register.md` contains the required approvals:

- A-017 approves `mod-w/step-02.md` as the active STEP-02 definition and authorizes Development Team briefing/planning only.
- A-018 approves the STEP-02 Development Team implementation plan before code work.
- A-019 approves the Sass command line dev dependency separately and requires `package.json` and `package-lock.json` from commit `839f9e0` to be excluded from STEP-02 review.

No process blocker remains before QA. This review covers the STEP-02 implementation files only.

---

## Scope Check

The implementation stays within STEP-02:

- Adds canonical CAV Level 1 domain types for `StreamKind`, `IdentitySlice`, document/workflow observations, `ObservedTruth`, `SourceReference`, and replay source metadata.
- Adds source-agnostic `StreamObservationRepository` and route-scoped replay provider.
- Adds local synthetic document and workflow replay fixtures shaped from the public DocuWare documentation.
- Adds replay mappers, repository implementation, dashboard facade, and a neutral dashboard replay source line.
- Extends dashboard and fixture guardrail tests for QA-006.

The implementation does not add Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, completed CAV findings, live DocuWare API calls, credentials, or CAV Level 3+ behavior.

---

## QA Rework - QA-010

**Status for this delta:** Rework required.

**QA evidence:** `qa.md` at `ac790fb` failed AC8 because the document fixture metadata and tests claim a documented index-field shape that the cited Platform REST API page does not show. The cited page shows `FieldName` and `Item`; it does not show `ItemElementName`, `/Date(ms)/` index-field values, `DWSTOREDATETIME`, or Decimal typing. Its visible `DOCUMENT_DATE` sample uses an ISO date string.

### Tech Lead Resolution

Use QA option **(b)**:

- Keep the current document fixture shape.
- Mark `ItemElementName`, `/Date(ms)/` date encoding, `DWSTOREDATETIME`, and Decimal typing as approximations or source-shape assumptions in fixture metadata.
- Rename the fixture test currently titled `should use the documented index field structure` so it no longer claims `ItemElementName` is documented by the cited page.
- Update assertions as needed so tests verify the documented `FieldName` / `Item` pair separately from approximated replay typing/metadata.

I corrected `mod-w/step-02.md` Source Conflict Resolution to remove the false statement that the public Platform REST API documentation shows `ItemElementName`.

### Required Development Team Rework

| Finding | Required rework | Acceptance criteria |
| --- | --- | --- |
| QA-010 | Correct document fixture metadata and test naming for public-source traceability. | Metadata states that `FieldName` and `Item` are documented by the cited Platform REST API page, while `ItemElementName`, `/Date(ms)/`, `DWSTOREDATETIME`, and Decimal typing are approximations/source-shape assumptions. The fixture test no longer says the full three-field structure is documented. AC8 can be checked against the cited page without finding a false documentation claim. |

### Optional Rework Recommendation

QA-011 is the same class of traceability issue for workflow duration values using the undocumented `d.` day prefix. I recommend including it in the same rework because the change is small and improves the same public-source traceability boundary. It needs Moderator approval before Development Team implements it.

If approved, required QA-011 rework:

- Mark the `d.` duration prefix as an approximation/source-shape assumption in workflow fixture metadata or comments.
- Ensure metadata no longer says every duration format used in the fixture is documented by the cited Workflow Analytics API page.
- Keep the documented `hh:mm:ss.fffffff` format for values under 24 hours.

### Development Team Rework Brief

```md
You are acting as the Development Team for IDP-Align under MOD-W v5.0.1.

Read these files first:
- mod-w/validation/moderator-register.md, especially A-018, A-020, and A-021
- mod-w/step-02.md
- review.md
- qa.md
- src/app/data/replay/fixtures/document-replay.fixture.ts
- src/app/data/replay/fixtures/replay-fixtures.spec.ts
- src/app/data/replay/docuware-replay.types.ts

Task:
Prepare a rework plan for QA-010 only. Do not code until the Moderator approves the plan and records that approval in the register.

Required rework:
- Keep the current document fixture shape.
- Correct document fixture metadata so it says the cited Platform REST API page documents `FieldName` and `Item`.
- Mark `ItemElementName`, `/Date(ms)/` date encoding, `DWSTOREDATETIME`, and Decimal typing as approximations or source-shape assumptions, not as documented fields from the cited page.
- Rename the fixture test currently titled `should use the documented index field structure` so it no longer claims the whole `FieldName` / `Item` / `ItemElementName` structure is documented.
- Update tests to verify documented source shape and approximated replay assumptions separately.

Constraints:
- Stay within STEP-02.
- Do not change About copy or About tests.
- Do not add live DocuWare calls, credentials, new fixture capabilities, Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, or CAV Level 3+ concepts.
- Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0 after implementation.

Optional only if Moderator explicitly approves QA-011 in the same rework:
- Mark the workflow `d.` duration prefix as an approximation/source-shape assumption.
- Do not claim that the `d.` prefix is documented by the cited Workflow Analytics API page.
```

---

## Re-Review Result

**Re-review date:** 2026-09-25  
**Delta reviewed:** `ac790fb..72f548a`, with implementation changes in `032fe2f` and register approval A-022 in `72f548a`.

Tech Lead assessment:

- QA-010 passes re-review. `mod-w/step-02.md` now correctly states that the cited Platform REST API page documents `FieldName` and `Item`, while `ItemElementName`, `/Date(ms)/`, `DWSTOREDATETIME`, and Decimal typing must be treated as approximations/source-shape assumptions when used.
- QA-010 implementation rework passes review. `document-replay.fixture.ts` now separates documented `FieldName` / `Item` support from approximated `ItemElementName`, `/Date(ms)/`, `DWSTOREDATETIME`, and Decimal typing. `replay-fixtures.spec.ts` no longer claims the full three-field structure is documented and now tests documented and approximated parts separately.
- QA-011 was explicitly approved for same-cycle inclusion in A-022 and passes re-review. `workflow-replay.fixture.ts` and `docuware-replay.types.ts` now state that `hh:mm:ss.fffffff` is documented, while the `d.` day prefix for durations of 24 hours or more is an approximation that the cited page does not show. Tests assert both the documented under-24-hour form and the metadata approximation note.
- No About copy or About tests changed.
- No new live API calls, credentials, CAV calculation logic, Evidence Trace behavior, completed CAV findings, or Level 3+ concepts were introduced.

No blocking, major, minor, or low implementation findings remain in the QA-010/QA-011 rework delta.

Verification note:

- `npm run lint` passed under Node.js v26.0.0.
- `npm run build` could not be rerun in this sandbox after the rework because Angular/esbuild failed with `spawn EPERM`.
- `npm test -- --watch=false` could not be rerun in this sandbox after the rework because Angular/esbuild failed with `spawn EPERM`.
- This is an environment permission failure, not an implementation failure, but fresh QA must rerun build and tests under Node.js v26.0.0 before acceptance.

---

## Findings

### Must Fix Now

None for the QA-010/QA-011 rework delta.

### Could Fix Later

None for the QA-010/QA-011 rework delta.

---

## Acceptance Check Mapping

- STEP-02 approval entry: met. A-017 is present.
- Canonical TypeScript domain types: met. Domain types are under `src/app/domain/`.
- Domain terminology: met. The implementation uses Stream, Identity Slice, Observation, Observed Truth, and source metadata without introducing `DivergenceDimension` early.
- Reserved Level 3+ terms: met. New STEP-02 runtime/domain code does not use reserved Level 3+ terms to describe current behavior.
- Repository interfaces: met. `StreamObservationRepository` is source-agnostic.
- Dashboard boundary: met. Dashboard uses `DashboardFacade`, which depends on the repository interface.
- Replay adapter: met. `ReplayStreamObservationRepository` implements both streams.
- Document fixtures: met after QA-010 rework. Fixtures are synthetic and use documented `FieldName` / `Item` concepts while marking `ItemElementName`, `/Date(ms)/`, `DWSTOREDATETIME`, and Decimal typing as approximations/source-shape assumptions.
- Workflow fixtures: met after QA-011 rework. Projection names follow Workflow Analytics API documentation; approximated task projection fields and the `d.` duration day prefix are noted in metadata.
- Fixture safety: met. Fixtures are synthetic, use synthetic IDs/names, cite public documentation, and tests check secret-like strings and URL guardrails.
- No browser live calls: met. Repository tests spy on `fetch` and `XMLHttpRequest.open`; no calls occur.
- Dashboard-visible data: met. The visible addition is a neutral replay source line; KPIs remain placeholders and filters remain disabled.
- Dashboard guardrail tests: met. Rendered dashboard copy is scanned for endorsement, private access, production readiness, business judgment, reserved terms, and alert/anomaly language.
- Repository/replay tests: met. Tests cover repository contract, mapper behavior, fixture guardrails, source info, and Observed Truth grouping.
- Existing STEP-01 behavior: met by test suite and unchanged About files.
- `npm run lint`: passed under Node.js v26.0.0.
- `npm run build`: fresh re-run blocked by sandbox `spawn EPERM`; previously passed before QA-010/QA-011 rework.
- `npm test -- --watch=false`: fresh re-run blocked by sandbox `spawn EPERM`; previously passed before QA-010/QA-011 rework.

---

## Design ID Mapping

- DS-001: met for STEP-02 scope. Dashboard structure remains intact and receives only neutral source metadata.
- DS-002: met. Document and Workflow remain separate first-class Stream views.
- DS-009: met for data foundation. Document observation fixtures support later document stream summary metrics without exposing completed metrics now.
- DS-010: met for data foundation. Workflow observation fixtures support later workflow stream summary metrics without exposing completed metrics now.

No new user-facing visual component was required by STEP-02.

---

## Architecture And Domain Check

- `architecture.md` D3/D4/D13 are followed: domain types are explicit, replay is local and synthetic, and the dashboard boundary goes through a facade and repository interface.
- `domain-language.md` guardrails are respected. Formal `DivergenceDimension` is deferred to STEP-03 as approved in A-018.
- `language-matrix.md` guardrails are respected. DocuWare references are bounded to public documentation, replay metadata, and source-shaped fixtures.
- `SourceReference.system` remains a string, keeping the domain layer source-agnostic.
- Workflow `decisionAgent` remains observation context, not an Identity Slice or Attribution claim.

---

## Verification

Initial STEP-02 review commands run with Node.js v26.0.0:

- `npm run lint` - Passed.
- `npm run build` - Passed.
- `npm test -- --watch=false` - Passed.

Test result:

- 12 test files passed.
- 154 tests passed.

Build result:

- Application bundle generation complete.
- Initial total: 256.48 kB raw / 73.23 kB estimated transfer.
- Lazy chunks: `dashboard-component` 10.87 kB, `about-component` 10.41 kB.

---

## QA Handoff

STEP-02 is ready for fresh QA re-check of QA-010 and QA-011, with one verification condition: QA must rerun `npm run build` and `npm test -- --watch=false` under Node.js v26.0.0 because this Tech Lead session hit sandbox `spawn EPERM` on those fresh reruns.

QA should verify:

- no STEP-02 dashboard copy implies completed Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, or completed CAV findings;
- replay fixtures remain synthetic, public-doc-shaped, and free of credentials, private URLs, real customer data, and live-call configuration;
- DocuWare references remain bounded research/demo context and do not imply endorsement, private access, confidential information, production readiness, or product defect/gap claims;
- `package.json` and `package-lock.json` from Sass commit `839f9e0` are excluded from STEP-02 acceptance per A-019.

MOD-W v5.0.1
