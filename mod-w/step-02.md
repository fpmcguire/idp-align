# STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures

---

## Goal

Define the source-agnostic CAV Level 1 domain model, repository interfaces, and local replay fixtures needed to represent document and workflow observations for IDP-Align.

This Step establishes typed data and the repository/adapter boundary only. It does not calculate Observed Baselines, detect sustained Divergence, build Evidence traces, or populate the dashboard with completed CAV findings.

---

## Related Requirements

- R1 - Ingest or replay document index-field observations shaped from DocuWare Platform REST API schemas, including vendor, amount/currency, and date-related fields.
- R3 - Ingest or replay workflow event observations shaped from the Workflow Analytics API, including task duration, decision agent, response time, error/route, and total runtime where available.
- R8 - Build primarily against realistic mock/replay data derived from documented DocuWare API shapes; live DocuWare Cloud access is an opportunistic upgrade, not a dependency.
- R9 - Use canonical CAV v1.0 vocabulary: Observed Truth, Identity Slice, Observed Baseline, Divergence, Evidence; preserve standard MOD-W artifact structure and STEP-xx build trail.

---

## Related Design IDs

| Design ID | Design element | Design intent to preserve | Product requirement |
| --- | --- | --- | --- |
| DS-001 | Dashboard home layout | Preserve the existing stream shell as the eventual consumer of replay-backed stream data. | R6 |
| DS-002 | Stream selector tabs | Document and Workflow remain separate first-class Stream views. | R6 |
| DS-009 | Document stream summary metrics | Shape document observations so later Steps can produce document stream summary metrics without changing the source boundary. | R1, R6 |
| DS-010 | Workflow stream summary metrics | Shape workflow observations so later Steps can produce workflow stream summary metrics without changing the source boundary. | R3, R6 |

No new user-facing visual component is required in STEP-02. DS-004 through DS-015 remain later-Step UI work.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry needed:** STEP-02 approval before Development Team briefing.  
**Status:** Pending Moderator approval.

Development Team may not write code until the Moderator approves this Step for briefing and then approves the Development Team implementation plan in the Moderator Register.

---

## Scope

- Add canonical TypeScript domain types for the Level 1 observation layer:
  - `StreamKind`
  - `IdentitySlice`
  - document observation records
  - workflow observation records
  - normalized `Observation` records
  - `ObservedTruth` records representing evidence-backed observed behavior
  - replay metadata and source-reference types as needed
- Use canonical terminology from `mod-w/domain-language.md` exactly in type names, user-visible labels, tests, and comments where those concepts appear.
- Model both streams as Level 1 observed-state data:
  - Document stream observations include synthetic document/index-field behavior such as vendor representation, document type, amount/currency, and date-related fields.
  - Workflow stream observations include synthetic workflow behavior such as task duration, decision agent, response time, route/error context, workflow runtime, and projection type where useful.
- Add source-agnostic repository interfaces that dashboard-facing services can consume without importing replay fixture files directly.
- Add a local replay adapter that implements the repository interface and returns typed synthetic observations.
- Keep the repository/adapter boundary aligned with `architecture.md` D13:
  `UI components -> feature facade/service -> domain logic -> repository interface -> replay adapter | BFF/API adapter | future backend/database adapter`
- Shape replay fixtures from public DocuWare documentation:
  - DocuWare Platform REST API documentation for document and index-field concepts.
  - DocuWare Workflow Analytics API documentation for workflow projection concepts.
- Ensure all fixture data is synthetic and reviewer-safe:
  - no real customer data;
  - no real DocuWare tenant IDs, document IDs, workflow IDs, users, vendors, credentials, access tokens, or private URLs;
  - no live DocuWare calls from browser code.
- Allow limited dashboard-facing data in STEP-02 only as neutral replay availability/state:
  - the dashboard may consume stream metadata and observation counts if needed to prove the repository boundary;
  - it must not show calculated Observed Baselines, sustained Divergences, Evidence traces, or non-placeholder KPI values that imply completed CAV logic.
- Extend the dashboard guardrail tests carried from QA-006 to check endorsement, private-access, production-readiness, and business-judgment patterns alongside the reserved-term and alert/anomaly checks.

---

## Out Of Scope

- Observed Baseline calculation.
- Sustained Divergence detection.
- Evidence Trace implementation.
- Divergence records, Divergence cards, Divergence detail, or status badge rendering.
- Chart.js analysis or metric time-series display.
- Real DocuWare API integration.
- OAuth, authentication, backend/proxy implementation, secrets, or live tenant configuration.
- Browser-stored credentials or direct browser calls to DocuWare endpoints.
- Persistence beyond local TypeScript fixtures or in-memory adapter responses.
- New user actions such as copy, mute, mark reviewed, export, or investigation.
- CAV Level 2 multi-source reconciliation.
- CAV Level 3+ concepts including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, and Attribution.
- PO-1 About References, PO-2 interview-date copy, PO-4 active-indicator token choice, QA-007 tablet breakpoint resolution, and QA-008 Playwright starter replacement.

