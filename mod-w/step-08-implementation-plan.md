# STEP-08 Implementation Plan - Quality Gate Completion And Documentation

**Step:** `mod-w/step-08.md`
**Step approval:** A-060 (briefing and implementation planning only)
**Author:** Development Team (Claude Code)
**Date:** 2026-09-26
**Status:** Proposed - awaiting Moderator implementation-plan approval
**Revision:** 2026-09-26 - corrected TL-PLAN-01 (QA-031 browser visibility of "Failed") in sections 5 and 12

No STEP-08 code, test, configuration, About copy, or documentation change is made until the Moderator approves this plan and records the approval in `mod-w/validation/moderator-register.md`. This file is the plan only. The Development Team does not write the register entry unless the Moderator instructs it.

---

## 1. Current State

| Area | Finding |
| --- | --- |
| E2E | `e2e/example.spec.ts` tests `playwright.dev`. `playwright.config.ts` is the starter config: no `baseURL`, no `webServer`, three browser projects, and the `html` reporter, which opens a browser when a run fails. Playwright 1.63.0 is installed with matching browsers (chromium 1243, firefox 1543, webkit 2359). |
| Determinism | Production code has no `Date.now()`, `new Date()`, `setTimeout`, or artificial delay. Replay loading is deterministic. |
| Test hooks | The dashboard already has `data-testid` attributes, `role=tablist/tab/tabpanel`, and `aria-current` on the selected Divergence card. No new hooks are needed. |
| Focus behavior | `dashboard.component.ts` already moves focus to the analysis heading when the analysis opens, back to the control that opened it on Back, and keeps focus on the tab when the stream changes. |
| Breakpoint | The list/detail grid becomes one column at `max-width: 1279px` (`dashboard.component.scss`). |
| Out-of-date About copy | `about.component.html` still says "This build is the STEP-01 foundation … added in later Steps", "Domain (planned)", "Data (planned)", and "Replay data will be modeled…". |
| PO-1 (A-014) | About names the DocuWare Platform REST API and Workflow Analytics API but does not link them. Not yet satisfied. |
| Claim guardrails | `src/testing/claim-guardrail-patterns.ts` `businessJudgment` matches `failure` but not `Failed`. The factual "Failed" value under "Instance state" (`divergence-format.ts`) passes because of how the pattern is written, not because a check evaluates its context. |
| Research documentation | `mod-w/docs/` does not exist. The repo records no sources from the pre-build research that `product.md` v1.0 mentions (2026-09-16/17). The only public source URLs in the repo are the two `knowledgecenter.docuware.com` links in the replay fixture metadata. `docs/design-api-summary.md` is marked advisory and uses assumed endpoints, so it is not cited as a source. |
| README | `README.md` "Current Step" still describes STEP-01 and says Observed Baseline calculation, sustained Divergence detection, Evidence Trace, and chart analysis are not implemented. |

---

## 2. Playwright Server And Configuration

### Proposed approach: production build served by a zero-dependency static server

| File | Change |
| --- | --- |
| `e2e/support/serve-dist.mjs` (new) | A static server of about 40 lines built on `node:http`. It serves `dist/idp-align/browser` on `127.0.0.1:4300` and falls back to `index.html` for application routes. No package is added. |
| `playwright.config.ts` | Add `webServer: { command: 'npm run build && node e2e/support/serve-dist.mjs', url: 'http://127.0.0.1:4300', reuseExistingServer: false, timeout: 180_000 }` and `use.baseURL`. Use one `chromium` project. Use reporters `[['list'], ['html', { open: 'never' }]]`. Keep `forbidOnly`. Set `retries: 0` so a flaky test cannot pass on retry. Use `trace: 'retain-on-failure'`. Remove the commented-out starter blocks. |
| `package.json` | No change. `npm run test:e2e` still runs `playwright test`. |

### Why this approach

- It tests the same production build that `npm run build` produces and that QA checked in STEP-06 and STEP-07, not the `ng serve` development server.
- It adds no dependency, which A-060 requires.
- A fixed port with `reuseExistingServer: false` prevents a stale server from being tested by mistake.

**Alternative considered:** `webServer` running `ng serve`. It is simpler, but it tests development-mode output and an HMR socket. Not recommended.

