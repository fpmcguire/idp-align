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

| Gate                         | Required before                               | Evidence to cite                                                                      |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| Step approval                | Development Team briefing                     | Active `step-xx.md`, roadmap status, conditions                                       |
| Implementation-plan approval | Development Team writes code                  | Dev Team plan and affected areas                                                      |
| Tech Lead review acceptance  | QA starts                                     | `review.md`, build/test evidence, findings status                                     |
| QA acceptance                | Moderator final gate                          | `qa.md`, acceptance-check evidence                                                    |
| Final Moderator gate         | Tagging, roadmap advancement, Step completion | `review.md`, `qa.md`, Product Owner sign-off if applicable, manual verification notes |

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

| Finding        | Disposition                                                                                                                                                                                                                                                                 | Owner                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| QA-001         | Approved separately; see A-009.                                                                                                                                                                                                                                             | Closed                           |
| QA-002         | Option (b) chosen after the explanation in `qa.md`. Rework required: extend the About surfacing-boundary sentence to read "…it does not decide what the behavior should have been, or whether it violates business intent." and update the About test to assert the phrase. | Development Team                 |
| QA-003         | Rework required: remove the stray space in "repository ." on the About page.                                                                                                                                                                                                | Development Team                 |
| QA-004         | Rework required: browser tab title `IDP-Align` and an original project favicon. DocuWare or other third-party branding must not be used.                                                                                                                                    | Development Team                 |
| QA-005         | Rework required: nav `aria-current` and `aria-label`, a single `h1` per route, and a focusable tab panel.                                                                                                                                                                   | Development Team                 |
| QA-006         | Not actioned.                                                                                                                                                                                                                                                               | Open (low)                       |
| QA-007, QA-008 | Informational; deferred to later Steps.                                                                                                                                                                                                                                     | Tech Lead (future Step planning) |

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

| Finding          | Disposition                                                                                                                                                                                      | Owner                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| QA-002 to QA-005 | Resolved; verified in re-check.                                                                                                                                                                  | Closed                           |
| QA-006           | Accepted as known risk for STEP-01. The dashboard guardrail test pattern gap is carried into STEP-02 test scope.                                                                                 | Tech Lead (STEP-02 planning)     |
| QA-007           | Deferred. Tech Lead to resolve the STEP-01 tablet breakpoint contradiction (DS-001 "stacked below desktop" vs. Required Changes "single-column below tablet width") before STEP-04/05 authoring. | Tech Lead                        |
| QA-008           | Deferred to STEP-08.                                                                                                                                                                             | Tech Lead (future Step planning) |
| QA-009           | Resolved by A-012.                                                                                                                                                                               | Closed                           |

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

| Note                                                                                                                   | Disposition                                                                                                                                                                                                                                                                                                                                                                            | Owner                                                                           |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| PO-1 - R10 is only partly met: About names the public DocuWare APIs but cites no sources.                              | Not STEP-01 rework. When authoring STEP-08, the Tech Lead adds an acceptance check that About includes a References section linking the public DocuWare Platform REST API and Workflow Analytics API documentation. If About will be demoed on 2026-09-28, the Moderator may instead approve a separately recorded About-only change before that date, following the full MOD-W route. | Tech Lead (STEP-08 authoring), or the Moderator's decision on an earlier change |
| PO-2 - The interview-date framing ("on September 28, 2026") goes stale after the interview.                            | No change before the interview. After 2026-09-28, the Product Owner proposes `mod-w/product.md` v1.4 with past-tense framing. After Moderator approval, the copy and test update go into the next active Step.                                                                                                                                                                         | Product Owner                                                                   |
| PO-3 - About omits Product v1.3's sentence "an Observed Baseline describes what has happened, not what should happen." | Closed. The meaning is already present; no action.                                                                                                                                                                                                                                                                                                                                     | Closed                                                                          |
| PO-4 - QA-007's orange accent is not named in A-013, which names only the tablet breakpoint.                           | The Tech Lead chooses the nav/tab active-indicator token (currently `--color-divergence-ongoing`) alongside the tablet breakpoint, before STEP-04 authoring, so the active tab and Ongoing Divergence status don't share one signal colour. The A-013 dispositions for QA-006, QA-007 (breakpoint), and QA-008 stand.                                                                  | Tech Lead                                                                       |

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

| Gate                         | Record                                                        | Result                                                 |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| Step approval                | A-002                                                         | Approved                                               |
| Implementation-plan approval | A-003; rework plans A-005 and A-011                           | Approved                                               |
| Tech Lead review acceptance  | A-006; post-QA re-review A-012 (`review.md` Re-Review Result) | Pass                                                   |
| QA acceptance                | A-013 (`qa.md` Re-Check, verdict Pass)                        | Pass                                                   |
| Product Owner sign-off       | A-014                                                         | Accepted with notes                                    |
| Tooling update               | A-015                                                         | Approved; committed before this gate as A-015 required |
| Manual verification          | Moderator manual check, 2026-09-24                            | Passed                                                 |

- `npm run build` passed and `npm test -- --watch=false` passed with 4 files and 62/62 tests, under Node.js v26.0.0 at `f7fe019`.
- `npm run lint` passed under Node.js v26.0.0 (A-015).
- All 17 STEP-01 acceptance checks are met (A-013, A-014).

#### Approval Summary

The Moderator approves STEP-01 as complete. The dashboard foundation, the Document and Workflow stream shell, and the About / Project Context view meet the STEP-01 acceptance checks and stay within CAV Level 1 and the bounded DocuWare research/demo guardrails.

#### Open Conditions Carried Forward

| Item             | Condition                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Owner                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| PO-1             | The Moderator confirmed that the About page will be demoed on 2026-09-28. Add an About References section linking the public DocuWare Platform REST API and Workflow Analytics API documentation before that date. This is a separately approved About-only change: Tech Lead defines it, Development Team plans it, the Moderator approves the plan, the Development Team implements it, then Tech Lead and QA check it. It does not reopen STEP-01 or move the `step-01` tag. | Tech Lead, then Development Team |
| PO-2             | After 2026-09-28, the Product Owner proposes `mod-w/product.md` v1.4 with past-tense interview framing. The approved copy and test update go into the next active Step.                                                                                                                                                                                                                                                                                                         | Product Owner                    |
| PO-4             | Before STEP-04 authoring, choose the nav/tab active-indicator token (currently `--color-divergence-ongoing`) together with the QA-007 tablet breakpoint.                                                                                                                                                                                                                                                                                                                        | Tech Lead                        |
| QA-006           | Dashboard guardrail test pattern gap goes into STEP-02 test scope.                                                                                                                                                                                                                                                                                                                                                                                                              | Tech Lead (STEP-02 planning)     |
| QA-007           | Resolve the tablet breakpoint contradiction before STEP-04/05 authoring.                                                                                                                                                                                                                                                                                                                                                                                                        | Tech Lead                        |
| QA-008           | Replace the Playwright starter spec in STEP-08.                                                                                                                                                                                                                                                                                                                                                                                                                                 | Tech Lead (future Step planning) |
| A-013 follow-ups | Pin the project Node.js version; the role completing a phase requests its register entry before handoff. Each needs its own proposal and Moderator approval.                                                                                                                                                                                                                                                                                                                    | Tech Lead                        |

#### Conditions

- Tag the commit that contains this entry, not `b15688d` or `f7fe019`.
- `.claude/settings.json` remains outside STEP-01 (A-009).

---

### A-017 - STEP-02 Step Approval Before Development Team Briefing

**Status:** Approved  
**Date:** 2026-09-24  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Brief Development Team on `mod-w/step-02.md`; Development Team may read context and propose an implementation plan, but may not write code until the Moderator approves that plan and records the approval in this register.

#### Approved Scope

`STEP-02 - CAV Domain Model, Repositories, And Replay Fixtures`

#### Approved Artifacts

- `mod-w/step-02.md`
- `mod-w/roadmap.md` STEP-02 status update

#### Approval Summary

The Moderator approves `mod-w/step-02.md` as the active STEP-02 definition and authorizes Development Team briefing/planning only.

STEP-02 is limited to canonical CAV Level 1 domain types, source-agnostic repository interfaces, synthetic DocuWare-shaped replay fixtures, a local replay adapter, and the QA-006 dashboard guardrail test carry-over. It does not authorize Observed Baseline calculation, sustained Divergence detection, Evidence Trace implementation, completed CAV findings, live DocuWare integration, PO-1 About References work, or any CAV Level 3+ concepts.

#### Conditions

- Development Team must propose an implementation plan and wait for Moderator approval before writing code.
- Verification for implementation must use Node.js v26.0.0 or another Angular CLI-compatible version.
- Required verification after implementation includes `npm run lint`, `npm run build`, and `npm test -- --watch=false`.

