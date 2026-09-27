# STEP-09 - Population-Specific Divergence Scenario

---

## Goal

Add a convincing synthetic document replay scenario that demonstrates Population-Specific Divergence.

The initial scenario is **Supplier Invoice Population Divergence**: multiple fictional `Supplier x Invoice` Identity Slices establish independent Observed Baselines, and one supplier invoice population surfaces sustained Divergence while peer supplier invoice populations do not surface the same Divergence.

This Step must exercise the existing CAV Level 1 pipeline. It must not introduce a scenario-specific detector, alternate CAV semantics, customer data, live DocuWare access, root-cause attribution, business-correctness judgment, risk classification, or an aggregate-stability finding.

---

## Related Requirements

- R1 - Ingest or replay document index-field observations shaped from DocuWare Platform REST API schemas, including producer/vendor, document type, amount/currency, and date-related fields.
- R2 - Build Observed Truth and observed document baselines by meaningful Identity Slice patterns, including vendor/document-type or producer/document-type populations; detect sustained divergence from those observed baselines.
- R5 - Surface every detected sustained Divergence with explainable and reconstructable Evidence, without classifying behavior as failure, defect, non-conformance, or violation of business intent.
- R6 - Angular v22, signals-only dashboard presenting document and workflow streams as separate but consistently modeled Level 1 views.
- R8 - Build primarily against realistic mock/replay data derived from documented DocuWare API shapes.
- R9 - Use canonical CAV v1.0 vocabulary and preserve MOD-W artifact structure.
- R11 - Automated unit and E2E coverage for baseline/divergence logic and dashboard behavior.
- R12 - Persist enough evidence to reconstruct a divergence finding from source observations and baseline context.

---

## Related Design IDs

| Design ID | Design element | STEP-09 relevance | Product requirement |
| --- | --- | --- | --- |
| DS-001 | Dashboard home layout | Scenario must remain visible through the existing dashboard shell. | R6 |
| DS-002 | Stream selector tabs | Document and Workflow stream separation must not regress. | R6, R11 |
| DS-003 | Summary KPI cards | Document stream summary should factually communicate slice-level coverage without unsupported aggregate-stability claims. | R6, R11 |
| DS-004 | Divergence card | New document Divergence must render through existing card behavior. | R5, R6, R11 |
| DS-005 | Divergence detail pane | Detail must show the affected Supplier x Invoice Identity Slice, Dimension, onset, duration, magnitude, and neutral interpretation boundary. | R5, R6, R12 |
| DS-006 | Baseline reference panel | Each surfaced finding must show its own Observed Baseline reference context. | R5, R12 |
| DS-007 | Evidence trace | Evidence must reconstruct the population-specific Divergence from source observations. | R5, R12 |
| DS-008 | Filter/sort bar | Identity Slice filtering must allow inspection of peer supplier populations. | R6, R11 |
| DS-009 | Document stream summary metrics | Summary must reflect the updated synthetic document replay data. | R1, R2, R6 |
| DS-015 | Divergence Analysis Chart.js detailed view | The new Divergence must support existing analysis behavior using Evidence observations. | R5, R6, R11 |

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** Pending  
**Status:** Draft by Tech Lead for Moderator review.

Development Team may not be briefed on STEP-09 until the Moderator approves this Step and records that approval in the register. No STEP-09 code, fixture, test, or documentation implementation is authorized until the Moderator separately approves the Development Team implementation plan.

---

## Scope

- Add or revise synthetic document replay data so the document stream includes a named, demo-worthy Supplier Invoice Population Divergence scenario.
- Preserve the existing accepted replay scenario behavior; this Step adds a named additional document scenario rather than silently replacing accepted replay evidence.
- Include at least five fictional `Supplier x Invoice` Identity Slices.
- Provide enough historical observations per supplier to derive independent Observed Baselines under the existing detector rules.
- Provide enough recent observations for one supplier invoice population to satisfy the existing sustained-Divergence rules.
- Keep peer supplier invoice populations inside their own Observed Baselines so they do not surface the same Divergence.
- Use dimensions already supported by the current document domain model unless the Development Team plan explicitly identifies a narrow, justified domain/data expansion and receives Moderator approval. Supported document dimensions are:
  - `amount-value`
  - `amount-currency`
  - `vendor-representation`
  - `document-date-lag`