**Browser engine:** Chromium only. Firefox and WebKit are installed, but three engines triple the run time and add engine-specific flakiness without changing what STEP-08 checks. They can be added later as projects outside the gate if the Moderator wants cross-engine evidence.

---

## 3. E2E Coverage

`e2e/example.spec.ts` is deleted. The following files are added.

### Support files

**`e2e/support/fixtures.ts`** - extends `test` with a guarded `page` fixture used by every browser spec:

- blocks and records every request whose origin is not `baseURL`;
- records `console` errors and `pageerror` events;
- asserts after each test that both lists are empty.

No test clicks an external link. Reference links are checked by their attributes only, so no external navigation occurs.

**`e2e/support/claim-text.ts`** - collects rendered claim text in the browser:

- removes `[data-boundary]` elements, as the About spec already does;
- removes an Evidence context field only when its label is exactly "Instance state" and its value is one of the source-state labels (Completed, Running, Failed, Stopped);
- returns the remaining text and a list of any "fail" wording found outside that allowed context.

### Specs

| Spec | Flows | Design IDs |
| --- | --- | --- |
| `dashboard-document.spec.ts` | `/` redirects to `/dashboard` with the Document tab `aria-selected`. Heading, CAV Level 1 subtitle, replay-source note, and KPI cards render with values. Selecting a card sets `aria-current` and fills the detail pane. The Observed Baseline panel shows method, reference window, and sample size. Evidence Trace items show time, source, and value. | DS-001, DS-003, DS-004, DS-005, DS-006, DS-007, DS-009, DS-013, DS-014 |
| `dashboard-workflow.spec.ts` | The same path for the Workflow stream, including Workflow KPIs and Evidence context fields. No cross-stream contamination: after a switch, the Document selection, filters, and heading do not appear in Workflow, and the reverse. | DS-001, DS-003, DS-004, DS-005, DS-007, DS-010, DS-014 |
| `stream-tabs-a11y.spec.ts` | Roving tabindex with ArrowRight, ArrowLeft, Home, and End. `aria-selected`, `aria-controls` to the rendered panel, and `aria-labelledby` back to the tab. Focus stays on the tab after a switch. | DS-002 |
| `filters-sorting.spec.ts` | Identity Slice, Status, and Time range filters narrow the result summary. Sort changes card order. Hidden selection: a selected card that is filtered out shows `detail-hidden`. A filter combination with no matches shows the filtered-empty state. Clear filters restores the list, and `aria-disabled` is set when no filter is active. Each stream keeps its own filter state across switches. KPI counts do not change with filters. Document stream, plus Workflow where practical. | DS-008, DS-011 |
| `divergence-analysis.spec.ts` | Opening the analysis from a selected Divergence moves focus to its heading. The chart canvas renders with a non-zero size, and the summary and table are present. On a Workflow Approval Divergence, the metric toggle switches the Dimension and updates the context and table. Back closes the analysis and returns focus to the open-analysis control. Switching stream with the analysis open closes it, and it is not open on return. | DS-015 |
| `responsive.spec.ts` | At 1280×800, list and detail are side by side (bounding boxes). At 1279×800, they stack. At 375×812, tabs, KPIs, filters, cards, detail, and analysis render. At every width, the page does not scroll horizontally (`scrollWidth ≤ clientWidth`). | DS-001, DS-003, DS-015 |
| `about.spec.ts` | The About nav link loads `/about`, and the Dashboard nav link returns to it. The References section contains exactly the two DocuWare links, each with `target="_blank"` and `rel` containing `noopener` and `noreferrer`. The CAV repository link keeps the same attributes. The out-of-date phrases ("later Steps", "(planned)", "STEP-01 foundation", "will be modeled") are absent. | R10, R13 |
| `claim-guardrails.spec.ts` | Rendered claim text across About and both streams, with the analysis open and closed. See section 5. | R5, R9 |
| `documentation.spec.ts` | Node-only check of `mod-w/docs/research-references.md`. See section 7. | R10 |

### Not covered by E2E

Categorical workflow behavior, error-exit values, and the loading, unavailable, and retry states cannot occur with the current replay data. They remain covered by the existing component specs. The E2E suite adds no fixtures and no test-only routes.

---

## 4. About Changes

