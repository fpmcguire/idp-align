# STEP-08 - Quality Gate Completion And Documentation

---

## Goal

Complete the final documentation and quality-gate pass for IDP-Align v1.

This Step closes the remaining R10/R11 obligations after STEP-07 final acceptance. It should replace starter E2E coverage with IDP-Align-specific Playwright flows, add or update documentation/reference surfaces needed for the public DocuWare research/demo framing, verify final CAV Level 1 claim guardrails across UI and documentation, and produce Step-specific verification evidence.

STEP-08 is a quality and documentation Step. It must not add new CAV behavior, new data scenarios, detector changes, live integration, user workflows, or cross-stream reconciliation.

---

## Related Requirements

- R10 - Maintain Domain Research and References documenting the public DocuWare and adjacent-industry sources that shaped the scope.
- R11 - Automated unit and E2E coverage for baseline/divergence logic and dashboard behavior, consistent with MOD-W quality gates.

Supporting guardrails from R5, R6, R9, and R13 remain active because STEP-08 touches dashboard verification, About/project-context copy, and final claim boundaries.

---

## Related Design IDs

| Design ID | Design element                             | STEP-08 relevance                                                                                                      | Product requirement |
| --------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------- |
| DS-001    | Dashboard home layout                      | E2E must verify the production dashboard shell and stream layout.                                                      | R6, R11             |
| DS-002    | Stream selector tabs                       | E2E must verify accessible Document/Workflow stream switching.                                                         | R6, R11             |
| DS-003    | Summary KPI cards                          | E2E must verify final KPI labels/values and responsive wrapping.                                                       | R6, R11             |
| DS-004    | Divergence card                            | E2E must verify card selection and accessible selected state.                                                          | R5, R6, R11         |
| DS-005    | Divergence detail pane                     | E2E must verify selected detail context and no stale/overclaim copy.                                                   | R5, R6, R11         |
| DS-006    | Baseline reference panel                   | E2E or component coverage must verify Observed Baseline language.                                                      | R5, R11             |
| DS-007    | Evidence trace                             | E2E must verify reconstructable Evidence appears in both streams.                                                      | R5, R11             |
| DS-008    | Filter/sort bar                            | E2E must verify filters, sorting, hidden-selection, and clear-filters behavior.                                        | R6, R11             |
| DS-009    | Document stream summary metrics            | E2E must verify document stream KPI/data presentation does not regress.                                                | R1, R2, R6, R11     |
| DS-010    | Workflow stream summary metrics            | E2E must verify workflow stream KPI/data presentation does not regress.                                                | R3, R4, R6, R11     |
| DS-011    | Empty state                                | Unit/component or E2E coverage must verify empty and filtered-empty states.                                            | R6, R11             |
| DS-012    | Loading state                              | Unit/component coverage must preserve loading/unavailable/retry states.                                                | R6, R11             |
| DS-013    | Status badges                              | E2E or component coverage must verify lifecycle-status semantics remain display-only.                                  | R5, R11             |
| DS-014    | Evidence detail row                        | E2E or component coverage must verify Evidence rows are readable and truthful.                                         | R5, R11             |
| DS-015    | Divergence Analysis Chart.js detailed view | E2E must verify chart rendering, metric switching, focus/back behavior, and lifecycle-sensitive flows where practical. | R5, R6, R11         |

The routed About / Project Context view is required by product and architecture R10/R13 rather than a separate Design ID.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** A-060  
**Status:** Approved by Moderator for Development Team briefing and implementation planning only, subject to A-060 conditions.

Development Team may be briefed and may prepare an implementation plan. No STEP-08 code or documentation implementation is authorized until the Moderator separately approves the Development Team implementation plan and records that approval in the register.

---

## Scope

- Replace the starter Playwright E2E spec under `e2e/` with committed IDP-Align E2E coverage:
  - tests must target the local IDP-Align Angular app, not `playwright.dev` or another external site;
  - tests must run through the existing `npm run test:e2e` script or an approved script update;
  - Playwright configuration may be updated only as needed to serve the local app reliably and keep tests deterministic.
