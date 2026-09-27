# Architecture - IDP-Align

**Project:** IDP-Align
**Date:** 2026-09-21
**Tech Lead:** Codex
**Status:** Architecture Definition

---

## Overview

IDP-Align is a standalone Angular dashboard that demonstrates CAV Level 1 - Observed-State Divergence for two independent streams: document index-field observations and workflow execution observations.

The implementation is mock/replay-first. It must model Observed Truth, Identity Slices, Observed Baselines, Divergences, and Evidence explicitly, then render both streams through shared UI and domain structures. Live external-platform access is a later adapter, not a dependency for the reference implementation.

The app must also include a routed About / Project Context view that explains the project's intent, UI, architecture, MOD-W workflow, CAV Level 1 framing, and scope boundaries for interview reviewers. For v1, this view should explicitly identify DocuWare as the research/demo domain for Frank McGuire's September 28, 2026 interview and explain the public DocuWare API/domain-learning intent. It may state that IDP-Align is itself a MOD-W project and that part of the project purpose is to assess the current MOD-W version in a realistic build. It must not imply DocuWare endorsement, private-system access, confidential interview content, production readiness, or a DocuWare product defect/gap claim.

---

## Requirement To Architecture Mapping

| Requirement | Decision(s) | Notes |
| --- | --- | --- |
| R1 | D3, D4, D13 | Document observations use external-platform-shaped replay fixtures behind a repository/adapter boundary. |
| R2 | D3, D5 | Document baselines and sustained divergence are computed from observed history. |
| R3 | D3, D4, D13 | Workflow observations use workflow analytics-shaped replay fixtures behind a repository/adapter boundary. |
| R4 | D3, D5 | Workflow baselines and sustained divergence use the same Level 1 pattern. |
| R5 | D2, D3, D6 | Divergence records carry baseline, evidence trace, onset, duration, and magnitude. |
| R6 | D1, D2, D7 | Angular dashboard uses shared stream components and approved design language. |
| R7 | D8, D13 | Thin backend/proxy remains an adapter option; not required for early mock steps. |
| R8 | D4, D13 | Mock/replay data is the primary implementation path and must be swappable through repository interfaces. |
| R9 | D3, D9 | Canonical CAV v1.0 terms are enforced through domain-language.md. |
| R10 | D10, D12 | Domain research remains documented outside runtime code; public About copy summarizes the bounded DocuWare research/demo context. |
| R11 | D11 | Unit and E2E checks cover CAV logic and dashboard behavior by step. |
| R12 | D6 | Evidence persistence is represented in replay data and divergence records. |
| R13 | D12, D13 | Routed About / Project Context view explains project intent, DocuWare interview research/demo framing, UI, architecture, repository/adapter boundary, MOD-W, CAV Level 1 scope, and scope boundaries. |

---

## Technology Stack

| Layer | Technology | Version | Rationale |
| --- | --- | --- | --- |
| Frontend | Angular | 22.1.x | Matches the implemented and verified application stack. |
| State | Angular signals | Angular-native | Matches PRODUCT signals-only dashboard requirement and avoids heavier state libraries. |
| Templates | Modern Angular control flow | Installed Angular version | Use `@if`, `@for`, and signal reads consistently. |
| Styling | SCSS | Angular project default | Centralize design tokens in global styles; component styles stay scoped. |
| Charts | Chart.js plus chartjs-plugin-annotation | Installed dependency | Prototype validates Chart.js; production must bundle dependencies, not load from CDN. |
| Testing | Angular unit test builder, Playwright | Existing config | Unit tests for domain logic/components; E2E for dashboard flows. |
| Data source | Local replay fixtures first | n/a | Supports R8 and decouples architecture from live access. |
| Future integration | Thin API/proxy service | TBD | Credentials never belong in browser; live external-platform calls are brokered server-side. |

---

## Current Architecture

### Application Layers

