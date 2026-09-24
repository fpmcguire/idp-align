# Moderator Register - IDP-Align

**Project:** IDP-Align  
**Owner:** Moderator  
**Workflow:** MOD-W v5.0.1  
**Purpose:** Single project record for Moderator approvals, role approvals, gate decisions, conditions, and authorized next actions.

---

## Usage

Record every Moderator approval here, including:

- Product Owner approvals
- Design approvals
- Tech Lead / Architecture Definition approvals
- Step approvals before Development Team briefing
- Development Team implementation-plan approvals
- Tech Lead review acceptance
- QA acceptance
- Final Moderator gates
- Role assignment changes or role-specific approvals

Each entry should include date, role/gate, status, approved artifacts or scope, conditions, and next authorized action.

---

## Required Gate Types

For each implementation Step, record these gates when they occur:

| Gate | Required before | Evidence to cite |
| --- | --- | --- |
| Step approval | Development Team briefing | Active `step-xx.md`, roadmap status, conditions |
| Implementation-plan approval | Development Team writes code | Dev Team plan and affected areas |
| Tech Lead review acceptance | QA starts | `review.md`, build/test evidence, findings status |
| QA acceptance | Moderator final gate | `qa.md`, acceptance-check evidence |
| Final Moderator gate | Tagging, roadmap advancement, Step completion | `review.md`, `qa.md`, Product Owner sign-off if applicable, manual verification notes |

If a gate is skipped or reordered, the Moderator must record an explicit override entry here with rationale and conditions.

---

## Approval Log

### A-001 - Architecture Definition / Tech Lead Work Approval

**Status:** Approved  
**Date:** 2026-09-23  
**Moderator:** Frank McGuire  
**Product Owner:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Architecture Definition  
**Next authorized action:** Brief Development Team on `mod-w/step-01.md`.

#### Approved Artifacts

