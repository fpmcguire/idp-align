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

### A-048 - STEP-06 Step Approval Before Development Team Briefing

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-06.md`  
**Next authorized action:** Development Team may be briefed on STEP-06 and may prepare an implementation plan. Development Team may not write code until the Moderator approves that implementation plan in the Moderator Register.

#### Approved Artifacts

- `mod-w/step-06.md` - STEP-06 Divergence Analysis Chart View definition
- `mod-w/roadmap.md` - STEP-06 status updated to approved for Development Team planning
- `mod-w/design/design-spec.md` - DS-015 and related analysis-view design intent
- `mod-w/architecture.md` - D2, D3, D6, D7, D9, D11, and D13 boundaries
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`

#### Approval Summary

The Moderator approves `mod-w/step-06.md` as the active STEP-06 definition:

**Divergence Analysis Chart View**

STEP-06 is approved for Development Team briefing and implementation planning. The Step may implement a bundled Chart.js analysis surface for the selected Divergence, including data-backed metric switching, truthful numeric and categorical representations, baseline and Evidence context, accessible non-canvas summaries, and responsive behavior.

#### Conditions

- Development Team must implement only the approved STEP-06 scope.
- The implementation plan must explicitly choose and justify the routed or in-page analysis-view pattern before code changes.
- Chart.js and `chartjs-plugin-annotation` must be bundled dependencies; CDN or runtime third-party script loading is not authorized.
- Metric options and chart data must derive from existing selected-stream Divergence, Observed Baseline, and Evidence data. No chart-only mock data or direct replay-fixture imports are authorized.
- Numeric and categorical Divergences must be represented truthfully; categorical data must not receive a fabricated numeric confidence band.
- Existing baseline and sustained Divergence logic, fixtures, repository boundaries, STEP-05 interactions, and responsive behavior must remain unchanged except for approved presentation wiring.
- No CAV Level 2+, Level 3+, Attribution, business judgment, severity/risk, alert/anomaly, live DocuWare, credentials, backend/proxy, About, or user-action workflow scope is authorized.
- The Development Team must obtain implementation-plan approval before writing code. Tech Lead review is required before QA acceptance.

### A-049 - STEP-06 Development Team Implementation Plan Approval

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before Development Team writes code  
**Step:** `mod-w/step-06.md`  
**Tech Lead verdict:** Pass for Moderator implementation-plan approval  
**Next authorized action:** Development Team may implement the approved STEP-06 plan and run verification. Tech Lead review is required before QA acceptance.

#### Approved Plan Decisions

- **View pattern:** In-page Divergence Analysis within the dashboard is approved. A routed child view, browser Back behavior, and deep-linking are outside STEP-06 scope.
- **Metric options:** Metric-switching options are same-Identity-Slice visible Divergences from the selected stream.
- **Chart series:** Evidence-only chart series are approved. Reference-window observation plotting is deferred because the current facade does not retain those observation values.
- **Browser evidence:** Scratchpad Playwright/browser evidence is approved; a committed E2E spec is not required for STEP-06.

#### Acceptance Summary

The Moderator approves the Development Team implementation plan reviewed by the Tech Lead with a verdict of "Pass for Moderator implementation-plan approval." The plan may now be implemented within the approved STEP-06 definition and the decisions recorded above.

#### Conditions

- Development Team may implement only the approved STEP-06 scope.
- Chart.js and `chartjs-plugin-annotation` must be bundled dependencies only. CDN and runtime third-party script loading are not authorized.
- Chart data and metric options must derive from existing selected-stream Divergence, Observed Baseline, and Evidence data.
- No chart-only mock data, direct replay-fixture imports, fixture changes, detector changes, baseline recomputation, live DocuWare calls, credentials, backend/proxy work, About changes, user action workflows, Attribution, CAV Level 2+ or Level 3+ terms, business-judgment language, alert/anomaly wording, or severity/risk claims are authorized.
- Numeric and categorical Divergences must be represented truthfully. Categorical charts must not fabricate numeric confidence bands.
- Existing STEP-05 filters, sorting, selection behavior, accessibility, and responsive behavior must not regress.
- Categorical chart behavior may be verified through component or view-model specs if replay browser data exposes only numeric Divergences; QA must record that coverage limitation.
- Development Team must hand off the completed implementation diff and verification evidence for Tech Lead review before QA.

### A-050 - STEP-06 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-06.md`  
**Tech Lead verdict:** Pass for QA  
**Next authorized action:** QA may review STEP-06 against `mod-w/step-06.md`, `review.md`, A-048, A-049, A-050, and the verification evidence. QA acceptance is required before the final Moderator gate.

#### Accepted Artifacts

- `review.md` - Tech Lead Review - STEP-06, verdict "Pass for QA"
- Current uncommitted STEP-06 implementation package
- A-048 STEP-06 Step approval
- A-049 STEP-06 Development Team implementation plan approval

#### Verification Evidence

