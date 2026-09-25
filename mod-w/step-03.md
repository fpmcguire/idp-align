# STEP-03 - Observed Baseline And Sustained Divergence Logic

---

## Goal

Implement the CAV Level 1 domain logic that derives Observed Baselines from historical replay observations and detects sustained Divergences for both the document and workflow streams.

This Step produces tested, evidence-carrying Divergence records behind the existing domain/data boundary. It does not build Divergence cards, detail panels, Evidence Trace UI, chart analysis, filtering interactions, or user actions.

---

## Related Requirements

- R2 - Build Observed Truth and an observed per-vendor/document-type baseline from historical document observations; detect sustained divergence from that observed baseline.
- R4 - Build Observed Truth and observed behavioral baselines from historical workflow runs; detect sustained divergence by relevant identity slice such as step, route, or decision agent.
- R5 - Every detected sustained Divergence is surfaced with an explainable and reconstructable Evidence trace: identity slice, baseline reference/context, dimension, observed behavior/value, magnitude/distance, onset, duration, and supporting observations as applicable. The surfaced finding does not itself classify the behavior as failure, defect, non-conformance, or violation of business intent.
- R12 - Persist enough evidence to reconstruct a divergence finding from its source observations and baseline context.

---

## Related Design IDs

| Design ID | Design element | Design intent to preserve | Product requirement |
| --- | --- | --- | --- |
| DS-003 | Summary KPI cards | Produce aggregate-ready Divergence data, but keep KPI rendering as placeholder unless already neutral. | R6 |
| DS-006 | Baseline reference panel | Domain records must carry baseline method, reference window, sample size, and baseline value/range needed by the later panel. | R2, R4, R5 |
| DS-007 | Evidence trace | Divergence records must carry chronological evidence references suitable for later timeline rendering. | R5 |
| DS-009 | Document stream summary metrics | Document logic must detect per vendor/document-type Divergence for selected document dimensions. | R1, R2, R6 |
| DS-010 | Workflow stream summary metrics | Workflow logic must detect per workflow step/runtime Divergence for selected workflow dimensions. | R3, R4, R6 |
| DS-013 | Status badges | Domain records may include initial lifecycle status values, but no user action handling is required. | R5, R6 |
| DS-014 | Evidence detail row | Evidence records must retain enough source-observation context for later expandable detail rows. | R5 |

No new user-facing visual component is required in STEP-03. DS-004, DS-005, DS-007 UI rendering, DS-008 filtering, DS-011/DS-012 states, and DS-015 charting remain later-Step UI work.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** A-029 - STEP-03 Step Approval Before Development Team Briefing  
**Status:** Approved for Development Team briefing and implementation planning only.

Development Team may be briefed on STEP-03 and may prepare an implementation plan. Development Team may not write code until the Moderator approves the Development Team implementation plan in the Moderator Register.

---

## Scope

- Add canonical TypeScript domain types for:
  - `ObservedBaseline`
  - `Divergence`
  - `DivergenceDimension`
  - `DivergenceStatus`
  - `Evidence` / `EvidenceTraceItem`
  - baseline method/configuration types as needed
- Implement pure domain helpers that:
  - derive Observed Baseline snapshots from historical observations;
  - evaluate candidate observations against those snapshots;
  - emit Divergence records only when sustained criteria are met;
  - attach reconstructable Evidence references in chronological order.
- Use deterministic, explainable MVP methods rather than opaque detection:
  - numeric dimensions may use historical mean, standard deviation, min/max, median, or percentile-style summary values when useful;
  - categorical dimensions may use historical dominant value, frequency, or distribution summary values when useful;
  - every method used must be named in the `ObservedBaseline` record.
- Keep the sustained criteria explicit and testable. A single out-of-baseline observation must not create a Divergence by itself.
- Cover the document stream dimensions already present in replay data, at minimum:
  - vendor representation;
  - amount behavior and currency behavior;
  - date-related behavior when supported by normalized observations.
- Cover the workflow stream dimensions already present in replay data, at minimum:
  - task duration;
  - response time when available;
  - decision/route/error behavior when enough observations exist;
  - workflow runtime for runtime observations.
- Account for QA-014: the workflow fixture behavior may produce related Divergences in both the Approval step Identity Slice and the Workflow runtime Identity Slice. STEP-03 may either emit both when both independently meet sustained criteria, or intentionally suppress/mark one as derived context. The chosen behavior must be explicit in tests and comments and must not imply root-cause Attribution.
- Extend repository/facade boundaries only as needed to expose computed Observed Baselines and Divergences to later dashboard Steps without importing fixture files into UI components.
- Preserve the existing replay-first architecture and source-agnostic repository pattern from `architecture.md` D13.
- Keep all logic local, deterministic, and fixture-backed. No live DocuWare calls, credentials, persistence service, or backend/proxy work is included.