- `mod-w/product.md` v1.2 feature update
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/roadmap.md`
- `mod-w/step-01.md`
- `mod-w/cross-validation.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.codex/config.toml`
- `.claude/settings.json`
- `.mcp.json`

#### Approval Summary

The Moderator and Product Owner approve the Tech Lead's Architecture Definition work and authorize proceeding to the next MOD-W phase: Development Team briefing for `mod-w/step-01.md`.

`STEP-01` is approved as the active implementation Step:

**Dashboard Foundation, Stream Shell, And About View**

#### Conditions

- Development Team must implement only the approved `STEP-01` scope.
- Development Team must wait for Moderator approval of its implementation plan before writing code.
- The About / Project Context view must include the approved architecture summary, MOD-W assessment explanation, and no target-organization or company-specific naming.
- Tech Lead review is required before QA acceptance.

---

### A-002 - STEP-01 Development Team Briefing Approval

**Status:** Approved  
**Date:** 2026-09-23  
**Moderator:** Frank McGuire  
**Product Owner:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Brief Development Team on `mod-w/step-01.md`; Development Team may read context and propose an implementation plan, but may not write code until the Moderator approves that plan.

#### Approved Scope

`STEP-01 - Dashboard Foundation, Stream Shell, And About View`

#### Approval Summary

The Moderator and Product Owner approve `mod-w/step-01.md` as the active implementation Step and authorize Development Team briefing.

#### Conditions

- The About / Project Context view must be a one-page project brief geared toward interview reviewers.
- The About / Project Context view must be reachable from top navigation.
- The About / Project Context brief must explain project intent, dashboard UI, architecture, MOD-W workflow, CAV Level 1, scope boundaries, and current-version MOD-W assessment.
- The About / Project Context brief and new STEP-01 user-facing copy must not mention the target organization or company-specific product/API names.
- No code changes are authorized until the Development Team implementation plan is approved and recorded in this register.

---

### A-003 - STEP-01 Development Team Implementation Plan Approval

**Status:** Approved  
**Date:** 2026-09-23  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before code changes  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Development Team may now write code to implement STEP-01.

#### Approved Plan

Development Team implementation plan for STEP-01, as outlined in Development Team kickoff response:

1. Setup: Remove starter content, scaffold dashboard and about directories
2. Styling & Tokens: Add global design tokens to `src/styles.scss`, component SCSS
3. Routing: Add dashboard and about routes with top-navigation About link
4. Dashboard Shell & Streams: Signal-backed stream tabs, placeholder regions (summary, filter bar, list, detail)
5. About Page: One-page project brief for reviewers explaining intent, UI, architecture, MOD-W, CAV Level 1, scope, and MOD-W assessment angle
6. Tests: Unit tests for shell rendering, stream switching, About route, forbidden-name absence
7. Build & Test: Verify `npm run build` and `npm test` pass

#### Affected Files

- `src/app/app.ts`, `src/app/app.html`, `src/app/app.scss`, `src/app/app.routes.ts`, `src/styles.scss`
- `src/app/features/dashboard/` (new feature)
- `src/app/features/about/` (new feature)
- `src/app/shared/ui/` (as needed)
- `src/app/app.spec.ts` or per-feature spec files

#### Approval Summary

The Moderator approves the Development Team implementation plan and authorizes code changes for STEP-01.

#### Conditions

- Preserve all approved design intent from `design-spec.md` (visual hierarchy, interaction patterns, color palette, accessibility baseline).
- Use canonical CAV v1.0 terminology from `domain-language.md` in all user-facing copy.
- Ensure About page does not mention target organization or company-specific product/API names.
- After implementation, run `npm run build` and `npm test` before Tech Lead review.
- Code changes must remain within STEP-01 scope as defined in `mod-w/step-01.md`.

---

### A-004 - STEP-01 Product Direction Change Approval

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Product Owner:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Product / Architecture / Step scope-change override during Tech Lead review  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Development Team may revise the existing STEP-01 implementation package in place to align with the updated DocuWare-specific v1 research/demo direction, then resubmit for Tech Lead review.

#### Approved Artifacts

- `mod-w/product.md` v1.2
- `mod-w/architecture.md` D12/D13 guardrail update
- `mod-w/domain-language.md` DocuWare research-context guardrail update
- `mod-w/language-matrix.md`
- `mod-w/step-01.md` updated STEP-01 acceptance checks
- `review.md` F-000 process finding

#### Approval Summary

The Product Owner updates IDP-Align v1 positioning: the app should surface itself as a personal DocuWare interview research/demo project for the September 28, 2026 Software Engineer interview. DocuWare references should not be hidden when they explain the domain, public API research intent, and demo purpose.

This approval overrides the earlier STEP-01 condition that the About / Project Context view and new STEP-01 copy must avoid target-organization or company-specific product/API naming.

#### Conditions

- DocuWare references are allowed only in bounded research/demo context.
- The app must not imply DocuWare endorsement, private DocuWare access, confidential interview content, production readiness, or a DocuWare product defect/gap claim.
- CAV Level 1 terminology and claim guardrails remain active.
- The existing STEP-01 implementation remains unaccepted until Development Team revises it and Tech Lead review acceptance is recorded.
- QA may not proceed until Tech Lead review acceptance is recorded in this register.

---

### A-005 - STEP-01 Development Team Rework Plan Approval

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Product Owner:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Development Team rework-plan approval before STEP-01 rework review  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Tech Lead may re-review the revised STEP-01 implementation package against the updated DocuWare-specific v1 direction.

#### Approved Rework Plan

The Development Team is approved to revise the existing STEP-01 implementation in place after A-004, without rolling back the original committed implementation or the uncommitted Angular file split.

Approved rework scope:

1. Update the About / Project Context view to present IDP-Align v1 as a bounded DocuWare interview research/demo project for the September 28, 2026 Software Engineer interview.
2. Update About tests to require the DocuWare research/demo context and reject prohibited overclaims.
3. Remove or neutralize hard-coded dashboard KPI counts and vendor filter values that imply completed replay/domain logic before later Steps.
4. Add semantic active state to the stream tabs.
5. Preserve separate Angular `.ts`, `.html`, and `.scss` component files.
6. Run build and tests with a compatible Node version, documenting any environment limitation.

#### Conditions

- Rework must stay within the updated STEP-01 scope.
- DocuWare references remain bounded by A-004 and `mod-w/language-matrix.md`.
- `.claude/settings.json` is not part of STEP-01 and is not approved as part of this implementation package.
- QA may proceed only after Tech Lead review acceptance is recorded.

---

### A-006 - STEP-01 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** QA may review STEP-01 against `mod-w/step-01.md`, `review.md`, the updated DocuWare-specific source-of-truth artifacts, and the passing build/test evidence.

#### Accepted Artifacts

- `review.md`
- Revised STEP-01 implementation package in the current working tree, excluding `.claude/settings.json`
- `mod-w/product.md` v1.2
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/roadmap.md`
- `mod-w/step-01.md`

