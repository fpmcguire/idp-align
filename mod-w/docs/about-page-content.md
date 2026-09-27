# About Page Content — Moderator-Approved Source

Status: Moderator-supplied content for the About page. Implement verbatim; wording changes require Moderator approval.

---

# About IDP-Align

A prototype that watches DocuWare-style document and workflow streams and flags sustained changes in observed behavior, with the Evidence behind each one.

Project source: [idp-align repository](https://github.com/fpmcguire/idp-align.git)

## The Problem

Document and workflow processes can drift without anyone noticing. A vendor changes its invoice format and amounts start landing in a different range. A workflow step that used to take minutes starts taking hours. A currency that was never seen before starts appearing. Each single record looks plausible, so nothing raises an alarm. The change only becomes visible as a pattern over time.

IDP-Align asks one narrow question: is recent behavior for this vendor, document type or workflow step different from how it has behaved before, and is that difference sustained?

## What IDP-Align Does

The dashboard observes two independent streams:

- **Document stream:** extracted index-field behavior, such as vendor representation, amount and currency, and dates, per Identity Slice such as vendor and document type.
- **Workflow stream:** workflow execution behavior, such as task duration, routing, response time and error routes, per Identity Slice such as workflow step or route.

For each stream, IDP-Align:

1. groups observations into **Identity Slices**
2. derives an **Observed Baseline** for each slice and Dimension from historical observations
3. surfaces a **Divergence** when recent observations stay outside that baseline
4. keeps the **Evidence** for each Divergence: the observations, their values compared with the baseline, and a Source Reference back to the replay record

The dashboard shows summary metrics, filters and sorting, a Divergence list and detail, an Evidence Trace, and a Divergence Analysis chart. Both streams share the same presentational components and are observed independently.

## How Detection Works

The detection rules are deliberately simple and explainable. Every parameter is recorded on the Observed Baselines and Divergences it shapes, so any result can be audited.

| Rule | Default | Meaning |
|---|---|---|
| Reference window | 28 days | History used to derive the Observed Baseline |
| Minimum sample | 4 observations | No baseline is derived from fewer observations |
| Numeric range | mean ± 3 standard deviations | Never narrower than ±5% of the mean, so very stable series don't flag tiny changes |
| Categorical rule | ≥ 10% share | A value is within the baseline if it appeared in at least 10% of reference observations |
| Sustained | 3 consecutive | Any observation within the baseline ends the run, so one-off outliers never become Divergences |

IDP-Align uses statistics instead of machine learning on purpose. They need no training data, every result can be explained in one sentence, and the rules can be tuned once real data is available.

## Why DocuWare

DocuWare works in document processing and workflow automation. It captures and indexes business documents, routes them through approval workflows, and applies AI-assisted processing through its AI Hub. Its two main surfaces, extracted document data and workflow execution, are a natural fit for observing how system behavior changes over time. The Purchase-to-Pay and invoice-processing use case gives realistic scenarios for both streams.

The same approach could apply to AI-assisted extraction. Extraction output is itself a stream of observations, so sustained changes per vendor or document type, such as amounts moving out of range or new currencies appearing, could be surfaced early, with the Evidence pointing to the exact documents to inspect.

The project does not claim that DocuWare has a product defect or gap in these areas. It is an outside learning exercise in applying an observation model to this domain.

### DocuWare API Research

Two public DocuWare APIs shape the replay data:

- **DocuWare Platform REST API:** document and index-field data, which informs the Document stream.
- **Workflow Analytics API:** workflow execution data such as task duration, routing and decision outcomes, which informs the Workflow stream.

Replay data is modeled on these publicly documented API shapes. If sandbox access becomes available, live calls would go through a thin server-side adapter so that credentials never reside in the browser.

**IDP-Align does not currently connect to any DocuWare system.**

## CAV Level 1 Scope

IDP-Align reports *what* changed, not *why*.

It targets Continuous Alignment Verification (CAV) Level 1: Observed-State Divergence. Canonical CAV terminology comes from the [Continuous Alignment Verification repository](https://github.com/fpmcguire/continuous-alignment-verification). For both streams the model is the same:

- Observed Truth built from continuous or replayed observations
- Identity Slices that group observations into meaningful cohorts
- Observed Baselines derived from historical behavior
- Divergence surfaced only when a departure from the Observed Baseline is sustained
- Evidence kept so every Divergence is explainable

IDP-Align does not implement CAV Levels 2–6, and it does not implement Attribution. Workflow context such as decision agent, route or instance state is shown as Evidence, not as a cause. Showing two streams side by side is not a claim of cross-stream alignment analysis.

A Divergence is evidence of change, not a judgment of failure, defect or non-conformance. IDP-Align surfaces Evidence for interpretation. It does not decide what the behavior should have been, or whether it violates business intent.

## Architecture

IDP-Align is a feature-sliced, layered Angular application built with standalone components and signals. Domain code is separated from data sources by a repository and adapter boundary:

```
UI components → feature facade → domain logic → repository interface
    → replay adapter | BFF/API adapter | future database-backed adapter
```

- **Repository boundary:** the dashboard depends only on repository interfaces, so replay data can later be replaced by a live BFF/API adapter or a database-backed source without rewriting the dashboard.
- **Mappers:** DocuWare-shaped records are translated into project-owned domain types. API shapes never reach the UI.
- **Pure domain layer:** Observed Baselines and Divergence detection are plain TypeScript with no Angular dependency.
- **Deterministic replay data:** the same synthetic observations are used on every run, so the demo, tests and QA evidence stay reproducible.

See Architecture (existing in-app link to the Architecture page) for the full explanation.

## Path to Production

1. Add a server-side adapter behind the existing repository boundary, with credentials kept out of the browser.
2. Run against real, anonymized data and tune the reference window, range and sustained rules.
3. Let users mark Divergences as expected or relevant, and use that feedback to reduce noise.
4. Consider linking the document and workflow streams only after the rules for joining them are agreed.

## Quality

Every step passes lint, a production build, a Vitest unit suite and a Playwright end-to-end suite. The tests cover the domain, mapping, repository, facade and UI layers.

## MOD-W Workflow

IDP-Align is a [MOD-W (Moderated AI Development Workflow)](https://github.com/fpmcguire/mod-w) project, built with AI coding agents under explicit governance. Work moves through Product Definition, Design and Architecture Definition, then small implementation Steps. Each Step is reviewed by a Tech Lead, checked by QA, and approved by a Moderator before the next one begins.

This governance keeps scope, terminology and claims under control, which matters for a tool whose value depends on not over-claiming. The build also served as a practical assessment of the current MOD-W version in a realistic, time-boxed project. It is not a formal certification or benchmark of MOD-W.

## Project Context

IDP-Align is a personal research and demo project by Frank McGuire, built in preparation for a DocuWare Software Engineer interview on September 28, 2026. Building a working dashboard against a publicly documented domain is a more concrete way to learn that domain than reading product material alone.

IDP-Align is an independent personal project. It is not affiliated with, reviewed by, or endorsed by DocuWare. It is based only on public information and does not use private DocuWare systems, customer data, or confidential interview information.

## Scope Boundaries & Non-Goals

- Not production software, and not a multi-tenant SaaS product.
- Not a DocuWare product, and not a reimplementation of DocuWare APIs, OCR or the workflow engine.
- Not a general-purpose IDP or workflow-orchestration engine.
- Not a claim of market novelty. Drift detection and data observability have mature prior art.
- No real customer data. Replay data is synthetic and modeled on public API documentation.

## References

- [DocuWare Platform REST API documentation](https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api)
- [DocuWare Workflow Analytics API documentation](https://knowledgecenter.docuware.com/docs/workflow-analytics-api)

These are public documentation pages. Linking to them does not imply DocuWare review or endorsement.

Author: [Frank McGuire](https://github.com/fpmcguire)
