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

| Step    | Title                                                 | Requirement(s)   | Agent       | Status                          | Notes                                                                                                                                                                                                                        |
| ------- | ----------------------------------------------------- | ---------------- | ----------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STEP-01 | Dashboard Foundation, Stream Shell, And About View    | R6, R9, R10, R13 | Claude Code | Complete (A-016, tag `step-01`) | Replace Angular starter with routed dashboard foundation, shared layout components, and DocuWare-specific reviewer-facing About route.                                                                                       |
| STEP-02 | CAV Domain Model, Repositories, And Replay Fixtures   | R1, R3, R8, R9   | Claude Code | Complete (A-028, tag `step-02`) | Added typed document/workflow observations, repository interfaces, replay adapters, dashboard source facade, and QA-006 dashboard guardrail test coverage.                                                                   |
| STEP-03 | Observed Baseline And Sustained Divergence Logic      | R2, R4, R5, R12  | Claude Code | Complete (A-033, tag `step-03`) | Added pure domain Observed Baseline derivation, sustained Divergence detection, Evidence construction, and QA-014 workflow overlap handling.                                                                                 |
| STEP-04 | Divergence List, Detail, Baseline, And Evidence Trace | R5, R6, R12      | Claude Code | Complete (A-039, tag `step-04`) | Added shared CAV Divergence cards, status badges, detail panel, Observed Baseline context, chronological Evidence Trace, stream KPIs, and per-stream selection state; carried QA-014, QA-018, and QA-019 wording guardrails. |
| STEP-05 | Filtering, Sorting, Empty, Loading, And Error States  | R6, R11          | Claude Code | Complete (A-047)                | Complete dashboard filter/sort interactions, loading/empty/error states, keyboard/focus behavior, and responsive-state checks after STEP-04.                                                                                 |
| STEP-06 | Divergence Analysis Chart View                        | R5, R6, R11      | Claude Code | Complete (A-052)                | Implemented bundled Chart.js analysis view with metric switching over selected Divergence evidence; categorical browser coverage remains spec-only because replay data is numeric-only.                                      |
| STEP-07 | Workflow Stream Parity And Cross-Stream Consistency   | R3, R4, R6, R9   | Claude Code | Approved for Dev Team planning (A-053) | Verify workflow stream uses same model and components with workflow-specific copy/data; implementation plan approval remains required before code.                                                                    |
| STEP-08 | Quality Gate Completion And Documentation             | R10, R11         | Claude Code | Planned                         | E2E flows, docs, final claim guardrails, and readiness for Tech Lead review/QA.                                                                                                                                              |

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

---

## Coverage Check

| Requirement | Steps                                       | Status                                                                                                                      |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| R1          | STEP-02                                     | Complete (A-028)                                                                                                            |
| R2          | STEP-03                                     | Complete (A-033)                                                                                                            |
| R3          | STEP-02, STEP-07                            | STEP-02 foundation complete; STEP-07 approved for parity planning (A-053)                                                   |
| R4          | STEP-03, STEP-07                            | STEP-03 domain logic complete (A-033); STEP-07 approved for parity planning (A-053)                                         |
| R5          | STEP-03, STEP-04, STEP-06                   | STEP-03 domain/evidence records complete (A-033); STEP-04 Divergence UI complete (A-039); STEP-06 analysis complete (A-052) |
| R6          | STEP-01, STEP-04, STEP-05, STEP-06, STEP-07 | STEP-05 dashboard interactions complete (A-047); STEP-06 analysis complete (A-052); STEP-07 parity planning approved (A-053) |
| R7          | Future Step                                 | Deferred until live access/proxy work is explicitly activated.                                                              |
| R8          | STEP-02                                     | Complete (A-028)                                                                                                            |
| R9          | STEP-01, STEP-02, STEP-07                   | STEP-01 and STEP-02 complete; STEP-07 parity planning approved (A-053)                                                      |
| R10         | STEP-01, STEP-08                            | Planned                                                                                                                     |
| R11         | STEP-03, STEP-05, STEP-06, STEP-08          | STEP-03, STEP-05, and STEP-06 quality gates complete; STEP-08 remains planned                                               |
| R12         | STEP-03, STEP-04                            | STEP-03 evidence-carrying records complete (A-033); STEP-04 Evidence Trace UI complete (A-039)                              |
| R13         | STEP-01                                     | Complete (A-016) - DocuWare-specific v1 interview research/demo framing.                                                    |