#### Acceptance Summary

Tech Lead review for STEP-01 passes. The reworked implementation resolves prior findings:

1. About copy and tests now align with the updated DocuWare-specific research/demo scope.
2. Dashboard placeholders no longer imply completed replay data, Observed Baseline calculation, or sustained Divergence detection.
3. Stream tabs expose semantic active state and keyboard behavior.

#### Evidence

- `review.md` verdict: Pass.
- `npm run build` passed under Node.js v26.0.0.
- `npm test -- --watch=false` passed under Node.js v26.0.0.
- Test result: 4 test files passed, 49 tests passed.

#### Conditions

- `.claude/settings.json` is modified in the working tree but is not part of STEP-01 and is not approved by this gate.
- The default Node.js version remains v24.13.0, below Angular CLI's minimum v24.15.0 on the v24 line; QA should use Node.js v26.0.0 or another compatible version.
- QA must verify that STEP-01 remains within CAV Level 1 and the bounded DocuWare research/demo guardrails.

---

### A-007 - Product Definition v1.3 Surfacing Boundary Clarification

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Product Owner:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Product semantic clarification during Tech Lead to QA handoff  
**Step:** `mod-w/step-01.md` impact check  
**Next authorized action:** QA may review STEP-01 using Product Definition v1.3, updated `review.md`, and the passing build/test evidence.

#### Approved Artifacts

- `mod-w/product.md` v1.3
- `mod-w/domain-language.md`
- `mod-w/step-01.md`
- `src/app/features/about/about.component.html`
- `src/app/features/about/about.component.spec.ts`
- `review.md`

#### Approval Summary

The Moderator authorizes Product Definition v1.3 to clarify the CAV Level 1 surfacing boundary:

`Observe -> Establish Baseline -> Detect Divergence -> Surface Evidence -> Interpret`

IDP-Align is responsible through Surface Evidence. Divergence detection is computational, while IDP-Align's product responsibility is to surface sustained change with reconstructable Evidence rather than judge the change as bad, defective, non-conformant, or contrary to business intent.

This is a semantic/product-contract clarification. It does not expand implementation scope, reinterpret CAV levels, add new product capability, or reopen STEP-01 beyond checking and minimally aligning user-facing wording.

#### STEP-01 Impact

- STEP-01 remains dashboard foundation scope only.
- Replay ingestion, Observed Baseline calculation, sustained Divergence detection, Evidence Trace implementation, and Chart.js analysis remain out of scope.
- About copy was minimally updated to state the surfacing boundary.
- About tests were updated to verify the surfacing boundary and reject business-judgment overclaims in claim copy.
- A-006 remains the historical Tech Lead acceptance record; `review.md` now records the Product v1.3 re-review result.

#### Conditions

- `.claude/settings.json` remains outside this authorization and outside STEP-01.
- QA must verify that no STEP-01 UI wording presents Divergence as inherently bad, defective, non-conformant, or in violation of business intent.

---

### A-008 - STEP-01 CAV Reference Link And README Alignment

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Documentation and About-page clarification before QA  
**Step:** `mod-w/step-01.md` impact check  
**Next authorized action:** QA may review STEP-01 using the updated About page, README, `review.md`, and the passing build/test evidence.

#### Approved Artifacts

- `src/app/features/about/about.component.html`
- `src/app/features/about/about.component.scss`
- `src/app/features/about/about.component.spec.ts`
- `README.md`
- `review.md`

#### Approval Summary

The Moderator requested a link to the CAV repository/reference on the About page and a README review for Product Definition v1.3 alignment.

The About page now links to the canonical CAV repository:

`https://github.com/fpmcguire/continuous-alignment-verification`