Files: `src/app/features/about/about.component.html` and `src/app/features/about/about.component.spec.ts`. Only the items below change.

### New References section (PO-1)

A final section with `data-testid="about-references"`:

- "DocuWare Platform REST API documentation" - `https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api`
- "DocuWare Workflow Analytics API documentation" - `https://knowledgecenter.docuware.com/docs/workflow-analytics-api`

Both links use `target="_blank" rel="noopener noreferrer"`. One `data-boundary` sentence follows: "These are public documentation pages; linking to them does not imply DocuWare review or endorsement."

Both URLs are re-checked during implementation. If either has moved, the Development Team reports it rather than choosing a replacement.

### Out-of-date copy replaced

Draft wording, subject to Product Owner review after QA:

| Current | Proposed |
| --- | --- |
| "Replay data will be modeled on these publicly documented API shapes." | "Replay data is modeled on these publicly documented API shapes." The live-adapter sentence is unchanged. |
| "This build is the STEP-01 foundation: stream tabs plus reserved regions for summary metrics, filters, the Divergence list, and Divergence detail. Replay data, Observed Baseline calculation, sustained Divergence detection, Evidence traces, and chart analysis are added in later Steps." | "The dashboard runs sustained Divergence detection over synthetic replay data. For each stream it calculates Observed Baselines and shows summary metrics, filters and sorting, a Divergence list and detail, an Evidence Trace, and a Divergence Analysis chart. Both streams share the same presentational components and are observed independently." |
| "Domain (planned): pure functions for Observed Truth, Identity Slices, Observed Baselines, and Divergence." | "Domain: pure functions for Observed Truth, Identity Slices, Observed Baselines, and sustained Divergence detection." |
| "Data (planned): repository interfaces with a local replay adapter first." | "Data: repository interfaces with a local replay adapter, the only adapter implemented." |

### Spec updates

- Replace the `STEP-01 foundation` assertion with current-state assertions.
- Add tests for the References links and their attributes.
- Add a test that the out-of-date phrases are absent.
- Keep the existing overclaim patterns and boundary-negation test unchanged. They also cover the new copy.

---

## 5. CAV Level 1 Claim Guardrails

`e2e/claim-guardrails.spec.ts` applies the existing `CLAIM_GUARDRAIL_PATTERNS` and `SEVERITY_RISK_PATTERN`, imported from `src/testing/claim-guardrail-patterns.ts` so the patterns are not duplicated.

### "Failed" under "Instance state" versus a failure claim

Per A-059 and A-060, a factual source-state value is allowed; a judgment is not.

- "Fail" wording is checked separately with `/\bfail(ed|ure|ures|s|ing)?\b/i`.
- It may appear only as the value of an Evidence context field labeled exactly "Instance state", and only as one of the source-state labels.
- Any other occurrence fails the test, including "failure" anywhere, and "Failed" in a card, detail copy, KPI note, or analysis copy.
- With current replay data, "Failed" is not browser-visible. Per STEP-07 QA-031, every runtime Evidence row in the current Workflow runtime Divergence renders "Instance state: Completed". The replay fixture marks only Payment release error-exit instances as `Failed`, and none of those is in that Divergence's Evidence.
- E2E does not require "Instance state: Failed" to render. To show the context rule is exercised in the browser, the test asserts that at least one "Instance state" field is visible (currently "Completed") and that the helper removes it through the allowed-context rule.
- "Failed" remains an accepted factual source-state label (A-059, A-060) if it appears under "Instance state". A positive control runs a synthetic "Instance state: Failed" field through the helper and must be accepted, without depending on replay data.
- Two negative controls prove the helper rejects judgment text. A synthetic `Divergence failure` and a synthetic `Instance state: failure of approval` are run through the same helper and must both be rejected.

### Other checks

- Observed Baseline is not described as a target, intended value, policy, requirement, or business truth.
- Divergence is not described as an alert, anomaly, violation, breach, failure, defect, non-conformance, severity, risk, business-correctness judgment, or root-cause finding.
- No CAV Level 2+ terms, Attribution, or cross-stream reconciliation, comparison, or correlation appear as implemented behavior.
- Existing unit and component guardrail specs remain in place and are not weakened.

---

## 6. Research And Reference Artifact

New file: `mod-w/docs/research-references.md` (D10, R10).