- Prefer a concrete amount-value Divergence for the initial scenario because it cleanly supports Evidence Trace and Divergence Analysis.
- Ensure the UI makes population-specific behavior explicit through factual slice-level presentation, such as "5 Identity Slices observed / 1 with surfaced Divergence", together with individual Identity Slice states.
- Update document-stream labels only as needed to support the approved `Producer x Document Type` / supplier invoice framing while preserving existing terminology guardrails.
- Add focused unit/component/E2E coverage for:
  - per-supplier Observed Baseline derivation;
  - one sustained Divergence for the intentionally changed supplier population;
  - no same-Divergence surfacing for peer supplier populations;
  - reconstructable Evidence Trace and Divergence Analysis for the surfaced finding;
  - factual UI wording with no unsupported aggregate-stability, cause, risk, failure, or business-intent claims.
- Update only bounded documentation or README copy if the Development Team plan justifies a short public-facing note and keeps `mod-w/docs/research-references.md` as the primary research record.

### Synthetic Data Shape

Use the user's sample as conceptual guidance, not literal source data. The fixture must replace placeholder "changed behavior" with concrete observed values.

Example conceptual shape:

```text
Supplier A x Invoice
Historical and recent amounts remain near its own baseline.
Example: 1240 EUR, 1310 EUR, 1180 EUR, 1270 EUR, then recent values still in range.

Supplier B x Invoice
Historical and recent amounts remain near a different stable baseline.
Example: 820 EUR, 790 EUR, 845 EUR, 810 EUR, then recent values still in range.

Supplier C x Invoice
Historical values establish a stable baseline.
Example: 2100 EUR, 2240 EUR, 2180 EUR, plus enough additional reference observations.

Recent values show sustained changed behavior.
Example: Apr, May, and Jun observations outside the Observed Baseline by enough distance to trigger existing sustained-Divergence criteria.
```

The final fixture should include at least five fictional suppliers, enough observations for readable dashboard and chart behavior, and source records that are easy to explain in a demo.

---

## Out Of Scope

- Live DocuWare integration, DocuWare credentials, OAuth, backend/proxy implementation, or non-replay adapters.
- Real customer data or actual DocuWare customer identities in replay fixtures.
- Claiming that Giebeler-Feuerschutz, Piening Personal, Sport Auto Plus, or any other customer experienced the simulated Divergence.
- Replacing the generic Identity Slice abstraction with a new mandatory `Producer` primitive.
- CAV Level 2+ behavior, cross-stream reconciliation, cross-stream comparison, or document/workflow causality.
- Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance as implemented behavior.
- Root-cause Attribution, producer blame, remediation, risk classification, failure, defect, violation, correctness, or business-impact claims.
- Aggregate stream stability as a domain finding unless a separately approved change adds calculation and Evidence support for that conclusion.
- New detector algorithms, changed sustained-Divergence thresholds, changed reference-window semantics, or scenario-specific detection rules unless separately approved.
- New dashboard workflows such as comments, assignments, export, open investigation, mark reviewed, mute, or persisted user actions.
- Adding customer case-study details to the About component.
- Making README the primary research record.
- Broad visual redesign.

---

## Inputs

- `mod-w/product.md`, especially R1, R2, R5, R6, R8, R9, R11, R12, and Scenario 1a.
- `mod-w/domain-language.md`, especially Identity Slice and `Producer x Document Type`.
- `mod-w/docs/research-references.md`, especially section 4a.
- `mod-w/architecture.md`, especially D3, D4, D5, D6, D9, D10, D11, and D13.
- `mod-w/roadmap.md`.
- `mod-w/validation/moderator-register.md`, especially A-069 and A-070.
- `mod-w/design/design-spec.md` DS-001 through DS-009 and DS-015 within its approved authority boundary.
- Existing document replay fixtures, replay mappers, repository tests, domain detector tests, dashboard component tests, and E2E tests under `src/app/` and `e2e/`.
- Current document dimensions in `src/app/domain/divergence-dimension.ts`.
- User-provided conceptual sample:
  - Supplier A stable around 1240 to 1310 EUR.
  - Supplier B stable around 790 to 845 EUR.
  - Supplier C historical around 2100 to 2240 EUR and recent changed behavior.