The README was replaced with project-specific content covering IDP-Align's DocuWare research/demo framing, Product v1.3 CAV surfacing boundary, current STEP-01 scope, and compatible Node.js verification note.

#### Conditions

- This does not expand STEP-01 implementation scope.
- `.claude/settings.json` remains outside this authorization and outside STEP-01.

---

### A-009 - `.claude/settings.json` Separate Approval

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Gate:** Disposition of QA finding QA-001  
**Next authorized action:** None required. STEP-01 final gate may cite this entry for QA-001.

#### Approved Artifacts

- `.claude/settings.json` as committed in `d6f77ac`

#### Approval Summary

The Moderator approves `.claude/settings.json` separately from STEP-01. It is committed on `master` in `d6f77ac`, whose commit message ("docs: clarify CAV surfacing boundary for QA") does not describe the change.

#### Conditions

- `.claude/settings.json` remains outside STEP-01 scope and outside STEP-01 acceptance.
- This approval does not change STEP-01 acceptance checks or scope.

---

### A-010 - STEP-01 QA Finding Dispositions And Rework Routing

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead (rework definition), Development Team (rework implementation)  
**Gate:** QA finding dispositions before Moderator final gate  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Tech Lead records the required rework below in `review.md` and hands it to the Development Team. The Development Team proposes a rework plan and waits for Moderator approval before writing code.

#### QA Finding Dispositions

| Finding | Disposition | Owner |
| --- | --- | --- |
| QA-001 | Approved separately; see A-009. | Closed |
| QA-002 | Option (b) chosen after the explanation in `qa.md`. Rework required: extend the About surfacing-boundary sentence to read "…it does not decide what the behavior should have been, or whether it violates business intent." and update the About test to assert the phrase. | Development Team |
| QA-003 | Rework required: remove the stray space in "repository ." on the About page. | Development Team |
| QA-004 | Rework required: browser tab title `IDP-Align` and an original project favicon. DocuWare or other third-party branding must not be used. | Development Team |
| QA-005 | Rework required: nav `aria-current` and `aria-label`, a single `h1` per route, and a focusable tab panel. | Development Team |
| QA-006 | Not actioned. | Open (low) |
| QA-007, QA-008 | Informational; deferred to later Steps. | Tech Lead (future Step planning) |

#### Process Record

The Moderator first instructed QA to implement QA-003, QA-004, and QA-005 directly. QA did so, which conflicted with the QA role constraint in `mod-w/prompts/qa.md` ("Do not modify implementation files") and skipped MOD-W Phase 3d → 3a. On the same day, before any commit, the Moderator directed that the QA changes be reverted and the findings routed through the Tech Lead to the Development Team. The implementation files are back at the Tech Lead-accepted state (`36b52aa`): build passes and 52/52 tests pass under Node v26.0.0. The reverted QA changes are not a reference implementation for the rework.

#### Conditions

- Rework stays within STEP-01 scope and does not change product copy beyond QA-002 and QA-003.
- After the rework, the Tech Lead re-reviews (Phase 3a) and a fresh QA session re-checks (Phase 3b). The re-check must not be done by the QA session that briefly implemented these fixes.
- Product Owner sign-off (Phase 3c) and the Moderator final gate follow.

---

### A-011 - STEP-01 Development Team QA Rework Plan Approval

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before code changes (post-QA rework)  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Tech Lead re-review of the QA-002 to QA-005 rework (Phase 3a).

#### Approved Rework Plan

Development Team rework plan for QA-002 through QA-005, as defined in `review.md` (Post-QA Rework) and A-010:

1. QA-002: extend the About surfacing-boundary sentence with "…or whether it violates business intent." inside `[data-boundary]`, and assert the phrase in About tests.
2. QA-003: move the CAV repository sentence to the first paragraph of "CAV Level 1 Scope", before the Level 1 model lead-in and list; remove the stray space before the period; keep the canonical URL and `target`/`rel` attributes; test the rendered sentence and placement.
3. QA-004: set the document title to `IDP-Align`; replace the Angular default `favicon.ico` with an original SVG project icon; no DocuWare or third-party branding.
4. QA-005: add nav `aria-label`, `aria-current="page"` on the active link only, exactly one `h1` per routed view, a keyboard-focusable tab panel, and a visible 2px focus indicator; add tests for these semantics.