---

### A-018 - STEP-02 Development Team Implementation Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before Development Team writes code  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Development Team implements STEP-02 per the approved plan, runs the build gate, then hands off for Tech Lead review.

#### Approved Plan

Development Team STEP-02 plan (2026-09-24), with the Tech Lead dispositions below:

- Canonical CAV Level 1 domain types in `src/app/domain/` (`StreamKind`, `IdentitySlice`, `SourceReference`, document/workflow `Observation`, `ObservedTruth` with a pure grouping helper).
- Source-agnostic `StreamObservationRepository` interface and provider in `src/app/data/`.
- Synthetic DocuWare-shaped `ReplayFixture` data and DTO mappers, shaped from the public Platform REST API and Workflow Analytics API documentation.
- `ReplayStreamObservationRepository` local replay adapter with no HTTP, credentials, or live calls.
- `DashboardFacade` and one neutral replay source line on the dashboard.
- QA-006 dashboard guardrail expansion and focused unit tests.

#### Tech Lead Dispositions Adopted

| Item                 | Disposition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dimension            | Leave formal Dimension / `DivergenceDimension` out of STEP-02.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Fixture behavior     | Include one neutral change in behavior per stream, in one Identity Slice each, not labeled as Divergence or expected output.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Dashboard (Option B) | Approved. Neutral replay source line with source facts only: replay source, observation count, Identity Slice count, date range, UTC. KPI cards stay "—", filters stay disabled, and list/detail placeholders stay intact. No Observed Baselines, Divergences, Evidence traces, rankings, severity, status, or "affected" language. Avoid "detected", "flagged", "changed", "issue", "anomaly", "alert", "violation", "bad", "defect", and "gap". Use "synthetic" and "replay" plainly. Browser code makes no live DocuWare calls, and credentials never live in browser code. |
| QA-006 expansion     | Approved as planned. `src/testing/claim-guardrail-patterns.ts` holds constants only and is imported by tests only. The dashboard visible-copy guardrail scans rendered dashboard text only. Fixture tests cover fixture safety and reserved/finding terminology, not ordinary source-domain values such as `state: "Failed"`. The shell route target and About boundary-scan limitation stay out of STEP-02.                                                                                                                                                                   |
| Naming               | `responseTimeMs` approved, with a fixture metadata or test note mapping it to `TaskReactionTimes`. `StreamSourceInfo` approved as a data-layer name. Existing "Identity Slice" copy is unchanged. No artifact updates needed before implementation.                                                                                                                                                                                                                                                                                                                            |

#### Conditions

- Verification uses Node.js v26.0.0: `npm run lint`, `npm run build`, `npm test -- --watch=false`.
- No About copy or About test changes (PO-1 excluded).
- The status text in `step-02.md` and `roadmap.md` still says "pending approval". Correcting it is a Moderator or Tech Lead action, not Development Team scope.

---

### A-019 - Sass Command Line Tool Dependency

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Gate:** Tooling dependency update outside STEP-02 implementation review  
**Next authorized action:** Tech Lead and Development Team leave `package.json` and `package-lock.json` from commit `839f9e0` out of the STEP-02 implementation review scope.

#### Approved Artifacts

- `package.json`
- `package-lock.json`

#### Approval Summary

The Moderator approves adding the Sass command line tool as a project dev dependency. This update provides the local `sass` CLI through npm scripts or `npx sass` without relying on a global machine install.

This is a tooling chore only. It is not part of STEP-02 implementation scope and must be reviewed separately from the STEP-02 code changes.

#### Evidence

- `npx sass --version` returned `1.105.0 compiled with dart2js 3.13.4`.
- Dependency commit: `839f9e0` (`chore: add sass cli dependency`).

#### Conditions

- Tech Lead review for STEP-02 excludes `package.json` and `package-lock.json` changes from commit `839f9e0`.
- Development Team should not include the Sass dependency commit in the STEP-02 implementation diff summary.

---

### A-020 - STEP-02 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** QA may review STEP-02 against `mod-w/step-02.md`, `review.md`, the approved A-018 implementation plan, and the passing verification evidence.

#### Accepted Artifacts

