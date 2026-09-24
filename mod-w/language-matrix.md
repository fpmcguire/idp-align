# Language Matrix - IDP-Align

**Project:** IDP-Align  
**Owner:** Tech Lead  
**Date:** 2026-09-24  
**Status:** Active for v1 DocuWare research/demo framing

---

## Purpose

This matrix translates between canonical CAV terms, DocuWare domain language, Angular implementation language, and interview/demo copy. It does not replace `domain-language.md`; it helps apply that canonical vocabulary in the DocuWare-specific v1 research/demo context.

---

## Matrix

| CAV / IDP-Align term | DocuWare domain term | Angular / code surface | Approved UI / demo wording | Guardrail |
| --- | --- | --- | --- | --- |
| Observed Truth | Document index fields; workflow analytics projection rows | `ObservedTruth`, observations, replay records | Observed document/workflow behavior | Do not imply business-rule truth or declared intent. |
| Identity Slice | Vendor, document type, workflow step, route, decision user | `IdentitySlice`, stream filters | Identity Slice, such as vendor/document type or workflow step | Avoid treating a slice as root cause. |
| Observed Baseline | Historical index-field pattern; historical task/runtime behavior | `ObservedBaseline`, baseline window | Observed Baseline derived from historical behavior | Do not call it policy, target, required value, or intention. |
| Divergence | Sustained change in document field behavior or workflow behavior | `Divergence`, divergence list/detail | Divergence from an Observed Baseline | Avoid alert, anomaly, violation, or breach as CAV finding names. |
| Evidence | Source document metadata; document IDs; workflow projection rows; timestamps | `Evidence`, `EvidenceTraceItem` | Evidence trace | Evidence supports the finding; it does not prove root cause. |
| Stream | Document/index-field surface; workflow analytics surface | `StreamKind`, stream route/state | Document stream, Workflow stream | Displaying two streams is not a Level 2 claim. |
| Repository / adapter boundary | Replay data, DocuWare Platform REST API, Workflow Analytics API, future BFF/API | repository interfaces, replay adapter, live adapter | Replay-first architecture with a future DocuWare API adapter | No browser-stored credentials; live calls go through an adapter/BFF. |
| DocuWare research context | AI Hub, document processing, workflow automation, public API docs | About/project-context copy, tests | Personal DocuWare interview research/demo project | Do not imply endorsement, private access, confidential interview details, or production readiness. |

---

## Interview / Demo Wording Rules

- It is allowed to say that IDP-Align v1 is a personal research/demo project for Frank McGuire's DocuWare Software Engineer interview on September 28, 2026.
- It is allowed to say that DocuWare presents document-processing, workflow, AI Hub, Platform REST API, and Workflow Analytics API domains that the project is exploring.
- It is allowed to describe public DocuWare API shapes as inspiration for replay/mock data and future adapters.
- Do not claim access to private DocuWare systems, customer data, proprietary implementation details, or confidential interview materials.
- Do not imply DocuWare reviewed, endorsed, requested, or approved IDP-Align.
- Do not claim IDP-Align diagnoses DocuWare product defects or fills a proven DocuWare product gap.
- Do not claim implemented CAV Levels 2-6, Attribution, production readiness, or formal MOD-W certification.

---

MOD-W v5.0.1