- `src/app/domain/`: canonical CAV and stream domain types, pure baseline/divergence helpers.
- `src/app/data/`: repository interfaces plus replay fixture adapters returning typed stream data.
- `src/app/features/dashboard/`: dashboard route, stream view, filters, selection state, and layout composition.
- `src/app/features/about/`: routed About / Project Context view for interview walkthroughs and scope explanation.
- `src/app/shared/ui/`: reusable presentational components such as KPI card, divergence card, baseline panel, evidence trace, status badge, and chart wrapper.
- `src/app/integration/`: reserved for future external-platform proxy clients and DTO mapping.

### Data Flow

1. Dashboard components call feature facades/services rather than fixture files or API clients directly.
2. Feature facades depend on repository interfaces for stream summaries, observations, divergences, evidence traces, and metric time series.
3. The initial repository implementation reads replay fixtures shaped after documented enterprise document-processing and workflow APIs.
4. Future repository implementations may call a BFF/proxy or backend-backed API without changing dashboard components or pure domain logic.
5. Domain helpers construct Observed Truth records grouped by Identity Slice.
6. Baseline helpers derive Observed Baselines from historical windows.
7. Divergence helpers emit Divergence records only after sustained change criteria are met.
8. Evidence is attached as chronological, reconstructable trace records.
9. Dashboard services expose stream summaries, filtered divergence lists, selected detail, and chart time series through signals.
10. Components render the selected stream without owning CAV calculation rules.

---

## Architectural Decisions

### D1 - Single Reusable Stream View

**Status:** Active
**Related Requirements:** R6

Use one dashboard stream view for document and workflow streams. Stream-specific labels, filters, dimensions, KPI copy, and fixtures are provided through typed configuration.

This accepts OBS-001 and OBS-005 from `architecture-notes.md`.

### D2 - Shared Divergence UI Components

**Status:** Active
**Related Requirements:** R5, R6

Implement Divergence Card, Divergence Detail, Baseline Reference Panel, Evidence Trace, KPI Card, and Status Badge as shared components. Stream-specific wrappers may format values, but layout and interaction behavior remain common.

This accepts OBS-002, OBS-003, OBS-006, and OBS-007.

### D3 - Canonical CAV Domain Model

**Status:** Active
**Related Requirements:** R1-R6, R9, R12

Define explicit domain types for Observed Truth, Identity Slice, Observed Baseline, Divergence, Evidence, Stream, Dimension, and Observation. Do not use "alert" or "anomaly" as the domain object for CAV findings.

### D4 - Mock/Replay First Data Boundary

**Status:** Active
**Related Requirements:** R1, R3, R8

Initial data comes from typed local fixtures. Fixture shapes should resemble enterprise document-processing and workflow analytics concepts, but runtime correctness depends on local domain contracts, not live API availability.

### D5 - Sustained Divergence Detection

**Status:** Active
**Related Requirements:** R2, R4

A Divergence requires repeated or windowed evidence beyond the Observed Baseline. One-off variation may be displayed as supporting observation only after it contributes to sustained divergence.

### D6 - Evidence-Carrying Divergence Records

**Status:** Active
**Related Requirements:** R5, R12

Each Divergence record stores or references its Identity Slice, Dimension, Observed Baseline snapshot, observed value or behavior, magnitude or distance, onset, duration, status, and chronological Evidence Trace.

### D7 - Bundled Chart.js Analysis

**Status:** Active
**Related Requirements:** R5, R6

Use bundled Chart.js and the installed annotation plugin for DS-015. Do not load Chart.js from CDN in production. Wrap chart lifecycle in an Angular component or directive and update existing chart instances when metric signals change.

This modifies OBS-004 and OBS-015: the charting approach is accepted, but CDN loading and prototype inline scripts are rejected.

### D8 - Future Thin Backend/Proxy

**Status:** Active
**Related Requirements:** R7

Reserve an integration boundary for a backend/proxy service that brokers external-platform OAuth2/API calls if live access becomes available. No credential or OAuth secret may be stored in browser code.

### D9 - CAV Level Claim Guardrails

**Status:** Active
**Related Requirements:** R9

The app and docs may claim only CAV Level 1 - Observed-State Divergence. Terms reserved for Levels 3-6, including Declared Intention, Alignment Delta, Envelope, Breach, Drift Velocity, and Convergence, must not describe current behavior.

### D10 - Research Documentation Stays Separate

**Status:** Active
**Related Requirements:** R10