- Verify dashboard behavior through E2E flows:
  - dashboard route loads with Document stream content;
  - About route is reachable and returns to Dashboard;
  - Document and Workflow stream tabs switch accessibly;
  - KPI cards, Divergence cards, detail pane, Observed Baseline context, Evidence Trace, filters, sorting, hidden-selection, and clear-filters behavior work in the rendered browser;
  - Divergence Analysis opens from a selected Divergence, provides an accessible back path, supports Workflow Approval metric switching, and closes coherently on stream switch;
  - responsive behavior is checked at minimum at 1280px and 1279px, with mobile coverage at a narrow viewport such as 375px when practical.
- Preserve and, where needed, strengthen unit/component tests for final claim guardrails:
  - CAV Level 1 terms are used consistently;
  - Observed Baseline is not described as target, intent, policy, requirement, or what should happen;
  - Divergence is not described as alert, anomaly, violation, breach, failure, defect, non-conformance, severity, risk, business correctness, or root cause;
  - workflow decision agent, route/error, response time, task duration, runtime, and instance state remain factual Evidence context only.
- Complete R10 research/reference documentation:
  - carry forward PO-1 from A-014 by adding an About References section linking the public DocuWare Platform REST API and Workflow Analytics API documentation, unless a separate Moderator-approved About-only change already satisfies this before STEP-08 implementation;
  - ensure public reference links use safe external-link attributes such as `target="_blank"` and `rel="noopener noreferrer"` when rendered in the app;
  - ensure reference copy makes clear that IDP-Align is based on public documentation and does not imply DocuWare endorsement, private access, confidential interview information, production readiness, or a DocuWare product defect/gap claim.
- Route the known stale About copy as STEP-08 documentation scope:
  - update the STEP-01-era About statements that say replay data, Observed Baseline calculation, sustained Divergence detection, Evidence traces, chart analysis, domain functions, and replay adapters are planned or "added in later Steps";
  - replace them with accurate current-state copy that describes implemented replay data, Observed Baseline/Divergence logic, Evidence Trace, chart analysis, shared dashboard streams, and repository/adapter boundary without overclaiming production readiness or live access.
- Create or update a durable research/reference artifact under `mod-w/docs/`, as required by architecture D10. The About References section is a concise user-facing summary and does not replace this artifact.
- Document the specific sources actually consulted for the Product References topics: DocuWare AI Hub; Platform REST API; Workflow Analytics API; Purchase-to-Pay/invoice processing; relevant adjacent ML drift-monitoring, data-observability, and streaming-drift approaches; canonical CAV Manifesto v1.0; and MOD-W methodology. Explain how each source informed scope; do not claim sources were consulted if they were not.
- Add README or reviewer-facing quality-gate notes only if the implementation plan justifies them and keeps them consistent with CAV Level 1 boundaries.
- Produce STEP-08-specific verification evidence for:
  - lint;
  - production build;
  - unit/component tests;
  - E2E tests;
  - documentation/reference checks;
  - final rendered/static CAV claim guardrails.

---

## Out Of Scope

- New CAV features, new CAV levels, cross-stream reconciliation, cross-stream comparison, cross-stream correlation, or CAV Level 2+ claims.
- CAV Level 3+ concepts as implemented behavior, including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance.
- Attribution/root-cause claims or change-log/deployment correlation.
- Changes to sustained-Divergence algorithms, thresholds, reference windows, baseline semantics, evidence construction, fixture values, replay scenarios, or status lifecycle semantics.
- Adding categorical workflow replay fixtures or making categorical workflow behavior browser-visible solely to close the recorded coverage limitation.
- Reopening QA-028 uneven duration tick formatting or QA-029 potential keyboard access for a future horizontally scrolling chart table, unless the Development Team proposes a specific, justified STEP-08 scope item and the Moderator approves it before implementation.
- Live DocuWare API calls, OAuth, authentication, credentials, backend/proxy implementation, non-replay adapters, tenant configuration, or deployment infrastructure.
- User action workflows such as copy details, mute, mark reviewed, resolve, export, open investigation, comments, assignments, or persisted reviewed/muted state.
- Package dependency or chart-library changes unless the implementation plan identifies a quality-gate blocker and obtains separate Moderator approval.
- Visual redesign, new dashboard features, new dashboard data dimensions, or prototype-only action controls.
- Rewriting MOD-W governance history, changing accepted prior Step artifacts except where STEP-08 documentation updates are explicitly scoped, or marking STEP-08 complete before Tech Lead review, QA acceptance, Product Owner review if required, and Moderator final gate.

---

## Inputs

