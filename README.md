# IDP-Align

IDP-Align is a working reference implementation and research prototype for
**MOD-W v5.0.1** and **Continuous Alignment Verification (CAV) Level 1** in the
context of DocuWare's document-processing and workflow-automation domain.

The application uses synthetic replay data shaped from public DocuWare
documentation to explore how document metadata and workflow execution behavior
can be modeled as observable streams, compared with historical Observed
Baselines, and surfaced as Evidence-backed Divergences.

IDP-Align is not affiliated with, reviewed by, or endorsed by DocuWare. It does
not connect to a DocuWare tenant, use credentials, process customer data, or
claim production readiness.

## Purpose And Goals

IDP-Align has four connected goals:

- Demonstrate that CAV Level 1, Observed-State Divergence, can be implemented in
  a working Angular application.
- Demonstrate MOD-W v5.0.1 as a governed, role-based development workflow with
  explicit planning, review, QA, and Moderator approval gates.
- Learn and model the DocuWare document/workflow domain through public API
  concepts rather than only reading product material.
- Provide a deterministic research/demo artifact with traceable data,
  reconstructable Evidence, automated tests, and clear claim boundaries.

The Product Definition is the authoritative product source:

- [mod-w/product.md](mod-w/product.md)

## What CAV Means Here

**CAV** means **Continuous Alignment Verification**. In this project, CAV means
observing behavior over time, deriving historical Observed Baselines, detecting
sustained Divergences from those baselines, and preserving the Evidence needed
to inspect each finding.

IDP-Align implements **CAV Level 1 - Observed-State Divergence** only.

The responsibility chain is:

```text
Observe -> Establish Baseline -> Detect Divergence -> Surface Evidence -> Interpret
```

IDP-Align is responsible through **Surface Evidence**. Interpretation remains a
human/domain responsibility unless later CAV levels introduce explicit intent.

Important boundaries:

- An **Observed Baseline** describes what has happened in observed history. It is
  not a target, policy, requirement, expected value, or business truth.
- A **Divergence** is evidence of sustained change from an Observed Baseline. It
  is not, by itself, a failure, defect, violation, risk, root cause, or business
  correctness judgment.
- IDP-Align does not implement CAV Level 2+ capabilities such as cross-stream
  reconciliation, declared intent, formal alignment deltas, drift velocity, or
  convergence enforcement.

Canonical CAV reference:

- Local copy: [cav/CAV-MANIFESTO.md](cav/CAV-MANIFESTO.md)
- Public repository: <https://github.com/fpmcguire/continuous-alignment-verification>

## What MOD-W Means Here

**MOD-W** means **Moderated AI Development Workflow**. IDP-Align was built using
MOD-W v5.0.1 as a structured development method with separated roles and
explicit gates:

- Product Owner: defines product scope and requirements.
- Moderator: controls approvals and final authority.
- Tech Lead: shapes steps and reviews implementation.
- Development Team: implements only approved scope.
- QA: validates completed implementation against acceptance criteria.

This matters because IDP-Align has precise claim boundaries. MOD-W keeps each
Step small, approved, reviewed, tested, and recorded before the project claims
completion.

Key MOD-W artifacts:

- [mod-w/roadmap.md](mod-w/roadmap.md)
- [mod-w/validation/moderator-register.md](mod-w/validation/moderator-register.md)
- [review.md](review.md)
- [qa.md](qa.md)

MOD-W methodology reference:

- <https://github.com/fpmcguire/mod-w>

## DocuWare Domain Context

IDP-Align models two independent observable surfaces in DocuWare's
document-processing and workflow-automation domain.

### Document Stream

The Document stream is shaped by public DocuWare Platform REST API concepts. It
models document/index-field behavior such as:

- company/vendor;
- document type;
- amount;
- currency;
- document date;
- storage timestamp.

This treats document metadata as an observation surface. The app can inspect how
document-like values behave over time for an Identity Slice such as a
vendor/document type.

### Workflow Stream

The Workflow stream is shaped by public DocuWare Workflow Analytics API
concepts. It models workflow execution behavior such as:

- workflow instances;
- workflow steps;
- task duration;
- response time;
- decisions;
- decision agents;
- route/outcome context;
- workflow runtime;
- instance state.

These workflow fields remain factual Evidence context. They are not presented as
Attribution, root cause, failure, violation, risk, or business correctness.

### API Research Boundary

The replay data is synthetic and modeled on public documentation. IDP-Align does
not call DocuWare APIs, does not authenticate with DocuWare, and does not use
private or confidential data.

Primary DocuWare references:

- DocuWare Platform REST API:
  <https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api>
- DocuWare Workflow Analytics API:
  <https://knowledgecenter.docuware.com/docs/workflow-analytics-api>
- DocuWare AI Hub:
  <https://start.docuware.com/docuware-ai-hub>
- Intelligent Document Processing introduction:
  <https://knowledgecenter.docuware.com/docs/intelligent-document-processing-introduction>