### Source Conflict Resolution

- A-069 controls the product boundary for Population-Specific Divergence.
- A-070 controls use of external research evidence. The case studies are motivation only and are not replay data.
- `mod-w/docs/research-references.md` is the primary home for case-study details. README and About must not duplicate customer-specific research unless separately approved.
- Product and domain language supersede any design or prototype language that uses alert, anomaly, severity, risk, action, failure, or business-judgment terms.
- The current domain model already supports document dimensions sufficient for this scenario. Prefer existing dimensions over new domain fields.
- The existing document Identity Slice implementation uses vendor/document type fields. For STEP-09, this can serve the approved Supplier x Invoice pattern without creating a new producer primitive.
- If fixture counts in existing tests change, update tests to assert the new intentional scenario behavior rather than brittle old counts.

---

## Expected Artifacts

- Updated synthetic document replay fixture records for the Supplier Invoice Population Divergence scenario.
- Any narrowly required replay mapper or repository updates, while preserving the repository/facade boundary.
- Updated document-stream unit tests for replay fixture shape, Observed Truth grouping, baseline derivation, Divergence detection, and Evidence reconstruction.
- Updated dashboard/component tests for population-specific summary, Identity Slice filtering, Divergence detail, Evidence Trace, and analysis behavior.
- Updated E2E coverage for the scenario in the rendered app.
- Optional bounded README or reviewer-facing note only if justified in the approved implementation plan.
- Development Team handoff with changed files and verification evidence.
- `review.md` after Tech Lead implementation review.
- `qa.md` after QA review.

Do not update `mod-w/roadmap.md` to complete STEP-09, add approval records, or create a final tag as part of Development Team implementation. Those are Moderator/final-gate actions.

---

## Reference Implementation

**Location:** No prototype implementation is authoritative for this feature. Existing production document stream behavior, dashboard components, Evidence Trace, and Divergence Analysis are the reference implementation for how the new scenario should be surfaced.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Reuse the existing CAV Level 1 pipeline:

```text
Replay observations
    ->
repository
    ->
domain observations
    ->
Identity Slice
    ->
Observed Truth
    ->
Observed Baseline
    ->
Divergence detection
    ->
Evidence
    ->
dashboard / analysis
```

- Use existing shared components and domain helpers.
- The new scenario should feel intentional and demo-ready, not like a minimal unit-test fixture.
- The scenario must remain inspectable through existing dashboard flows.

### Rejected Assumptions

- Do not build a custom detector for the scenario.
- Do not label peer populations as "stable" unless that exact state is computed and supported.
- Do not use customer case-study names as suppliers.
- Do not convert `Producer x Document Type` into a new required schema primitive.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-09 Step approval entry before Development Team briefing.
- [ ] A separate Moderator implementation-plan approval is recorded before any STEP-09 code, fixture, test, or documentation changes are made.
- [ ] STEP-09 implementation remains limited to the approved Population-Specific Divergence scope.
- [ ] Existing accepted replay scenario behavior is preserved or explicitly accounted for in the approved implementation plan.
- [ ] Document replay data includes at least five fictional `Supplier x Invoice` Identity Slices.
- [ ] Supplier names are fictional and do not use actual DocuWare customer names.
- [ ] No replay data is copied from DocuWare case studies or other real customer data.
- [ ] Each supplier invoice population has enough historical observations to derive an Observed Baseline where the scenario expects baseline comparison.
- [ ] One supplier invoice population produces sustained recent out-of-baseline observations that trigger existing Divergence detection.
- [ ] Peer supplier invoice populations do not surface the same Divergence.
- [ ] The surfaced Divergence uses existing CAV Level 1 domain logic and detector criteria.
- [ ] No scenario-specific detector, threshold, reference-window, or baseline semantic change is introduced unless separately approved.
- [ ] Evidence Trace reconstructs the surfaced Divergence from source observations and baseline context.
- [ ] Divergence Analysis opens for the new surfaced Divergence and shows useful chart/table data.
- [ ] UI or summary copy makes population-specific behavior explicit through factual slice-level presentation.
- [ ] UI does not claim aggregate document-stream stability unless aggregate stability is calculated and supported by the domain model.
- [ ] UI and documentation do not present Divergence as failure, defect, violation, non-conformance, risk, business correctness, producer blame, root cause, remediation need, or declared-intent mismatch.
- [ ] `Producer x Document Type` is used only as an approved Identity Slice pattern, not as a mandatory primitive.
- [ ] About component does not gain customer-specific case-study details.
- [ ] README, if touched, remains brief and points to the research record rather than becoming the primary research source.
- [ ] Dashboard code continues to depend on the facade/repository boundary and does not import replay fixtures directly.
- [ ] Shared UI components remain presentational and do not call repositories, detectors, adapters, or fixture files.
- [ ] Workflow stream behavior does not regress.
- [ ] Existing filtering, sorting, selection, loading/error/empty states, tab accessibility, and analysis open/back behavior do not regress.
- [ ] Unit/component tests cover the new scenario and updated guardrails.
- [ ] E2E tests cover the demo path for the new document scenario.
- [ ] `npm run lint` passes under the project-approved Node.js version.
- [ ] `npm run build` passes under the project-approved Node.js version.
- [ ] `npm test -- --watch=false` passes under the project-approved Node.js version.
- [ ] `npm run test:e2e` passes under the project-approved Node.js version.
- [ ] Development Team handoff lists changed files, explains fixture/story choices, documents intentionally unchanged boundaries, and provides verification output.
- [ ] Tech Lead review is completed in `review.md` and accepted by the Moderator before QA begins.
- [ ] QA review is completed in `qa.md` before final Moderator gate.