- `mod-w/product.md` v1.3, especially R10, R11, References, CAV Scope, Domain Research Positioning, and claim guardrails.
- `mod-w/design/design-spec.md` DS-001 through DS-015 within its approved authority boundary.
- `mod-w/architecture.md` D1, D2, D3, D4, D6, D7, D9, D10, D11, D12, and D13.
- `mod-w/domain-language.md`.
- `mod-w/language-matrix.md`.
- `mod-w/roadmap.md`.
- `mod-w/validation/moderator-register.md`, especially:
  - A-014 PO-1 About References carry-forward;
  - A-058 STEP-08 final-gate eligibility blockers;
  - A-059 STEP-07 final Moderator gate and accepted notes.
  - A-060 STEP-08 Step approval and conditions.
- `review.md` STEP-07 Tech Lead review.
- `qa.md` STEP-07 QA review, especially QA-028, QA-029, QA-031, QA-032, and categorical workflow coverage limitation.
- Current Playwright setup:
  - `package.json` scripts `test:e2e`, `test:e2e:ui`, and `test:e2e:report`;
  - `playwright.config.ts`;
  - `e2e/example.spec.ts`, currently starter coverage against `playwright.dev` and not acceptable as IDP-Align E2E evidence.
- Current About implementation and tests under `src/app/features/about/`.
- Current dashboard/domain/data/unit tests under `src/app/`.

### Source Conflict Resolution

- The roadmap summary says STEP-08 covers "E2E flows, docs, final claim guardrails, and readiness." This Step definition, once approved, controls the actual STEP-08 scope and acceptance checks; the roadmap summary alone is not acceptance criteria.
- A-014 records PO-1 as either a STEP-08 acceptance check or a separately approved About-only change. Unless the Moderator records such a separate change before STEP-08 implementation, STEP-08 includes the About References section.
- A-058 records that the current Playwright starter spec is not valid STEP-08 evidence. STEP-08 must replace or remove starter external-site tests and verify IDP-Align behavior.
- A-059 completes STEP-07 and accepts the categorical workflow browser limitation. STEP-08 must preserve that limitation unless the Moderator separately approves fixture/data scope.
- STEP-07 QA-031 accepted "Failed" as a factual source-state label when rendered under "Instance state." STEP-08 guardrails should not blindly fail source-state labels when they are clearly presented as source Evidence context; they should still reject judgmental "failure" claims.
- Product and domain language supersede design examples that use alert/severity/action language. STEP-08 must keep design intent while preserving CAV Level 1 wording.

---

## Expected Artifacts

- Proposed updates to `e2e/` replacing starter Playwright tests with IDP-Align E2E flows.
- Possible updates to `playwright.config.ts` or npm scripts only if needed for deterministic local app serving and approved by the implementation plan.
- Updates to About copy and About specs for:
  - public DocuWare Platform REST API and Workflow Analytics API reference links;
  - accurate current-state dashboard/architecture wording after Steps 02-07.
- A durable research/reference artifact under `mod-w/docs/`, with citations to the specific sources consulted for the Product References topics listed in the R10 scope above.
- Focused unit/component tests for final documentation/reference and claim-guardrail behavior.
- STEP-08-specific verification evidence in the Development Team handoff.
- `review.md` after Tech Lead review.
- `qa.md` after QA review.

Do not update `mod-w/roadmap.md` to complete STEP-08, add approval records, or create a final tag as part of Development Team implementation. Those are Moderator/final-gate actions.

---

## Reference Implementation

**Location:** Prototype evidence exists under `mod-w/design/project/` for dashboard, Divergence list/detail, Evidence Trace, workflow summary examples, and Divergence Analysis concepts.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Use the prototype only as evidence for expected dashboard behavior already implemented in production.
- E2E tests must exercise the production Angular app and its approved shared components, not prototype HTML/scripts.
- Documentation updates must reflect product/architecture/domain-language authority, not prototype-only action language or alert/severity wording.

### Prototype Assumption Disposition

Accepted prototype assumptions:

- The dashboard should remain inspectable through realistic Document and Workflow stream flows.
- Divergence cards, detail, Observed Baseline, Evidence Trace, filters, and analysis are central behaviors worth E2E coverage.

Modified prototype assumptions:

- User actions shown in the prototype remain out of scope.
- Chart.js behavior is the implemented bundled production analysis, not prototype CDN/script behavior.
- Final documentation should describe the current production architecture and quality gates, not prototype scaffolding.