- `review.md` - Tech Lead Review - STEP-02, verdict "Pass for QA"
- Current STEP-02 implementation package in the working tree, excluding Sass tooling commit `839f9e0` per A-019
- `mod-w/step-02.md`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`

#### Acceptance Summary

The Moderator accepts the Tech Lead review for STEP-02. The review found no must-fix or could-fix-later findings and confirms that the implementation remains within STEP-02 scope: domain types, source-agnostic repository interface, synthetic replay fixtures, replay adapter, dashboard facade, neutral replay source line, and QA-006 guardrail expansion.

The implementation does not add Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, completed CAV findings, live DocuWare API calls, credentials, or CAV Level 3+ behavior.

#### Evidence

- `review.md` verdict: Pass for QA.
- `npm run lint` passed under Node.js v26.0.0.
- `npm run build` passed under Node.js v26.0.0.
- `npm test -- --watch=false` passed under Node.js v26.0.0.
- Test result: 12 test files passed, 154 tests passed.

#### Conditions

- QA must exclude `package.json` and `package-lock.json` from Sass commit `839f9e0` from STEP-02 acceptance per A-019.
- QA should verify that STEP-02 dashboard copy does not imply completed Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, or completed CAV findings.
- QA should verify replay fixtures remain synthetic, public-doc-shaped, and free of credentials, private URLs, real customer data, and live-call configuration.

---

### A-021 - STEP-02 QA Finding Dispositions And Rework Routing

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead (rework definition and Step correction), Development Team (rework implementation)  
**Gate:** QA finding dispositions before QA acceptance  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Tech Lead resolves the QA-010 source conflict in `mod-w/step-02.md`, records the required rework in `review.md`, and hands it to the Development Team. The Development Team proposes a rework plan and waits for Moderator approval before writing code.

#### QA Result

`qa.md` QA Review - STEP-02 at `ddcde42`: verdict **Fail**. AC8 is not met, and all other acceptance checks pass, some with notes. Lint, build, and tests (12 files, 154 tests) pass under Node.js v26.0.0.

#### QA Finding Dispositions

| Finding                   | Disposition                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Owner                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| QA-010 (Medium, AC8 Fail) | Rework required. The document fixture metadata claims a documented `FieldName` / `Item` / `ItemElementName` shape, but the cited Platform REST API page contains no `ItemElementName`, no `/Date(...)/` values, and no `DWSTOREDATETIME`, and its `DOCUMENT_DATE` sample is the ISO string `"2020-01-01"`. The Tech Lead corrects `step-02.md` Source Conflict Resolution (line 120), chooses the rework route (`qa.md` options a, b, or c), and records it in `review.md`. | Tech Lead, then Development Team |
| QA-011 to QA-016          | Not dispositioned in this entry. They remain open for Moderator disposition. The Tech Lead may propose including QA-011, which is the same class of traceability issue as QA-010, but the proposal needs Moderator approval.                                                                                                                                                                                                                                                | Open                             |

#### Process Record

QA drafted this entry on the Moderator's in-session instruction to route the failing finding to the Tech Lead. QA did not edit implementation files or Step artifacts.

#### Conditions

- The rework stays within STEP-02 scope. No About copy or About test changes (PO-1 is excluded).
- The Development Team rework plan requires Moderator approval before code is written.
- After the rework, the Tech Lead re-reviews and a fresh QA session re-checks AC8 against the cited public source.
- QA acceptance and the STEP-02 final gate follow the re-check.

---

### A-022 - STEP-02 Development Team QA-010 / QA-011 Rework Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Rework-plan approval before Development Team writes code  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Development Team implements the QA-010 and QA-011 rework per the approved plan, runs the build gate, then hands off for Tech Lead re-review.

#### Approved Plan

Development Team QA-010 rework plan (2026-09-25), following the Tech Lead resolution in `review.md` (QA option (b)):

- Keep the current document fixture shape, values, and IDs.
- Correct `document-replay.fixture.ts` metadata and header comment: the cited Platform REST API page documents `FieldName` and a single `Item`; `COMPANY` and `DOCUMENT_DATE` follow the documented sample field names; `ItemElementName` typing (including Decimal), `/Date(ms)/` date encoding, and `DWSTOREDATETIME` are marked as approximations or source-shape assumptions, noting that the cited `DOCUMENT_DATE` sample is an ISO date string.
- Correct the `DocuWareIndexField` comment in `docuware-replay.types.ts` (comment only; no type change).
- Replace the fixture test `should use the documented index field structure` with separate tests for the documented `FieldName` / `Item` pair, the approximated `ItemElementName` key, and the metadata approximation notes.
- `document-replay.mapper.ts` is not changed.

#### Scope Decision

| Item   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-010 | Approved for rework as planned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| QA-011 | Approved for inclusion in the same rework (Moderator decision, 2026-09-25, following the Tech Lead and Development Team recommendations). Mark the workflow `d.` duration day prefix as an approximation/source-shape assumption in `workflow-replay.fixture.ts` metadata and the `timeSpan()` comment, and in the `docuware-replay.types.ts` duration comment. Metadata must no longer say every duration format used is documented by the cited Workflow Analytics API page. Keep the documented `hh:mm:ss.fffffff` form for values under 24 hours. No duration values change. Add a fixture test for the documented form under 24 hours and the metadata approximation note. |

#### Conditions

- Stay within STEP-02. No About copy or About test changes (PO-1 excluded).
- No live DocuWare calls, credentials, new fixture capabilities, Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, or CAV Level 3+ concepts.
- Verification uses Node.js v26.0.0: `npm run lint`, `npm run build`, `npm test -- --watch=false`.
- The Development Team leaves the Tech Lead's `mod-w/step-02.md` and `review.md` working-tree changes untouched.
- After implementation, the Tech Lead re-reviews and a fresh QA session re-checks AC8 and AC9 against the cited public sources.
- QA-012 to QA-016 remain open for Moderator disposition.

---

### A-023 - STEP-02 Tech Lead Re-Review Acceptance (QA-010 / QA-011)

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA re-check  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Fresh QA re-check of QA-010 and QA-011 against commit `3ab913b`.

#### Accepted Artifacts

- `review.md` re-review result at `3ab913b`, verdict "Pass for fresh QA re-check, with build/test verification limitation noted below"
- Development Team rework commit `032fe2f`
- Rework plan approval A-022 at `72f548a`
- `mod-w/step-02.md` source-conflict correction at `3ab913b`

#### Acceptance Summary

The Moderator accepts the Tech Lead re-review for the STEP-02 QA-010 and QA-011 rework. The rework resolves the traceability mismatch by separating documented public-source fields from replay approximations/source-shape assumptions in the document and workflow fixture metadata, comments, and tests.

No About copy or About tests changed. The rework introduces no live DocuWare calls, credentials, CAV calculation logic, Evidence Trace behavior, completed CAV findings, or Level 3+ concepts.

#### Evidence

- `review.md` records no remaining blocking, major, minor, or low findings for the QA-010/QA-011 rework delta.
- `npm run lint` passed under Node.js v26.0.0.
- Fresh `npm run build` and `npm test -- --watch=false` reruns were blocked in the Tech Lead sandbox by `spawn EPERM`; this is recorded as an environment limitation in `review.md`.

#### Conditions

- Fresh QA must rerun `npm run build` and `npm test -- --watch=false` under Node.js v26.0.0 before acceptance.
- QA must re-check AC8 and AC9 against the cited public sources.
- QA-012 to QA-016 remain open for Moderator disposition unless resolved separately.

---

### A-024 - STEP-02 QA Re-Check Acceptance And Open Finding Dispositions

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance after STEP-02 QA-010 / QA-011 rework re-check  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Development Team prepares a QA-012 copy-only rework plan for Moderator approval before implementation; Tech Lead prepares final STEP-02 gate after QA-012 is resolved or explicitly carried.

#### Accepted Artifacts

- `qa.md` re-check record at `bc0c64c`, verdict "Pass with notes"
- Tech Lead re-review acceptance A-023 at `bc0c64c`
- STEP-02 Change Notes correction for QA-017 at `6498be9`

#### Acceptance Summary

The Moderator accepts the fresh QA re-check for STEP-02. QA-010 and QA-011 are resolved, AC8 now passes, AC9 passes without note, and lint, build, and tests passed under Node.js v26.0.0 in the QA environment.

QA-012 to QA-017 are dispositioned below so the remaining demo-facing and process notes are traceable before the STEP-02 final gate.

#### Finding Dispositions

| Finding | Disposition                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-010  | Closed by the approved QA-010 rework and QA re-check.                                                                                                                                                                                                                                                                                                                         |
| QA-011  | Closed by the approved same-cycle QA-011 rework and QA re-check.                                                                                                                                                                                                                                                                                                              |
| QA-012  | Rework before the 2026-09-28 demo. Development Team should propose a copy-only plan to replace stale KPI note text that says "Pending replay data" with text that accurately says CAV logic is pending while replay data is loaded. No KPI values, calculations, Observed Baseline logic, sustained Divergence detection, filters, About files, or new capability may change. |
| QA-013  | Accepted as a non-blocking terminology consistency note. Carry into future copy alignment unless it is naturally touched by an approved dashboard copy rework.                                                                                                                                                                                                                |
| QA-014  | Accepted as a STEP-03 planning note. STEP-03 must account for the workflow behavior change appearing in both the Approval step slice and Workflow runtime slice.                                                                                                                                                                                                              |
| QA-015  | Accepted as a future adapter planning note. A later adapter/BFF Step should revisit `sourceKind` extensibility and dashboard rendering of source metadata before non-replay data is introduced.                                                                                                                                                                               |
| QA-016  | Accepted as a process traceability note. Future commits should keep role artifacts separated when feasible; no STEP-02 implementation rework required.                                                                                                                                                                                                                        |
| QA-017  | Closed by `6498be9`, which adds the missing `mod-w/step-02.md` Change Notes row for the QA-010 Source Conflict correction.                                                                                                                                                                                                                                                    |

#### Conditions

- QA-012 requires a Development Team rework plan and Moderator approval before any app-code changes.
- Any QA-012 rework must stay within STEP-02 scope and PO-1 exclusion: no About copy or About test changes.
- Final STEP-02 acceptance waits until QA-012 is either reworked and checked or explicitly carried past the demo by Moderator decision.

---

### A-025 - STEP-02 Development Team QA-012 Rework Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Rework-plan approval before Development Team writes code  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Development Team implements the QA-012 copy-only rework, runs the build gate, then hands off for Tech Lead re-review.

#### Approved Plan

- Replace the KPI card note "Pending replay data" in `dashboard.component.html` with "Pending Divergence detection" (Moderator copy decision, 2026-09-25).
- Update only the directly affected assertion in `dashboard.component.spec.ts`: expect the new copy, assert "Pending replay data" is absent, and keep the no-digits check.

#### Conditions

- KPI values remain "—". No calculations, Observed Baseline logic, sustained Divergence detection, filters, Evidence Trace behavior, live DocuWare calls, credentials, or new capability.
- No About copy or About test changes (PO-1 excluded). QA-013 casing is not touched.
- Verification uses Node.js v26.0.0: `npm run lint`, `npm run build`, `npm test -- --watch=false`.
- After implementation, the Tech Lead re-reviews and a fresh QA session re-checks QA-012 before the STEP-02 final gate.

---

### A-026 - STEP-02 Tech Lead Re-Review Acceptance (QA-012)

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA-012 re-check  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Fresh QA re-check of QA-012 against Development Team commit `0fed7ba` and Tech Lead review commit `02a80c3`.

#### Accepted Artifacts

- Development Team QA-012 rework commit `0fed7ba`
- `review.md` Tech Lead QA-012 re-review at `02a80c3`, verdict "Pass for fresh QA re-check of QA-012"
- A-025 Development Team QA-012 rework plan approval at `2932e5d`

#### Acceptance Summary

The Moderator accepts the Tech Lead re-review for the STEP-02 QA-012 copy-only rework. The rework replaces stale KPI note copy with "Pending Divergence detection", keeps KPI values as placeholders, and adds a regression guard against the stale "Pending replay data" text.

No About files, fixtures, calculations, Observed Baseline logic, sustained Divergence detection, filters, Evidence Trace behavior, live DocuWare calls, credentials, or new capability changed.

#### Evidence

- `review.md` records no blocking, major, minor, or low findings for the QA-012 rework delta.
- `npm run lint` passed under Node.js v26.0.0.
- `npm run build` passed under Node.js v26.0.0 after rerun outside the sandbox.
- `npm test -- --watch=false` passed under Node.js v26.0.0 after rerun outside the sandbox: 12 files and 158 tests passed.

#### Conditions

- Fresh QA re-checks QA-012 before the STEP-02 final gate.
- QA should confirm the stale "Pending replay data" copy is no longer present in the dashboard KPI cards and that the replacement copy does not imply completed Divergence detection.

---

### A-027 - STEP-02 QA-012 Re-Check Acceptance

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance after STEP-02 QA-012 rework re-check  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Tech Lead prepares the STEP-02 final gate.

#### Accepted Artifacts

- `qa.md` "Re-Check - QA-012 Rework", verdict "Pass"
- Tech Lead re-review acceptance A-026 at `09adf09`
- Development Team QA-012 rework commit `0fed7ba`

#### Acceptance Summary

The Moderator accepts the fresh QA re-check of QA-012. The KPI card note now reads "Pending Divergence detection", KPI values remain "—", and the stale "Pending replay data" copy is removed from source. Lint, build, and tests (12 files, 158 tests) passed under Node.js v26.0.0.

#### Evidence

- QA re-check found no new findings. Lint, build, and tests passed under Node.js v26.0.0.
- Moderator manual browser review of the KPI card copy completed successfully on 2026-09-25, closing the manual check listed in the QA re-check.

#### Finding Dispositions

| Finding | Disposition                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------- |
| QA-012  | Closed by the approved QA-012 rework, Tech Lead re-review, QA re-check, and Moderator browser review. |

#### Conditions

- QA-013 to QA-016 dispositions from A-024 stand unchanged.
- No About copy or About test changes (PO-1 excluded).
- The STEP-02 final gate follows this acceptance.

---

### A-028 - STEP-02 Moderator Final Gate

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Final Moderator gate  
**Gate:** STEP-02 final acceptance  
**Step:** `mod-w/step-02.md`  
**Next authorized action:** Create the annotated tag `step-02` on the commit that contains this entry and the roadmap completion update, then proceed to STEP-03 planning when directed.

#### Accepted Artifacts

- STEP-02 implementation commit `ddcde42`, excluding Sass tooling commit `839f9e0` per A-019
- QA-010 / QA-011 rework commit `032fe2f`
- QA-012 rework commit `0fed7ba`
- Tech Lead reviews in `review.md` through `02a80c3`
- QA records in `qa.md` through `ca4d137`
- QA acceptances A-024 and A-027
- Roadmap STEP-02 completion update in this final-gate commit

#### Final Acceptance Summary

STEP-02 is accepted as complete. It establishes canonical CAV Level 1 domain types, source-agnostic repository interfaces, synthetic replay fixtures shaped from public DocuWare documentation, a local replay adapter, a dashboard-facing source facade, and the QA-006 dashboard guardrail expansion.

The accepted STEP-02 scope does not include Observed Baseline calculation, sustained Divergence detection, Evidence Trace behavior, completed CAV findings, live DocuWare API calls, credentials, production readiness claims, private access claims, or CAV Level 3+ concepts.

#### QA And Finding Dispositions

| Finding | Final disposition                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------- |
| QA-010  | Closed by QA-010 rework and QA re-check.                                                                               |
| QA-011  | Closed by QA-011 rework and QA re-check.                                                                               |
| QA-012  | Closed by copy-only rework, Tech Lead re-review, QA re-check, and A-027 acceptance.                                    |
| QA-013  | Carried as non-blocking copy/terminology alignment note for future work.                                               |
| QA-014  | Carried into STEP-03 planning: workflow fixture behavior can appear in both Approval step and Workflow runtime slices. |
| QA-015  | Carried as future adapter/BFF planning note before non-replay data is introduced.                                      |
| QA-016  | Accepted as process traceability note; no STEP-02 implementation rework required.                                      |
| QA-017  | Closed by the STEP-02 Change Notes correction.                                                                         |

#### Evidence

- A-017 approved the STEP-02 definition.
- A-018 approved the Development Team implementation plan.
- A-020 accepted the initial Tech Lead review.
- A-021 routed QA-010 and recorded the initial QA fail.
- A-022 approved QA-010 and QA-011 rework.
- A-023 accepted the Tech Lead re-review for QA-010 / QA-011.
- A-024 accepted the QA re-check and dispositioned open notes.
- A-025 approved QA-012 copy-only rework.
- A-026 accepted the Tech Lead re-review for QA-012.
- A-027 accepted the QA-012 re-check.
- Lint, build, and tests passed under Node.js v26.0.0 in the accepted QA evidence.

#### Notes

- `qa.md` line 9 still contains the earlier QA-010 / QA-011 re-check summary. The later "Re-Check - QA-012 Rework" section and A-027 are the controlling QA-012 acceptance evidence for this final gate.
- PO-1 About References remains outside STEP-02.
- PO-4, QA-007, and QA-008 remain governed by their previously assigned later-Step timing.

---

### A-029 - STEP-03 Step Approval Before Development Team Briefing

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-03.md`  
**Next authorized action:** Brief Development Team on `mod-w/step-03.md`; Development Team may read context and propose an implementation plan, but may not write code until the Moderator approves that plan.