Domain research and source references remain in MOD-W/docs artifacts. Runtime fixtures may include comments or metadata, but research narrative does not belong inside components.

### D11 - Step-Level Quality Gates

**Status:** Active
**Related Requirements:** R11

Every implementation Step must define test expectations. Domain logic requires unit coverage; dashboard flows require component or E2E coverage when user-visible behavior changes.

### D12 - Routed About View

**Status:** Active
**Related Requirements:** R6, R9, R10, R13

Provide a dedicated routed About / Project Context page rather than a modal. It must be reachable from top navigation and written as a one-page project brief for interview reviewers. It must explain IDP-Align's intent, DocuWare interview research/demo framing, dashboard UI, architecture, MOD-W workflow, CAV Level 1 scope, and non-goals in concise reviewer-facing language. It may explicitly describe IDP-Align as a MOD-W project and as a practical assessment of the current MOD-W version. It must include a short architecture summary that names the feature-sliced/layered shape and the repository/adapter boundary between business/domain code and data sources.

The About view may mention DocuWare, DocuWare Platform REST API, Workflow Analytics API, AI Hub, and the September 28, 2026 interview context when those references explain why the project exists and what domain is being learned. The About view must not imply DocuWare endorsement, private access, confidential interview details, production readiness, or that IDP-Align is a DocuWare product.

### D13 - Repository And Adapter Boundary

**Status:** Active
**Related Requirements:** R1, R3, R7, R8, R13

Dashboard features must depend on repository interfaces or feature facades, not directly on mock fixture files, live API clients, BFF clients, or future database-specific DTOs.

The initial adapter is a replay/mock adapter that reads local fixtures. A future live adapter may call a BFF/proxy. A future database-backed implementation may sit behind the same BFF/API contract. Domain logic and presentational components must remain source-agnostic.

The conventional pattern is a lightweight ports-and-adapters boundary inside a feature-sliced Angular app:

`UI components -> feature facade/service -> domain logic -> repository interface -> replay adapter | BFF/API adapter | future backend/database adapter`

This boundary makes mock-to-live migration an adapter change rather than a dashboard rewrite.

---

## Decision Index

| ID | Title | Status | Requirements |
| --- | --- | --- | --- |
| D1 | Single Reusable Stream View | Active | R6 |
| D2 | Shared Divergence UI Components | Active | R5, R6 |
| D3 | Canonical CAV Domain Model | Active | R1-R6, R9, R12 |
| D4 | Mock/Replay First Data Boundary | Active | R1, R3, R8 |
| D5 | Sustained Divergence Detection | Active | R2, R4 |
| D6 | Evidence-Carrying Divergence Records | Active | R5, R12 |
| D7 | Bundled Chart.js Analysis | Active | R5, R6 |
| D8 | Future Thin Backend/Proxy | Active | R7 |
| D9 | CAV Level Claim Guardrails | Active | R9 |
| D10 | Research Documentation Stays Separate | Active | R10 |
| D11 | Step-Level Quality Gates | Active | R11 |
| D12 | Routed About View | Active | R6, R9, R10, R13 |
| D13 | Repository And Adapter Boundary | Active | R1, R3, R7, R8, R13 |

---

## Data Model

Core domain shapes:

- `StreamKind`: `document` or `workflow`.
- `IdentitySlice`: stable ID, display label, stream kind, and slice fields such as vendor/document type or workflow step/route/decision agent.
- `Observation`: timestamped observed event or extracted field value, linked to stream kind and Identity Slice.
- `ObservedTruth`: normalized observation set for an Identity Slice and dimension.
- `ObservedBaseline`: immutable baseline snapshot with reference window, method, sample size, expected range/value, and version.
- `Divergence`: sustained departure from an Observed Baseline with status, onset, duration, magnitude, trend, and Evidence.
- `Evidence`: persisted observation references and derived facts supporting a Divergence.
- `StreamSummary`: aggregate KPI counts and trend data for the active stream.
- `MetricTimeSeries`: chart-ready points with observed value, baseline value, and optional confidence band.

Baseline versioning decision: baseline snapshots attached to Divergences are immutable. Future recalculation creates a new baseline version rather than mutating evidence history.

