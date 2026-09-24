# PRODUCT — IDP-Align

**Project:** IDP-Align  
**Version:** 1.2  
**Date:** 2026-09-24  
**Owner:** Frank McGuire  
**Status:** Product Definition  
**Canonical CAV reference:** The CAV Manifesto v1.0 (cav/CAV-MANIFESTO.md)

## Problem Statement

IDP-Align is a domain-exploration, interview-preparation, and methodology-proof project. Its purpose is to apply Continuous Alignment Verification (CAV) to a domain outside those in which it has already been explored — industrial telemetry (MQTT-Align) and bioprocess monitoring (Bio-Align) — using a real, external, unfamiliar system: DocuWare's enterprise document-processing and workflow-automation domain.

For v1, IDP-Align should surface itself as a personal research and demo project for Frank McGuire's DocuWare Software Engineer interview scheduled for September 28, 2026. The app may name DocuWare and describe the public DocuWare API and workflow/document-processing domain as the research context. It must not imply DocuWare endorsement, access to private DocuWare systems, confidential interview information, production readiness, or a claim that DocuWare has a product gap or defect.

The project observes two distinct data surfaces exposed by DocuWare:

1. **Document/index-field data** via the Platform REST API.
2. **Workflow execution data** via the Workflow Analytics API.

IDP-Align does not reimplement document extraction or workflow orchestration. It acts as an external observer of their outputs and behavior.

The project is intentionally scoped to **CAV Level 1 — Observed-State Divergence**. It continuously constructs Observed Truth, organizes observations into meaningful identity slices, establishes observed baselines from historical behavior, detects sustained divergence, and persists explainable evidence.

Two streams demonstrate the same canonical Level 1 pattern in different forms:

- **Document data stream:** historical extracted index-field behavior is modeled per identity slice such as vendor/document type. New observations are compared with the established observed baseline. Persistent changes in vendor-name representation, amount/currency behavior, date representation, or other selected dimensions are surfaced as divergence.
- **Workflow process stream:** historical workflow execution behavior is modeled per step, branch, decision agent, or other relevant identity slice. Task duration, routing, response time, and error behavior are compared with observed historical behavior. Sustained deviation is surfaced as divergence.

The distinction between these streams is **not** "declared baseline vs. inferred baseline." Under canonical CAV v1.0, both are observed-state verification. An observed baseline may be selected from historical evidence or inferred continuously from it; neither is Declared Intention.

Explicit business rules such as "currency must be EUR," "amount must be below a contractual threshold," or "this workflow step must complete within an agreed limit" are outside the Level 1 implementation. Such machine-readable expectations belong to a future **CAV Level 3 — Intent Registry** extension, with formal intent-vs-observed deltas and envelopes beginning at Level 4.

The project is anchored in DocuWare's Purchase-to-Pay / invoice-processing use case as realistic scenario framing. It does not claim that DocuWare has failed to address these concerns or that IDP-Align identifies an unoccupied product niche.

## CAV Scope

### Implemented target

**CAV Level 1 — Observed-State Divergence**

IDP-Align must demonstrate:

- continuous or replayed observation;
- Observed Truth modeling;
- meaningful identity slicing;
- observed baselines derived from historical behavior;
- sustained-divergence detection rather than one-off anomaly flagging;
- evidence persistence;
- explainable divergence findings.

### Explicitly not implemented

IDP-Align does not claim to implement:

- **Level 2 — Multi-Dimensional Observed Alignment:** cross-environment or multi-source reconciliation beyond what is needed to present the two independent Level 1 streams;
- **Level 3 — Intent Registry:** no machine-readable declared-intent registry;
- **Level 4 — Formal Alignment Deltas + Envelopes:** no formal intent-vs-observed delta engine or declared-intent envelope DSL;
- **Level 5 — Drift Velocity Modeling:** no formal derivative/velocity model over Level 4 alignment deltas;
- **Level 6 — Convergence Enforcement:** no closed-loop remediation or enforcement.

The dashboard may show magnitude, duration, trend, or distance from an **observed baseline** for explainability. Those measurements do not constitute the formal Level 4 Alignment Delta or Level 5 Drift Velocity defined by CAV.

## Target Users

| User                      | Context                                                                                            | Goal                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| AP / Finance Ops Reviewer | Reviews invoices routed through Purchase-to-Pay and relies on extracted index fields               | Trust extracted values without manually re-checking every document, and see evidence when behavior changes materially |
| Workflow / Process Owner  | Owns approval-routing behavior such as task duration, decision agents, responses, and error routes | Know when a workflow step or cohort begins behaving differently from its established historical behavior              |
| AI Model Quality Engineer | Evaluates quality and behavior of AI-assisted document-processing systems                          | Inspect continuous, explainable evidence of behavioral divergence across document and workflow outputs                |