---

## Inputs

- `mod-w/product.md` v1.3
- `mod-w/architecture.md` D3, D4, D9, D10, D11, D13
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/design/design-spec.md` DS-001, DS-002, DS-009, DS-010
- `mod-w/validation/moderator-register.md` A-013 through A-016
- Current dashboard and About tests for guardrail patterns
- Public DocuWare documentation used for fixture shaping:
  - `https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api`
  - `https://knowledgecenter.docuware.com/docs/workflow-analytics-api`

---

## Expected File Changes

- New files under `src/app/domain/`
- New files under `src/app/data/`
- New replay fixture files under an appropriate data/replay location
- Focused unit tests for domain types, repository contracts, replay adapter behavior, and fixture guardrails
- Dashboard-related service/facade files only if needed to consume repository interfaces without importing fixtures directly
- Existing dashboard tests updated for QA-006 guardrail coverage
- `review.md` after Tech Lead review
- `qa.md` after QA review

Do not modify About copy or About tests for PO-1 as part of STEP-02.

---

## Reference Implementation

**Location:** `mod-w/design/project/Dashboard.dc.html`, `mod-w/design/project/WorkflowDashboard.dc.html`, `mod-w/design/project/DocumentStreamSummary.dc.html`, `mod-w/design/project/WorkflowStreamSummary.dc.html`

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Changes

- Treat prototype mock data as scenario evidence only, not production structure.
- Implement typed Angular/TypeScript domain and data-source boundaries rather than hardcoded component data.
- Preserve the two-stream intent and summary-metric needs from DS-009 and DS-010.
- Do not copy prototype inline scripts, inline styles, or ad hoc data shapes.
- Do not implement prototype-visible Divergence cards, details, baselines, Evidence traces, or charts in this Step.
- Keep all data synthetic and shaped from public documentation rather than real or private system exports.

### Prototype Assumption Disposition

Not applicable. Claude Code is assigned; Claude Design is not implementing this Step.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-02 approval entry before Development Team briefing.
- [ ] Canonical TypeScript domain types exist for document and workflow observations, Observed Truth, Identity Slice, Stream, and replay source metadata.
- [ ] Domain type names and user-visible labels use `mod-w/domain-language.md` terms exactly where those concepts appear.
- [ ] No code, tests, fixtures, or UI copy introduced in this Step use reserved Level 3+ terms to describe current behavior.
- [ ] Source-agnostic repository interfaces exist for stream observation access.
- [ ] Dashboard-facing code depends on repository interfaces or feature facades rather than importing replay fixture files directly.
- [ ] A local replay adapter implements the repository interface for both Document and Workflow streams.
- [ ] Document replay fixtures are synthetic and shaped from public DocuWare Platform REST API document/index-field concepts.
- [ ] Workflow replay fixtures are synthetic and shaped from public Workflow Analytics API projection concepts.
- [ ] Fixtures contain no credentials, access tokens, private tenant URLs, real customer data, or live-call configuration.
- [ ] Browser code performs no live DocuWare API calls.
- [ ] Any dashboard-visible data introduced by STEP-02 is limited to neutral stream metadata or observation counts and does not imply Observed Baseline calculation, sustained Divergence detection, Evidence traces, or completed CAV findings.
- [ ] Dashboard guardrail tests cover endorsement, private access, production readiness, business-judgment claims, reserved Level 3+ terms, and alert/anomaly wording.
- [ ] Unit tests cover repository interface expectations and replay adapter behavior for both streams.
- [ ] Unit tests cover synthetic fixture validity and guardrails.
- [ ] Existing STEP-01 dashboard and About behavior remains intact.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.

---

## Plan

1. Confirm the STEP-02 approval entry exists in `mod-w/validation/moderator-register.md` before briefing the Development Team.
2. Define domain model types for Stream, Identity Slice, Observed Truth, and stream-specific observations.
3. Define repository interfaces for source-agnostic observation access.
4. Add synthetic document and workflow replay fixtures shaped from the cited public DocuWare documentation.
5. Implement a local replay adapter behind the repository interfaces.
6. Wire only the minimum dashboard-facing service/facade touchpoint needed to prove the boundary, without displaying completed CAV logic.
7. Extend QA-006 guardrail tests for dashboard copy.
8. Add focused tests for domain types, fixtures, repository contracts, and replay adapter behavior.
9. Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-24 | Initial STEP-02 authored | Begin post-STEP-01 domain/data foundation while carrying QA-006 guardrail coverage forward. |

---

## Review Notes

Tech Lead review must verify that STEP-02 does not implement or imply Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, live DocuWare integration, or Level 3+ CAV capabilities.

Review must also verify that fixture shape is traceable to public documentation while remaining fully synthetic.

---

## QA Notes

QA should verify that the dashboard still avoids overclaims and that any newly visible replay metadata cannot be read as completed baseline/divergence logic.

QA should also confirm no credential-like strings, tenant URLs, private customer names, access tokens, or live API calls are introduced.

---

MOD-W v5.0.1