Divergence lifecycle for MVP: `ongoing`, `reviewed`, `resolved`, `muted`. `reviewed` and `muted` are user action states layered on the finding; they do not imply remediation or CAV Level 6 convergence.

---

## Integration Points

- Local replay fixture provider for initial Steps.
- Repository interfaces for stream summaries, observations, divergences, evidence traces, and metric time series.
- Local replay adapter for initial Steps.
- Future BFF/API adapter behind the same repository interfaces.
- Future backend/database implementation behind the BFF/API contract.
- Future backend/proxy endpoint family may expose stream summaries, divergence lists, divergence details, and metric time series.
- Chart.js component consumes `MetricTimeSeries` only; it does not compute baselines.

---

## Constraints

- No production credential in browser code.
- No claim beyond CAV Level 1.
- No Declared Intention or business-rule conformance engine in MVP.
- No attribution/root-cause claim.
- DocuWare references are allowed in bounded v1 research/demo context. Do not imply endorsement, private-system access, confidential interview details, production readiness, or a DocuWare product defect/gap claim.
- No direct import or copy of design-tool prototype code into production.
- Design-spec is authoritative for approved user-facing design only; this file controls technical decomposition.

---

## Patterns And Conventions

- Prefer pure functions for baseline and divergence calculations.
- Do not import fixture files, API clients, or backend DTOs directly into UI components.
- Put data-source switching behind repository interfaces or feature facades.
- Use signals for component state and computed projections.
- Keep filters separate from selected Divergence state.
- Keep stream-specific formatting in configuration/helpers, not duplicated components.
- Use accessible native controls for tabs, buttons, filters, and panels.
- Use `data-testid` values from `design-spec.md` where applicable.
- Use bundled dependencies for production; no CDN scripts.

---

## Decisions That Diverge From Prototype

| Prototype implication | Architecture decision | Rationale |
| --- | --- | --- |
| Chart.js loaded from CDN in `DivergenceAnalysis.dc.html`. | Bundle Chart.js from npm. | Production should work offline from built assets and avoid third-party runtime script trust. |
| Inline HTML styles and inline scripts. | Angular components with SCSS and typed state. | Maintains framework conventions, type safety, testability, and accessibility. |
| Separate dashboard files for document and workflow. | Single reusable stream route/view with stream configuration. | Reduces duplication while preserving approved visual behavior. |
| Action buttons shown as functional concepts. | Implement Copy/Mark reviewed only when a Step explicitly scopes them; Mute may be inert or omitted until state handling is defined. | Avoids implying alerting/remediation workflows outside Level 1. |
| Prototype contains fixed desktop boards. | Production must be responsive per design-spec. | Approved spec requires tablet/mobile behavior beyond prototype coverage. |
| Prototype has no About / Project Context view. | Add a routed About view. | Product Owner requested reviewer-facing project explanation after Architecture Definition. |
| Prototype hardcodes mock data in design files. | Production uses repository interfaces with replay/mock adapters. | Keeps mock data, live BFF/API, and future database-backed data interchangeable. |

---

## Change Log

| Date | Change | Affected D-IDs | Reason |
| --- | --- | --- | --- |
| 2026-09-21 | Initial Architecture Definition | D1-D11 | Start implementation planning after approved design handoff. |
| 2026-09-23 | Added routed About view decision and vendor-name guardrail | D8, D10, D12 | Product Owner requested interview-oriented project explanation without naming target vendor/interview organization. |
| 2026-09-23 | Added MOD-W assessment explanation to About scope | D12 | Moderator clarified that the About view may present IDP-Align as a MOD-W project assessing the current MOD-W version. |
| 2026-09-23 | Made repository/adapter boundary explicit | D13 | Moderator requested clear separation between business/domain code and mock, live, BFF, or future database data sources. |
| 2026-09-23 | Clarified About placement and depth | D12 | Moderator approved one-page project brief in top navigation for STEP-01. |
| 2026-09-24 | Updated About guardrails for DocuWare-specific v1 positioning | D12, D13 | Product Owner requested explicit DocuWare interview research/demo framing rather than hiding DocuWare references. |

---

MOD-W v5.0.1
