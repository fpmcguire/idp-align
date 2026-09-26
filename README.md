# IDP-Align

IDP-Align is an Angular dashboard for exploring Continuous Alignment Verification (CAV) Level 1 in DocuWare's document-processing and workflow-automation domain.

For v1, the project is a personal research/demo artifact for Frank McGuire's DocuWare Software Engineer interview on September 28, 2026. It is based on public DocuWare domain/API information and local replay-first architecture. It is not affiliated with, reviewed by, or endorsed by DocuWare.

## Product Framing

IDP-Align applies CAV Level 1 - Observed-State Divergence to two independent streams:

- Document stream: extracted document/index-field behavior shaped by public DocuWare Platform REST API concepts.
- Workflow stream: workflow execution behavior shaped by public DocuWare Workflow Analytics API concepts.

The Product Definition is in `mod-w/product.md`.

## CAV Boundary

Product v1.3 clarifies the responsibility chain:

```text
Observe -> Establish Baseline -> Detect Divergence -> Surface Evidence -> Interpret
```

IDP-Align is responsible through Surface Evidence.

Divergence is evidence of change, not a judgment of failure, defect, or non-conformance. An Observed Baseline describes what has happened in observed history; it does not automatically describe what should happen. Business-intent comparison belongs to later CAV capabilities where explicit Intent exists.

Canonical CAV reference:

- Local: `cav/CAV-MANIFESTO.md`
- GitHub: https://github.com/fpmcguire/continuous-alignment-verification

## Current State

The dashboard runs sustained Divergence detection over synthetic replay data modeled on public DocuWare API documentation. For each stream it calculates Observed Baselines and shows summary metrics, filters and sorting, a Divergence list and detail, an Evidence Trace, and a Divergence Analysis chart. The dashboard reads data through a repository interface; the local replay adapter is the only adapter implemented, and IDP-Align does not connect to any DocuWare system. It is not production software.

MOD-W artifacts:

- `mod-w/roadmap.md`
- `mod-w/validation/moderator-register.md`
- `review.md` and `qa.md`
- `mod-w/docs/research-references.md` - public sources consulted for the research framing

## Development

Install dependencies, then run:

```bash
npm run lint
npm run build
npm test -- --watch=false
npm run test:e2e
```

`npm run test:e2e` runs the Playwright E2E tests in `e2e/` with Chromium. It builds the app, serves the production build locally on `http://127.0.0.1:4300` with `e2e/support/serve-dist.mjs`, and fails on any external network request or console error. Install the browser once with `npx playwright install chromium` if it is missing.

Angular CLI requires Node.js `v24.15.0+` on the v24 line, or another compatible version such as `v26.0.0`. The current verified commands were run with Node.js `v26.0.0`.

To start a local development server:

```bash
npm run start
```

Then open `http://localhost:4200/`.