These are scenario personas used to ground the exploration. They are not a claim of validated user research with DocuWare customers or employees.

## Goals

1. Demonstrate through a working implementation that canonical **CAV Level 1 — Observed-State Divergence** transfers coherently to enterprise document-processing and workflow-event data.
2. Construct Observed Truth from extracted document index-field observations and organize it into meaningful identity slices such as vendor and document type.
3. Establish observed per-slice baselines from historical document behavior and surface sustained divergence from those baselines.
4. Construct Observed Truth from Purchase-to-Pay workflow events and establish observed behavioral baselines for selected steps, routes, agents, and timing dimensions.
5. Surface sustained workflow divergence while distinguishing it from one-off variation.
6. Make every divergence finding explainable: identity slice, observed baseline reference, dimension, observed value/behavior, magnitude or distance, onset, duration, and supporting evidence.
7. Use the project to learn the DocuWare domain by building against documented API shapes rather than only reading product material.
8. Demonstrate MOD-W as the development methodology used to research, specify, design, implement, test, review, and approve the reference implementation.
9. Present IDP-Align v1 as a focused DocuWare interview research/demo artifact that explains why the domain is being explored, what public APIs and concepts shaped the implementation, and what the project intentionally does not claim.

## Non-Goals

1. Not a general-purpose IDP or workflow-orchestration engine.
2. Not a reimplementation of DocuWare's Platform REST API, Workflow Analytics API, OCR, Intelligent Indexing, IDP models, agents, or workflow engine.
3. Not a production-grade multi-tenant SaaS product.
4. Not a claim of market novelty or an unoccupied niche. Baseline comparison, drift detection, data observability, ML monitoring, and change-point detection all have mature prior art.
5. Not a general business-process conformance-checking platform.
6. Not an implementation of CAV Levels 2–6.
7. Not an implementation of **CAV Attribution**. Attribution/root-cause lineage remains a separate proposed orthogonal capability and is not part of canonical CAV v1.0 or IDP-Align's committed scope.
8. Not integrated with an existing Cavalieri Align codebase; IDP-Align is a new, standalone, publicly shareable reference implementation.
9. Not a resume or cover-letter claim unless separately reviewed after the project is actually implemented.

## High-Level Requirements

Stable R-IDs are required for traceability.

| ID  | Requirement                                                                                                                                                                                              | Priority    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| R1  | Ingest or replay document index-field observations shaped from DocuWare Platform REST API schemas, including vendor, amount/currency, and date-related fields                                            | Must have   |
| R2  | Build Observed Truth and an observed per-vendor/document-type baseline from historical document observations; detect sustained divergence from that observed baseline                                    | Must have   |
| R3  | Ingest or replay workflow event observations shaped from the Workflow Analytics API, including task duration, decision agent, response time, error/route, and total runtime where available              | Must have   |
| R4  | Build Observed Truth and observed behavioral baselines from historical workflow runs; detect sustained divergence by relevant identity slice such as step, route, or decision agent                      | Must have   |
| R5  | Every divergence finding carries an explainable evidence trace: identity slice, baseline reference, dimension, observed behavior/value, magnitude/distance, onset, duration, and supporting observations | Must have   |
| R6  | Angular v21, signals-only dashboard presenting the document and workflow streams as separate but consistently modeled Level 1 views                                                                      | Must have   |
| R7  | Thin backend/proxy service capable of brokering DocuWare OAuth2/API calls if live access becomes available; credentials never reside in the browser                                                      | Must have   |
| R8  | Build primarily against realistic mock/replay data derived from documented DocuWare API shapes; live DocuWare Cloud access is an opportunistic upgrade, not a dependency                                 | Must have   |
| R9  | Use canonical CAV v1.0 vocabulary: Observed Truth, Identity Slice, Observed Baseline, Divergence, Evidence; preserve standard MOD-W artifact structure and STEP-xx build trail                           | Should have |
| R10 | Maintain Domain Research and References documenting the public DocuWare and adjacent-industry sources that shaped the scope                                                                              | Should have |
| R11 | Automated unit and E2E coverage for baseline/divergence logic and dashboard behavior, consistent with MOD-W quality gates                                                                                | Should have |
| R12 | Persist enough evidence to reconstruct a divergence finding from its source observations and baseline context                                                                                            | Should have |
| R13 | Provide a routed About / Project Context view that names DocuWare as the v1 research/demo domain for the September 28, 2026 interview, explains project intent, dashboard UI, architecture, MOD-W workflow, CAV Level 1 scope, DocuWare API research intent, and project boundaries without endorsement, private-access, confidential-information, or certification claims | Must have |

