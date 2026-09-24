# Tech Lead Review - STEP-01

**Project:** IDP-Align  
**Step:** STEP-01 - Dashboard Foundation, Stream Shell, And About View  
**Review date:** 2026-09-24  
**Reviewer:** Codex, Tech Lead  
**Implementation package reviewed:** Commit `4cafa70254f661c9737a05517caee66d55110c76` plus current uncommitted working-tree changes  
**Verdict:** Changes Requested

---

## Gate Verification

`mod-w/validation/moderator-register.md` contains the required Step and implementation-plan approvals:

- A-002 approves STEP-01 for Development Team briefing and implementation planning.
- A-003 approves the STEP-01 Development Team implementation plan and authorizes code changes.

The implementation is therefore authorized Development Team work. A-004 additionally approves the Product Owner's DocuWare-specific v1 research/demo direction and overrides the earlier neutral-naming guardrail. The implementation remains unaccepted until this review's findings are resolved and Tech Lead review acceptance is recorded in the Moderator Register.

QA may not proceed until a future Moderator Register entry records Tech Lead review acceptance for STEP-01 and identifies `review.md` as evidence.

---

## Findings

### F-000 - Resolved Process Finding - Product Owner change request required STEP-01 naming guardrail update

**Files / artifacts:**

- `mod-w/product.md`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- `mod-w/step-01.md`
- `mod-w/validation/moderator-register.md`
- `src/app/features/about/about.component.html`
- `src/app/features/about/about.component.spec.ts`
- `src/app/shared/ui/app-shell/app-shell.component.html`

**Evidence:**

During review, the Product Owner requested that IDP-Align v1 surface itself specifically as a research and demo project for an upcoming DocuWare interview on September 28, 2026. The requested direction says not to hide DocuWare references and to explain that DocuWare is the domain being explored and that the DocuWare API is part of the research/demo intent.

That request conflicted with the previously approved STEP-01 guardrail, which said the About view, app navigation, new user-facing explanatory copy, test fixture labels, and code comments introduced by STEP-01 must not mention the target organization or company-specific product/API names. The same neutral-language rule was also present in Architecture D12/D13 and `domain-language.md` enforcement rules.

**Impact:**

The current implementation was correctly written toward the previously approved neutral framing, but it no longer satisfies the updated Product Owner direction. Without a source-of-truth update, the Development Team would have been asked to violate the active Step to satisfy the newer Product Owner request.

**Resolution:**

Resolved by source-of-truth updates and Moderator approval A-004:

- `mod-w/product.md` defines v1 as a DocuWare-specific interview research/demo project.
- `mod-w/architecture.md` D12 and relevant guardrails allow bounded DocuWare references in the About/project-context surface.
- `mod-w/domain-language.md` distinguishes allowed DocuWare research framing from prohibited overclaiming, endorsement, confidential-data claims, or interview-private details.
- `mod-w/language-matrix.md` maps CAV, DocuWare, Angular, and demo language.
- `mod-w/step-01.md` acceptance checks and out-of-scope language now expect bounded DocuWare naming and DocuWare API research intent.
- `mod-w/validation/moderator-register.md` A-004 records the Moderator/Product Owner approval and override.

The Development Team should revise the Step-01 implementation against the updated scope. The revised copy should be precise and professional: it may say the project is a personal research/demo built to understand DocuWare's document-processing and workflow domains for the September 28, 2026 interview, but it must not imply DocuWare endorsement, access to private systems, production readiness, or confidential interview content.

---

### F-001 - Blocking - About tests contradict required About copy and will fail once the test runner can execute

**Files:**

- `src/app/features/about/about.component.spec.ts`
- `src/app/features/about/about.component.html`

**Evidence:**

The About page correctly includes scope-boundary language required by STEP-01 and Architecture D9/D12, including statements that the app does not implement Levels 2-6, does not provide root-cause attribution, and does not claim formal cross-stream alignment analysis.

However, the spec asserts that visible copy must not contain `Level 2`, `Level 3`, `Attribution`, or `root-cause`. That conflicts with the approved requirement to explain CAV Level 1 scope boundaries and future-level non-goals.

The spec also forbids `Enterprise`, while the About copy uses neutral phrases such as "enterprise document processing and workflow systems" and "enterprise platform API calls." Under the updated STEP-01 scope, tests should focus on prohibited overclaims and disallowed implications, not generic domain vocabulary.

**Impact:**

`npm test` cannot currently run because of the local Node version, but when the Angular test runner is available these assertions should fail against the current template. This blocks Tech Lead acceptance because STEP-01 acceptance requires unit tests to pass or a documented test-run limitation; here the limitation is documented, but the test code itself is also inconsistent with the approved copy.

