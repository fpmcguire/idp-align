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

| Step | Title | Requirement(s) | Agent | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| STEP-01 | Dashboard Foundation, Stream Shell, And About View | R6, R9, R10, R13 | Claude Code | Complete (A-016, tag `step-01`) | Replace Angular starter with routed dashboard foundation, shared layout components, and DocuWare-specific reviewer-facing About route. |
| STEP-02 | CAV Domain Model, Repositories, And Replay Fixtures | R1, R3, R8, R9 | Claude Code | Authored, pending Moderator approval | Add typed document/workflow observations, repository interfaces, replay adapters, and QA-006 dashboard guardrail test coverage. |
| STEP-03 | Observed Baseline And Sustained Divergence Logic | R2, R4, R5, R12 | Claude Code | Planned | Pure domain helpers plus unit tests. |
| STEP-04 | Divergence List, Detail, Baseline, And Evidence Trace | R5, R6, R12 | Claude Code | Planned | Implement shared CAV UI components and selection state. |
| STEP-05 | Filtering, Sorting, Empty, Loading, And Error States | R6 | Claude Code | Planned | Complete dashboard interaction states and responsive behavior. |
| STEP-06 | Divergence Analysis Chart View | R5, R6 | Claude Code or Claude Design | Planned | Implement Chart.js analysis view with metric switching. |
| STEP-07 | Workflow Stream Parity And Cross-Stream Consistency | R3, R4, R6, R9 | Claude Code | Planned | Verify workflow stream uses same model and components with workflow-specific copy/data. |
| STEP-08 | Quality Gate Completion And Documentation | R10, R11 | Claude Code | Planned | E2E flows, docs, final claim guardrails, and readiness for Tech Lead review/QA. |

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

**Requirements:** R6

**Output:** Filter/sort bar, empty state, loading/error states, keyboard/focus handling, and responsive behavior.

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

| Requirement | Steps | Status |
| --- | --- | --- |
| R1 | STEP-02 | Authored, pending approval |
| R2 | STEP-03 | Planned |
| R3 | STEP-02, STEP-07 | STEP-02 authored, pending approval; STEP-07 planned |
| R4 | STEP-03, STEP-07 | Planned |
| R5 | STEP-03, STEP-04, STEP-06 | Planned |
| R6 | STEP-01, STEP-04, STEP-05, STEP-06, STEP-07 | Planned |
| R7 | Future Step | Deferred until live access/proxy work is explicitly activated. |
| R8 | STEP-02 | Authored, pending approval |
| R9 | STEP-01, STEP-02, STEP-07 | STEP-01 complete; STEP-02 authored, pending approval; STEP-07 planned |
| R10 | STEP-01, STEP-08 | Planned |
| R11 | STEP-03, STEP-05, STEP-08 | Planned |
| R12 | STEP-03, STEP-04 | Planned |
| R13 | STEP-01 | Complete (A-016) - DocuWare-specific v1 interview research/demo framing. |

---

## Change Log

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-24 | Updated STEP-01 roadmap language for DocuWare-specific interview research/demo framing. | Align roadmap with Product v1.2, STEP-01 update, language matrix, and Moderator approval A-004. |
| 2026-09-24 | Set STEP-01 and R13 to Complete. | Moderator final gate A-016. Carried conditions PO-1 (About References before 2026-09-28), PO-2, PO-4, QA-006 to QA-008 are recorded in A-016. |
| 2026-09-24 | Authored STEP-02 and marked it pending Moderator approval. | Prepare the domain model, repository boundary, replay fixture, and QA-006 guardrail-test scope after STEP-01 completion. |

---

MOD-W v5.0.1