## Key User Scenarios

### Scenario 1 — Document-stream divergence

Historical invoice observations for a vendor establish an observed pattern for selected index fields. New invoices begin producing a materially different vendor representation, currency/amount pattern, date representation, or other selected field behavior.

IDP-Align groups the observations by identity slice, distinguishes one-off variation from sustained change, confirms divergence, and shows the evidence supporting the finding.

The system does **not** claim the new value violates declared business intent unless such intent is separately introduced in a future Level 3/4 implementation.

### Scenario 2 — Workflow-stream divergence

Historical Purchase-to-Pay workflow runs establish observed behavior for a selected step, route, or decision-agent slice.

Task duration, routing, response time, or error behavior begins to differ persistently from the established observed baseline.

IDP-Align confirms sustained divergence and presents the affected identity slice, baseline context, onset, duration, magnitude/distance, and evidence.

### Scenario 3 — Cross-stream review without cross-stream CAV claim

An AI Model Quality Engineer opens the dashboard and reviews document-stream and workflow-stream divergence side by side.

The two streams share canonical Level 1 concepts and reusable evidence/detail components, but IDP-Align does not claim that simply displaying both streams constitutes Level 2 multi-source reconciliation or Level 4 cross-stream intent alignment.

### Scenario 4 — Future intent extension

A future version could introduce explicit business expectations as machine-readable Intent Artifacts. That would begin a Level 3 extension. Comparing those intent artifacts formally with observed state and evaluating tolerance envelopes would be Level 4.

This scenario documents the architectural direction only; it is not part of the current implementation.

## Acceptance Criteria

- [ ] All Must-have requirements implemented.
- [ ] Both streams model Observed Truth and identity slices explicitly.
- [ ] Both streams use observed baselines; no observed baseline is mislabeled as Declared Intention.
- [ ] Sustained divergence is distinguishable from one-off variation.
- [ ] Every surfaced divergence has reconstructable evidence.
- [ ] UI and code use canonical CAV v1.0 terminology.
- [ ] No feature or documentation claims CAV Level 2–6 capability without satisfying the canonical level definition.
- [ ] No Attribution capability is claimed as implemented.
- [ ] Unit and E2E quality gates pass.
- [ ] No unresolved critical risks.
- [ ] `qa.md` completed.
- [ ] `review.md` approved.
- [ ] Moderator sign-off.

## Risks

| Risk                                                                       | Impact                                                      | Likelihood  | Mitigation                                                                                       |
| -------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| No timely live DocuWare Cloud/API access                                   | Live integration cannot be demonstrated                     | High        | Treat schema-accurate mock/replay data as the primary path from the start                        |
| OAuth2/proxy work consumes the build window                                | Less time for the actual CAV demonstration                  | Medium      | Keep proxy thin; do not build general backend infrastructure                                     |
| Two-stream scope is too broad                                              | Neither stream reaches convincing depth                     | Medium–High | Use the same Level 1 conceptual model for both; keep dimensions and identity slices narrow       |
| Audience interprets the project as a proposed DocuWare product or critique | Undermines its purpose as learning/reference implementation | Low–Medium  | Frame it explicitly as domain exploration using public interfaces and realistic scenarios        |
| DocuWare interview/demo framing is mistaken for endorsement or private access | Creates reputational and accuracy risk | Medium | State that IDP-Align is a personal research/demo project based on public information and optional sandbox access only |
| Synthetic data makes divergence feel contrived                             | Weakens credibility                                         | Medium      | Derive scenarios from documented Purchase-to-Pay shapes and plausible historical variation       |
| Legacy CAV terminology leaks into code/docs                                | Level claims become internally inconsistent                 | Medium      | Treat CAV Manifesto v1.0 as canonical; reject "Level 1 declared / Level 2+ inferred" terminology |
| Observed baseline is mistaken for business truth                           | System overstates what it knows                             | Medium      | UI and evidence detail explicitly label baselines as observed/historical, not intended/required  |
| Attribution is accidentally implied by showing decision-agent context      | Scope creep / false capability claim                        | Low–Medium  | Treat agent/version fields as evidence context only; do not call them root-cause attribution     |

## Assumptions and Constraints

IDP-Align is a scoped, time-boxed personal reference implementation, not a commercial DocuWare product and not a claim of engagement with DocuWare beyond use of public information and interfaces.

IDP-Align v1 is allowed to identify DocuWare by name in the About / Project Context view, navigation-adjacent project context, documentation, tests, and demo copy where doing so clarifies the interview research context. Such references must remain factual, bounded, and non-confidential.