#### Approved Artifacts

- `mod-w/step-03.md` - STEP-03 definition authored by the Tech Lead
- `mod-w/roadmap.md` - STEP-03 status updated from authored/pending approval to approved for briefing/planning

#### Approval Summary

The Moderator approves `mod-w/step-03.md` as the active STEP-03 definition:

**Observed Baseline And Sustained Divergence Logic**

STEP-03 is approved for Development Team briefing and implementation planning only. The Step covers CAV Level 1 Observed Baseline derivation, sustained Divergence detection, and Evidence-carrying domain records for document and workflow streams.

#### Conditions

- Development Team must implement only the approved STEP-03 scope.
- Development Team must wait for Moderator approval of its implementation plan before writing code.
- STEP-03 must account for QA-014: workflow fixture behavior may appear in both Approval step and Workflow runtime slices.
- QA-015 remains a future adapter/BFF planning note only unless it affects preserving the source-agnostic boundary.
- PO-1 About References remains outside STEP-03 unless separately routed.
- PO-4, QA-007, and QA-008 retain their later-step timing unless separately rerouted by the Moderator.
- No UI Divergence cards, detail panels, Evidence Trace rendering, Chart.js analysis, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution work is authorized in STEP-03.
- Tech Lead review is required before QA acceptance.

---

### A-030 - STEP-03 Development Team Implementation Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before Development Team writes code  
**Step:** `mod-w/step-03.md`  
**Next authorized action:** Development Team implements STEP-03 per the approved plan, runs the build gate under Node.js v26.0.0, then hands off for Tech Lead review.

#### Approved Plan

Development Team STEP-03 plan (2026-09-25), with the Tech Lead conditions below:

- Pure domain files in `src/app/domain/`: `divergence-dimension.ts`, `baseline-statistics.ts`, `observed-baseline.ts`, `evidence.ts`, `divergence.ts`, `divergence-detection.ts`, each with a focused spec, plus `domain-terminology.spec.ts`.
- One test-only file in `src/app/data/replay/` (`replay-divergence-detection.spec.ts`) that runs the domain detector over observations read through the repository interface.
- Dimensions: document `vendor-representation`, `amount-value`, `amount-currency`, `document-date-lag`; workflow step `task-duration`, `response-time`, `task-outcome`; workflow runtime `workflow-runtime`.
- Observed Baselines are immutable snapshots carrying stream kind, Identity Slice, dimension, reference window, method, sample size, reference observation IDs, stable ID and version, and a value/range/distribution summary.
- Divergences carry stream kind, Identity Slice, dimension, embedded baseline snapshot, observed summary, magnitude, onset, duration, status, sustained criteria, and chronological Evidence.

#### Tech Lead Conditions Adopted

| Item               | Condition                                                                                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-014             | Emit both Approval step and Workflow runtime Divergences when both independently meet sustained criteria. Do not link them, suppress one, or mark either as derived. Keep the no-Attribution explanation in comments and tests.                            |
| Scope              | No production dashboard or facade changes. STEP-03 is pure domain logic plus tests; STEP-04 wires dashboard/facade consumption.                                                                                                                            |
| Detection defaults | 28-day reference window; minimum 4 reference observations; numeric range mean ± max(3 sample standard deviations, 5% of absolute mean); categorical minimum reference share 0.1; sustained threshold 3 consecutive out-of-baseline candidate observations. |
| `resolved` status  | The detector may set `resolved`. Comments and tests must make clear it is only a finding lifecycle state and does not imply remediation, Convergence, or business correctness.                                                                             |
| Date behavior      | Date representation is unsupported by normalized observations. `document-date-lag` is the date-related dimension for STEP-03.                                                                                                                              |
| `decisionAgent`    | Evidence context only; not a dimension and not Attribution.                                                                                                                                                                                                |
| Amount / currency  | `amount-value` compares raw numeric values; `amount-currency` is a separate dimension. Tests must make the separation obvious.                                                                                                                             |
| Credit notes       | Credit-note slices receive no baseline due to insufficient reference sample; this must be tested.                                                                                                                                                          |

#### Conditions

- Verification uses Node.js v26.0.0 via `fnm`: `fnm exec --using=v26.0.0 node --version`, then `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd test -- --watch=false` through `fnm exec --using=v26.0.0`.
- No About copy or About test changes (PO-1 excluded).
- No fixture changes, live DocuWare calls, credentials, UI rendering, CAV Level 2+ claims, or reserved Level 3+ terms.
- Tech Lead review is required before QA acceptance.

---