Moderator decisions on the plan:

- QA-003 placement: first paragraph of the CAV Level 1 Scope section.
- QA-004 favicon: SVG only; `favicon.ico` removed.
- QA-005: 2px `:focus-visible` outline also applied to nav links (design-spec section 2).

#### Implementation Record

The approval was given in the Development Team session before code changes and is recorded here after implementation. Commits: `9fe46fd` (QA-002, QA-003), `2cfbddd` (QA-004), `b15688d` (QA-005). Under Node.js v26.0.0, `npm run build` passed and `npm test -- --watch=false` passed with 4 files and 62/62 tests.

#### Conditions

- Rework stays within STEP-01 and changes no product copy beyond QA-002 and QA-003.
- QA-006, QA-007, and QA-008 are not addressed; dispositions in A-010 stand.
- Tech Lead re-review (Phase 3a) is required, then a fresh QA re-check (Phase 3b) by a session that did not implement these fixes.

---

### A-012 - STEP-01 Tech Lead Re-Review Acceptance (Post-QA Rework)

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA (post-QA rework, Phase 3a)  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Fresh QA re-check of QA-002 to QA-005 (Phase 3b).

#### Accepted Artifacts

- `review.md` "Re-Review Result", verdict "Pass for fresh QA re-check", committed in `b23b719`
- Development Team rework commits `9fe46fd`, `2cfbddd`, `b15688d` (delta `bb07b6f..b15688d`)

#### Evidence

- Tech Lead assessment: QA-002, QA-003, QA-004, and QA-005 pass review, with no remaining code, architecture, security, routing, terminology, maintainability, or scope findings.
- `npm run build` passed and `npm test -- --watch=false` passed, 4 files and 62/62 tests, under Node.js v26.0.0.

#### Process Record

This entry closes QA finding QA-009. The fresh QA session started the re-check on the Moderator's in-session direction, before this acceptance was recorded. The Moderator accepted the re-review and QA-009's recommendation, and this entry is recorded after the QA re-check to keep the sequence traceable.

#### Conditions

- `.claude/settings.json` remains outside STEP-01 (A-009).

---

### A-013 - STEP-01 QA Acceptance (Post-Rework Re-Check)

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance before Moderator final gate (Phase 3b)  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Product Owner sign-off (Phase 3c), then the Moderator final gate (4a).

#### Accepted Artifacts

- `qa.md` section "Re-Check - QA-002 To QA-005 Rework", verdict Pass, reviewed at `b23b719`

#### Acceptance Summary

A fresh QA session, which did not implement or revert any STEP-01 fixes, re-checked the Development Team rework. QA-002, QA-003, QA-004, and QA-005 are resolved and there are no regressions. All STEP-01 acceptance checks pass. `npm run build` passed and `npm test -- --watch=false` passed with 62/62 tests under Node.js v26.0.0. The manual browser evidence is recorded in `qa.md`.

#### Finding Dispositions

| Finding | Disposition | Owner |
| --- | --- | --- |
| QA-002 to QA-005 | Resolved; verified in re-check. | Closed |
| QA-006 | Accepted as known risk for STEP-01. The dashboard guardrail test pattern gap is carried into STEP-02 test scope. | Tech Lead (STEP-02 planning) |
| QA-007 | Deferred. Tech Lead to resolve the STEP-01 tablet breakpoint contradiction (DS-001 "stacked below desktop" vs. Required Changes "single-column below tablet width") before STEP-04/05 authoring. | Tech Lead |
| QA-008 | Deferred to STEP-08. | Tech Lead (future Step planning) |
| QA-009 | Resolved by A-012. | Closed |

#### Tech Lead Follow-Ups Outside STEP-01

These items are outside STEP-01 scope. Each needs its own proposal and Moderator approval.

- Pin the project Node.js version, for example with `.node-version`/`.nvmrc` set to 26.0.0 or a `package.json` `engines` field. The default v24.13.0 is below the Angular CLI minimum, and every role has had to switch Node versions manually.
- Process: the role completing a phase requests the register entry before handoff. A-011 and A-012 were both recorded after the fact.