The project follows a lightweight MOD-W v5 pass. PRODUCT is authoritative for product scope. Architecture Definition may be scaled down, while small implementation steps, build gates, annotated Git tags, testing, review, and Moderator sign-off remain part of the build discipline.

The project is a standalone Angular v21 application using signals and modern Angular control flow.

Mock/replay data is the primary data source. Live DocuWare integration may replace or supplement it if access becomes available without jeopardizing the build.

No production-grade authentication, multi-tenancy, persistence, or deployment architecture is implied beyond what is necessary for the reference implementation.

The CAV Manifesto v1.0 is the canonical source for CAV terminology and maturity levels. Earlier documents using "Level 1 = declared baseline" or "Level 2+ = inferred baseline" are superseded for this project.

## Domain Language

Use these terms consistently:

- **Observed Truth** — evidence-backed representation of actual system behavior.
- **Identity Slice** — meaningful cohort/scope used to compare behavior.
- **Observed Baseline** — reference derived from historical or continuously inferred observed behavior.
- **Divergence** — sustained, meaningful departure from an observed baseline or relevant observed comparison.
- **Evidence** — persisted observations and relationships supporting a divergence finding.

Reserved for future CAV levels and **not** to be used as descriptions of current IDP-Align behavior:

- **Declared Intention / Intent** — Level 3+.
- **Alignment Delta** — Level 4+ formal intent-vs-observed difference.
- **Envelope / Breach** — Level 4+ when tied to declared intent.
- **Drift Velocity** — Level 5 formal rate of change of Alignment Delta.
- **Convergence** — Level 6 corrective-action effectiveness.

Avoid using generic words such as "alert" or "anomaly" as replacements for the canonical CAV term **Divergence** when describing CAV findings.

## Attribution Boundary

Root-cause or execution-context attribution answers a different question from CAV's maturity axis: not merely **whether and how a system is diverging**, but **which upstream change plausibly caused the divergence**.

IDP-Align does not implement a change-log correlation engine and therefore does not claim CAV Attribution.

A workflow event's `decision agent` field may be shown as evidence context because it is part of the observed event. Showing that field is not equivalent to correlating a divergence with an independently observed model deployment, configuration change, or other causal event.

## Open Questions

None are blocking the initial build.

Potential future research questions include:

- whether IDP-Align should later demonstrate Level 3 Intent Artifacts;
- whether a Level 4 intent-vs-observed delta is useful in the Purchase-to-Pay scenario;
- whether CAV Attribution should eventually be piloted using an independent change/deployment log.

These are future methodology/product questions, not current requirements.

## Domain Research Positioning

The project adopts the following positioning guardrails:

- IDP-Align observes outputs and workflow behavior; it does not compete with document extraction itself.
- Baseline comparison, statistical drift detection, data observability, ML monitoring, and change-point detection have substantial prior art.
- CAV does not claim a novel detection algorithm. Its contribution is a consistent alignment-verification model and vocabulary across domains.
- Under CAV v1.0, historical and continuously inferred references are both forms of **Observed Baseline**. The distinction between an observed baseline and **Declared Intention** is semantic and architectural, not merely how the baseline was calculated.
- Attribution/root-cause lineage remains outside canonical CAV v1.0 unless separately adopted in a future methodology revision.

## References

Development documentation should cite the specific public sources used for:

- DocuWare AI Hub domain framing;
- DocuWare Platform REST API;
- DocuWare Workflow Analytics API;
- DocuWare Purchase-to-Pay / invoice-processing scenario;
- adjacent ML drift-monitoring, data-observability, and streaming drift-detection approaches;
- the canonical CAV Manifesto v1.0;
- MOD-W methodology.

## Change Log

| Date       | Version | Change                                                                                                                                                                                                                                                                                                                |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-16 | 1.0     | Initial Product Definition established through pre-build domain and market research                                                                                                                                                                                                                                   |
| 2026-09-17 | 1.0.x   | Expanded adjacent-tooling research and corrected vendor/status notes                                                                                                                                                                                                                                                  |
| 2026-09-20 | 1.1     | Reconciled PRODUCT with canonical CAV Manifesto v1.0: replaced obsolete "Level 1 declared / Level 2+ inferred" model with Level 1 Observed-State Divergence; separated Observed Baseline from Declared Intention; moved intent/delta concepts to Levels 3/4; added explicit Attribution boundary and claim guardrails |
| 2026-09-24 | 1.2     | Product Owner updated v1 positioning to explicitly surface IDP-Align as a DocuWare interview research/demo project for September 28, 2026, allowing bounded DocuWare references in project context and demo copy. |
