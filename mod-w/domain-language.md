# Domain Language - IDP-Align

**Project:** IDP-Align
**Owner:** Tech Lead

---

## Ownership

This file is authoritative for canonical product, architecture, code, and review terminology. Update it when a Step introduces a new concept or review finds naming drift.

---

## Terms

| Term | Definition | Code | UI | Avoid |
| --- | --- | --- | --- | --- |
| Observed Truth | Evidence-backed representation of what the system actually did. | `ObservedTruth` | Observed Truth | Truth, actuals without context |
| Identity Slice | Meaningful cohort or scope used to compare behavior. | `IdentitySlice` | Identity slice | Segment, group, bucket unless generic UI copy |
| Producer x Document Type | Approved example Identity Slice pattern for document populations, not a new mandatory domain primitive. Examples include `Supplier x Invoice`, `Customer x Timesheet`, and `Authority x Traffic Notice`. | Use existing `IdentitySlice` fields | Producer x Document Type when explaining the pattern | New primitive, required schema, causal source |
| Observed Baseline | Reference derived from historical or continuously inferred observed behavior. | `ObservedBaseline` | Observed Baseline | Target, intended value, policy |
| Divergence | Sustained, meaningful departure from an Observed Baseline or observed comparison. | `Divergence` | Divergence | Alert, anomaly, violation, breach |
| Evidence | Persisted observations and relationships supporting a Divergence. | `Evidence`, `EvidenceTraceItem` | Evidence, Evidence trace | Proof without trace, log blob |
| Surfacing | Making detected Divergence and supporting Evidence visible for interpretation without assigning business correctness, failure, defect, non-conformance, or causal meaning. | `surfaceDivergence` if needed | Surface, surfaced Divergence | Judging, validating, proving failure |
| Stream | One independent CAV Level 1 view: document stream or workflow stream. | `StreamKind`, `StreamConfig` | Document stream, Workflow stream | Pipeline unless referring to implementation |
| Document stream | Stream observing document/index-field behavior. | `StreamKind.Document` or `'document'` | Document stream | Invoice stream when the scope is broader |
| Workflow stream | Stream observing workflow execution behavior. | `StreamKind.Workflow` or `'workflow'` | Workflow stream | Process stream unless product copy changes |
| Dimension | The behavior being compared for a Divergence, such as amount behavior or task duration. | `DivergenceDimension` | Dimension | Metric when non-numeric |
| Baseline Reference Panel | UI component showing baseline definition, reference window, and sample size. | `BaselineReferencePanelComponent` | Observed Baseline | Baseline editor |
| Divergence Card | UI component summarizing one Divergence. | `DivergenceCardComponent` | Divergence card is not visible copy unless needed | Alert card |
| Evidence Trace | UI component rendering chronological Evidence. | `EvidenceTraceComponent` | Evidence trace | Audit trail if it implies compliance workflow |
| Divergence status | Lifecycle marker for a Divergence finding. MVP statuses are ongoing, reviewed, resolved, and muted. | `DivergenceStatus` | Ongoing, Reviewed, Resolved, Muted | Fixed, remediated, converged |
| Reference window | Time period used to derive an Observed Baseline. | `referenceWindow` | Reference window | Intent period |
| Magnitude | Human-readable size or distance of observed behavior from baseline. | `magnitude` | Magnitude, difference from baseline, distance from baseline | Alignment Delta |
| Replay data | Local fixture data used to simulate observed document and workflow behavior. | `ReplayFixture` | Not normally shown | Fake data in user-facing UI |
| About view | Routed project context page explaining IDP-Align intent, UI, architecture, MOD-W, CAV, and scope for reviewers. | `AboutPageComponent` | About, Project Context | Modal-only explanation, vendor pitch |
| Reviewer | Neutral audience term for people evaluating the project. | `Reviewer` when needed | Reviewer | Interviewer name, target company name |
| MOD-W assessment | Explanation that IDP-Align is also exercising and evaluating the current MOD-W version through a realistic build. | `modWAssessment` if needed | MOD-W assessment | Methodology certification, formal benchmark |
| DocuWare research context | v1 explanation that IDP-Align is a personal research/demo project for learning DocuWare's document-processing and workflow domains ahead of the September 28, 2026 interview. | `docuWareResearchContext` if needed | DocuWare research context, interview research/demo | DocuWare endorsement, confidential interview content, private access claim |

---

## Reserved Terms

These terms are canonical CAV terms but are reserved for future levels and must not describe current IDP-Align behavior:

| Reserved term | Allowed use |
| --- | --- |
| Declared Intention / Intent | Future Level 3 discussion only. |
| Alignment Delta | Future Level 4 formal intent-vs-observed measurement only. |
| Envelope | Future Level 4 declared-intent tolerance only. |
| Breach | Future Level 4 envelope breach only. |
| Drift Velocity | Future Level 5 only. |
| Convergence | Future Level 6 corrective-action measurement only. |
| Attribution | Future orthogonal root-cause/change-log correlation capability only. |

---

## Design Term Disposition

| Proposed term from design-spec.md | Disposition | Rationale |
| --- | --- | --- |
| Divergence Card | Ratified | Useful UI component name distinct from Divergence domain concept. |
| Baseline Reference Panel | Ratified with UI-only scope | Keeps Observed Baseline reserved for domain object. |
| Evidence Trace | Ratified | Clear UI representation of chronological Evidence. |
| Stream | Ratified | Concise dashboard concept for document/workflow views. |
| Identity Slice Selector | Ratified as UI component | Distinguishes filter control from Identity Slice domain concept. |

---

## Enforcement Rules

- Use canonical CAV v1.0 vocabulary from `cav/CAV-MANIFESTO.md`.
- Do not label Observed Baselines as intent, targets, policy, or requirements.
- Do not call Divergences alerts, anomalies, violations, or breaches in code or user-facing copy.
- Do not present a surfaced Divergence as inherently bad, defective, non-conformant, or contrary to business intent solely because it differs from an Observed Baseline.
- Producer x Document Type is an approved Identity Slice pattern for document-stream populations; it must not be treated as a new mandatory primitive or as causal evidence.
- If a field comes from a workflow event, it may be Evidence context; do not imply root-cause Attribution.
- For v1, bounded DocuWare references are allowed in the About view, project-context copy, documentation, tests, and demo framing when they explain the research/demo domain and September 28, 2026 interview context.
- Do not imply DocuWare endorsement, private DocuWare access, confidential interview content, production readiness, formal certification, or a DocuWare product defect/gap claim.
- It is acceptable for the About view to state that IDP-Align is a MOD-W project assessing the current MOD-W version, as long as it does not claim formal certification or benchmark status.
- Review must flag terminology drift in code, docs, tests, and UI copy.

---

MOD-W v5.0.1
