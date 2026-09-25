# Tech Lead Review - STEP-03

**Project:** IDP-Align  
**Step:** STEP-03 - Observed Baseline And Sustained Divergence Logic  
**Review date:** 2026-09-25  
**Reviewer:** Codex, Tech Lead  
**Implementation package reviewed:** Current uncommitted Development Team STEP-03 work after A-030 implementation-plan approval  
**Verdict:** Pass for QA

---

## Gate Verification

`mod-w/validation/moderator-register.md` contains the required approvals:

- A-029 approves `mod-w/step-03.md` as the active STEP-03 definition for Development Team briefing and implementation planning.
- A-030 approves the Development Team implementation plan before code changes and records the accepted Tech Lead conditions.

No process blocker remains before QA. The working tree is intentionally uncommitted per the Development Team handoff.

---

## Scope Check

The implementation stays within STEP-03:

- Adds pure domain types and helpers for `ObservedBaseline`, `Divergence`, `DivergenceDimension`, `DivergenceStatus`, `Evidence`, baseline statistics, and stream-level detection.
- Adds focused domain specs and a replay-level detector spec that reads observations through `ReplayStreamObservationRepository`.
- Adds one small production helper, `byObservedAt`, to `src/app/domain/observation.ts` for deterministic chronological ordering.
- Adds `src/testing/observation-builders.ts` as a test-only helper imported only by specs.
- Records A-030 in the Moderator Register.

The implementation does not change dashboard production code, dashboard facade code, fixtures, About files, routes, styles, package metadata, live integration code, credentials, or UI rendering.

---

## Findings

### Must Fix Now

None.

### Could Fix Later

None.

---

## Acceptance Check Mapping

- STEP-03 approval entry: met. A-029 is present.
- Domain types for Observed Baseline, Divergence, Divergence Dimension, Divergence Status, and Evidence: met. Implemented under `src/app/domain/`.
- Canonical terminology: met. Runtime/domain values use canonical CAV Level 1 terms, and `domain-terminology.spec.ts` plus replay detection guardrails check serialized outputs.
- Reserved Level 3+ terms: met for current behavior. Comments/tests mention Attribution and Convergence only as explicit non-claims required by A-030.
- Pure deterministic baseline derivation: met. `deriveObservedBaseline` and `referenceWindowFor` are pure, deterministic helpers.
- Observed Baseline fields: met. Baselines carry stream kind, identity slice ID, dimension, reference window, sample size, reference observation IDs, version, method, and numeric/categorical summaries.
- Pure deterministic sustained detection: met. `detectSustainedDivergences` and `detectStreamDivergences` evaluate chronological candidate observations against immutable baselines.
- One-off suppression: met. Specs cover one-off document and workflow changes across dimensions and shorter-than-threshold runs.
- Divergence fields: met. Divergences carry stream kind, full Identity Slice, dimension, embedded baseline, observed summary, magnitude, onset, latest timestamp, duration, status, sustained criteria, and Evidence.
- Evidence reconstruction: met. Evidence carries source observation IDs, source references, compared values, baseline membership, context, and chronological ordering; specs rebuild a baseline from referenced observations.
- Document dimensions: met. Tests cover vendor representation, amount value, currency, and supported date behavior via `document-date-lag`.
- Workflow dimensions: met. Tests cover task duration, response time, task outcome, workflow runtime, and no-baseline behavior where response data is absent.
- QA-014 handling: met. The detector emits Approval step and Workflow runtime Divergences independently when both meet criteria, with no cross-reference, suppression, or derived marker.
- No Attribution: met. Decision-agent and instance/runtime fields are Evidence context only; tests assert no decision-agent dimension and no related/derived/cause fields.
- Source-agnostic boundary: met. Production code stays in domain helpers; replay-level tests use the repository interface and do not import fixture files directly.
- Existing dashboard behavior: met by scope inspection and passing full test suite; no dashboard production files changed.
- Fixture safety and live-call boundary: met by scope inspection; fixtures were not changed and no live API code was added.
- Dashboard guardrail coverage: met. Existing dashboard guardrail specs still pass in the full suite.
- `npm run lint` under Node.js v26.0.0: met.
- `npm run build` under Node.js v26.0.0: met after rerun outside sandbox due to known Angular/esbuild `spawn EPERM`.
- `npm test -- --watch=false` under Node.js v26.0.0: met after rerun outside sandbox due to known Angular/esbuild `spawn EPERM`.

---

## Design ID Mapping

- DS-003: met for STEP-03 data readiness. Divergence results are aggregate-ready, but KPI rendering remains unchanged.
- DS-006: met. Baseline records carry method, reference window, sample size, and value/range/distribution summaries for later panel rendering.
- DS-007 and DS-014: met. Evidence records are chronological and carry source/context values for later Evidence Trace/detail rows.
- DS-009: met. Document stream domain logic covers vendor representation, amount, currency, and date-related behavior supported by normalized observations.
- DS-010: met. Workflow stream domain logic covers task duration, response time, outcome, and workflow runtime.
- DS-013: met for domain readiness. `DivergenceStatus` includes lifecycle statuses, while user action handling remains out of scope.

No new user-facing visual component was required by STEP-03.

---

## Architecture And Domain Check

- `architecture.md` D3 is followed: canonical CAV domain objects are explicit.
- `architecture.md` D4 is preserved: detection runs over replay-backed observations without live dependencies.
- `architecture.md` D5 is followed: Divergences require sustained repeated evidence, not one-off observations.
- `architecture.md` D6 is followed: Divergence records carry baseline snapshots and Evidence.
- `architecture.md` D9 is respected: no CAV Level 2+ or Intent behavior is implemented.
- `architecture.md` D11 is satisfied with focused unit coverage.
- `architecture.md` D13 remains intact: no dashboard component imports replay fixtures, and no BFF/live adapter work was introduced.
- `domain-language.md` guardrails are respected. Observed Baseline is not treated as Intent, and Divergence is not labeled as an alert/anomaly/violation/breach in runtime output.

---

## Verification

Run with Node.js v26.0.0 via `fnm`:

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | Pass - `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | Pass - all files pass linting |
| `fnm exec --using=v26.0.0 npm.cmd run build` | Pass after rerun outside sandbox; sandboxed run failed with known `spawn EPERM` |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | Pass after rerun outside sandbox; 20 test files and 268 tests passed |

Build output:

- Initial total: 256.96 kB raw / 73.44 kB estimated transfer.
- Lazy chunks unchanged in kind: `dashboard-component` and `about-component`.

---

## QA Handoff

STEP-03 is ready for QA review.

QA should pay special attention to:

- sustained Divergence versus one-off variation;
- Evidence reconstruction from source observations and baseline context;
- QA-014 independent Approval step and Workflow runtime Divergences;
- absence of UI rendering scope creep;
- absence of Attribution, business-judgment, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or CAV Level 2+ claims in current behavior.

MOD-W v5.0.1
