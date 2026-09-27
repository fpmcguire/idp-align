# Roadmap - IDP-Align

**Project:** IDP-Align
**Date:** 2026-09-24
**Tech Lead:** Codex
**Status:** Planned

---

## Summary

Build IDP-Align in small, reviewable Steps that first establish the Angular dashboard shell, canonical domain language, and DocuWare-specific interview research/demo framing, then add replay data, Level 1 baseline/divergence logic, evidence detail, chart analysis, and quality gates.

---

## Steps

| Step    | Title                                                 | Requirement(s)                   | Agent       | Status                                                                        | Notes                                                                                                                                                                                                                        |
| ------- | ----------------------------------------------------- | -------------------------------- | ----------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STEP-01 | Dashboard Foundation, Stream Shell, And About View    | R6, R9, R10, R13                 | Claude Code | Complete (A-016, tag `step-01`)                                               | Replace Angular starter with routed dashboard foundation, shared layout components, and DocuWare-specific reviewer-facing About route.                                                                                       |
| STEP-02 | CAV Domain Model, Repositories, And Replay Fixtures   | R1, R3, R8, R9                   | Claude Code | Complete (A-028, tag `step-02`)                                               | Added typed document/workflow observations, repository interfaces, replay adapters, dashboard source facade, and QA-006 dashboard guardrail test coverage.                                                                   |
| STEP-03 | Observed Baseline And Sustained Divergence Logic      | R2, R4, R5, R12                  | Claude Code | Complete (A-033, tag `step-03`)                                               | Added pure domain Observed Baseline derivation, sustained Divergence detection, Evidence construction, and QA-014 workflow overlap handling.                                                                                 |
| STEP-04 | Divergence List, Detail, Baseline, And Evidence Trace | R5, R6, R12                      | Claude Code | Complete (A-039, tag `step-04`)                                               | Added shared CAV Divergence cards, status badges, detail panel, Observed Baseline context, chronological Evidence Trace, stream KPIs, and per-stream selection state; carried QA-014, QA-018, and QA-019 wording guardrails. |
| STEP-05 | Filtering, Sorting, Empty, Loading, And Error States  | R6, R11                          | Claude Code | Complete (A-047)                                                              | Complete dashboard filter/sort interactions, loading/empty/error states, keyboard/focus behavior, and responsive-state checks after STEP-04.                                                                                 |
| STEP-06 | Divergence Analysis Chart View                        | R5, R6, R11                      | Claude Code | Complete (A-052)                                                              | Implemented bundled Chart.js analysis view with metric switching over selected Divergence evidence; categorical browser coverage remains spec-only because replay data is numeric-only.                                      |
| STEP-07 | Workflow Stream Parity And Cross-Stream Consistency   | R3, R4, R6, R9                   | Claude Code | Complete (A-059)                                                              | Workflow parity accepted with notes; categorical workflow behavior remains spec-covered only, and QA-028/QA-029 remain non-blocking carry-forward notes.                                                                     |
| STEP-08 | Quality Gate Completion And Documentation             | R10, R11                         | Claude Code | Complete (A-066)                                                              | Local IDP-Align E2E, R10 research references, About/README current-state copy, and CAV Level 1 claim guardrails accepted with QA notes; categorical workflow remains spec-covered only.                                      |
| STEP-09 | Population-Specific Divergence Scenario               | R1, R2, R5, R6, R8, R9, R11, R12 | Claude Code | QA accepted with notes; pending Product Owner review and final Moderator gate | QA accepted under A-076; Product Owner review of QA-STEP09-002/003 and the final Moderator gate remain pending under A-077.                                                                                                  |
| STEP-10 | Architecture Page                                     | R9, R10, R13, R14                | Claude Code | Approved for Development Team briefing and planning (A-079)                   | Implementation-plan approval remains required; A-079 records a STEP-10-only sequencing override. STEP-09 itself remains incomplete.                                                                                          |

---

## Step Details

### STEP-01 - Dashboard Foundation, Stream Shell, And About View

**Goal:** Establish the Angular application shell, dashboard route, DocuWare-specific About / Project Context route, design tokens, and shared stream layout without implementing full CAV calculations.

**Requirements:** R6, R9, R10, R13

**Output:** Routed dashboard frame with Document/Workflow stream tabs, placeholder KPI/list/detail regions, routed About / Project Context view that names the DocuWare interview research/demo context, approved terminology, responsive layout baseline, and initial tests.

### STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures

**Goal:** Define canonical TypeScript domain types, repository interfaces, and realistic local replay adapters for document and workflow observations.

**Requirements:** R1, R3, R8, R9

**Output:** Typed fixtures, source-agnostic repository contracts, replay adapter implementation, and a service boundary that can feed both streams without dashboard fixture imports. This Step does not implement Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, or completed CAV findings; those remain later Steps.

### STEP-03 - Observed Baseline And Sustained Divergence Logic

**Goal:** Implement pure functions that derive Observed Baselines and identify sustained Divergences from replay observations.

**Requirements:** R2, R4, R5, R12

**Output:** Tested domain logic producing evidence-carrying Divergence records.