**Required change:**

Revise the negative assertions so they forbid false implementation claims and disallowed implications, not legitimate non-goal language. Update these tests to require bounded DocuWare research/demo framing while still rejecting endorsement, private-system access, confidential interview details, production-readiness claims, DocuWare defect/gap claims, or implemented Level 2+ / Attribution claims.

---

### F-002 - Major - Dashboard placeholder data implies implemented Divergence counts and vendor filters before replay/domain logic exists

**Files:**

- `src/app/features/dashboard/dashboard.component.html`
- `src/app/features/dashboard/dashboard.component.spec.ts`

**Evidence:**

The dashboard renders hard-coded KPI counts for total, ongoing, and resolved Divergences, and the tests lock those values in as expected behavior. The filter options include vendor-like names. STEP-01 is allowed to establish placeholder summary, filter, list, and detail regions, but explicitly does not implement replay ingestion, Observed Baseline calculation, sustained Divergence detection, or fixture modeling beyond minimal placeholder stream metadata.

**Impact:**

The screen can be read as showing real computed findings before the supporting CAV domain model, replay adapters, and sustained Divergence logic exist. This weakens the Level 1 claim guardrail and may create test debt by pinning arbitrary placeholder counts.

**Required change:**

Make the STEP-01 dashboard visibly foundational rather than data-bearing. Prefer neutral placeholders such as em dashes, "Pending replay data," or zero-state copy until STEP-02/STEP-03 introduce data and logic. Tests should assert the presence of KPI regions and stream switching, not arbitrary counts that imply implemented findings.

---

### F-003 - Minor - Stream tabs should expose active state semantically, not only through CSS

**Files:**

- `src/app/features/dashboard/dashboard.component.html`

**Evidence:**

The stream controls are native buttons and are therefore keyboard reachable, but active state is currently conveyed only through the `active` class. STEP-01 asks for accessible button/tab behavior.

**Impact:**

Assistive technology users may not receive a clear state announcement for the active stream.

**Required change:**

Add an appropriate semantic state, such as `aria-pressed` for toggle buttons or a full `role="tablist"` / `role="tab"` / `aria-selected` pattern.

---

## Positive Review Notes

- The Angular starter content has been removed from the rendered app shell.
- The default route redirects to the dashboard, with a routed About page available from top navigation.
- The uncommitted conversion to separate `.html`, `.scss`, and `.ts` component files is consistent with the Moderator's stated Angular preference and improves maintainability.
- The app uses standalone Angular components and signal-backed stream state.
- The About copy substantially covers project intent, dashboard UI, architecture, MOD-W workflow, CAV Level 1 scope, scope boundaries, and the MOD-W assessment angle.
- The reference implementation disposition is respected at a high level: layout intent is adopted with Angular components, templates, and SCSS rather than direct prototype code.

---

## Verification

Commands run:

- `npm run build` - Passed.
- `npm test -- --watch=false` - Blocked before Angular tests could run because the environment has Node.js `v24.13.0`; Angular CLI requires at least `v24.15.0` on the v24 line.

Because tests did not execute and F-001 indicates likely test failures once the Node version is corrected, STEP-01 cannot receive Tech Lead acceptance yet.

---

## Moderator Note - Future Angular File-Organization Preferences

The preference for separate Angular template, style, and code files should be captured before Development Team implementation, preferably as an explicit Moderator condition during Architecture Definition or Step approval.

Recommended MOD-W handling:

- Moderator states the preference during Architecture Definition review or Step approval.
- Tech Lead records it in the relevant architecture conventions or active `step-xx.md` constraints.
- Development Team implementation plan lists the affected file organization, for example `.component.ts`, `.component.html`, and `.component.scss` rather than inline templates/styles.
- Tech Lead review verifies compliance as a maintainability and convention check.

This is ultimately a Moderator preference, but the Tech Lead is responsible for converting it into an implementation constraint once the Moderator states it.

---

## Review Outcome

STEP-01 is not approved for QA. F-000 is resolved by A-004 and the source-of-truth updates, so the Development Team may revise the existing Step-01 implementation in place. Resolve F-001 and F-002 before requesting another Tech Lead review. F-003 may be resolved in the same pass and should not be deferred unless the Moderator explicitly accepts it as a later accessibility cleanup.

Required approval record after fixes:

- A Moderator Register entry for STEP-01 Tech Lead review acceptance, citing the updated `review.md`, build evidence, test evidence, and any remaining accepted conditions.

MOD-W v5.0.1
