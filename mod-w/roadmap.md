# Roadmap - IDP-Align

**Project:** IDP-Align
**Date:** 2026-09-21
**Tech Lead:** Codex
**Status:** Planned

---

## Summary

Build IDP-Align in small, reviewable Steps that first establish the Angular dashboard shell and canonical domain language, then add replay data, Level 1 baseline/divergence logic, evidence detail, chart analysis, and quality gates.

---

## Steps

| Step | Title | Requirement(s) | Agent | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| STEP-01 | Dashboard Foundation, Stream Shell, And About View | R6, R9, R10, R13 | Claude Code | Planned | Replace Angular starter with routed dashboard foundation, shared layout components, and reviewer-facing About route. |
| STEP-02 | CAV Domain Model, Repositories, And Replay Fixtures | R1, R3, R8, R9 | Claude Code | Planned | Add typed document/workflow observations, repository interfaces, and replay adapters. |
| STEP-03 | Observed Baseline And Sustained Divergence Logic | R2, R4, R5, R12 | Claude Code | Planned | Pure domain helpers plus unit tests. |
| STEP-04 | Divergence List, Detail, Baseline, And Evidence Trace | R5, R6, R12 | Claude Code | Planned | Implement shared CAV UI components and selection state. |
| STEP-05 | Filtering, Sorting, Empty, Loading, And Error States | R6 | Claude Code | Planned | Complete dashboard interaction states and responsive behavior. |
| STEP-06 | Divergence Analysis Chart View | R5, R6 | Claude Code or Claude Design | Planned | Implement Chart.js analysis view with metric switching. |
| STEP-07 | Workflow Stream Parity And Cross-Stream Consistency | R3, R4, R6, R9 | Claude Code | Planned | Verify workflow stream uses same model and components with workflow-specific copy/data. |
| STEP-08 | Quality Gate Completion And Documentation | R10, R11 | Claude Code | Planned | E2E flows, docs, final claim guardrails, and readiness for Tech Lead review/QA. |

---

## Step Details

### STEP-01 - Dashboard Foundation, Stream Shell, And About View

**Goal:** Establish the Angular application shell, dashboard route, About route, design tokens, and shared stream layout without implementing full CAV calculations.

**Requirements:** R6, R9, R10, R13

**Output:** Routed dashboard frame with Document/Workflow stream tabs, placeholder KPI/list/detail regions, routed About / Project Context view, approved terminology, responsive layout baseline, and initial tests.

### STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures

**Goal:** Define canonical TypeScript domain types, repository interfaces, and realistic local replay adapters for document and workflow observations.

**Requirements:** R1, R3, R8, R9

**Output:** Typed fixtures, source-agnostic repository contracts, replay adapter implementation, and service boundary feeding both streams.

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
| R1 | STEP-02 | Planned |
| R2 | STEP-03 | Planned |
| R3 | STEP-02, STEP-07 | Planned |
| R4 | STEP-03, STEP-07 | Planned |
| R5 | STEP-03, STEP-04, STEP-06 | Planned |
| R6 | STEP-01, STEP-04, STEP-05, STEP-06, STEP-07 | Planned |
| R7 | Future Step | Deferred until live access/proxy work is explicitly activated. |
| R8 | STEP-02 | Planned |
| R9 | STEP-01, STEP-02, STEP-07 | Planned |
| R10 | STEP-01, STEP-08 | Planned |
| R11 | STEP-03, STEP-05, STEP-08 | Planned |
| R12 | STEP-03, STEP-04 | Planned |
| R13 | STEP-01 | Planned |

---

MOD-W v5.0.1