### STEP-04 - Divergence List, Detail, Baseline, And Evidence Trace

**Goal:** Render usable divergence cards, detail panel, Observed Baseline context, and chronological Evidence Trace.

**Requirements:** R5, R6, R12

**Output:** Shared components mapped to DS-004, DS-005, DS-006, DS-007, DS-013, and DS-014.

### STEP-05 - Filtering, Sorting, Empty, Loading, And Error States

**Goal:** Complete primary dashboard interactions and state rendering.

**Requirements:** R6, R11

**Output:** Functional filter/sort bar, empty and filtered-empty states, loading/error states, keyboard/focus handling, and responsive behavior. STEP-05 carries the STEP-04 inactive tab-panel reference note into accessibility scope; Chart.js analysis and user action workflows remain later/out of scope.

### STEP-06 - Divergence Analysis Chart View

**Goal:** Add Chart.js detailed analysis with observed values, Observed Baseline, confidence band, and metric switching.

**Requirements:** R5, R6

**Output:** DS-015 implementation using bundled Chart.js.

### STEP-07 - Workflow Stream Parity And Cross-Stream Consistency

**Goal:** Ensure workflow stream reaches the same Level 1 quality as document stream while preserving workflow-specific dimensions.

**Requirements:** R3, R4, R6, R9

**Output:** Workflow dashboard, evidence, and detail parity using shared architecture.

### STEP-08 - Quality Gate Completion And Documentation

**Goal:** Finish MOD-W quality trail and final claim guardrails.

**Requirements:** R10, R11

**Output:** Passing build/tests/E2E, research/reference docs updated, final Tech Lead review and QA readiness.

### STEP-09 - Population-Specific Divergence Scenario

**Goal:** Add a synthetic, demo-worthy Supplier Invoice Population Divergence scenario showing that multiple Supplier x Invoice Identity Slices can establish independent Observed Baselines, with one supplier population surfacing sustained Divergence while peer populations do not surface the same Divergence.

**Requirements:** R1, R2, R5, R6, R8, R9, R11, R12

**Output:** QA accepted with notes under A-076. Product Owner review of QA-STEP09-002/003 and the final Moderator gate remain pending under A-077.

### STEP-10 - Architecture Page

**Goal:** Add a permanent routed Architecture product surface that explains IDP-Align's data flow, CAV Level 1 boundaries, Identity Slice behavior, implementation status, source boundary, research provenance, and future research without interview framing.

**Requirements:** R9, R10, R13, R14

**Output:** Approved for Development Team briefing and planning under A-079. A separate implementation-plan approval is required before code changes.

---

## Coverage Check

| Requirement | Steps                                                | Status                                                                                                                                                                                                |
| ----------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1          | STEP-02                                              | Complete (A-028)                                                                                                                                                                                      |
| R2          | STEP-03, STEP-09                                     | STEP-03 complete (A-033); STEP-09 draft would extend document-stream scenario coverage if approved.                                                                                                   |
| R3          | STEP-02, STEP-07                                     | STEP-02 foundation and STEP-07 workflow parity complete (A-059)                                                                                                                                       |
| R4          | STEP-03, STEP-07                                     | STEP-03 domain logic complete (A-033); STEP-07 workflow parity complete (A-059)                                                                                                                       |
| R5          | STEP-03, STEP-04, STEP-06, STEP-09                   | STEP-03 domain/evidence records complete (A-033); STEP-04 Divergence UI complete (A-039); STEP-06 analysis complete (A-052); STEP-09 draft would add scenario-specific evidence coverage if approved. |
| R6          | STEP-01, STEP-04, STEP-05, STEP-06, STEP-07, STEP-09 | STEP-05 dashboard interactions complete (A-047); STEP-06 analysis complete (A-052); STEP-07 workflow parity complete (A-059); STEP-09 draft would update document scenario presentation if approved.  |
| R7          | Future Step                                          | Deferred until live access/proxy work is explicitly activated.                                                                                                                                        |
| R8          | STEP-02, STEP-09                                     | Complete (A-028); STEP-09 draft would add approved synthetic replay scenario if approved.                                                                                                             |
| R9          | STEP-01, STEP-02, STEP-07, STEP-09                   | STEP-01, STEP-02, and STEP-07 complete (A-059); STEP-09 draft preserves approved Population-Specific Divergence language if approved.                                                                 |
| R10         | STEP-01, STEP-08                                     | Complete (STEP-01; STEP-08 A-066)                                                                                                                                                                     |
| R11         | STEP-03, STEP-05, STEP-06, STEP-08, STEP-09          | Complete (STEP-03, STEP-05, STEP-06, and STEP-08 A-066); STEP-09 draft includes scenario unit/component/E2E coverage if approved.                                                                     |
| R12         | STEP-03, STEP-04, STEP-09                            | STEP-03 evidence-carrying records complete (A-033); STEP-04 Evidence Trace UI complete (A-039); STEP-09 draft would verify reconstructable scenario evidence if approved.                             |
| R13         | STEP-01                                              | Complete (A-016) - DocuWare-specific v1 interview research/demo framing.                                                                                                                              |
| R14         | STEP-10                                              | Approved for STEP-10; implementation-plan approval remains required.                                                                                                                                  |