Rejected prototype assumptions:

- Alert, anomaly, severity, risk, action-menu, mute, mark-reviewed, copy-details, or investigation language as current implemented behavior.
- Cross-stream reconciliation or CAV Level 2+ interpretation.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-08 Step approval entry before Development Team briefing.
- [ ] A separate Moderator implementation-plan approval is recorded before any STEP-08 code or documentation changes are made.
- [ ] STEP-08 implementation remains limited to approved R10/R11 documentation, E2E, guardrail, and quality-gate scope.
- [ ] The Playwright starter tests against `playwright.dev` are removed or replaced; no committed E2E test depends on external starter websites.
- [ ] `npm run test:e2e` runs committed E2E tests against the local IDP-Align app.
- [ ] E2E coverage verifies the dashboard initial load, Document stream KPI/list/detail/Evidence path, and About navigation.
- [ ] E2E coverage verifies Workflow stream KPI/list/detail/Evidence path, stream tab accessibility, and no cross-stream state contamination.
- [ ] E2E coverage verifies filters, sorting, hidden-selection, filtered-empty, clear-filters, and per-stream state behavior for at least one stream, with workflow coverage where practical.
- [ ] E2E coverage verifies Divergence Analysis open/back behavior, focus movement, Workflow Approval metric switching, chart rendering, and coherent stream-switch closure.
- [ ] E2E coverage verifies responsive behavior at 1280px and 1279px, and includes a narrow mobile viewport such as 375px when practical.
- [ ] E2E or automated browser checks verify no console errors and no unexpected external network requests during dashboard/About flows, except user-triggered navigation to explicit public reference links if such navigation is intentionally tested.
- [ ] Unit/component tests for CAV domain logic and dashboard behavior continue to pass and are not weakened.
- [ ] Existing STEP-05, STEP-06, and STEP-07 behavior remains covered and does not regress, including filters, sorting, hidden-selection, loading/unavailable/retry states, tab accessibility, analysis open/back, metric switching, chart lifecycle, and 1279px/1280px behavior.
- [ ] About includes a References section linking the public DocuWare Platform REST API and Workflow Analytics API documentation, unless a separate Moderator-approved About-only change has already satisfied PO-1 from A-014.
- [ ] About/reference links use safe external-link attributes where rendered in the app.
- [ ] About current-state copy no longer says that replay data, Observed Baseline calculation, sustained Divergence detection, Evidence traces, chart analysis, domain functions, or replay adapters are merely planned or added in later Steps.
- [ ] Documentation/reference artifacts cite public sources used for DocuWare API/domain framing and adjacent context required by R10, without implying private access, endorsement, confidential information, production readiness, or a DocuWare defect/gap claim.
- [ ] A durable research/reference artifact exists under `mod-w/docs/` consistent with D10 and records the specific consulted sources relevant to the Product References topics listed in the R10 scope, with their relevance and bounded, non-confidential framing. About links alone do not satisfy this check.
- [ ] Documentation/reference artifacts do not imply private access, endorsement, confidential information, production readiness, or a DocuWare defect/gap claim.
- [ ] UI and documentation claim only CAV Level 1 - Observed-State Divergence as implemented behavior.
- [ ] Observed Baseline is not described as a target, intended value, policy, requirement, or business truth.
- [ ] Divergence is not described as an alert, anomaly, violation, breach, failure, defect, non-conformance, severity, risk, business-correctness judgment, or root-cause finding.
- [ ] Workflow decision agent, route/error, task duration, response time, runtime, and instance state remain factual Evidence context and do not imply Attribution.
- [ ] No UI, E2E, test, or documentation copy introduces cross-stream reconciliation, comparison, correlation, CAV Level 2+, Declared Intention / Intent as implemented behavior, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution.
- [ ] Categorical workflow behavior remains recorded as spec-covered only unless separate Moderator approval authorizes replay data changes; STEP-08 does not add categorical workflow fixtures or browser-visible categorical replay solely for coverage.
- [ ] QA-028 and QA-029 remain accepted non-blocking carry-forward notes unless the implementation plan explicitly routes and the Moderator approves a narrow fix.
- [ ] No fixtures, detection algorithms, thresholds, reference windows, baseline semantics, evidence construction, lifecycle status semantics, live DocuWare calls, credentials, OAuth, backend/proxy code, non-replay adapters, package dependencies, or chart libraries are changed unless separately approved before implementation.
- [ ] Shared UI components remain presentational and do not call repositories, detectors, adapters, fixture files, or browser APIs unrelated to their presentation responsibility.
- [ ] Dashboard code continues to use the facade/repository boundary and does not import replay fixtures directly or recompute Observed Baselines/sustained Divergences inline.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.
- [ ] `npm run test:e2e` passes under Node.js v26.0.0 and produces STEP-08-specific IDP-Align E2E evidence.
- [ ] Development Team handoff lists changed files, explains documentation/E2E changes, documents any intentionally unchanged carry-forward notes, and provides verification output.
- [ ] Tech Lead review is completed in `review.md` and accepted by the Moderator before QA begins.
- [ ] QA review is completed in `qa.md`, including independent verification of R10/R11 checks, before any STEP-08 final gate is requested.
- [ ] Product Owner review of the updated About/reference copy is recorded after QA and before the STEP-08 final Moderator gate.