---

## Change Log

| Date       | Change                                                                                  | Reason                                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-09-24 | Updated STEP-01 roadmap language for DocuWare-specific interview research/demo framing. | Align roadmap with Product v1.2, STEP-01 update, language matrix, and Moderator approval A-004.                                                                    |
| 2026-09-24 | Set STEP-01 and R13 to Complete.                                                        | Moderator final gate A-016. Carried conditions PO-1 (About References before 2026-09-28), PO-2, PO-4, QA-006 to QA-008 are recorded in A-016.                      |
| 2026-09-24 | Authored STEP-02 and marked it pending Moderator approval.                              | Prepare the domain model, repository boundary, replay fixture, and QA-006 guardrail-test scope after STEP-01 completion.                                           |
| 2026-09-24 | Updated STEP-02 status after A-017 approval.                                            | Moderator approved STEP-02 for Development Team briefing/planning only; implementation plan approval remains required before code.                                 |
| 2026-09-25 | Set STEP-02 to Complete.                                                                | Moderator final gate A-028 after Tech Lead review, QA re-checks, QA-012 rework, and final QA acceptance.                                                           |
| 2026-09-25 | Authored STEP-03 and marked it pending Moderator approval.                              | Prepare Observed Baseline and sustained Divergence domain logic after STEP-02 completion; carry QA-014 into STEP-03 scope.                                         |
| 2026-09-25 | Updated STEP-03 status after A-029 approval.                                            | Moderator approved STEP-03 for Development Team briefing/planning only; implementation plan approval remains required before code.                                 |
| 2026-09-25 | Set STEP-03 to Complete.                                                                | Moderator final gate A-033 after implementation-plan approval, Tech Lead review acceptance, QA acceptance, and final finding dispositions.                         |
| 2026-09-25 | Authored STEP-04 and marked it pending Moderator approval.                              | Prepare UI surfacing of STEP-03 Divergence, Observed Baseline, and Evidence records while carrying QA-019 into status rendering scope.                             |
| 2026-09-25 | Updated STEP-04 status after A-034 approval.                                            | Moderator approved STEP-04 for Development Team briefing/planning only; implementation plan approval remains required before code.                                 |
| 2026-09-25 | Set STEP-04 to Complete.                                                                | Moderator final gate A-039 after implementation-plan approval, tablet rework approval, Tech Lead review acceptance, QA acceptance, and final finding dispositions. |
| 2026-09-25 | Authored STEP-05 and marked it pending Moderator approval.                              | Prepare dashboard filtering, sorting, empty/loading/error states, and keyboard/focus refinements after STEP-04 final acceptance A-039.                             |
| 2026-09-25 | Updated STEP-05 status after A-040 approval.                                            | Moderator approved STEP-05 for Development Team briefing/planning only; implementation plan approval remains required before code.                                 |
| 2026-09-26 | Set STEP-05 to Complete.                                                                | Moderator final gate A-047 after Tech Lead review, QA-026 rework, QA re-check, QA acceptance, and finding dispositions.                                            |
| 2026-09-26 | Authored STEP-06 and marked it pending Moderator approval.                              | Prepare bundled Chart.js Divergence Analysis view after STEP-05 final acceptance A-047; implementation plan approval remains required before code.                 |
| 2026-09-26 | Updated STEP-06 status after A-048 approval.                                            | Moderator approved STEP-06 for Development Team briefing/planning only; implementation plan approval remains required before code.                                 |
| 2026-09-26 | Set STEP-06 to Complete.                                                                | Moderator final gate A-052 after Tech Lead review, QA acceptance, browser verification, and finding dispositions.                                                  |
| 2026-09-26 | Authored STEP-07 and marked it pending Moderator approval.                              | Prepare workflow stream parity and cross-stream consistency work after STEP-06 final acceptance A-052; implementation plan approval remains required before code.   |
| 2026-09-26 | Updated STEP-07 status after A-053 approval.                                            | Moderator approved STEP-07 for Development Team briefing/planning only; implementation plan approval remains required before code.                                 |

---

MOD-W v5.0.1