### Structure

1. Purpose and boundaries: public sources only; no endorsement, private access, confidential information, production readiness, or DocuWare defect/gap claim.
2. One section per Product References topic. Each has a table with Source, URL, Publisher, Accessed date, How it informed IDP-Align scope, and Limits of the claim.
3. A closing note, "Unrecorded pre-build research", stating that `product.md` v1.0 refers to market research from 2026-09-16/17 whose sources were not recorded in the repo, and that this artifact does not reconstruct them.

### Verification rule

- Every external source is fetched during implementation. Only sources actually retrieved and read are listed, with their access date.
- A source that cannot be retrieved, or does not support the stated relevance, is left out and reported in the handoff.
- The artifact does not claim that any source was used in the original research. It states that the sources were consulted during STEP-08 to document the scope framing.

### Candidate sources (not yet verified)

| Topic | Candidates to fetch and verify |
| --- | --- |
| DocuWare AI Hub | DocuWare's public AI Hub / intelligent document processing page and the matching knowledge-center page, located by search |
| Platform REST API | `https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api`, and the public DocuWare developer portal if reachable |
| Workflow Analytics API | `https://knowledgecenter.docuware.com/docs/workflow-analytics-api` |
| Purchase-to-Pay / invoice processing | DocuWare's public invoice-processing / accounts-payable solution page |
| ML drift monitoring | Evidently AI data-drift documentation; NannyML or Arize drift-monitoring documentation |
| Data observability | Soda documentation on checks and anomaly detection. Arize and Soda are the tools whose screenshots are in `design-refs/`. |
| Streaming drift detection | River drift-detector documentation (ADWIN, Page-Hinkley); Gama et al., "A Survey on Concept Drift Adaptation", ACM Computing Surveys, 2014, as a bibliographic anchor |
| CAV Manifesto v1.0 | In-repo `cav/CAV-MANIFESTO.md` and `https://github.com/fpmcguire/continuous-alignment-verification` |
| MOD-W methodology | `https://github.com/fpmcguire/mod-w` and the in-repo `mod-w/` templates (v5.0.1) |

### Relevance framing

Adjacent-tooling entries are recorded as prior art, consistent with `product.md` non-goal 4. They are not framed as gaps that IDP-Align fills. Terms those tools use, such as anomaly, alert, and monitor, are quoted as their terms and are never applied to IDP-Align's behavior.

The About References section remains a separate, concise user-facing summary and does not replace this artifact.

---

## 7. Documentation Checks

`e2e/documentation.spec.ts` runs in Node without launching a browser. It reads `mod-w/docs/research-references.md` and checks that:

- all seven Product References topic headings are present;
- every source row has an `https://` URL, an access date, and a non-empty relevance entry;
- no credential or secret patterns (`FIXTURE_SECRET_PATTERNS.credentials`) or tenant hosts (`docuware.cloud`) appear;
- the claim patterns find nothing in the IDP-Align scope and boundary sections. Adjacent-tooling rows may quote other tools' terms.

The check runs inside `npm run test:e2e`, so no new npm script is needed.

---

## 8. Optional README Change (Moderator Decision)

Replace the out-of-date "Current Step" block in `README.md` with a short current-state paragraph that keeps CAV Level 1 limits, and add `npm run test:e2e` to the command list with a note that it builds and serves the app locally.

**Justification:** the README makes the same "does not implement Observed Baseline calculation…" statement that STEP-08 removes from About, and reviewers read it.

**If declined:** the README is left unchanged and recorded as an out-of-scope note in the handoff.

---

## 9. Verification Commands And Evidence

All commands run under Node.js v26.0.0 as `fnm exec --using=v26.0.0 npm.cmd …`.

| # | Command | Evidence recorded |
| --- | --- | --- |
| 1 | `run lint` | Pass output |
| 2 | `run build` | Pass output |
| 3 | `test -- --watch=false` | Pass output; test count must be at least 496, new count reported |
| 4 | `run test:e2e` | List-reporter output, test count per spec, confirmation of zero external requests and zero console errors |
| 5 | Static scan | No `playwright.dev` or external `https://` targets in `e2e/` other than About link assertions; no fixture imports in `features/` or `shared/`; no changes under `src/app/data` or `src/app/domain`; `git diff --stat` limited to the files in section 10 |