---

## Change Log

| Date       | Change                                                                                  | Reason                                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-24 | Updated STEP-01 roadmap language for DocuWare-specific interview research/demo framing. | Align roadmap with Product v1.2, STEP-01 update, language matrix, and Moderator approval A-004.                                                                                              |
| 2026-09-24 | Set STEP-01 and R13 to Complete.                                                        | Moderator final gate A-016. Carried conditions PO-1 (About References before 2026-09-28), PO-2, PO-4, QA-006 to QA-008 are recorded in A-016.                                                |
| 2026-09-24 | Authored STEP-02 and marked it pending Moderator approval.                              | Prepare the domain model, repository boundary, replay fixture, and QA-006 guardrail-test scope after STEP-01 completion.                                                                     |
| 2026-09-24 | Updated STEP-02 status after A-017 approval.                                            | Moderator approved STEP-02 for Development Team briefing/planning only; implementation plan approval remains required before code.                                                           |
| 2026-09-25 | Set STEP-02 to Complete.                                                                | Moderator final gate A-028 after Tech Lead review, QA re-checks, QA-012 rework, and final QA acceptance.                                                                                     |
| 2026-09-25 | Authored STEP-03 and marked it pending Moderator approval.                              | Prepare Observed Baseline and sustained Divergence domain logic after STEP-02 completion; carry QA-014 into STEP-03 scope.                                                                   |
| 2026-09-25 | Updated STEP-03 status after A-029 approval.                                            | Moderator approved STEP-03 for Development Team briefing/planning only; implementation plan approval remains required before code.                                                           |
| 2026-09-25 | Set STEP-03 to Complete.                                                                | Moderator final gate A-033 after implementation-plan approval, Tech Lead review acceptance, QA acceptance, and final finding dispositions.                                                   |
| 2026-09-25 | Authored STEP-04 and marked it pending Moderator approval.                              | Prepare UI surfacing of STEP-03 Divergence, Observed Baseline, and Evidence records while carrying QA-019 into status rendering scope.                                                       |
| 2026-09-25 | Updated STEP-04 status after A-034 approval.                                            | Moderator approved STEP-04 for Development Team briefing/planning only; implementation plan approval remains required before code.                                                           |
| 2026-09-25 | Set STEP-04 to Complete.                                                                | Moderator final gate A-039 after implementation-plan approval, tablet rework approval, Tech Lead review acceptance, QA acceptance, and final finding dispositions.                           |
| 2026-09-25 | Authored STEP-05 and marked it pending Moderator approval.                              | Prepare dashboard filtering, sorting, empty/loading/error states, and keyboard/focus refinements after STEP-04 final acceptance A-039.                                                       |
| 2026-09-25 | Updated STEP-05 status after A-040 approval.                                            | Moderator approved STEP-05 for Development Team briefing/planning only; implementation plan approval remains required before code.                                                           |
| 2026-09-26 | Set STEP-05 to Complete.                                                                | Moderator final gate A-047 after Tech Lead review, QA-026 rework, QA re-check, QA acceptance, and finding dispositions.                                                                      |
| 2026-09-26 | Authored STEP-06 and marked it pending Moderator approval.                              | Prepare bundled Chart.js Divergence Analysis view after STEP-05 final acceptance A-047; implementation plan approval remains required before code.                                           |
| 2026-09-26 | Updated STEP-06 status after A-048 approval.                                            | Moderator approved STEP-06 for Development Team briefing/planning only; implementation plan approval remains required before code.                                                           |
| 2026-09-26 | Set STEP-06 to Complete.                                                                | Moderator final gate A-052 after Tech Lead review, QA acceptance, browser verification, and finding dispositions.                                                                            |
| 2026-09-26 | Authored STEP-07 and marked it pending Moderator approval.                              | Prepare workflow stream parity and cross-stream consistency work after STEP-06 final acceptance A-052; implementation plan approval remains required before code.                            |
| 2026-09-26 | Updated STEP-07 status after A-053 approval.                                            | Moderator approved STEP-07 for Development Team briefing/planning only; implementation plan approval remains required before code.                                                           |
| 2026-09-26 | Set STEP-07 to Complete.                                                                | Final Moderator gate A-059 after Tech Lead review, QA acceptance, Product Owner approval, and acceptance of non-blocking notes.                                                              |
| 2026-09-26 | Set STEP-08 to Complete.                                                                | Final Moderator gate A-066 after Tech Lead review acceptance, QA acceptance with notes, Product Owner approval, and finding dispositions.                                                    |
| 2026-09-27 | Added STEP-09 draft pending Moderator approval.                                         | A-069/A-070 authorize Tech Lead to draft a bounded Population-Specific Divergence implementation Step using Supplier Invoice Population Divergence as the initial scenario.                  |
| 2026-09-27 | Approved STEP-10 for briefing and planning under A-079.                                 | Scoped override permits STEP-10 implementation after plan approval without waiting for STEP-09's separate final gate; STEP-09 remains pending Product Owner review and Moderator completion. |

---

MOD-W v5.0.1