### A-031 - STEP-03 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-03.md`  
**Next authorized action:** QA may review STEP-03 against `mod-w/step-03.md`, `review.md`, the approved A-030 implementation plan, and the passing verification evidence.

#### Accepted Artifacts

- `review.md` - Tech Lead Review - STEP-03, verdict "Pass for QA"
- Current STEP-03 implementation package in the working tree
- `mod-w/step-03.md`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`

#### Acceptance Summary

The Moderator accepts the Tech Lead review for STEP-03. The review found no must-fix or could-fix-later findings and confirms that the implementation remains within STEP-03 scope: pure domain logic, Observed Baseline derivation, sustained Divergence detection, Evidence construction, focused domain tests, and replay-level detector tests through the repository interface.

The implementation does not add dashboard rendering, dashboard facade consumption, fixture changes, About copy changes, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution behavior.

#### Evidence

- `review.md` verdict: Pass for QA.
- `fnm exec --using=v26.0.0 node --version` printed `v26.0.0`.
- `fnm exec --using=v26.0.0 npm.cmd run lint` passed.
- `fnm exec --using=v26.0.0 npm.cmd run build` passed after rerun outside the sandbox; the sandboxed run hit the known Angular/esbuild `spawn EPERM` limitation.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` passed after rerun outside the sandbox; 20 test files and 268 tests passed.

#### Conditions

- QA should verify sustained Divergence behavior versus one-off variation, Evidence reconstruction, QA-014 independent Approval step and Workflow runtime Divergences, and absence of UI rendering scope creep.
- QA should verify no current behavior claims Attribution, business judgment, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or CAV Level 2+ capability.
- QA should use Node.js v26.0.0 via `fnm` for verification.

---

### A-032 - STEP-03 QA Acceptance And Finding Dispositions

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance before STEP-03 final gate  
**Step:** `mod-w/step-03.md`  
**Next authorized action:** Prepare the STEP-03 final Moderator gate. No STEP-03 rework is required before the final gate.

#### Accepted Artifacts

- `qa.md` - QA Review - STEP-03, verdict "Pass with notes"
- STEP-03 implementation commit `164abb6`
- Tech Lead review acceptance A-031

#### Acceptance Summary

The Moderator accepts the STEP-03 QA review. QA found that all 21 STEP-03 acceptance checks pass, with AC10 and AC11 passing with notes. Lint, build, and tests passed under Node.js v26.0.0 via `fnm`, with 20 test files and 268 tests passing.

QA-014 is closed for STEP-03: the Approval step and Workflow runtime Divergences are emitted independently when each meets sustained criteria, with no link, suppression, derived marker, or causal Attribution claim.

#### Finding Dispositions

| Finding | Disposition                                                                                                                                                                                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-018  | Accepted as a known product/data-model limitation, not a STEP-03 defect. STEP-03 detects vendor-representation changes within an Identity Slice. Broader vendor rename/entity matching touches Identity Slice design from STEP-02 and should be routed to later Tech Lead planning before adding a vendor-rename demo scenario or live adapter work. |
| QA-019  | Accepted as MVP detection semantics for STEP-03. Carry to STEP-04 planning: before rendering `resolved` statuses prominently, Tech Lead should decide whether one returning observation is enough or whether resolution needs sustained in-baseline evidence plus resolution evidence.                                                               |
| QA-020  | Accepted as approved A-030 behavior from the consecutive-observation rule. No STEP-03 action required.                                                                                                                                                                                                                                               |
| QA-021  | Accepted as optional cleanup. If `observation.ts` is touched later, prefer deterministic code-point comparison over locale-sensitive `localeCompare` for equal timestamps.                                                                                                                                                                           |
| QA-022  | Accepted as process traceability note. QA independently checked commit `164abb6`, and results match `review.md`. Future commits should keep role artifacts separated when feasible.                                                                                                                                                                  |

#### Conditions

- No STEP-03 rework is required for QA-018 through QA-022 before the final gate.
- Carry QA-018 into later domain/data-model planning if vendor rename/entity matching becomes part of the demo or adapter scope.
- Carry QA-019 into STEP-04 planning before rendering `resolved` Divergence status in user-facing UI.
- The STEP-03 final gate follows this acceptance.

---

### A-033 - STEP-03 Moderator Final Gate

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Final Moderator gate  
**Gate:** STEP-03 final acceptance  
**Step:** `mod-w/step-03.md`  
**Next authorized action:** Create the annotated tag `step-03` on the commit that contains this entry and the roadmap completion update, then proceed to STEP-04 planning when directed.

#### Accepted Artifacts

- STEP-03 implementation commit `164abb6`
- QA acceptance commit `e828e5c`
- Tech Lead review in `review.md`
- QA review in `qa.md`
- QA acceptance and finding dispositions A-032
- Roadmap STEP-03 completion update in this final-gate commit

#### Final Acceptance Summary

STEP-03 is accepted as complete. It implements pure domain logic for CAV Level 1 Observed Baseline derivation, sustained Divergence detection, and Evidence-carrying Divergence records for the document and workflow streams.

The accepted STEP-03 scope does not include dashboard rendering, dashboard facade consumption, Divergence cards, detail panels, Evidence Trace UI, Chart.js analysis, fixture changes, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution behavior.

#### QA And Finding Dispositions

| Finding | Final disposition                                                                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-014  | Closed for STEP-03. Approval step and Workflow runtime Divergences are emitted independently when each meets sustained criteria, with no link, suppression, derived marker, or causal Attribution claim. |
| QA-018  | Accepted as known product/data-model limitation. Carry to later vendor identity/entity-matching planning if needed before adding a vendor-rename demo scenario or live adapter work.                     |
| QA-019  | Accepted as MVP detection semantics for STEP-03. Carry into STEP-04 planning before rendering `resolved` Divergence status in user-facing UI.                                                            |
| QA-020  | Accepted as approved A-030 consecutive-observation behavior. No action required.                                                                                                                         |
| QA-021  | Accepted as optional cleanup if `observation.ts` is touched later.                                                                                                                                       |
| QA-022  | Accepted as process traceability note. No STEP-03 rework required.                                                                                                                                       |

#### Evidence

- A-029 approved the STEP-03 definition.
- A-030 approved the Development Team implementation plan.
- A-031 accepted the Tech Lead review before QA.
- A-032 accepted the QA review and dispositioned QA-018 through QA-022.
- Lint, build, and tests passed under Node.js v26.0.0 in the accepted Tech Lead and QA evidence.
- QA reported 20 test files and 268 tests passing.

#### Notes

- QA-018 and QA-019 are carry-forward planning notes, not STEP-03 blockers.
- PO-1 About References remains outside STEP-03.
- PO-4, QA-007, and QA-008 remain governed by their previously assigned later-Step timing unless separately rerouted by the Moderator.

---