---

## Plan

1. Moderator approval A-060 authorizes Development Team briefing and implementation planning only.
2. Development Team inspects current E2E/tooling, About copy, documentation gaps, and guardrail tests, then proposes an implementation plan.
3. The implementation plan identifies exact E2E flows, the mandatory `mod-w/docs/` research/reference artifact and sources, About/reference updates, guardrail checks, documentation edits, any tooling/script changes, and the Product Owner review handoff.
4. Wait for separate Moderator implementation-plan approval before any code or documentation implementation.
5. Implement only the approved R10/R11 scope and verify lint, build, unit/component tests, and E2E under Node.js v26.0.0.
6. Hand off the completed diff and evidence for Tech Lead review, then QA; obtain Product Owner review after QA and before the final Moderator gate.

---

## Moderator Decisions (A-060)

- A durable `mod-w/docs/` research/reference artifact is mandatory under D10/R10; the About References section is a separate concise summary.
- Product Owner review of About/reference copy is required after QA and before the final Moderator gate.
- The implementation plan chooses a deterministic local-app Playwright server strategy; any config or script changes remain subject to plan approval.
- README/reviewer documentation updates are optional and must be justified in the implementation plan.
- A-059's QA-031 disposition is sufficient: factual source-state text such as "Failed" under "Instance state" is acceptable; guardrail checks must evaluate context.

---

## Change Notes

| Date       | Change                                       | Reason                                                                                                                                        |
| ---------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-26 | Initial STEP-08 proposed                     | Define R10/R11 quality-gate and documentation scope after STEP-07 final acceptance A-059 and A-058 final-gate eligibility blockers.           |
| 2026-09-26 | Synced STEP-08 with Moderator approval A-060 | Made D10/R10 research artifact and Product Owner final-gate review explicit; replaced superseded Moderator questions with recorded decisions. |

---

## Review Notes

Tech Lead review must verify that STEP-08 closes quality-gate and documentation gaps without expanding the product beyond CAV Level 1.

Review must pay special attention to:

- whether E2E tests exercise IDP-Align behavior rather than Playwright starter pages;
- whether About/reference copy satisfies PO-1 and accurately reflects the implemented current state;
- whether R10 references are public, bounded, and non-confidential;
- whether final UI/docs/tests avoid CAV Level 2+, Attribution, business judgment, alert/anomaly, severity/risk, and live-access claims;
- whether STEP-05 through STEP-07 behavior remains intact;
- whether categorical workflow behavior, QA-028, and QA-029 remain honestly documented without being reopened silently.

---

## QA Notes

QA should independently run or inspect:

- lint, build, unit/component tests, and committed E2E tests under Node.js v26.0.0;
- rendered About references and current-state copy;
- dashboard E2E flows in both streams, including filters, sorting, hidden-selection, Evidence, analysis open/back, metric switching, focus, and responsive breakpoints;
- static and rendered claim-guardrail scans across UI and documentation;
- absence of direct fixture imports in dashboard/shared UI production code and absence of live DocuWare/network behavior except explicit public reference links.

QA should record that categorical workflow behavior remains spec-covered only unless a separately approved change alters that fact. QA should also preserve QA-028 and QA-029 as accepted non-blocking notes unless the approved STEP-08 implementation plan explicitly routes them.

---

MOD-W v5.0.1