- `fnm exec --using=v26.0.0 npm.cmd run lint` passed.
- `fnm exec --using=v26.0.0 npm.cmd run build` passed after an outside-sandbox rerun for the known Angular/esbuild `spawn EPERM` limitation.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` passed after an outside-sandbox rerun: 30 files and 470 tests.

#### Acceptance Summary

The Moderator accepts the Tech Lead review for STEP-06. The review found no Must Fix or Could Fix Later findings and confirms that the implementation remains within the approved STEP-06 scope: an in-page bundled Chart.js Divergence Analysis view using existing Divergence, Observed Baseline, and Evidence records, metric switching over visible same-Identity-Slice Divergences, truthful numeric and categorical representations, accessible non-canvas summaries, and preserved STEP-05 dashboard behavior.

#### Conditions And QA Notes

- QA should verify browser evidence for chart rendering, focus behavior, metric switching, and responsive layout.
- QA should record that categorical chart behavior is covered by specs only because replay browser data currently produces numeric Divergences only.
- QA should verify no regression in STEP-05 filters, sorting, hidden-selection behavior, loading/unavailable states, tab accessibility, and 1279px/1280px layout behavior.
- QA should verify no direct replay-fixture imports, CDN Chart.js loading, live DocuWare calls, About changes, user action workflows, Attribution, CAV Level 2+ claims, alert/anomaly wording, severity/risk claims, or business-judgment language.
- The completed implementation diff and verification evidence remain subject to QA review; this entry is not final STEP-06 acceptance.

### A-051 - STEP-06 QA Acceptance And Finding Dispositions

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance before Moderator final gate  
**Step:** `mod-w/step-06.md`  
**Next authorized action:** The Moderator may record the STEP-06 final gate and update the roadmap.

#### Accepted Artifacts

- `qa.md` - STEP-06 QA review, verdict "Pass with notes"
- `review.md` - STEP-06 Tech Lead Review, verdict "Pass for QA"
- A-048 STEP-06 Step approval
- A-049 STEP-06 Development Team implementation-plan approval
- A-050 STEP-06 Tech Lead review acceptance
- Commit `194437b` - `feat(step-06): add divergence analysis view`

#### Acceptance Summary

The Moderator accepts the STEP-06 QA review. All 25 acceptance checks pass, lint/build/tests pass under Node.js v26.0.0 with 30 test files and 470 tests, and the independent browser check passes all 72 checks. The categorical chart behavior is covered by component and view-model specs because replay browser data currently exposes numeric Divergences only.

#### Finding Dispositions

| Finding | Disposition                                                                                                                                                                                                     |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-028  | Accepted as an Info-level cosmetic limitation. No STEP-06 rework; carry uneven duration tick formatting to a later polish pass.                                                                                 |
| QA-029  | Accepted as an Info-level latent accessibility note. No STEP-06 rework; carry keyboard access for a future horizontally scrolling table to a later accessibility pass.                                          |
| QA-030  | Accepted as an Info-level process traceability note. No action required; approval artifacts A-049 and A-050 were committed separately before the implementation, and the package matches the reviewed evidence. |

#### Conditions

- No additional STEP-06 implementation rework is required.
- The final Moderator gate must preserve the categorical browser-coverage limitation and QA-028/QA-029 carry-forward notes.

---

### A-052 - STEP-06 Moderator Final Gate

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Final Moderator gate  
**Gate:** STEP-06 final acceptance  
**Step:** `mod-w/step-06.md`  
**Next authorized action:** STEP-06 is complete; proceed to STEP-07 planning when directed.

#### Accepted Artifacts

- STEP-06 implementation commit `194437b`
- `review.md` Tech Lead STEP-06 review
- `qa.md` STEP-06 QA review
- Moderator approvals A-048 through A-051
- `mod-w/step-06.md`
- Updated STEP-06 roadmap status

#### Final Acceptance Summary

STEP-06 is accepted as complete. It delivers an in-page bundled Chart.js Divergence Analysis view using existing Divergence, Observed Baseline, and Evidence records, same-Identity-Slice metric switching, truthful numeric and categorical representations, accessible non-canvas summaries, chart lifecycle cleanup, and preserved STEP-05 dashboard behavior.

QA-028 and QA-029 are carried as non-blocking future polish/accessibility notes. QA-030 is carried as a non-blocking process traceability note. The accepted scope contains no fixture or detector changes, direct replay-fixture imports, live DocuWare calls, credentials, CDN loading, About changes, user action workflows, Attribution, CAV Level 2+ or Level 3+ behavior, alert/anomaly wording, severity/risk claims, or business-judgment language.

#### Evidence

- `npm.cmd run lint` passed under Node.js v26.0.0.
- `npm.cmd run build` passed under Node.js v26.0.0.
- `npm.cmd test -- --watch=false` passed under Node.js v26.0.0: 30 test files and 470 tests.
- Independent Playwright/browser verification passed 72 of 72 checks across chart rendering, metric switching, focus, lifecycle cleanup, regression behavior, and responsive layouts.

#### Conditions And Carry-Forward Notes

- Categorical chart behavior remains spec-covered only until replay data exposes a categorical Divergence in the browser.
- QA-028 uneven duration tick formatting remains a later polish note.
- QA-029 keyboard access for a potentially scrolling chart table remains a later accessibility note.
- STEP-07 Workflow Stream Parity And Cross-Stream Consistency remains planned.

### A-053 - STEP-07 Step Approval Before Development Team Briefing

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Step approval before Development Team briefing  
**Step:** `mod-w/step-07.md`  
**Next authorized action:** Development Team may be briefed on STEP-07 and may prepare an implementation plan. Development Team may not write code until the Moderator approves that implementation plan in the Moderator Register.

#### Approved Artifacts

- `mod-w/step-07.md` - STEP-07 Workflow Stream Parity And Cross-Stream Consistency definition
- `mod-w/roadmap.md` - STEP-07 status updated to approved for Development Team planning
- `mod-w/architecture.md` - D1, D2, D3, D4, D5, D6, D9, D11, and D13 boundaries
- `mod-w/domain-language.md`
- `mod-w/language-matrix.md`
- `mod-w/design/design-spec.md` - DS-001 through DS-015 as applicable to workflow parity

#### Approval Summary

The Moderator approves `mod-w/step-07.md` as the active STEP-07 definition:

**Workflow Stream Parity And Cross-Stream Consistency**

STEP-07 is approved for Development Team briefing and implementation planning. The Step may verify and close workflow-stream parity gaps across the shared dashboard, Divergence detail, Evidence, filters/sorting, analysis behavior, accessibility, and responsive surfaces while preserving workflow-specific meaning.

#### Conditions

- Development Team must implement only the approved STEP-07 scope.
- The implementation must preserve independent CAV Level 1 Document and Workflow streams; cross-stream reconciliation, comparison, correlation, and CAV Level 2 claims are not authorized.
- Workflow fields such as decision agent, route, error, task duration, response time, and runtime must remain factual Evidence context and must not imply Attribution, root cause, violation, failure, risk, or business correctness.
- Existing workflow Divergence, Observed Baseline, Evidence, and replay data must be used through the facade/repository boundary. No direct replay-fixture imports, fixture value changes, detector changes, threshold changes, or reference-window changes are authorized.
- No live DocuWare calls, credentials, OAuth, backend/proxy work, non-replay adapters, package dependency changes, chart-library changes, About changes, or user action workflows are authorized.
- Existing STEP-05 and STEP-06 behavior, including filters, sorting, hidden-selection handling, analysis open/back, chart lifecycle, metric switching, tab accessibility, and responsive breakpoints, must not regress.
- QA-028 and QA-029 remain accepted carry-forward notes and are not STEP-07 requirements unless separately routed and approved.
- The Development Team must obtain implementation-plan approval before writing code. Tech Lead review is required before QA acceptance.

### A-054 - STEP-07 Development Team Implementation Plan Approval

**Status:** Approved with conditions  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Development Team  
**Gate:** Implementation-plan approval before Development Team writes code  
**Step:** `mod-w/step-07.md`  
**Tech Lead verdict:** Pass for Moderator implementation-plan approval, with conditions  
**Next authorized action:** Development Team may implement the approved STEP-07 plan and run verification. Tech Lead review is required before QA acceptance.

#### Approved Plan Decision

The Moderator explicitly approves **KPI Option C**: add a data-backed shared KPI for **"Identity Slices with Divergences"**. This is approved shared-layout fallout within STEP-07 parity work and may affect both Document and Workflow stream presentation. The KPI must use existing facade/domain data and must not count decision agents or routes as a proxy for parity or Attribution.

#### Acceptance Summary

The Moderator approves the Development Team implementation plan reviewed by the Tech Lead. The plan is within A-053 and may now be implemented with KPI Option C and the conditions below.

#### Conditions

- KPI wording must remain non-comparative. **"2 of 4"** is acceptable as within-stream coverage, but copy must not compare Document and Workflow streams or imply cross-stream alignment.
- Use descriptive wording such as **"Identity Slices with Divergences"**. Do not use **"with Divergences"** as a risk or severity cue. Notes may identify workflow coverage, such as **"Workflow steps and Workflow runtime."**
- The shared KPI must be data-backed, use existing facade/domain data, and remain within the shared layout without changing detector, baseline, fixture, or repository semantics.
- The test-only categorical builder is approved only for tests. It must not alter replay fixtures, detection thresholds, reference windows, production data, or browser-visible scenarios.
- The Evidence label change must be checked in Document specs as well as Workflow coverage. **"Amount (compared value)"** is acceptable only if shared wording remains truthful for categorical and document rows and does not imply a target.
- About files and About tests remain untouched. The separately reported stale About sentence is out of scope and requires separate routing.
- Development Team must preserve independent CAV Level 1 streams and must not introduce cross-stream reconciliation, comparison, correlation, Attribution, CAV Level 2+ or Level 3+ claims, business judgment, severity/risk, alert/anomaly, or user-action workflow behavior.
- Existing STEP-05 and STEP-06 behavior must not regress. No fixture value changes, detector changes, threshold changes, reference-window changes, live DocuWare calls, credentials, backend/proxy work, non-replay adapters, or package/chart dependency changes are authorized.
- Development Team must hand off the completed implementation diff and verification evidence for Tech Lead review before QA.

### A-055 - STEP-07 Tech Lead Review Acceptance

**Status:** Approved  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** Tech Lead  
**Gate:** Tech Lead review acceptance before QA  
**Step:** `mod-w/step-07.md`  
**Tech Lead verdict:** Pass for QA  
**Next authorized action:** QA may review STEP-07 against `mod-w/step-07.md`, `review.md`, A-053, A-054, A-055, and the verification evidence. QA acceptance is required before the final Moderator gate.

#### Accepted Artifacts

- `review.md` - Tech Lead Review - STEP-07, verdict "Pass for QA"
- Current uncommitted STEP-07 implementation package
- A-053 STEP-07 Step approval
- A-054 STEP-07 Development Team implementation-plan approval

#### Verification Evidence

- `fnm exec --using=v26.0.0 npm.cmd run lint` passed.
- `fnm exec --using=v26.0.0 npm.cmd run build` passed after an outside-sandbox rerun for the known Angular/esbuild `spawn EPERM` limitation.
- `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` passed after an outside-sandbox rerun: 30 files and 496 tests.
- Development Team scratchpad browser evidence reports 73 of 73 checks passing across workflow parity, analysis behavior, focus, wording, external-request, console, and responsive checks.

#### Acceptance Summary

The Moderator accepts the Tech Lead review for STEP-07. The review found no Must Fix or Could Fix Later findings and confirms that the implementation remains within the approved STEP-07 scope: workflow parity across shared dashboard surfaces, the data-backed shared "Identity Slices with Divergences" KPI approved in A-054, workflow-specific filter and Evidence formatting, preserved STEP-05/STEP-06 behavior, and test-only categorical coverage.

#### Conditions And QA Notes

- QA should verify the shared Identity Slice KPI wording and values in both streams without comparative or risk/severity meaning.
- QA should verify workflow-specific card, detail, Evidence, filter, sorting, hidden-selection, loading/unavailable, tab-accessibility, and 1279px/1280px behavior.
- QA should verify workflow analysis open/back behavior, Workflow Approval metric switching, Workflow runtime chart coverage, chart lifecycle, and responsive behavior.
- QA should record that categorical workflow behavior is covered by specs only because replay browser data exposes numeric workflow Divergences only.
- QA should verify no direct replay-fixture imports, fixture/detector/threshold/reference-window changes, About changes, live DocuWare calls, package/chart changes, user actions, cross-stream reconciliation/comparison/correlation, Attribution, Level 2+ claims, alert/anomaly wording, severity/risk claims, or business-judgment language.
- The completed implementation diff and verification evidence remain subject to QA review; this entry is not final STEP-07 acceptance.

### A-056 - STEP-07 QA Acceptance And Finding Dispositions

**Status:** Approved with notes  
**Date:** 2026-09-26  
**Moderator:** Frank McGuire  
**Role approved:** QA  
**Gate:** QA acceptance before Moderator final gate  
**Step:** `mod-w/step-07.md`  
**Next authorized action:** Product Owner review may be requested before the Moderator records the STEP-07 final gate.

#### Accepted Artifacts

- `qa.md` - STEP-07 QA review, verdict "Pass with notes"
- `review.md` - STEP-07 Tech Lead Review, verdict "Pass for QA"
- A-053 STEP-07 Step approval
- A-054 STEP-07 Development Team implementation-plan approval
- A-055 STEP-07 Tech Lead review acceptance
- STEP-07 implementation commit `e19b580`

#### Acceptance Summary

The Moderator accepts the STEP-07 QA review. All 27 acceptance checks pass, lint/build/tests pass under Node.js v26.0.0 with 30 test files and 496 tests, and the independent browser check passes 115 of 115 checks. Categorical workflow behavior remains covered by specs only because replay browser data exposes numeric workflow Divergences only.

#### Finding Dispositions

| Finding         | Disposition                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| QA-031          | Accepted as an Info-level factual-source-state wording note. The `Failed` label is permitted when reporting a recorded source state under Instance state; no rework is required.                 |
| QA-032          | Accepted as an Info-level process traceability note. No action required; A-053, A-054, and A-055 were committed separately before implementation, and the package matches the reviewed evidence. |
| QA-028 / QA-029 | Carry forward unchanged as previously accepted STEP-06 polish/accessibility notes; STEP-07 does not reopen them.                                                                                 |

#### Conditions And Final-Gate Status

- No additional STEP-07 implementation rework is required.
- The final Moderator gate remains pending Product Owner review and Moderator confirmation of the accepted scope and carry-forward notes.
- QA does not authorize STEP-07 completion or roadmap advancement by this entry alone.

### A-057 - STEP-07 Product Owner Review

**Status:** Approved for final Moderator gate
**Date:** 2026-09-26
**Role:** Product Owner
**Gate:** Product Owner review before Moderator final gate
**Step:** `mod-w/step-07.md`
**Next authorized action:** Moderator may record the STEP-07 final gate after considering this Product Owner approval and the accepted Tech Lead and QA evidence.

#### Reviewed Artifacts

- `mod-w/step-07.md`
- `review.md` - STEP-07 Tech Lead Review
- `qa.md` - STEP-07 QA review and finding dispositions
- `mod-w/validation/moderator-register.md` - A-053 through A-056

#### Product Owner Findings

- The implemented scope is acceptable: Document and Workflow remain independent CAV Level 1 streams, with no cross-stream reconciliation or Level 2+ claims.
- The shared **Identity Slices with Divergences** KPI is acceptable in both streams. Values such as `2 of 4` are filter-independent, within-stream coverage, and use non-comparative wording.
- **Failed** is acceptable when shown as the recorded source state under Instance state; it is factual Evidence context, not business judgment or severity language.
- The v1 interview/demo replay limitations are acceptable: categorical workflow Divergences and Error Exit Evidence are not browser-visible; resolved status and broader metric cases remain covered by specs.
- QA-028 and QA-029 may remain non-blocking carry-forward polish/accessibility notes.
- QA-032 requires no corrective action beyond its traceability record.
- The stale About sentence remains outside STEP-07 and must be handled through separate documentation routing.

**Blocking changes:** None.

#### Approval Summary

The Product Owner approves STEP-07 for the final Moderator gate. This approval is not the final Moderator gate and does not itself authorize roadmap advancement or Step completion.

---

### A-058 - STEP-08 Final-Gate Eligibility Check

- **Status:** Blocked - not eligible for final gate
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Gate:** STEP-08 final-gate eligibility check
- **Step:** `mod-w/step-08.md`
- **Next authorized action:** Tech Lead authors and submits a STEP-08 definition for Moderator approval. No STEP-08 implementation or completion is authorized by this entry.

#### Findings

| ID          | Classification                  | Finding                                                                                                                                                                                                                                                                                            |
| ----------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M-STEP08-01 | Blocking                        | `mod-w/step-08.md` does not exist. There are no approved STEP-08 scope boundaries or acceptance checks. The roadmap's `Planned` status and summary are not approval or acceptance criteria.                                                                                                        |
| M-STEP08-02 | Blocking                        | No STEP-08 Moderator Step-approval record exists. The required approval before Development Team briefing is absent.                                                                                                                                                                                |
| M-STEP08-03 | Blocking                        | No STEP-08 implementation-plan approval, Tech Lead review acceptance, or QA acceptance is recorded. The STEP-07 review and QA evidence in `review.md` and `qa.md` apply only to STEP-07.                                                                                                           |
| M-STEP08-04 | Blocking                        | No STEP-08-specific verification evidence is recorded for build, unit tests, E2E flows, final CAV claim guardrails, or R10/R11 documentation. The current `e2e/example.spec.ts` is Playwright starter coverage against `playwright.dev`, not evidence of IDP-Align E2E behavior.                   |
| M-STEP08-05 | Blocking pending approved scope | No STEP-08 Product Owner review/approval is recorded, and without an approved Step its applicability and acceptance criteria cannot be determined. Product Owner note PO-1 in A-014 requires STEP-08 authoring to address the About References check for R10; this is not itself STEP-08 approval. |
| M-STEP08-06 | Blocking prerequisite           | STEP-07 has not reached its final Moderator gate. A-057 authorizes that gate but is not its decision, and the roadmap still lists STEP-07 as approved for Development Team planning rather than complete. Do not advance to STEP-08 completion before STEP-07 is completed through its own gate.   |

#### Disposition

The final gate is not conducted because STEP-08 is not eligible. No STEP-08 acceptance checks are inferred from the roadmap. No implementation changes are authorized by this entry, and STEP-08 must not be marked complete. The roadmap remains unchanged.

The stale About sentence is not assessed or routed here; it may be considered only if it is explicitly included in a Moderator-approved STEP-08 scope. No non-blocking STEP-08 findings are assigned because there is no approved scope against which to classify them.

#### Prerequisites For A Future Final Gate

- Author `mod-w/step-08.md` with explicit R10/R11 scope, acceptance checks, E2E expectations, final CAV claim guardrails, and any separately routed documentation change; submit it for Moderator Step approval.
- After Step approval, obtain and record Development Team implementation-plan approval before implementation.
- Complete the approved work and provide STEP-08-specific build, unit-test, E2E, documentation, and claim-guardrail evidence for Tech Lead review.
- Record Tech Lead review acceptance, QA acceptance, and Product Owner approval if required by the approved Step and gate process.
- Request a new Moderator final gate only after those prerequisites are evidenced.

### A-059 - STEP-07 Final Moderator Gate

- **Status:** Approved with notes (Pass)
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Gate:** Final Moderator gate
- **Step:** `mod-w/step-07.md`
- **Next authorized action:** Tech Lead may author and submit STEP-08 for Moderator review. Development Team briefing requires STEP-08 approval, and code changes require a separately approved implementation plan.

#### Accepted Artifacts

- `mod-w/step-07.md` and its acceptance checks
- `review.md` - Tech Lead Review - STEP-07, Pass for QA
- `qa.md` - QA Review - STEP-07, Pass with notes
- A-053 STEP-07 approval, A-054 implementation-plan approval, A-055 Tech Lead review acceptance, A-056 QA acceptance, and A-057 Product Owner approval for the final gate

#### Final-Gate Findings

- No blocking STEP-07 changes remain. QA reports all 27 acceptance checks pass; lint, build, and 496 unit/component tests pass; the independent browser check passes 115/115. Product Owner A-057 approves the scope with no blocking changes.
- QA-031 and QA-032 are accepted as informational notes under A-056. QA-028 and QA-029 remain accepted non-blocking carry-forward notes per A-057.
- Categorical workflow behavior remains spec-covered only because current replay browser data exposes numeric workflow Divergences only; this limitation is recorded in QA and accepted by the Product Owner.
- The STEP-07 work preserves independent CAV Level 1 streams and does not introduce cross-stream reconciliation, Attribution, Level 2+ claims, prohibited user actions, or changes to About files, fixtures, detectors, thresholds, reference windows, live access, or dependencies.

#### Decision

STEP-07 passes its final Moderator gate and is complete. Roadmap advancement is authorized. This decision resolves finding M-STEP08-06 from A-058, which identified STEP-07's pending final gate as a STEP-08 sequencing blocker. Findings M-STEP08-01 through M-STEP08-05 remain blocking; STEP-08 is not approved or complete, and no STEP-08 acceptance criteria are inferred from the roadmap.

### A-060 - STEP-08 Step Approval Before Development Team Briefing

- **Status:** Approved with conditions - Step definition only
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Gate:** Step approval before Development Team briefing
- **Step:** `mod-w/step-08.md`
- **Next authorized action:** Development Team may be briefed and may prepare an implementation plan. No STEP-08 code or documentation changes are authorized until the Moderator separately approves that implementation plan and records the approval in this register.

#### Approved Artifact And Scope

- `mod-w/step-08.md` - Quality Gate Completion And Documentation, as reviewed on 2026-09-26.
- Scope is limited to R10/R11 documentation, local IDP-Align Playwright E2E coverage, final CAV Level 1 claim guardrails, and the explicitly listed About current-state/reference-copy updates.

#### Approval Conditions

- Preserve CAV Level 1 boundaries. Do not add new CAV behavior, data scenarios, fixture changes, detector or baseline changes, live access, user workflows, cross-stream reconciliation, or Level 2+ claims without separate Moderator approval.
- Replace the Playwright starter coverage with committed E2E tests against the local IDP-Align app, runnable through `npm run test:e2e`. Any server/config approach must be described in the implementation plan and be deterministic; code or configuration changes still wait for plan approval.
- Address PO-1 from A-014: the About page must link the public DocuWare Platform REST API and Workflow Analytics API documentation unless a separate Moderator-approved About-only route is implemented and verified before STEP-08 implementation. The current About copy names these APIs but does not link them, so PO-1 is not currently satisfied.
- R10 requires a durable research/reference artifact under `mod-w/docs/` consistent with D10; About links alone are insufficient. The artifact must document the specific sources used for the Product References topics: DocuWare AI Hub, Platform REST API, Workflow Analytics API, Purchase-to-Pay/invoice processing, relevant adjacent ML drift-monitoring/data-observability/streaming-drift approaches, canonical CAV Manifesto v1.0, and MOD-W methodology. Cite only sources actually consulted and explain their relevance to scope.
- Product Owner review is required after QA and before the STEP-08 final Moderator gate because this Step changes reviewer-facing About/reference copy. The implementation plan must identify this handoff.
- The stale About copy is approved only within the specific statements routed in this Step; it does not authorize a broader About rewrite.
- QA-028 and QA-029 remain accepted non-blocking carry-forward notes unless a narrow change is explicitly proposed in the implementation plan and separately approved before implementation.
- Categorical workflow behavior remains spec-covered only. Do not add categorical workflow fixtures or make the behavior browser-visible unless a separate Moderator approval authorizes that data scope.
- Respect A-059: factual source-state text such as “Failed” under “Instance state” is not a failure/judgment claim. Guardrail checks must assess context rather than reject that source value indiscriminately.

#### Moderator Resolutions Of Proposed Open Decisions

- A MOD-W research/reference artifact is required by D10 and R10; the About References section is a separate concise user-facing summary.
- Product Owner review before the final Moderator gate is required as stated above.
- The implementation plan may select how Playwright starts or reaches the local app, provided `npm run test:e2e` is deterministic and exercises IDP-Align.
- README/reviewer documentation changes are optional; they must be justified in the implementation plan and remain within approved R10/R11 scope.
- A-059's QA-031 disposition is sufficient; no new carve-out is required beyond preserving factual source-state context.

#### Gate Boundary

This entry authorizes briefing and implementation planning only. It is not implementation-plan approval, Tech Lead review acceptance, QA acceptance, Product Owner final sign-off, or STEP-08 completion. Those gates and STEP-specific verification evidence remain required before a future final Moderator gate. It resolves A-058 findings M-STEP08-01 and M-STEP08-02; remaining A-058 requirements apply to their respective later gates.

### A-061 - STEP-08 Development Team Implementation Plan Decision

- **Status:** Not approved - required review artifacts unavailable
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Gate:** Implementation-plan approval before Development Team writes code or documentation
- **Step:** `mod-w/step-08.md`
- **Reported Tech Lead verdict:** Pass for Moderator implementation-plan approval, with conditions
- **Next authorized action:** Submit the Development Team implementation plan and Tech Lead review as accessible project artifacts for Moderator review. No STEP-08 implementation is authorized.

#### Decision Basis

The requested Development Team implementation plan is not present in the workspace, and no STEP-08 Tech Lead review artifact is available. The current `review.md` contains the STEP-07 review only. The reported Tech Lead verdict is noted, but without the plan and review evidence the Moderator cannot verify the proposed work against A-060 or approve its implementation. This is a documentation/evidence blocker, not a finding that the unseen plan's technical approach is defective.

#### Required Review Conditions

On resubmission, verify that the implementation plan explicitly incorporates all A-060 conditions and the requested STEP-08 decisions:

- Approve a zero-dependency static `dist` server for Playwright E2E; treat Chromium-only E2E as the gate, with cross-engine runs optional.
- Keep the README update within STEP-08 R10/R11 scope to correct stale STEP-01-era public-facing status claims.
- Correct the QA-031 assumption: current browser replay data does not render `Instance state: Failed`; it is only an accepted factual source-state label if present. Do not require it to render.
- Cite only research/reference sources actually fetched or read during implementation; list omitted unverified sources rather than guessing.
- Restrict `src/testing` guardrail imports to test/E2E code; never import them in production code.
- Do not authorize connector work; it is outside STEP-08 scope.
- Require Product Owner review of About/reference copy and the research/reference artifact after QA and before the final Moderator gate.
- Preserve CAV Level 1 boundaries, QA-028/QA-029 as accepted non-blocking notes, and categorical workflow behavior as spec-covered only. No new behavior/data or fixture changes, detector/baseline changes, live access, user workflows, cross-stream reconciliation, Attribution, or Level 2+ claims are authorized.

No approval is granted by this entry. Development Team may not write or modify STEP-08 implementation code or documentation until the complete plan and Tech Lead review are reviewed and a separate Moderator implementation-plan approval is recorded. This is not Tech Lead review acceptance, QA acceptance, Product Owner sign-off, or STEP-08 final acceptance.

### A-062 - STEP-08 Development Team Implementation Plan Approval

- **Status:** Approved with conditions
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Role approved:** Development Team
- **Gate:** Implementation-plan approval before implementation
- **Step:** `mod-w/step-08.md`
- **Tech Lead verdict:** Pass for Moderator implementation-plan approval, with conditions
- **Next authorized action:** Development Team may implement only the approved plan and conditions below, run the planned verification, and hand off the diff and evidence to the Tech Lead for implementation review. QA must not begin until the Moderator accepts that Tech Lead review.

#### Approved Artifacts

- `mod-w/step-08.md`, approved under A-060
- `mod-w/step-08-implementation-plan.md`, reviewed for this gate
- `review.md` - Tech Lead Review - STEP-08 Implementation Plan, verdict "Pass for Moderator implementation-plan approval, with conditions"
- A-060 STEP-08 Step approval
- A-061 prior non-approval and resubmission conditions; TL-PLAN-01 is closed in the reviewed plan review

#### Approval Conditions

- The zero-dependency static server for the production `dist/idp-align/browser` output is approved for Playwright E2E. The server must remain local to the test run and serve the built application with route fallback as planned.
- Chromium-only E2E is approved as the STEP-08 gate. Cross-engine runs may be supplied as optional evidence and are not required for acceptance.
- The README update described in section 8 of the implementation plan is approved within STEP-08 R10/R11 scope, limited to correcting stale STEP-01-era public-facing status claims and documenting the E2E command without expanding CAV claims.
- The research/reference artifact may cite only sources actually fetched and read during implementation. Omit unverifiable candidates and report them in the handoff; do not guess URLs, source contents, or prior research provenance.
- Imports from `src/testing` are permitted only in test and E2E code. No production code may import testing helpers.
- Connector work is explicitly excluded and is not authorized or relevant to STEP-08.
- Product Owner review of the updated About/reference copy and `mod-w/docs/research-references.md` is required after QA and before the final Moderator gate.
- Correct the QA-031 assumption as in the reviewed plan: current browser-visible Workflow runtime Evidence shows `Instance state: Completed`; `Failed` is only an accepted factual source-state label if present. E2E must not require it to render. Synthetic helper controls may test the contextual allow/reject behavior without changing replay data.
- Preserve CAV Level 1 boundaries. No new CAV behavior, fixture/data changes, detector/domain/baseline changes, live access, user actions, cross-stream reconciliation, Attribution, or Level 2+ claims are authorized.
- QA-028 and QA-029 remain accepted non-blocking carry-forward notes. No categorical workflow fixture or browser-coverage changes are authorized; categorical behavior remains spec-covered only.
- No package/dependency, backend/proxy, non-replay adapter, credentials/OAuth, lifecycle semantics, or chart-library changes are included. Any newly identified need outside the approved plan must stop and return for separate Moderator approval.

#### Decision And Gate Boundary

The Moderator approves the Development Team implementation plan in `mod-w/step-08-implementation-plan.md` with the conditions above. Development Team may now implement only that approved plan, execute its verification, and hand off to the Tech Lead.

This entry does not accept the Tech Lead's implementation review, accept QA, record Product Owner sign-off, update roadmap completion status, or complete STEP-08. The required sequence remains implementation, Tech Lead review and Moderator acceptance, QA, Product Owner review of About/reference copy and research references, then a separately requested Moderator final gate.

### A-063 - STEP-08 Tech Lead Review Acceptance

- **Status:** Accepted - Pass for QA
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Role accepted:** Tech Lead
- **Gate:** Tech Lead implementation review acceptance before QA
- **Step:** `mod-w/step-08.md`
- **Tech Lead verdict:** Pass for QA; no Must Fix or Could Fix Later findings
- **Next authorized action:** QA may begin independent STEP-08 review against the accepted scope and evidence below.

#### Accepted Artifacts And Evidence

- A-060 STEP-08 Step approval
- A-062 STEP-08 Development Team implementation-plan approval
- `mod-w/step-08.md`
- `mod-w/step-08-implementation-plan.md`
- `review.md` - Tech Lead Review - STEP-08, verdict "Pass for QA"
- Implementation commits: `3095e05` (plan and review), `ae01eda` (references and current-state docs), and `64bd924` (IDP-Align E2E coverage)
- Tech Lead reports Node.js v26.0.0 verification: lint passed; build passed after outside-sandbox rerun for known Angular/esbuild `spawn EPERM`; unit/component tests passed (30 files, 500 tests); Playwright E2E passed (42 Chromium tests); `git diff --check` passed.

#### Acceptance Summary

The Moderator accepts the Tech Lead implementation review. The reviewed implementation is within A-062: Playwright starter coverage is replaced with local IDP-Align E2E tests served from the production build; PO-1 About links use safe external-link attributes; the R10 research/reference artifact records consulted sources and unverified candidates omitted; the README current-state update is bounded to the approved scope; `src/testing` helpers are confined to tests/E2E; and no connector work is included.

The review confirms preservation of CAV Level 1 boundaries, QA-028/QA-029 as accepted non-blocking notes, and categorical workflow behavior as spec-covered only. It reports no changes to fixtures, detector/domain logic, packages, backend, live access, user actions, or cross-stream reconciliation.

#### QA Handoff

QA is authorized to review STEP-08 against A-060, A-062, `mod-w/step-08.md`, `mod-w/step-08-implementation-plan.md`, `review.md`, commits `3095e05`, `ae01eda`, and `64bd924`, and the verification evidence reported in `review.md`.

QA should pay particular attention to:

- E2E runs against local IDP-Align and fully replaces the Playwright starter behavior.
- About PO-1 API references, their safe external-link attributes, and the scoped current-state copy.
- `mod-w/docs/research-references.md`: source relevance, consulted-source accuracy, and omission/reporting of unverifiable candidates.
- CAV Level 1 claim guardrails across UI, docs, README, and E2E, including factual `Instance state` handling.
- No fixture, detector, domain, package, backend, connector, live-access, user-action, Attribution, or cross-stream reconciliation changes.
- QA-028/QA-029 remain accepted non-blocking notes; categorical workflow behavior remains spec-covered only.
- Non-blocking verification note: a commit-range `git diff --check b389389..64bd924` flags trailing spaces on two Markdown metadata lines in `review.md`. They appear to be Markdown hard-break formatting; determine whether they are intentional or should be cleaned up. This does not block QA.

#### Gate Boundary

This entry accepts only the Tech Lead implementation review and authorizes QA to begin. It is not QA acceptance, Product Owner approval, roadmap completion, or the STEP-08 final Moderator gate. Product Owner review of the About/reference copy and `mod-w/docs/research-references.md` remains required after QA and before the final Moderator gate.

### A-064 - STEP-08 QA Acceptance And Finding Dispositions

- **Status:** Accepted with notes (Pass)
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Role accepted:** QA
- **Gate:** QA acceptance before Product Owner review and Moderator final gate
- **Step:** `mod-w/step-08.md`
- **QA verdict:** Pass with notes; no blocking findings and no findings above Info
- **Next authorized action:** Product Owner review of the About/reference copy and `mod-w/docs/research-references.md`; after that, request the STEP-08 final Moderator gate.

#### Accepted Artifacts And Evidence

- `qa.md` - QA Review - STEP-08, verdict "Pass with notes"
- `review.md` - Tech Lead Review - STEP-08, verdict "Pass for QA", accepted under A-063
- `mod-w/step-08.md` and `mod-w/step-08-implementation-plan.md`
- A-060 STEP-08 Step approval, A-062 implementation-plan approval, and A-063 Tech Lead review acceptance
- Implementation commits `3095e05`, `ae01eda`, and `64bd924`; QA ran from `12f1903` and changed only `qa.md`
- QA reports Node.js v26.0.0 verification: lint and build passed; unit/component tests passed (30 files, 500 tests); local production-build Playwright E2E passed (42 Chromium tests); independent scratch probes confirmed the external-request, console-error, and uncaught-error guards fail as intended; all 13 cited research URLs were fetched and read.

#### Finding Dispositions

| Finding                         | Disposition                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-033                          | Accepted as Info. The two flagged `review.md` metadata lines use the repository's intentional two-space Markdown line-break convention; no cleanup required.                                                                                                                                                                                                                    |
| QA-034                          | Accepted as Info process/traceability note. Verified that `3095e05` contains the STEP-08 implementation review rather than a preserved Tech Lead plan-review artifact. A-062 records the plan approval and Tech Lead verdict before implementation commits; the missing standalone plan-review artifact does not change the accepted implementation result. No rework required. |
| QA-035                          | Accepted as Info test-design note. The E2E suite intentionally asserts the current fixed replay state `Completed`; synthetic controls test that `Failed` is allowed only as factual `Instance state` context. Any separately approved replay-data change that makes another state visible must update the expectation.                                                          |
| QA-036                          | Accepted as Info test-coverage note. The suite has no committed negative-control spec for the E2E guard, but QA's independent scratch probes confirmed external requests, console errors, and uncaught errors fail tests. No rework required for this gate.                                                                                                                     |
| QA-028 / QA-029                 | Remain accepted non-blocking carry-forward notes. QA's responsive probe confirms the chart table does not scroll horizontally at the tested widths, so the QA-029 condition still does not occur.                                                                                                                                                                               |
| Categorical workflow limitation | Preserved: categorical workflow behavior remains spec-covered only; no categorical fixtures or browser-visible changes were introduced.                                                                                                                                                                                                                                         |

#### Acceptance Summary

The Moderator accepts the STEP-08 QA review. All acceptance checks assessable by QA pass, including local IDP-Align E2E coverage, PO-1 links and safe attributes, R10 research documentation, CAV Level 1 guardrails, absence of unauthorized implementation scope, and lint/build/unit/E2E verification. Product Owner review is not a QA criterion and remains a required next gate.

#### Gate Boundary

This entry records QA acceptance only. It is not Product Owner approval, roadmap completion, STEP-08 completion, or the final Moderator gate. The Product Owner must review the About/reference copy and `mod-w/docs/research-references.md` before the Moderator conducts the final gate. No roadmap status is changed by this entry.

### A-065 - STEP-08 Product Owner Review

- **Status:** Approved for final Moderator gate
- **Date:** 2026-09-26
- **Product Owner:** Frank McGuire
- **Gate:** Product Owner review after QA and before final Moderator gate
- **Step:** `mod-w/step-08.md`
- **Next authorized action:** Moderator may conduct the STEP-08 final gate after reviewing A-060, A-062, A-063, A-064, and this Product Owner approval.

#### Reviewed Artifacts

- STEP-08 About/reference copy in `src/app/features/about/about.component.html`
- `mod-w/docs/research-references.md`
- `qa.md` - STEP-08 QA Review, Pass with notes
- `mod-w/step-08.md` and `mod-w/step-08-implementation-plan.md`

#### Product Owner Decision

The Product Owner confirms review of the About/reference copy and `mod-w/docs/research-references.md` and approves STEP-08 for the final Moderator gate. This approval covers the reviewer-facing current-state and public API reference copy and the research/reference artifact's source choices, relevance statements, claim limits, and disclosure that the original pre-build source list was not recorded.

The approval does not accept the final Moderator gate, mark STEP-08 complete, or authorize roadmap advancement. QA-028 and QA-029 remain accepted non-blocking notes, and categorical workflow behavior remains spec-covered only.

### A-066 - STEP-08 Final Moderator Gate

- **Status:** Approved with notes (Pass)
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Gate:** Final Moderator gate
- **Step:** `mod-w/step-08.md`
- **Next authorized action:** STEP-08 is complete. Roadmap advancement is authorized; no additional STEP-08 implementation is required by this gate.

#### Accepted Artifacts And Gate Evidence

- `mod-w/step-08.md` and `mod-w/step-08-implementation-plan.md`, approved under A-060 and A-062
- `review.md` - STEP-08 Tech Lead implementation review, Pass for QA, accepted under A-063
- `qa.md` - STEP-08 QA review, Pass with notes, accepted under A-064
- A-065 Product Owner review approving the About/reference copy and `mod-w/docs/research-references.md`
- Implementation commits `3095e05`, `ae01eda`, and `64bd924`
- QA verification under Node.js v26.0.0: lint and production build passed; unit/component tests passed (30 files, 500 tests); local production-build Playwright E2E passed (42 Chromium tests); all 13 cited research URLs were retrieved and read; independent scratch probes confirmed the E2E safety guards fail on external requests, console errors, and uncaught errors

#### Final Finding Dispositions

- No blocking findings remain. QA reports all 36 acceptance checks assessable by QA pass; Product Owner review, the 37th check, is satisfied by A-065.
- QA-033 is accepted as intentional Markdown hard-break whitespace; no cleanup is required.
- QA-034 is accepted as an informational traceability note: the plan approval predates the implementation commits, while the standalone Tech Lead plan-review artifact was not preserved in `review.md`. This does not change the reviewed implementation result or require rework.
- QA-035 is accepted: the current replay data renders `Instance state: Completed`; E2E assertions are intentionally tied to the current fixture, while synthetic controls test the allowed factual source-state context. Any separately approved data change must update those expectations.
- QA-036 is accepted: the E2E guard lacks committed negative-control tests, but QA independently verified failure behavior for external requests, console errors, and uncaught errors. No rework is required for this gate.
- QA-028 and QA-029 remain accepted non-blocking carry-forward notes. QA confirmed the analysis table does not scroll horizontally at tested widths.
- Categorical workflow behavior remains spec-covered only. No fixture/data changes or browser-visible categorical workflow cases were introduced.
- The implementation remains within A-060/A-062: CAV Level 1 only; no unauthorized fixture, domain/detector, package, backend, connector, live-access, user-action, Attribution, or cross-stream reconciliation changes.

#### Decision

STEP-08 passes the final Moderator gate and is complete. The approved R10/R11 documentation, E2E coverage, and CAV Level 1 claim-guardrail work meets the approved acceptance checks with the informational notes and limitations above. Roadmap advancement is authorized. This decision does not waive or reopen any later product or methodology work outside STEP-08.

### A-067 - STEP-08 Final Moderator Gate Reconfirmation

- **Status:** Reconfirmed - Pass with notes
- **Date:** 2026-09-26
- **Moderator:** Frank McGuire
- **Gate:** Final Moderator gate re-review
- **Step:** `mod-w/step-08.md`
- **Prior final-gate decision:** A-066
- **Next authorized action:** STEP-08 remains complete. No additional implementation or roadmap action is required.

#### Reconfirmation Basis

The Moderator re-reviewed the current gate record after the request to rerun the final gate. A-060 Step approval, A-062 implementation-plan approval, A-063 Tech Lead review acceptance, A-064 QA acceptance, and A-065 Product Owner approval are present. QA reports all 36 acceptance checks assessable by QA pass; Product Owner review is recorded for the remaining check. The reviewed implementation remains at commits `3095e05`, `ae01eda`, and `64bd924`; no subsequent application-code changes are reported in the current worktree.

The accepted informational findings remain QA-033 through QA-036. QA-028/QA-029 remain non-blocking carry-forward notes, and categorical workflow behavior remains spec-covered only. No blocking findings or unapproved scope are identified.

#### Decision

The Moderator reaffirms A-066: STEP-08 passes the final Moderator gate and remains complete. The roadmap already records STEP-08, R10, and R11 as complete under A-066 and requires no further status change. This reaffirmation does not waive any accepted conditions or authorize scope beyond STEP-08.

### A-068 - Post-Completion Public Repository Cleanup

- **Status:** Approved - Documentation/publication cleanup
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Product Owner:** Frank McGuire
- **Gate:** Post-completion documentation/publication cleanup outside a formal implementation Step
- **Next authorized action:** Commit the approved cleanup as a documentation/repository-publication change. New feature work must begin through a separately approved MOD-W Step.

#### Approved Scope

- Update `README.md` DocuWare disclaimer wording to include "sponsored by".
- Add Apache License 2.0 repository licensing via `LICENSE`, `package.json`, `package-lock.json`, and README license notice.
- Correct `mod-w/product.md` Angular version references from v21 to v22 to match the implemented and verified application stack.
- Remove the stale Angular version-conflict rationale from `mod-w/architecture.md`.
- Add the corresponding `mod-w/product.md` change-log note for the Angular version correction.

#### Approval Summary

The Moderator and Product Owner approve these changes as public-repository hygiene and post-completion documentation cleanup. The cleanup records the repository's public licensing posture, strengthens existing third-party affiliation disclaimers, and reconciles documentation with the already implemented Angular v22 stack.

This entry explicitly records that the changes occurred after STEP-08 completion and outside a formal feature implementation Step.

#### Conditions

- No runtime behavior, application feature, CAV capability, replay data, detector/domain logic, UI workflow, test scope, dependency version, or production integration change is authorized by this entry.
- The cleanup must not imply DocuWare affiliation, sponsorship, endorsement, private access, production readiness, or a DocuWare product defect/gap claim.
- New feature work after this cleanup must start with normal MOD-W planning, Step approval, implementation-plan approval, Tech Lead review, QA, and final Moderator gates as applicable.

### A-069 - Population-Specific Divergence Product Update Approval

- **Status:** Approved - Product/domain-language update
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Product Owner:** Frank McGuire
- **Gate:** Product Owner artifact update approval before Tech Lead step drafting
- **Next authorized action:** Tech Lead may draft a bounded implementation Step for Population-Specific Divergence through the normal MOD-W process. No implementation work is authorized until the Step and implementation plan receive separate Moderator approvals.

#### Approved Artifacts

- `mod-w/product.md`
- `mod-w/domain-language.md`

#### Approval Summary

The Moderator approves the Product Owner updates for Population-Specific Divergence.

The approved PRODUCT change treats the capability as a clarification and extension of existing document-stream CAV Level 1 scope rather than a new top-level requirement. R1/R2 now explicitly support producer/document-type document populations as meaningful Identity Slice patterns. `Supplier Invoice Population Divergence` is added as a named synthetic document replay scenario.

The approved domain-language change adds `Producer x Document Type` as an approved example Identity Slice pattern, with examples including `Supplier x Invoice`, `Customer x Timesheet`, and `Authority x Traffic Notice`. This is not a new mandatory domain primitive.

#### Conditions

- The existing accepted replay scenario must be preserved.
- The initial scenario is `Supplier Invoice Population Divergence`.
- Scenario data must remain synthetic and must not use actual DocuWare customer identities.
- The feature remains CAV Level 1 only and must not infer cause, correctness, failure, risk, business intent, or cross-stream causality.
- UI language may make population-specific behavior explicit through factual slice-level presentation, such as observed Identity Slice counts and individual slice states.
- The UI must not claim aggregate document-stream stability unless such stability is calculated and supported by the domain model.
- Formal MOD-W artifacts touched by this update must remain plain ASCII.
- New feature work must proceed through normal MOD-W planning, Step approval, implementation-plan approval, Tech Lead review, QA, and final Moderator gates.

### A-070 - Population-Specific Divergence Research Evidence Approval

- **Status:** Approved - Product Owner research-evidence update
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Product Owner:** Frank McGuire
- **Gate:** Product Owner research-reference update approval
- **Next authorized action:** Commit the approved research-reference update. Tech Lead may use the approved research evidence when drafting the bounded Population-Specific Divergence implementation Step through the normal MOD-W process.

#### Approved Artifacts

- `mod-w/docs/research-references.md`

#### Approval Summary

The Moderator approves the Product Owner's update adding external research evidence for Population-Specific Divergence.

The approved update records three published DocuWare customer case studies as research motivation for the generalized Identity Slice pattern `Producer x Document Type`:

- Giebeler-Feuerschutz supports `Supplier x Invoice`.
- Piening Personal supports `Customer x Timesheet`.
- Sport Auto Plus supports `Authority x Traffic Notice`.

These examples support the approved product framing from A-069 while preserving the claim boundary that the replay scenario remains synthetic.

#### Conditions

- The cited case studies are research evidence only and are not product requirements.
- IDP-Align must not reproduce customer data from the cited case studies.
- IDP-Align must not claim that any cited customer experienced the sustained Divergence simulated by IDP-Align.
- The initial `Supplier Invoice Population Divergence` replay scenario remains entirely synthetic.
- This approval does not authorize implementation work, fixture changes, UI changes, detector/domain logic changes, or any CAV claim beyond Level 1.
- New feature work must proceed through normal MOD-W planning, Step approval, implementation-plan approval, Tech Lead review, QA, and final Moderator gates.

### A-071 - STEP-09 Tech Lead Step Draft Approval

- **Status:** Approved - Step draft for Development Team briefing and implementation planning only
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Role approved:** Tech Lead
- **Gate:** Step approval before Development Team briefing
- **Step:** `mod-w/step-09.md`
- **Next authorized action:** Development Team may be briefed on STEP-09 and may prepare an implementation plan. No STEP-09 code, fixture, test, or documentation implementation is authorized until the Moderator separately approves the Development Team implementation plan.

#### Approved Artifacts

- `mod-w/step-09.md`
- `mod-w/roadmap.md` STEP-09 draft entry and coverage notes

#### Approval Summary

The Moderator approves the Tech Lead's bounded STEP-09 draft for Population-Specific Divergence.

STEP-09 is approved as the next active implementation Step for Development Team briefing and implementation planning only:

**Population-Specific Divergence Scenario**

Initial scenario:

**Supplier Invoice Population Divergence**

The Step is bounded to a synthetic, demo-worthy document replay scenario that uses multiple fictional `Supplier x Invoice` Identity Slices, preserves existing replay behavior, exercises existing CAV Level 1 detection, and surfaces one population-specific Divergence with reconstructable Evidence while peer populations do not surface the same Divergence.

#### Conditions

- Development Team must implement only the approved STEP-09 scope.
- Development Team must wait for Moderator approval of its implementation plan before writing code, changing fixtures, updating tests, or editing documentation.
- Scenario data must remain synthetic and must not use actual DocuWare customer identities or customer data.
- The feature remains CAV Level 1 only and must not infer cause, correctness, failure, risk, business intent, producer blame, remediation, Attribution, or cross-stream causality.
- UI language must not claim aggregate document-stream stability unless such stability is calculated and supported by the domain model.
- Existing accepted replay behavior must be preserved or explicitly accounted for in the approved implementation plan.
- `Producer x Document Type` remains an approved Identity Slice pattern, not a new mandatory primitive.
- Tech Lead review is required before QA acceptance.

### A-072 - STEP-09 Development Team Implementation Plan Approval

- **Status:** Approved with conditions - Development Team implementation plan
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Role approved:** Development Team
- **Gate:** Implementation-plan approval before code, fixture, test, or documentation changes
- **Step:** `mod-w/step-09.md`
- **Next authorized action:** Development Team may implement STEP-09 only according to the approved implementation plan and conditions below, then hand off for Tech Lead review.

#### Approved Plan

Development Team implementation plan for STEP-09, as submitted in the plan-only handoff:

1. Use Option A: extend the accepted document replay scenario with additional peer supplier invoice populations while preserving the existing Alpha Office Supplies amount Divergence.
2. Add new fictional Supplier x Invoice peers at the end of the document fixture so existing record IDs and accepted Alpha Evidence remain unchanged.
3. Keep the current shared reference window and Aug-Sep 2026 weekly cadence; do not force literal Apr/May/Jun dates.
4. Add population summary and Identity Slice state presentation through the dashboard facade and presentational UI only.
5. Keep the detector, thresholds, reference-window semantics, baseline semantics, dimensions, mappers, About component, and README unchanged unless a condition below states otherwise.
6. Add or update focused fixture, repository, domain/replay detection, facade/component, guardrail, and E2E coverage for the scenario.
7. Verify with lint, build, unit/component tests, and E2E under the approved Node.js version.

#### Approval Conditions

- Option A is approved; Option B is not approved.
- STEP-09 should produce exactly one surfaced document Divergence for the invoice population demo unless a blocker is returned to the Moderator before implementation proceeds further.
- The existing Alpha Office Supplies amount Divergence may remain the surfaced Divergence only if the implementation makes Population-Specific Divergence explicit by adding peer supplier invoice populations and factual population-summary UI.
- Scenario data must remain synthetic and must not use actual DocuWare customer identities or customer data.
- New supplier names must be fictional and must not use Giebeler-Feuerschutz, Piening Personal, Sport Auto Plus, or any real customer name.
- The slice-state list may appear in both streams only if it stays generic; the document stream remains the STEP-09 demo focus.
- No README change is approved for STEP-09.
- No About component customer case-study material is approved.
- The current Aug-Sep cadence is approved; literal Apr/May/Jun dates are not required and should not be introduced if doing so changes reference-window behavior.
- Product Owner review is required after QA and before the STEP-09 final Moderator gate.
- UI language must remain factual and must not claim aggregate document-stream stability unless such stability is calculated and supported by the domain model.
- Do not introduce cause, correctness, failure, risk, business intent, producer blame, remediation, Attribution, cross-stream causality, CAV Level 2+, or Declared Intention claims.
- Do not change detector algorithms, sustained-Divergence thresholds, reference-window semantics, baseline semantics, supported dimensions, mappers, workflow replay behavior, backend/proxy code, live access, package dependencies, or chart libraries unless separate Moderator approval is obtained first.
- Existing accepted replay behavior must be preserved or explicitly accounted for in the Development Team handoff and Tech Lead review.
- Tech Lead review is required before QA begins.

### A-073 - STEP-09 Tech Lead Review Acceptance For QA

- **Status:** Accepted with conditions - QA may begin
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Role accepted:** Tech Lead
- **Gate:** Tech Lead implementation review acceptance before QA
- **Step:** `mod-w/step-09.md`
- **Tech Lead verdict:** Hold for Moderator decision before QA; Moderator accepts the implementation package for QA review with the E2E finding disposition below.
- **Next authorized action:** Commit the accepted STEP-09 implementation package and Tech Lead review. QA may begin independent STEP-09 review after this commit. QA must not treat STEP-09 as complete; final gate remains separate.

#### Accepted Artifacts And Evidence

- `mod-w/step-09.md`
- A-071 STEP-09 Step approval
- A-072 STEP-09 Development Team implementation-plan approval
- `review.md` - Tech Lead Review - STEP-09
- Current STEP-09 implementation package in the working tree, including document replay fixture additions, population summary and Identity Slice state UI, focused unit/component/E2E tests, and related test updates
- Development Team reported verification under Node.js v26.0.0:
  - lint passed
  - build passed
  - unit/component tests passed: 33 files, 541 tests
  - E2E reported 44 passed and 2 failed
- Tech Lead spot check: `git diff --check` passed

#### Acceptance Summary

The Moderator accepts the Tech Lead review and the STEP-09 implementation package for QA review. The implementation is within A-072 Option A: it preserves the existing Alpha Office Supplies amount Divergence, appends fictional synthetic supplier invoice peer populations, keeps the existing reference-window and detector semantics, adds factual population-summary and Identity Slice state presentation, and does not change README, About, roadmap completion status, detector code, thresholds, dimensions, workflow replay behavior, backend/proxy code, dependencies, or chart libraries.

The implementation remains CAV Level 1 only and does not authorize cause, correctness, failure, risk, business intent, producer blame, remediation, Attribution, cross-stream causality, aggregate-stability, CAV Level 2+, or Declared Intention claims.

#### E2E Finding Disposition

The Moderator accepts TL-STEP09-001 as a QA-review condition rather than a blocker to starting QA.

The reported E2E failures are recorded as pre-existing or non-STEP-09 candidates for QA verification:

- `about.spec.ts:22` expects 3 external links but finds 5 after earlier About-page link changes.
- `documentation.spec.ts:89` flags the word "official" in the Sport Auto Plus research-reference row as an endorsement-pattern match.

QA must independently verify whether these failures are outside STEP-09 scope and recommend disposition. This acceptance does not waive the final STEP-09 quality gate. The final Moderator gate must separately decide whether the E2E failures require rework, a separate cleanup approval, or explicit acceptance.

#### QA Handoff

QA is authorized to review STEP-09 against A-071, A-072, `mod-w/step-09.md`, `review.md`, the Development Team handoff, and the committed implementation package.

QA should pay particular attention to:

- exactly one surfaced document Divergence;
- five fictional Supplier x Invoice Identity Slices;
- no real customer names or customer data in replay fixtures;
- preservation of existing Alpha Evidence IDs and accepted replay behavior;
- population-summary and Identity Slice state wording;
- Evidence Trace and Divergence Analysis for Alpha;
- peer supplier filters showing no Divergence;
- absence of unsupported aggregate-stability, CAV Level 2+, Attribution, business judgment, severity/risk, alert/anomaly, root-cause, and case-study customer claims;
- preservation of workflow behavior;
- independent disposition of the two reported E2E failures.

#### Gate Boundary

This entry accepts the Tech Lead review and authorizes QA to begin. It is not QA acceptance, Product Owner review, roadmap completion, STEP-09 completion, or the final Moderator gate. Product Owner review remains required after QA and before the STEP-09 final Moderator gate under A-072.

### A-074 - QA-STEP09-001 Narrow E2E Cleanup Approval

- **Status:** Approved - Narrow cleanup before STEP-09 final gate
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Product Owner:** Frank McGuire
- **Role approved:** Development Team
- **Gate:** Cleanup approval after QA blocker and Tech Lead disposition
- **Finding:** `QA-STEP09-001`
- **Next authorized action:** Development Team may perform only the narrow E2E cleanup described below, then hand off for Tech Lead re-review. QA must re-run the E2E gate after Tech Lead re-review.

#### Approved Scope

The Moderator approves the Tech Lead's `review.md` section "QA Blocker Disposition - QA-STEP09-001" as the cleanup boundary.

Approved cleanup goal:

- Make `npm run test:e2e` pass cleanly, expected 46/46 tests, without changing STEP-09 product behavior.

Approved files:

- `e2e/about.spec.ts`
- `e2e/documentation.spec.ts`
- `mod-w/docs/research-references.md`, only for the Sport Auto Plus relevance-cell wording described below

#### Product Owner Approval For A-070 Content

The Product Owner approves narrowly rewording the A-070 Sport Auto Plus relevance cell in `mod-w/docs/research-references.md` to avoid the false-positive word "official" while preserving the factual research meaning, the authority/source-specific document-population support, and the synthetic-data/customer-claim boundary.

Preferred wording direction:

- "authority-issued notices for minor traffic offences..."
- or "traffic-offence notices and other violation documents..."

The limits cell and the A-070 claim boundary must remain intact.

#### Conditions

- Do not change STEP-09 implementation behavior.
- Do not change document replay fixtures, dashboard behavior, identity-slice state behavior, detector/domain logic, replay mappers/repositories, workflow replay behavior, About component files, README, roadmap, `mod-w/step-09.md`, `qa.md`, or the Moderator Register.
- For `e2e/about.spec.ts`, update the stale external-link expectation while preserving assertions that every external link has `target="_blank"` and `rel` containing both `noopener` and `noreferrer`.
- Do not remove safe-link coverage.
- Do not narrow `CLAIM_GUARDRAIL_PATTERNS` unless a separate Moderator approval is obtained first.
- Run verification under Node.js v26.0.0:
  - `npm run lint`
  - `npm run build`
  - `npm test -- --watch=false`
  - `npm run test:e2e`
- Development Team handoff must list changed files, explain the exact fix for each E2E failure, confirm that no STEP-09 implementation file changed, and provide verification output.

#### Gate Boundary

This entry authorizes only the QA-STEP09-001 cleanup. It is not QA acceptance, Product Owner review of STEP-09, roadmap completion, STEP-09 completion, or the final Moderator gate.

### A-075 - QA-STEP09-001 Cleanup Tech Lead Re-Review Acceptance

- **Status:** Accepted - QA E2E re-run authorized
- **Date:** 2026-09-27
- **Moderator:** Frank McGuire
- **Role accepted:** Tech Lead
- **Gate:** Cleanup Tech Lead re-review acceptance before QA re-run
- **Finding:** `QA-STEP09-001`
- **Next authorized action:** Commit the accepted narrow cleanup and Tech Lead re-review. QA may re-run the E2E gate for QA-STEP09-001 after this commit.

#### Accepted Artifacts And Evidence

- `review.md` section "Re-Review - QA-STEP09-001 Narrow E2E Cleanup (A-074)"
- `e2e/about.spec.ts`
- `mod-w/docs/research-references.md`

#### Acceptance Summary

The Moderator accepts the Tech Lead's re-review of the A-074 cleanup.

The cleanup is within approved scope:

- `e2e/about.spec.ts` updates the stale external-link count from 3 to 5 while preserving the safe-link assertions for every external link.
- `mod-w/docs/research-references.md` rewords the Sport Auto Plus relevance cell from "official notices" to "authority-issued notices" while preserving the A-070 research meaning and claim boundary.
- `CLAIM_GUARDRAIL_PATTERNS` was not narrowed.
- No STEP-09 implementation behavior was changed.

Tech Lead reports verification under Node.js v26.0.0:

- lint passed
- build passed after outside-sandbox rerun for known Angular/esbuild `spawn EPERM`
- unit/component tests passed: 33 files, 541 tests
- E2E passed after outside-sandbox rerun: 46 tests

#### Finding Disposition

- TL-STEP09-CLEANUP-001 is accepted as Info. The About external-link count remains fixed and may need future updates if About links intentionally change. This does not block the QA E2E re-run.

#### QA Handoff

QA is authorized to re-review QA-STEP09-001 against A-074, this entry, `review.md`, and the committed cleanup package.

QA should verify:

- `npm run test:e2e` passes with 46/46 tests;
- About safe-link assertions still cover every external link;
- the documentation guardrail no longer flags the Sport Auto Plus relevance row;
- no STEP-09 implementation behavior changed.

#### Gate Boundary

This entry accepts only the Tech Lead re-review of the QA-STEP09-001 cleanup and authorizes QA re-review. It is not QA acceptance, Product Owner review, roadmap completion, STEP-09 completion, or the final Moderator gate.

MOD-W v5.0.1
