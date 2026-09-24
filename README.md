# IDP-Align

IDP-Align is an Angular dashboard foundation for exploring Continuous Alignment Verification (CAV) Level 1 in DocuWare's document-processing and workflow-automation domain.

For v1, the project is a personal research/demo artifact for Frank McGuire's DocuWare Software Engineer interview on September 28, 2026. It is based on public DocuWare domain/API information and local replay-first architecture. It is not affiliated with, reviewed by, or endorsed by DocuWare.

## Product Framing

IDP-Align applies CAV Level 1 - Observed-State Divergence to two planned streams:

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

## Current Step

STEP-01 establishes the dashboard shell, stream tabs, placeholder dashboard regions, and routed About / Project Context view. It does not implement replay ingestion, Observed Baseline calculation, sustained Divergence detection, Evidence Trace implementation, or chart analysis.

MOD-W artifacts:

- `mod-w/step-01.md`
- `review.md`
- `mod-w/validation/moderator-register.md`

## Development

Install dependencies, then run:

```bash
npm run build
npm test -- --watch=false
```

Angular CLI requires Node.js `v24.15.0+` on the v24 line, or another compatible version such as `v26.0.0`. The current verified commands were run with Node.js `v26.0.0`.

To start a local development server:

```bash
npm run start
```

Then open `http://localhost:4200/`.