---

## Plan

1. Moderator reviews and, if appropriate, approves this STEP-09 draft for Development Team briefing and implementation planning only.
2. Development Team inspects current document replay fixtures, detector behavior, dashboard summary behavior, analysis behavior, and E2E coverage.
3. Development Team proposes an implementation plan that identifies exact fixture changes, expected supplier populations, selected divergent Dimension(s), UI copy changes if any, tests, verification commands, and any documentation edits.
4. Moderator approves the implementation plan before any code, fixture, test, or documentation implementation begins.
5. Development Team implements only the approved plan.
6. Development Team verifies lint, build, unit/component tests, and E2E under the project-approved Node.js version.
7. Tech Lead reviews implementation in `review.md`.
8. Moderator accepts Tech Lead review before QA begins.
9. QA performs independent review in `qa.md`.
10. Moderator final gate determines STEP-09 completion.

---

## Moderator Decisions Needed

- Whether to approve STEP-09 as the active next implementation Step for Development Team briefing and implementation planning.
- Whether STEP-09 should require Product Owner review after QA because the work changes demo-facing product behavior.
- Whether any README update is permitted in the implementation plan, or whether public-facing documentation should wait until after implementation acceptance.
- Whether the Step should target exactly one surfaced document Divergence or may retain any existing document Divergence if the approved implementation plan explains why.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-27 | Initial STEP-09 draft | Draft bounded implementation Step after Product Owner and Moderator approvals A-069 and A-070 for Population-Specific Divergence. |

---

## Review Notes

Tech Lead review must verify that implementation demonstrates population-specific document Divergence without expanding IDP-Align beyond CAV Level 1.

Review must pay special attention to:

- whether the fixture is synthetic, deterministic, and demo-worthy;
- whether the divergent supplier population and peer populations each use their own Observed Baseline;
- whether the same existing detector surfaces the Divergence;
- whether Evidence Trace and Divergence Analysis reconstruct the finding;
- whether UI wording avoids unsupported aggregate-stability claims;
- whether customer case-study evidence remains research motivation only;
- whether no actual customer identity appears in replay data;
- whether existing dashboard and workflow behavior remains intact.

---

## QA Notes

QA should independently verify:

- the rendered Document stream can demonstrate the Supplier Invoice Population Divergence scenario;
- filters can isolate the divergent supplier and peer supplier populations;
- Evidence Trace and Divergence Analysis remain coherent and accessible;
- source-info and summary counts match the updated replay data;
- no customer case-study data or customer names appear in replay fixtures;
- no UI/docs/tests introduce CAV Level 2+, Attribution, business judgment, alert/anomaly, severity/risk, root-cause, or aggregate-stability claims;
- lint, build, unit/component tests, and E2E pass under the project-approved Node.js version.

---

MOD-W v5.0.1