The handoff includes each command's output and a table mapping every STEP-08 acceptance check to its evidence.

---

## 10. Affected Files

| Action | File |
| --- | --- |
| Delete | `e2e/example.spec.ts` |
| New | `e2e/support/fixtures.ts`, `e2e/support/claim-text.ts`, `e2e/support/serve-dist.mjs` |
| New | `e2e/dashboard-document.spec.ts`, `e2e/dashboard-workflow.spec.ts`, `e2e/stream-tabs-a11y.spec.ts`, `e2e/filters-sorting.spec.ts`, `e2e/divergence-analysis.spec.ts`, `e2e/responsive.spec.ts`, `e2e/about.spec.ts`, `e2e/claim-guardrails.spec.ts`, `e2e/documentation.spec.ts` |
| New | `mod-w/docs/research-references.md` |
| Modify | `playwright.config.ts` |
| Modify | `src/app/features/about/about.component.html`, `src/app/features/about/about.component.spec.ts` |
| Modify (if approved) | `README.md` |

**Unchanged:** replay fixtures, domain, data, detectors, dashboard and shared UI production code, `package.json`, `package-lock.json`, `mod-w/roadmap.md`, the Moderator register, `review.md`, and `qa.md`.

If E2E exposes a real defect in production UI code, the Development Team stops and reports it rather than fixing it inside STEP-08.

---

## 11. Scope Preservation

- No new CAV behavior, fixtures, data scenarios, detector, threshold, reference-window, baseline, Evidence, or lifecycle changes.
- No live DocuWare calls, credentials, OAuth, backend/proxy code, or non-replay adapters.
- No user action workflows, cross-stream reconciliation, or CAV Level 2+ claims.
- Categorical workflow behavior remains spec-covered only.
- QA-028 and QA-029 remain accepted non-blocking carry-forward notes. The responsive spec observes whether page-level horizontal scrolling occurs but does not change chart formatting or table keyboard access.
- About edits are limited to the References section and the four statements in section 4.
- No package or chart-library changes.

No item in this plan requires separate scope approval beyond implementation-plan approval.

---

## 12. Assumptions

- Relative time-range filters use the replay data's own time range, not the current date. Production code has no `Date.now()` or `new Date()`; E2E will confirm stable results.
- The two `knowledgecenter.docuware.com` URLs are still valid public pages. They are re-checked during implementation.
- Rendered Workflow runtime Evidence rows show "Instance state: Completed", as reported in STEP-07 QA-031. "Failed" is not browser-visible with current replay data. It is allowed as a factual source-state label if it appears, but E2E does not depend on it.

## 13. Risks

| Risk | Mitigation |
| --- | --- |
| The original pre-build research sources are unrecorded, so the artifact covers only sources consulted in STEP-08. | The artifact states this explicitly. If the Moderator or Product Owner provides the original research notes, they can be cited instead. |
| Some vendor pages may block fetching or have moved. | Those sources are omitted and reported, not guessed. |
| `test:e2e` rebuilds the app first, adding about 30-60 seconds. | Accepted as the cost of testing the real production build. |
| E2E selectors depend on existing `data-testid` attributes. | No new hooks are added to production code; selectors prefer roles and accessible names where available. |

---

## 14. Decisions Requested From The Moderator

1. Server approach (section 2): zero-dependency static server over `dist` (recommended) or `ng serve`.
2. Chromium as the only E2E engine for the gate.
3. The optional README change (section 8).
4. The draft About wording (section 4). It still goes to Product Owner review after QA.

---

## 15. Handoff Sequence

1. The Moderator approves this plan and records the approval in the register. The Development Team does not write the entry unless instructed.
2. The Development Team implements the approved scope, runs the verification in section 9, and hands off the diff and evidence.
3. The Tech Lead reviews in `review.md`, and the Moderator accepts the review before QA begins.
4. QA reviews in `qa.md` with independent verification of R10/R11, preserving QA-028, QA-029, and the categorical coverage limitation as notes.
5. The Product Owner reviews the About/References copy and `mod-w/docs/research-references.md` after QA.
6. The Moderator conducts the STEP-08 final gate.

Nothing is committed unless the Moderator explicitly instructs it.

---

MOD-W v5.0.1