- Purchase-to-Pay scenario:
  <https://start.docuware.com/purchase-to-pay>
- Invoice-processing scenario:
  <https://start.docuware.com/process-incoming-invoices>

The full research record is here:

- [mod-w/docs/research-references.md](mod-w/docs/research-references.md)

## Data And Architecture

The current application uses static TypeScript replay fixtures. It does not load
mock data from runtime JSON and does not generate new data on rerun.

Data flow:

```text
static TypeScript replay fixtures
  -> replay repository
  -> replay mappers
  -> domain observations
  -> Observed Baseline + Divergence detection
  -> dashboard facade
  -> cards / detail / Evidence Trace / analysis charts
```

Important implementation points:

- Replay fixtures live under `src/app/data/replay/fixtures/`.
- The dashboard does not import fixture files directly.
- `StreamObservationRepository` defines the data-access boundary.
- `ReplayStreamObservationRepository` is the only implemented adapter.
- Domain logic derives Observed Baselines and detects Divergences.
- Dashboard state is prepared by `DashboardFacade`.
- Chart.js renders analysis chart models derived from selected Divergences; the
  charts are not independent mock charts with their own private data.

Useful source areas:

- Replay data and mappers: `src/app/data/replay/`
- Repository boundary: `src/app/data/stream-observation.repository.ts`
- Domain model and detection: `src/app/domain/`
- Dashboard feature: `src/app/features/dashboard/`
- Shared Divergence UI: `src/app/shared/ui/divergence/`
- E2E flows: `e2e/`

## Angular v22 Implementation

IDP-Align is built and verified with Angular v22 packages. The application uses
modern Angular patterns:

- standalone components;
- route-level providers;
- Angular signals and computed state;
- signal inputs;
- function queries;
- `@if` and `@for` template control flow;
- render hooks such as `afterNextRender` and `afterRenderEffect`;
- Chart.js integration through an injectable chart factory.

Application state is in memory. The dashboard does not persist state to
`localStorage`, encode it in the URL, or store it in a backend session.

Angular and runtime versions are recorded in [package.json](package.json).

## Current State

The dashboard runs sustained Divergence detection over synthetic replay data
modeled on public DocuWare API documentation. For each stream it calculates
Observed Baselines and shows:

- stream KPIs;
- filters and sorting;
- Divergence cards;
- selected Divergence detail;
- Observed Baseline summary;
- Evidence Trace;
- Divergence Analysis chart and table;
- loading, unavailable, empty, and filtered-empty states.

STEP-08 completed the quality-gate and documentation work. The project includes
unit tests, E2E tests, research references, claim guardrails, QA records, and
final MOD-W completion artifacts.

Live runtime:

- <https://www.frank-mcguire.com/idg-align>

## Known Limits And Non-Goals

IDP-Align intentionally does not include:

- live DocuWare integration;
- OAuth, credentials, proxy, or backend code;
- customer, private, or confidential data;
- runtime JSON scenario loading;
- random replay-data generation;
- cross-stream reconciliation or correlation;
- CAV Level 2+ claims;
- root-cause, Attribution, violation, risk, or business-correctness claims;
- production-readiness claims.

Categorical workflow behavior is covered by component/unit specs, but the
current replay browser data exposes only numeric workflow Divergences. QA-028
and QA-029 remain accepted carry-forward notes unless separately routed and
approved.

## Development

Install dependencies:

```bash
npm install
```

Run quality checks:

```bash
npm run lint
npm run build
npm test -- --watch=false
npm run test:e2e
```

`npm run test:e2e` runs the Playwright E2E tests in `e2e/` with Chromium. It
builds the app, serves the production build locally on `http://127.0.0.1:4300`
with `e2e/support/serve-dist.mjs`, and fails on any external network request or
console error. Install the browser once with `npx playwright install chromium`
if it is missing.

Angular CLI requires Node.js `v24.15.0+` on the v24 line, or another compatible
version such as `v26.0.0`. The STEP-08 quality gates were verified with Node.js
`v26.0.0`.

Start a local development server:

```bash
npm run start
```

Then open `http://localhost:4200/`.

## Reference Links

- CAV Manifesto repository:
  <https://github.com/fpmcguire/continuous-alignment-verification>
- MOD-W repository:
  <https://github.com/fpmcguire/mod-w>
- DocuWare Platform REST API:
  <https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api>
- DocuWare Workflow Analytics API:
  <https://knowledgecenter.docuware.com/docs/workflow-analytics-api>
- IDP-Align research references:
  [mod-w/docs/research-references.md](mod-w/docs/research-references.md)

---

Author: [Frank McGuire](https://github.com/fpmcguire) |
[Portfolio](https://www.frank-mcguire.com/) |
[LinkedIn](https://www.linkedin.com/in/frank-mcguire-06b6ba1/) |
[Email](mailto:fpmcguire@gmail.com)