#### Conditions

- The STEP-01 final gate, tag, and `mod-w/roadmap.md` status advancement remain pending Product Owner sign-off and the Moderator final gate.
- Tag the commit that contains this entry and the `qa.md` re-check record, not `b15688d`.
- `.claude/settings.json` remains outside STEP-01 (A-009).

---

### A-014 - STEP-01 Product Owner Sign-off (Phase 3c)

**Status:** Accepted with notes  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Product Owner:** Frank McGuire  
**Role approved:** Product Owner  
**Gate:** Product Owner sign-off before Moderator final gate (Phase 3c)  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Moderator final gate (4a) for STEP-01.

#### Verdict

Accepted with notes. The notes do not block the final gate.

#### Acceptance Check Review

The Product Owner reviewed the rendered copy against `mod-w/product.md` v1.3 directly, using `qa.md` and `review.md` as supporting evidence.

- All 17 STEP-01 acceptance checks are met.
- About covers every required topic: project intent, DocuWare interview research/demo framing, DocuWare API research intent, dashboard UI, CAV Level 1, architecture, MOD-W workflow, and scope boundaries.
- The surfacing-boundary copy denies failure, defect, non-conformance, and business-intent violation. Every overclaim (endorsement, private access, confidential information, production readiness, a defect or gap claim, certification) appears only inside a negated boundary statement.
- The dashboard shows only placeholders ("—", "Pending replay data"), so it does not imply that replay data, Observed Baseline calculation, or sustained Divergence detection exist yet.
- The "Ongoing" KPI label matches the canonical Divergence status in `mod-w/domain-language.md`.
- Product Goal 9 (present v1 as a bounded DocuWare interview research/demo artifact) is served.

#### Evidence

- Product Owner re-run at `3c91884`, with a clean working tree, under Node.js v26.0.0: `npm run build` passed, and `npm test -- --watch=false` passed with 4 files and 62/62 tests.
- `qa.md` re-check verdict Pass (A-013); `review.md` Re-Review Result Pass (A-012).

#### Notes And Dispositions

| Note | Disposition | Owner |
| --- | --- | --- |
| PO-1 - R10 is only partly met: About names the public DocuWare APIs but cites no sources. | Not STEP-01 rework. When authoring STEP-08, the Tech Lead adds an acceptance check that About includes a References section linking the public DocuWare Platform REST API and Workflow Analytics API documentation. If About will be demoed on 2026-09-28, the Moderator may instead approve a separately recorded About-only change before that date, following the full MOD-W route. | Tech Lead (STEP-08 authoring), or the Moderator's decision on an earlier change |
| PO-2 - The interview-date framing ("on September 28, 2026") goes stale after the interview. | No change before the interview. After 2026-09-28, the Product Owner proposes `mod-w/product.md` v1.4 with past-tense framing. After Moderator approval, the copy and test update go into the next active Step. | Product Owner |
| PO-3 - About omits Product v1.3's sentence "an Observed Baseline describes what has happened, not what should happen." | Closed. The meaning is already present; no action. | Closed |
| PO-4 - QA-007's orange accent is not named in A-013, which names only the tablet breakpoint. | The Tech Lead chooses the nav/tab active-indicator token (currently `--color-divergence-ongoing`) alongside the tablet breakpoint, before STEP-04 authoring, so the active tab and Ongoing Divergence status don't share one signal colour. The A-013 dispositions for QA-006, QA-007 (breakpoint), and QA-008 stand. | Tech Lead |

#### Conditions

- The STEP-01 final gate, tag, and `mod-w/roadmap.md` status advancement remain Moderator actions.
- The final-gate entry should carry PO-1, PO-2, and PO-4 forward as open conditions.
- `.claude/settings.json` remains outside STEP-01 (A-009).

---

### A-015 - Test Dependency And Convenience Script Update

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Gate:** Tooling update before STEP-01 final commit consideration  
**Step:** `mod-w/step-01.md` support tooling  
**Next authorized action:** Commit this tooling update separately before any commit that records STEP-01 completion or advances the roadmap.

#### Approved Artifacts

- `package.json`
- `package-lock.json`
- `angular.json`
- `eslint.config.js`