---

## Out Of Scope

- Divergence card UI, detail panel UI, Baseline Reference Panel UI, Evidence Trace UI, status badge rendering, or chart rendering.
- Filter/sort interactions, empty/loading/error state expansion, responsive dashboard work, or visual polish beyond unchanged placeholders.
- User actions such as copy details, mute, mark reviewed, resolve, export, or open investigation.
- Mutation or editing of baselines.
- Cross-stream reconciliation or CAV Level 2 claims.
- CAV Level 3+ concepts including Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or business-rule conformance.
- Attribution/root-cause correlation. Workflow decision-agent and runtime context may be Evidence context only.
- Real DocuWare API integration, OAuth, authentication, backend/proxy implementation, secrets, or live tenant configuration.
- PO-1 About References unless separately routed.
- PO-4, QA-007, and QA-008 unless a later Moderator approval changes their timing.
- QA-015 future adapter/BFF work. It is noted here only to preserve source-agnostic interfaces; no non-replay adapter changes are required.

---

## Inputs

- `mod-w/product.md` v1.3
- `mod-w/architecture.md` D3, D4, D5, D6, D9, D11, D13
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/step-02.md`
- `review.md` STEP-02 final review trail
- `qa.md` STEP-02 QA records, especially QA-014 and QA-015
- `mod-w/validation/moderator-register.md` A-028
- Current STEP-02 domain/data implementation under `src/app/domain/` and `src/app/data/`
- `mod-w/design/design-spec.md` DS-003, DS-006, DS-007, DS-009, DS-010, DS-013, DS-014

### Source Conflict Resolution

Known conflict disposition:

- Product and Architecture require sustained Divergence from Observed Baselines, while Design examples sometimes use alert-like visual language. For STEP-03, Product and `domain-language.md` control: domain objects and tests must use `Divergence`, `Observed Baseline`, and `Evidence`, not alert/anomaly/violation/breach language.
- QA-014 notes that the workflow fixture behavior can surface through both the Approval step and Workflow runtime slices. This is not treated as a STEP-02 fixture defect. STEP-03 must make an explicit detector decision for this expected overlap and verify it with tests.
- QA-015 is a future adapter/BFF planning note. STEP-03 should not implement adapter extensibility beyond preserving the existing repository/facade boundary, because no non-replay data source is being introduced in this Step.

---

## Expected File Changes

- New or updated files under `src/app/domain/` for Observed Baseline, Divergence, Evidence, dimensions, and pure calculation helpers.
- Focused unit tests under `src/app/domain/` for baseline derivation, sustained Divergence detection, Evidence construction, terminology guardrails, and edge cases.
- New or updated files under `src/app/data/` only if needed to expose computed baseline/divergence data through source-agnostic interfaces or replay-backed services.
- New or updated dashboard facade tests only if the facade exposes computed data for later UI Steps.
- Existing dashboard component templates should remain placeholder-only unless a minimal non-visual data boundary change is unavoidable.
- `review.md` after Tech Lead review.
- `qa.md` after QA review.

Do not modify About copy or About tests for PO-1 as part of STEP-03.

---

## Reference Implementation

**Location:** Prototype evidence exists for user-facing baseline panels, evidence traces, cards, and chart views under `mod-w/design/project/`, but no production-ready domain calculation reference implementation exists for STEP-03.

**Disposition:**

- [ ] Adopt as-is
- [ ] Adopt with modifications
- [ ] Reject
- [x] None - no Reference Implementation exists for this Step's domain logic

### Required Direction

- Implement typed Angular/TypeScript domain logic rather than hardcoded component findings.
- Treat prototype baseline/evidence content as design evidence for later UI shape only, not as authoritative calculation logic.
- Produce deterministic domain records that later UI Steps can render without recalculating CAV logic in components.
- Preserve the two independent Level 1 streams. Displaying or calculating both streams side by side must not become a Level 2 claim.

### Prototype Assumption Disposition

Not applicable. Claude Code is assigned; Claude Design is not implementing this Step.

---

## Acceptance Checks

- [ ] `mod-w/validation/moderator-register.md` contains the STEP-03 Step approval entry before Development Team briefing.
- [ ] Canonical TypeScript domain types exist for Observed Baseline, Divergence, Divergence Dimension, Divergence Status, and Evidence / Evidence Trace items.
- [ ] Domain type names, comments, tests, and any user-visible copy introduced by this Step use canonical terms from `mod-w/domain-language.md`.
- [ ] No code, tests, fixtures, or UI copy introduced in this Step use reserved Level 3+ terms to describe current behavior.
- [ ] Baseline derivation is implemented as pure, deterministic domain logic over Observed Truth / observations.
- [ ] Each Observed Baseline carries at least stream kind, Identity Slice, dimension, reference window, method, sample size, version or stable ID, and baseline value/range/distribution summary as applicable.
- [ ] Sustained Divergence detection is implemented as pure, deterministic domain logic over baseline snapshots and candidate observations.
- [ ] A single out-of-baseline observation is covered by tests and does not create a Divergence by itself.
- [ ] Each Divergence carries at least stream kind, Identity Slice, dimension, baseline reference/context, observed value or behavior summary, magnitude/distance, onset, duration, status, and Evidence.
- [ ] Evidence items reference the source observations or source records needed to reconstruct the finding and are chronological.
- [ ] Document-stream tests cover expected baseline and sustained Divergence behavior for vendor representation, amount/currency behavior, and date-related behavior where supported by the normalized observations.
- [ ] Workflow-stream tests cover expected baseline and sustained Divergence behavior for task duration, response time where available, decision/route/error behavior where enough observations exist, and workflow runtime.
- [ ] QA-014 is explicitly handled: tests prove the chosen behavior when the Approval step and Workflow runtime slices both reflect the same underlying workflow change.
- [ ] Workflow decision-agent context, route context, and runtime context are treated as Evidence or Identity Slice fields only and do not imply Attribution.
- [ ] Repository/facade access to computed baselines/divergences, if added, preserves the source-agnostic boundary and does not import replay fixtures directly into dashboard components.
- [ ] Existing STEP-01 and STEP-02 dashboard behavior remains intact; no completed UI rendering of Divergence cards, detail, Evidence Trace, or charts is introduced.
- [ ] Fixtures remain synthetic, and browser code performs no live DocuWare API calls.
- [ ] Dashboard guardrail tests still cover endorsement, private access, production readiness, business-judgment claims, reserved Level 3+ terms, and alert/anomaly wording.
- [ ] `npm run lint` passes under Node.js v26.0.0.
- [ ] `npm run build` passes under Node.js v26.0.0.
- [ ] `npm test -- --watch=false` passes under Node.js v26.0.0.

---

## Plan

1. Confirm the STEP-03 approval entry exists in `mod-w/validation/moderator-register.md` before briefing the Development Team.
2. Define domain types for Observed Baseline, Divergence, Divergence Dimension, Divergence Status, and Evidence.
3. Implement pure baseline derivation helpers for document and workflow Observed Truth.
4. Implement pure sustained Divergence detection helpers with explicit minimum-duration or minimum-repeated-observation criteria.
5. Build Evidence records from source observations and baseline snapshots without adding UI-specific formatting.
6. Add source-agnostic repository/facade exposure only if needed for later dashboard consumption.
7. Add focused unit tests for baseline derivation, one-off variation suppression, sustained detection, Evidence reconstruction, and QA-014 workflow overlap behavior.
8. Verify no Level 3+ terms, alert/anomaly language, business-judgment wording, credentials, or live API calls are introduced.
9. Run `npm run lint`, `npm run build`, and `npm test -- --watch=false` under Node.js v26.0.0.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-25 | Initial STEP-03 authored | Begin Observed Baseline and sustained Divergence logic after STEP-02 final acceptance A-028. |
| 2026-09-25 | Updated approval status after A-029 | Moderator approved STEP-03 for Development Team briefing and implementation planning only. |

---

## Review Notes

Tech Lead review must verify that STEP-03 implements real domain logic and not UI-only or hardcoded findings. Review must map each acceptance check to diff or test evidence, with particular attention to one-off variation suppression, Evidence reconstruction, source-agnostic boundaries, QA-014 overlap handling, and CAV Level 1 claim guardrails.

Review must also verify that any dashboard-visible changes remain placeholders or neutral computed-data plumbing and do not implement later-Step UI components.

---

## QA Notes

QA should verify that detected Divergences are sustained departures from Observed Baselines, not single-observation anomalies, business-rule violations, or intent conformance failures.

QA should also verify that the Approval step and Workflow runtime overlap from QA-014 behaves exactly as the Development Team and tests state, and that the behavior is not presented as causal Attribution.

---

MOD-W v5.0.1