### A-034 - STEP-04 Step Approval Before Development Team Briefing

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-04.md`  
**Next authorized action:** Brief Development Team on `mod-w/step-04.md`; Development Team may read context and propose an implementation plan, but may not write code until the Moderator approves that plan.

#### Approved Artifacts

- `mod-w/step-04.md` - STEP-04 definition authored by the Tech Lead
- `mod-w/roadmap.md` - STEP-04 status updated from authored/pending approval to approved for briefing/planning

#### Approval Summary

The Moderator approves `mod-w/step-04.md` as the active STEP-04 definition:

**Divergence List, Detail, Baseline, And Evidence Trace**

STEP-04 is approved for Development Team briefing and implementation planning only. The Step covers UI surfacing of STEP-03 Divergence, Observed Baseline, and Evidence records through dashboard list/detail components, status badges, baseline context, Evidence Trace, selection state, and stream KPI counts.

#### Conditions

- Development Team must implement only the approved STEP-04 scope.
- Development Team must wait for Moderator approval of its implementation plan before writing code.
- STEP-04 must preserve the source-agnostic boundary: dashboard components must not import replay fixtures or reimplement baseline/Divergence logic inline.
- STEP-04 must carry QA-014: workflow Approval and Workflow runtime Divergences may both render, but UI must not imply causation or Attribution.
- STEP-04 must carry QA-019: `resolved` status, if rendered, must be presented only as a lifecycle status and must not imply remediation, correction, Convergence, or business correctness.
- STEP-04 must carry QA-018: UI copy must not imply broader vendor rename/entity matching than the STEP-03 detector supports.
- Filters/sorting, Chart.js analysis, user action workflows, About copy changes, fixture changes, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, and Attribution are not authorized in STEP-04.
- PO-1 About References remains outside STEP-04 unless separately routed.
- PO-4, QA-007, and QA-008 retain their later-step timing unless separately rerouted by the Moderator.
- Tech Lead review is required before QA acceptance.

---

### A-035 - STEP-04 Development Team Implementation Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before Development Team writes code  
**Step:** `mod-w/step-04.md`  
**Next authorized action:** Development Team implements STEP-04 per the approved plan and the Tech Lead conditions below, runs the build gate under Node.js v26.0.0, then hands off for Tech Lead review.

#### Approved Plan

Development Team STEP-04 plan (2026-09-25), with the Tech Lead conditions below:

- `DashboardFacade` reads Identity Slices and observations per stream through `StreamObservationRepository`, computes Divergences with the STEP-03 `detectStreamDivergences`, orders them by onset (stable, detector order on ties), and exposes Divergences by stream, per-stream KPI counts, and per-stream selection (default: first Divergence; none when the stream has none).
- Presentational components under `src/app/shared/ui/divergence/`: Status Badge, Divergence Card, Divergence Detail, Baseline Reference Panel, Evidence Trace, plus a display-only formatting helper.
- Dashboard renders real list, detail, and KPI content; truthful empty and unavailable states; placeholder "later Step" copy replaced; filters stay disabled; Trend stays a non-chart placeholder.
- Tests for facade, components, stream switching, selection/detail, baseline panel, Evidence Trace, status wording, QA-014 non-causal presentation, and existing claim guardrails.

#### Tech Lead Conditions Adopted

| Item               | Condition                                                                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resolved KPI       | Keep visible with count `0` in replay and the note "Finding lifecycle status". No remediation, correction, Convergence, success, or business-correctness implication.                                       |
| ESLint import rule | Not added in STEP-04. Fixture-import boundary enforced by implementation discipline, tests where practical, and Tech Lead review static checks.                                                             |
| Component location | `src/app/shared/ui/divergence/`. Presentational only: typed inputs/outputs, no repository access, no detector calls, no fixture imports.                                                                    |
| Facade / data flow | `DashboardFacade -> repository -> STEP-03 domain detector`. Components must not compute baselines or Divergences inline or import `data/replay/**`.                                                         |
| QA-014             | Workflow Divergences render as sibling findings with no grouping or cross-linking. Shared instance IDs only as Evidence context. No copy or structure implying cause, Attribution, relation, or dependency. |
| QA-019             | `resolved` wording frames it as finding lifecycle status only. Wording that the resolving observation is not listed in Evidence is acceptable. No STEP-03 detector semantics changes.                       |
| QA-018             | No rename/entity-matching claims. "Vendor representation" is acceptable. No "rename", "same vendor", or entity-matching copy.                                                                               |
| Tab panel focus    | Adjustment approved if tests are updated and keyboard accessibility remains sound.                                                                                                                          |

#### Conditions

- Verification uses Node.js v26.0.0 via `fnm`: `fnm exec --using=v26.0.0 node --version`, then `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd test -- --watch=false` through `fnm exec --using=v26.0.0`.
- No functional filtering/sorting, Chart.js, user actions, About copy or About test changes, fixture or detector changes, live calls, OAuth, credentials, backend/proxy, non-replay adapters, CAV Level 2+ claims, or reserved Level 3+ behavior.
- Tech Lead review is required before QA acceptance.

---

### A-036 - STEP-04 Development Team Tablet Breakpoint Rework Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Rework-plan approval before Development Team writes code  
**Step:** `mod-w/step-04.md`  
**Next authorized action:** Development Team rework is implemented and verified; STEP-04 is approved to hand back for Tech Lead re-review.

#### Rework Source

- `review.md` Tech Lead Review - STEP-04, verdict "Rework required before QA", Must Fix Now finding 1: the list/detail layout stacked only at `max-width: 1024px`, so 1025-1279px stayed two-column, conflicting with the `design-spec.md` tablet range (768-1279px, stacked).

#### Approved Plan

- In `src/app/features/dashboard/dashboard.component.scss`, change the list/detail breakpoint from `max-width: 1024px` to `max-width: 1279px`: stacked at 1279px and below, two-column from 1280px.
- No other file, copy, component, fixture, domain logic, About, Chart.js, or test changes unless strictly necessary.
- Mobile detail modal/push overlay is not added; mobile keeps the single stacked column.
- No committed breakpoint test: unit tests run in jsdom without media-query evaluation, and adding an e2e suite is outside STEP-04. Browser evidence is provided instead.

#### Conditions

- Browser evidence at 1400, 1280, 1279, 1200, 768, and 390px showing the expected two-column or stacked layout.
- Verification uses Node.js v26.0.0 via `fnm`: `node --version`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd test -- --watch=false`.
- Do not commit unless instructed.
- Tech Lead re-review is required before QA acceptance.

#### Evidence

- Development Team reported the one-line breakpoint change only.
- Playwright browser check: 1400 and 1280px two-column; 1279, 1200, 1032 (iPad Pro 13 portrait), 768, and 390px stacked with full-width detail; no horizontal overflow at any width.
- Lint, build, and tests pass under Node.js v26.0.0: 26 test files, 337 tests.
- Moderator approved the Development Team rework for Tech Lead re-review.

---

### A-037 - STEP-04 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-04.md`  
**Next authorized action:** QA may review STEP-04 against `mod-w/step-04.md`, `review.md`, the approved A-035 implementation plan, the A-036 rework approval and browser evidence, and the passing verification evidence.

#### Accepted Artifacts

- `review.md` - Tech Lead Review - STEP-04, verdict "Pass for QA"
- Current STEP-04 implementation package in commit `933aece`
- `mod-w/step-04.md`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/design/design-spec.md`

#### Acceptance Summary

The Moderator accepts the Tech Lead review for STEP-04. The initial Tech Lead review found one must-fix tablet breakpoint issue. A-036 approved the scoped rework, and the Tech Lead re-review confirms that the dashboard now stacks list/detail layout through the approved tablet range and returns to two columns at desktop width.

The implementation remains within STEP-04 scope: dashboard list/detail rendering, status badges, baseline reference context, Evidence Trace display, stream KPI counts, source-agnostic facade consumption, and local selection state. It does not add functional filters/sorting, Chart.js analysis, user action workflows, About copy changes, fixture changes, detector changes, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution behavior.

#### Evidence

- `review.md` verdict: Pass for QA.
- A-036 browser evidence: 1400px and 1280px two-column; 1279px, 1200px, 1032px, 768px, and 390px stacked with no horizontal overflow.
- `fnm exec --using=v26.0.0 node --version` printed `v26.0.0`.
- `fnm exec --using=v26.0.0 npm.cmd run lint` passed.
- `fnm exec --using=v26.0.0 npm.cmd run build` passed after rerun outside the sandbox; the sandboxed run hit the known Angular/esbuild `spawn EPERM` limitation.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` passed after rerun outside the sandbox; 26 test files and 337 tests passed.

#### Conditions

- QA should verify replay dashboard rendering, independent Approval step and Workflow runtime Divergences, baseline and Evidence Trace copy, lifecycle-only `resolved` wording, and the 768-1279px stacked tablet layout.
- QA should verify no About, Chart.js, fixture, live-call, credential, domain-detector, CAV Level 2+, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution scope creep.
- QA should use Node.js v26.0.0 via `fnm` for verification.

---

### A-038 - STEP-04 QA Acceptance And Finding Dispositions

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance before STEP-04 final gate  
**Step:** `mod-w/step-04.md`  
**Next authorized action:** Prepare the STEP-04 final Moderator gate. No STEP-04 rework is required before the final gate.

#### Accepted Artifacts

- `qa.md` - QA Review - STEP-04, verdict "Pass with notes"
- STEP-04 implementation commit `933aece`
- Tech Lead review acceptance A-037

#### Acceptance Summary

The Moderator accepts the STEP-04 QA review. QA found that all 28 STEP-04 acceptance checks pass, with AC12, AC15, and AC18 passing with notes. Lint, build, and tests passed under Node.js v26.0.0 via `fnm`, with 26 test files and 337 tests passing. The rendered browser check confirmed replay dashboard content, selection, keyboard access, stream switching, chronological Evidence Trace, Baseline panel content, disabled filters, no charts, and the stacked 768-1279px tablet layout with no horizontal overflow.

QA-014 remains satisfied in STEP-04: the Approval step and Workflow runtime Divergences render as independent sibling cards with no link, grouping, or causal Attribution copy. QA-019 remains satisfied: `resolved` is presented only as a finding lifecycle status.

#### Finding Dispositions

| Finding | Disposition                                                                                                                                                                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-023  | Resolved by A-037. The Tech Lead review acceptance was recorded after QA started, but it accepts the same `933aece` package QA reviewed, and `ac434f6` changes only this register.                                                                                                                 |
| QA-024  | Accepted as a known display limitation for STEP-04. Day-scale duration formatting drops minutes, so some rendered Evidence values do not reconcile exactly; the domain record keeps exact milliseconds. Better duration formatting may be considered in a later UI polish step. No STEP-04 rework. |
| QA-025  | Closed, no action. `review.md` described the working tree as uncommitted at Tech Lead review time. The work was committed before QA on the Moderator's instruction.                                                                                                                                |

#### Conditions

- No STEP-04 rework is required for QA-023 through QA-025 before the final gate.
- Carry QA-024 to a later UI polish step if duration display precision is revisited.
- Note the QA risks for later planning: shared replay values between Approval and Workflow runtime Divergences may invite inferred relationships (QA-014, data not copy), and sibling `resolved`/`ongoing` cards on the same Identity Slice and dimension are not explained as separate sustained runs (QA-019).
- The STEP-04 final gate follows this acceptance.

---

### A-039 - STEP-04 Moderator Final Gate

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Final Moderator gate  
**Gate:** STEP-04 final acceptance  
**Step:** `mod-w/step-04.md`  
**Next authorized action:** Create the annotated tag `step-04` on the commit that contains this entry and the roadmap completion update, then proceed to STEP-05 planning when directed.

#### Accepted Artifacts

- STEP-04 implementation commit `933aece`
- Tech Lead review acceptance commit `ac434f6`
- QA acceptance commit `7ca798b`
- Tech Lead review in `review.md`
- QA review in `qa.md`
- QA acceptance and finding dispositions A-038
- Roadmap STEP-04 completion update in this final-gate commit

#### Final Acceptance Summary

STEP-04 is accepted as complete. It renders computed CAV Level 1 Divergences on the dashboard through the source-agnostic facade: Divergence cards with status badges, a detail panel, Observed Baseline reference context, a chronological Evidence Trace, stream KPI counts, and per-stream local selection state, with a stacked list/detail layout from 768px to 1279px and two columns from 1280px.

The accepted STEP-04 scope does not include functional filters or sorting, Chart.js analysis, user action workflows, About copy changes, fixture changes, detector changes, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution behavior.

#### QA And Finding Dispositions

| Finding | Final disposition                                                                                                                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-014  | Satisfied for STEP-04. Approval step and Workflow runtime Divergences render as independent sibling cards with no grouping, cross-linking, or causal Attribution copy. Shared replay values remain a later-planning risk for Attribution-adjacent copy. |
| QA-018  | Satisfied for STEP-04. No rename or entity-matching claims in rendered copy. The underlying vendor identity limitation remains carried to later planning.                                                                                               |
| QA-019  | Satisfied for STEP-04. `resolved` is presented only as finding lifecycle status. Sibling `resolved`/`ongoing` runs on the same Identity Slice and dimension remain a later-planning note.                                                               |
| QA-023  | Resolved by A-037.                                                                                                                                                                                                                                      |
| QA-024  | Accepted as a known display limitation. Carry to a later UI polish step if duration display precision is revisited.                                                                                                                                     |
| QA-025  | Closed, no action.                                                                                                                                                                                                                                      |

#### Evidence

- A-034 approved the STEP-04 definition.
- A-035 approved the Development Team implementation plan with Tech Lead conditions.
- A-036 approved the tablet breakpoint rework with browser evidence.
- A-037 accepted the Tech Lead review before QA.
- A-038 accepted the QA review and dispositioned QA-023 through QA-025.
- Lint, build, and tests passed under Node.js v26.0.0 in the accepted Tech Lead and QA evidence.
- QA reported 26 test files and 337 tests passing.

#### Notes

- QA-024 and the QA-014/QA-019 display risks are carry-forward planning notes, not STEP-04 blockers.
- The pre-existing inactive stream tab `aria-controls` reference to an unrendered panel id is noted for STEP-05 keyboard/focus planning.
- PO-1 About References remains outside STEP-04.
- PO-4, QA-007, and QA-008 remain governed by their previously assigned later-Step timing unless separately rerouted by the Moderator.

---

### A-040 - STEP-05 Step Approval Before Development Team Briefing

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** Development Team may be briefed on STEP-05 and may prepare an implementation plan. Development Team may not write code until the Moderator approves the Development Team implementation plan in the Moderator Register.

#### Approved Artifacts

- `mod-w/step-05.md` - STEP-05 definition authored by the Tech Lead
- `mod-w/roadmap.md` - STEP-05 status updated from authored/pending approval to approved for briefing/planning

#### Approval Summary

The Moderator approves `mod-w/step-05.md` as the active STEP-05 definition:

**Filtering, Sorting, Empty, Loading, And Error States**

STEP-05 is approved for Development Team briefing and implementation planning only. The Step covers functional dashboard filters and sorting, explicit loading/empty/error/unavailable states, keyboard/focus refinements, selection behavior under filters, and preservation of STEP-04 responsive behavior.

#### Conditions

- Development Team must implement only the approved STEP-05 scope.
- STEP-05 must preserve the source-agnostic boundary: dashboard components must not import replay fixtures or reimplement Observed Baseline or sustained Divergence logic inline.
- STEP-05 implements lifecycle-status filtering, not severity/risk scoring.
- STEP-05 must carry QA-024 as a known display limitation; duration-format precision is not required unless separately routed.
- STEP-05 must carry the STEP-04 accessibility note about inactive stream-tab `aria-controls` into keyboard/focus planning.
- Chart.js analysis, user action workflows, About copy changes, fixture changes, detector changes, live DocuWare calls, credentials, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, and Attribution are not authorized in STEP-05.
- PO-1 About References and future MOD-W roles/harnesses/About-flowchart content remain outside STEP-05 unless separately routed.

---

### A-041 - STEP-05 Development Team Implementation Plan Approval

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before Development Team writes code  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** STEP-05 implementation is complete and verified; hand off for Tech Lead review.

#### Recording Note

The Moderator approved the Development Team implementation plan in session before any code was written, and the Development Team then implemented STEP-05. This entry was recorded afterwards by the Development Team at the Moderator's explicit instruction, for this instance only. Register entries otherwise remain the Moderator's to record.

#### Approved Plan

Development Team STEP-05 plan (2026-09-25), with the Tech Lead decisions and conditions below:

- New dashboard-local helpers (`dashboard-filters.ts`) filter and sort Divergence records the detector has already computed. They do not recompute Observed Baselines or sustained Divergences.
- `DashboardFacade` models per-stream data state (loading, unavailable, ready) behind the repository interface. A source that errors or completes without data is unavailable. Retry re-reads the stream through the repository. Filters, sort, and selection are held per stream. KPI counts stay unfiltered.
- Filters: Identity Slice (repository slices for the active stream), time range presets, and lifecycle status (statuses present in the stream). Sort: onset (default, STEP-04 order), Identity Slice, dimension, and status (lifecycle order, stable). Magnitude sort and custom time ranges are excluded.
- Selection: a chosen Divergence hidden by filters is reported as hidden rather than replaced. Clearing filters restores it. With no choice, the first visible Divergence is shown.
- States: loading, unavailable with retry, no Divergences, and filtered-empty, with local copy that does not imply live access and no support links.
- Accessibility: only the active stream tab carries `aria-controls`. Controls stay rendered so focus is not stranded, and focus moves to the list after retry. Existing tab keyboard behavior and visible focus states are kept.
- STEP-04 responsive behavior is preserved: 1280px and wider two-column, 768-1279px stacked, below 768px single stacked flow.

#### Tech Lead Decisions Adopted

| Item                 | Decision                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Stream switching     | Preserve per-stream filter, sort, and selection state.                                       |
| Filtered-empty reset | No extra reset button inside the filtered-empty state; use the stable Clear filters control. |
| Time range           | Filter on `latestObservedAt`, anchored to the latest observation in the stream.              |
| Browser evidence     | Throwaway Playwright scripts; no committed e2e suite required in STEP-05.                    |

#### Conditions

- The dashboard-only severity/risk guardrail must not change About tests.
- Clear filters `aria-disabled` behavior must be safe and tested.
- Retry remains behind the facade/repository boundary and does not imply live DocuWare access.
- KPI copy must state that counts are unfiltered.
- QA-024 duration precision remains out of scope unless separately routed.
- Verification uses Node.js v26.0.0 via `fnm`: `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd test -- --watch=false`.
- Do not commit unless instructed. Tech Lead review is required before QA acceptance.

---

### A-042 - STEP-05 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-25  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** QA may review STEP-05 against `mod-w/step-05.md`, `review.md`, the approved A-041 implementation plan, and the passing verification evidence.

#### Accepted Artifacts

- `review.md` - Tech Lead Review - STEP-05, verdict "Pass for QA"
- Current STEP-05 implementation package in the working tree
- `mod-w/step-05.md`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/design/design-spec.md`

#### Acceptance Summary

The Moderator accepts the Tech Lead review for STEP-05. The review found no must-fix or could-fix-later findings and confirms that the implementation remains within STEP-05 scope: functional dashboard filters and sorting, explicit loading/unavailable/empty/filtered-empty states, per-stream filter/sort/selection behavior, hidden-selection handling, retry through the repository/facade boundary, and keyboard/focus refinements.

The implementation does not add Chart.js analysis, user action workflows, About copy changes, fixture changes, detector changes, live DocuWare calls, credentials, backend/proxy work, CAV Level 2+ claims, Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, Attribution, or severity/risk scoring.

#### Evidence

- `review.md` verdict: Pass for QA.
- `fnm exec --using=v26.0.0 node --version` printed `v26.0.0`.
- `fnm exec --using=v26.0.0 npm.cmd run lint` passed.
- `fnm exec --using=v26.0.0 npm.cmd run build` passed after rerun outside the sandbox; the sandboxed run hit the known Angular/esbuild `spawn EPERM` limitation.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` passed after rerun outside the sandbox; 27 test files and 408 tests passed.
- Development Team reported 18 of 18 browser checks passing with throwaway Playwright evidence.

#### Conditions

- QA should verify A-041 process traceability and this A-042 Tech Lead review acceptance before QA.
- QA should verify filters, sorting, clear filters, stream switching, hidden-selection behavior, loading/unavailable/empty/filtered-empty states, retry behavior, accessibility, and 1279px/1280px responsive behavior.
- QA should verify no severity/risk scoring, business judgment, live-access claim, Attribution, CAV Level 2+ claim, Chart.js analysis, user action workflow, About change, fixture change, or detector change was introduced.
- QA should use Node.js v26.0.0 via `fnm` for verification.

---

### A-043 - STEP-05 QA-026 Rework Plan Approval

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** QA-026 rework plan approval before implementation  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** Development Team may implement the approved QA-026 rework plan, then hand off the completed diff and verification evidence for Tech Lead review before QA acceptance.

#### Approved Rework Plan

The Moderator approves the Development Team's QA-026 rework plan for STEP-05.

The approved fix is limited to aligning the Time range select's `aria-describedby` reference with the rendered `#time-range-note` paragraph so the control cannot point to a missing description in the empty list state.

#### Scope Conditions

- Add a computed dashboard value that exposes the time range note only when no controls note replaces it.
- Use that computed value for both the Time range select `aria-describedby` attribute and the `time-range-note` paragraph render condition.
- Do not render the time range note in the empty list state.
- Do not change note copy, controls-note copy, disabled state behavior, filters, sorting, KPIs, fixtures, facade/domain logic, About, Chart.js analysis, user actions, live integration, QA-027, `qa.md`, or `review.md`.
- Do not commit unless separately instructed.

#### Expected Verification

- Extend the existing no-Divergences stream spec to assert that `filter-timerange` has no `aria-describedby`, `[data-testid="time-range-note"]` is not rendered, and no `#time-range-note` element exists.
- Preserve the existing ready-state assertion that `filter-timerange` references `time-range-note` and the note renders.
- Run verification under Node.js v26.0.0 via `fnm`: `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd test`.
- Expected test count remains 408 because the plan extends an existing spec.

---

### A-044 - STEP-05 QA Documentation Carry Approval

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Documentation-scope disposition before QA-026 QA re-check  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** Tech Lead may treat the `qa.md` modification as separately approved from QA-026 and may clear the QA-026 rework package for QA re-check if no other findings remain.

#### Disposition

The Moderator approves carrying the current `qa.md` modification separately from the QA-026 rework implementation.

This approval does not widen the QA-026 implementation scope. The QA-026 code rework remains limited to the Time range `aria-describedby`/`time-range-note` fix approved in A-043.

#### Conditions

- QA may consider the `qa.md` modification as separately authorized documentation context, not as part of the QA-026 implementation fix.
- This disposition resolves the Tech Lead process finding TL-STEP05-RW-001 if the dashboard implementation and verification remain otherwise acceptable.
- QA-026 remains subject to QA re-check against A-043, the Tech Lead rework review, and the verification evidence.

### A-045 - STEP-05 Tech Lead Rework Review Acceptance

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead rework review acceptance before QA re-check  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** QA may re-check QA-026 against A-043, A-044, the completed implementation, and the verification evidence.

#### Accepted Artifacts

- `review.md` - STEP-05 QA-026 Rework Review Addendum, verdict "Pass for QA re-check"
- QA-026 implementation rework in the current working tree
- A-043 approved QA-026 rework plan
- A-044 approved separate `qa.md` documentation disposition

#### Acceptance Summary

The Moderator accepts the Tech Lead's rework review for STEP-05. The review confirms that the implementation matches the approved QA-026 plan: the Time range select references `time-range-note` only when that note is rendered, and the no-Divergences state no longer exposes a dangling description reference.

The Tech Lead found no remaining Must Fix or Could Fix Later findings. The previously identified scope finding concerning the `qa.md` modification is resolved by A-044. The QA-026 code scope remains limited to the approved accessibility fix.

#### Evidence

- `fnm exec --using=v26.0.0 npm.cmd run lint` passed.
- `fnm exec --using=v26.0.0 npm.cmd run build` passed after rerun outside the sandbox.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` passed after rerun outside the sandbox: 27 test files and 408 tests passed.
- The existing ready-state assertion remains in place, and the no-Divergences spec covers the absent `aria-describedby` and absent `time-range-note` element.

#### Conditions

- QA must re-check QA-026 and confirm the approved fix against the no-Divergences state.
- QA must preserve the existing STEP-05 scope and must not treat this acceptance as final STEP-05 or QA acceptance.
- QA-027 remains a documented process note and does not require implementation rework.

### A-046 - STEP-05 QA Acceptance And Finding Dispositions

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance before Moderator final gate  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** The Moderator may record the STEP-05 final gate and update the roadmap.

#### Accepted Artifacts

- `qa.md` - STEP-05 QA-026 Re-check, verdict "QA-026 resolved. There are no new findings."
- `review.md` - STEP-05 QA-026 Rework Review Addendum, verdict "Pass for QA re-check"
- A-045 Moderator acceptance of the Tech Lead rework review
- Commit `6100088` - `fix(step-05): resolve time-range description reference`

#### Acceptance Summary

The Moderator accepts the QA-026 re-check and the STEP-05 QA review. QA independently reran lint, build, and tests under Node.js v26.0.0; all passed, with 27 test files and 408 tests. The no-Divergence state no longer contains a dangling Time range `aria-describedby` reference, and the ready state continues to expose a valid rendered description.

#### Finding Dispositions

| Finding | Disposition                                                                                 |
| ------- | ------------------------------------------------------------------------------------------- |
| QA-026  | Closed. The approved accessibility rework is verified by QA and introduces no new findings. |
| QA-027  | Accepted as a non-blocking process traceability note. No implementation rework is required. |

#### Conditions

- No additional STEP-05 implementation changes are authorized or required.
- The final Moderator gate must preserve the documented QA-027 process note.

---

### A-047 - STEP-05 Moderator Final Gate

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Final Moderator gate  
**Gate:** STEP-05 final acceptance  
**Step:** `mod-w/step-05.md`  
**Next authorized action:** STEP-05 is complete; proceed to STEP-06 planning when directed.

#### Accepted Artifacts

- STEP-05 implementation commit `6100088`
- `review.md` Tech Lead STEP-05 review and QA-026 rework review addendum
- `qa.md` STEP-05 QA review and QA-026 re-check
- Moderator approvals A-040 through A-046
- `mod-w/step-05.md`
- Updated STEP-05 roadmap status

#### Final Acceptance Summary

STEP-05 is accepted as complete. It delivers functional dashboard filtering and sorting, explicit loading/unavailable/empty/filtered-empty states, per-stream filter/sort/selection behavior, hidden-selection handling, repository-backed retry behavior, keyboard and focus refinements, and preserved responsive behavior.

The QA-026 accessibility rework is closed. QA-027 remains a non-blocking process note. The accepted scope contains no Chart.js analysis, user action workflows, About changes, fixture or detector changes, live DocuWare calls, credentials, backend/proxy work, or CAV Level 2+ behavior.

#### Evidence

- `npm.cmd run lint` passed under Node.js v26.0.0.
- `npm.cmd run build` passed under Node.js v26.0.0.
- `npm.cmd test -- --watch=false` passed under Node.js v26.0.0: 27 test files and 408 tests.
- QA independently verified the no-Divergence and ready-state accessibility behavior after commit `6100088`.

#### Conditions And Carry-Forward Notes

- QA-027 is carried as a process note; future workflow cycles should keep approval artifacts separate from implementation commits where feasible.
- QA-024 remains a known duration-display limitation carried from STEP-04.
- STEP-06 Chart.js analysis remains planned and is not included in this acceptance.

---

MOD-W v5.0.1