#### Approval Summary

The Moderator added test dependencies and convenience scripts for linting, coverage, Playwright e2e commands, and the InMotion base-href build. The Angular workspace now has an ESLint target backed by `angular-eslint`, and the new ESLint flat config covers Angular TypeScript and template files.

This approval records infrastructure/tooling support only. It does not complete STEP-01, advance `mod-w/roadmap.md`, or replace the pending Moderator final gate.

#### Evidence

- `npm run lint` passed under Node.js v26.0.0.
- `npm test -- --watch=false` passed under Node.js v26.0.0 with 4 files and 62/62 tests.

#### Conditions

- Continue using Node.js v26.0.0 or another Angular CLI-compatible version for verification.
- Commit this update before committing any STEP-01 completion/final-gate changes.

---

### A-016 - STEP-01 Moderator Final Gate

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Gate:** Moderator final gate (4a)  
**Step:** `mod-w/step-01.md`  
**Next authorized action:** Create the annotated tag `step-01` on the commit that contains this entry, set STEP-01 to Complete in `mod-w/roadmap.md`, and start the PO-1 About-only References change.

#### Approved Scope

`STEP-01 - Dashboard Foundation, Stream Shell, And About View`, as implemented through Development Team commit `b15688d`, together with the tooling update approved in A-015 (`f7fe019`).

#### Gate Evidence

| Gate | Record | Result |
| --- | --- | --- |
| Step approval | A-002 | Approved |
| Implementation-plan approval | A-003; rework plans A-005 and A-011 | Approved |
| Tech Lead review acceptance | A-006; post-QA re-review A-012 (`review.md` Re-Review Result) | Pass |
| QA acceptance | A-013 (`qa.md` Re-Check, verdict Pass) | Pass |
| Product Owner sign-off | A-014 | Accepted with notes |
| Tooling update | A-015 | Approved; committed before this gate as A-015 required |
| Manual verification | Moderator manual check, 2026-09-24 | Passed |

- `npm run build` passed and `npm test -- --watch=false` passed with 4 files and 62/62 tests, under Node.js v26.0.0 at `f7fe019`.
- `npm run lint` passed under Node.js v26.0.0 (A-015).
- All 17 STEP-01 acceptance checks are met (A-013, A-014).

#### Approval Summary

The Moderator approves STEP-01 as complete. The dashboard foundation, the Document and Workflow stream shell, and the About / Project Context view meet the STEP-01 acceptance checks and stay within CAV Level 1 and the bounded DocuWare research/demo guardrails.

#### Open Conditions Carried Forward

| Item | Condition | Owner |
| --- | --- | --- |
| PO-1 | The Moderator confirmed that the About page will be demoed on 2026-09-28. Add an About References section linking the public DocuWare Platform REST API and Workflow Analytics API documentation before that date. This is a separately approved About-only change: Tech Lead defines it, Development Team plans it, the Moderator approves the plan, the Development Team implements it, then Tech Lead and QA check it. It does not reopen STEP-01 or move the `step-01` tag. | Tech Lead, then Development Team |
| PO-2 | After 2026-09-28, the Product Owner proposes `mod-w/product.md` v1.4 with past-tense interview framing. The approved copy and test update go into the next active Step. | Product Owner |
| PO-4 | Before STEP-04 authoring, choose the nav/tab active-indicator token (currently `--color-divergence-ongoing`) together with the QA-007 tablet breakpoint. | Tech Lead |
| QA-006 | Dashboard guardrail test pattern gap goes into STEP-02 test scope. | Tech Lead (STEP-02 planning) |
| QA-007 | Resolve the tablet breakpoint contradiction before STEP-04/05 authoring. | Tech Lead |
| QA-008 | Replace the Playwright starter spec in STEP-08. | Tech Lead (future Step planning) |
| A-013 follow-ups | Pin the project Node.js version; the role completing a phase requests its register entry before handoff. Each needs its own proposal and Moderator approval. | Tech Lead |

#### Conditions

- Tag the commit that contains this entry, not `b15688d` or `f7fe019`.
- `.claude/settings.json` remains outside STEP-01 (A-009).

---

MOD-W v5.0.1
