# STEP-10 - Architecture Page

---

## Goal

Add a permanent routed Architecture page that explains how IDP-Align works without relying on the interview-framed About page.

The page must explain the principal data flow, CAV Level 1 boundaries, Identity Slice behavior, population-specific Divergence, implemented versus synthetic capability, repository/adapter separation, public research provenance, and future research directions. It is a product surface, not exhaustive developer documentation.

This Step must not change detection behavior, Observed Baseline semantics, sustained-Divergence criteria, fixtures, Dashboard behavior, or application architecture beyond adding the routed page and navigation entry.

---

## Related Requirements

- R14 - Permanent routed Architecture view reachable from top navigation, with no interview, interviewer, or employer-directed framing.
- R9 - Canonical CAV v1.0 vocabulary.
- R10 - Public research provenance remains bounded and documented.
- R11 - Automated coverage for routed UI behavior and guardrails.
- R13 - Existing About / Project Context view obligations remain intact.

---

## Related Architecture Decisions

- D4 - Mock/Replay First Data Boundary.
- D9 - CAV Level Claim Guardrails.
- D10 - Research Documentation Stays Separate.
- D12 - Routed About View.
- D13 - Repository And Adapter Boundary.
- D14 - Routed Architecture Product Surface.

---

## Related Design IDs

The existing `design-spec.md` has no Architecture-page-specific Design IDs. STEP-10 should inherit the About page's approved visual language and accessibility baseline unless the Moderator requests Designer review.

| Design ID             | Design element         | STEP-10 relevance                                                                                                               |
| --------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| DS-001                | Dashboard home layout  | Navigation must preserve the approved app shell and route structure.                                                            |
| Design Spec section 1 | Visual identity        | Architecture page should reuse About page typography, spacing, dark surfaces, borders, and restrained tone.                     |
| Design Spec section 2 | Accessibility baseline | Architecture page must use semantic headings, lists, links, keyboard-reachable navigation, visible focus, and WCAG AA contrast. |

### Designer Review

Tech Lead recommendation: Designer review is not required before implementation if the Development Team reuses the About page's visual language and does not introduce a new visual system. If the Development Team proposes novel diagrams, interactions, or layout patterns beyond accessible semantic markup, route that proposal to the Moderator for Designer review before implementation.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`
**Draft authorization:** A-078 admits R14 and authorizes Tech Lead drafting.
**Step approval entry:** A-079.
**Implementation-plan approval entry:** A-080.
**Status:** Approved for Development Team implementation under the plan and conditions in A-080.

Development Team may implement only `mod-w/step-10-implementation-plan.md` as approved under A-080. A-079 allows STEP-10 implementation after plan approval before the STEP-09 final gate; STEP-09's Product Owner review and final Moderator gate remain pending and are not waived or completed by that override.

---

## Scope

- Add a lazy routed Architecture page at `/architecture`.
- Add a top-navigation link so primary navigation reads: Dashboard | About | Architecture.
- Implement the page as a standalone Angular component using signals where local component state or derived display data is needed.
- Use separate `.ts`, `.html`, and `.scss` files for the component.
- Reuse the About page's visual language: centered article/page container, restrained dark surfaces, clear section hierarchy, boundary callouts, and safe external links.
- Use accessible semantic markup for diagrams and flows, such as ordered lists, nested sections, definition lists, tables with captions, or labeled text flow blocks. Do not use images, SVG-only diagrams, canvas, Mermaid, CDN libraries, or screenshot assets for diagrams.
- Use `mod-w/docs/architecture-page.txt` as the Product Owner-reviewed content baseline, with the PO corrections in A-078 and this Step applied.
- If that copy conflicts with R14, A-078, `product.md`, `domain-language.md`, `architecture.md`, `research-references.md`, STEP-09 behavior, or this Step, the Development Team implementation plan must identify the conflict and use the authoritative MOD-W source rather than copying the baseline text literally.
- Include the required content areas:
  - principal data flow;
  - separation of source data, mapping, CAV domain, and presentation;
  - CAV Level 1 claim boundaries;
  - Identity Slices with independent Observed Baselines;
  - population-specific Divergence from STEP-09;
  - Surfaced Divergence vs. No surfaced Divergence vs. No Observed Baseline;
  - implemented versus synthetic capability;
  - repository/adapter boundary and live-source extension point;
  - relationship among canonical CAV, IDP-Align, and observation sources;
  - public research provenance for the `Producer x Document Type` Identity Slice pattern;
  - clearly labeled future research.
- Apply the required Product Owner copy corrections:
  - Sport Auto Plus wording must stay within `research-references.md` section 4a: "Variation in authority-specific traffic-notice document structures motivates Authority x Traffic Notice populations."
  - Do not list "Production DocuWare integration" as not implemented.
  - Express live sources only through the source-independent extension-point section and state that this is not a claim that live integration currently exists.
  - Remove any interviewer, employer-directed, or interview-date framing.
- Include external links for public research cases only as research provenance. Every external link must use `target="_blank"` and `rel="noopener noreferrer"`.
- Decide the About page relationship:
  - Recommended: shorten the existing About Architecture section slightly and link to `/architecture` for the permanent technical explanation, while preserving all R13 obligations.
  - Acceptable alternative: leave About unchanged and add the Architecture route independently, if the implementation plan justifies keeping the current About content intact.
- Render synthetic supplier names and Identity Slice states to match STEP-09 fixtures:
  - `Alpha Office Supplies (synthetic) · Invoice` has surfaced Divergence.
  - `Beta Freight Services (synthetic) · Invoice`, `Delta Packaging Supplies (synthetic) · Invoice`, `Epsilon Print Services (synthetic) · Invoice`, and `Gamma Facilities Care (synthetic) · Invoice` have No surfaced Divergence.
  - Credit note Identity Slices may be mentioned only if the page also clearly distinguishes No Observed Baseline from No surfaced Divergence.
- Static versus derived supplier/slice-state content:
  - Recommendation: render this Architecture page copy statically because R14 is explanatory content, not a second Dashboard view, and because the Step must not alter Dashboard/domain behavior.
  - If static, add tests that lock the copy to the current STEP-09 fixture names and states so fixture drift is caught.
  - If derived, the implementation plan must prove the page reads through existing facade/repository/domain boundaries without importing fixture files directly into presentation code and without adding detection side effects.

---

## Out Of Scope

- Any change to Divergence detection, thresholds, sustained-Divergence criteria, reference-window behavior, Observed Baseline semantics, dimensions, mappers, fixtures, repository contracts, Dashboard behavior, or workflow behavior.
- Live DocuWare integration, OAuth, credentials, backend/proxy implementation, new adapters, or calls to external systems.
- Claiming current live integration, production readiness, or dependency on DocuWare for CAV or IDP-Align core architecture.
- CAV Level 2+, Declared Intention / Intent, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution as implemented behavior.
- Root-cause, causality, correctness, failure, risk, business significance, producer blame, remediation, or business-intent judgment.
- Treating `Producer x Document Type` as a CAV primitive or required schema field.
- Presenting case studies as customers, datasets, product requirements, or evidence of IDP-Align's synthetic Divergences.
- Adding file maps, exhaustive developer documentation, test listings, governance process documentation, or MOD-W process detail beyond what the page needs to explain product architecture.
- Broad visual redesign or new design system.
- Replacing About's R13 project-context obligations.

---

## Inputs

- `mod-w/product.md`, especially R13, R14, the CAV Scope, Scenario 1a, and v1.4 change log.
- `mod-w/validation/moderator-register.md`, especially A-078 and the STEP-09 gate status.
- `mod-w/domain-language.md`, especially canonical CAV terms, reserved terms, `Producer x Document Type`, and enforcement rules.
- `mod-w/architecture.md`, especially D4, D9, D10, D12, D13, and D14.
- `mod-w/docs/architecture-page.txt` as the Product Owner-reviewed copy baseline, subject to the corrections and guardrails in this Step.
- `mod-w/docs/research-references.md`, especially section 4a.
- `mod-w/design/design-spec.md`, especially visual identity and accessibility baseline.
- `mod-w/step-09.md` and accepted STEP-09 implementation evidence.
- `src/app/features/about/` for visual language and existing architecture summary.
- `src/app/shared/ui/app-shell/` for top navigation.
- `src/app/shared/ui/identity-slice-states/` for canonical slice-state wording.
- `src/app/features/dashboard/identity-slice-states.ts` for how slice states are derived.
- `src/app/data/replay/fixtures/document-replay.fixture.ts` for current synthetic supplier names if static page copy is used.
- Existing route, component, app-shell, guardrail, and E2E tests.

### Source Conflict Resolution

- A-078 authorized drafting; A-079 approved STEP-10 for briefing/planning, and A-080 approves the implementation plan with conditions. Implementation is limited to the A-080 plan.
- R14 is a new product requirement, not an extension of R13.
- R13 keeps About interview/project-context obligations; R14 must be permanent and must not contain interview, interviewer, employer-directed, or interview-date framing.
- Product and domain language supersede any copied content that uses forbidden terms or implies Level 2+, Attribution, causality, correctness, failure, risk, producer blame, remediation, or business significance.
- `research-references.md` section 4a controls the case-study provenance wording and limits.
- STEP-09 final Moderator gate was deferred under A-077 at the time R14 was admitted. Unless the Moderator records an override, STEP-10 implementation should not begin before STEP-09 final gate is recorded.

---

## Files Likely Touched

- `src/app/app.routes.ts` - add lazy `/architecture` route.
- `src/app/shared/ui/app-shell/app-shell.component.html` - add Architecture nav link.
- `src/app/shared/ui/app-shell/app-shell.component.spec.ts` - nav link and `aria-current` coverage.
- `src/app/features/architecture/architecture.component.ts` - new standalone component.
- `src/app/features/architecture/architecture.component.html` - new page template.
- `src/app/features/architecture/architecture.component.scss` - page styling aligned with About.
- `src/app/features/architecture/architecture.component.spec.ts` - content, guardrail, link, and semantic-markup tests.
- `src/app/features/about/about.component.html` and `.spec.ts` - only if the implementation plan chooses to shorten About's Architecture section and link to `/architecture`.
- `e2e/*.spec.ts` - route, nav, a11y, safe-link, and guardrail coverage.

Do not modify replay fixtures, detector/domain logic, repositories, dashboard components, shared Divergence components, README, `mod-w/docs/research-references.md`, or MOD-W approval artifacts unless separately approved.

---

## Expected Artifacts

- New routed Architecture page.
- Updated top navigation.
- Optional bounded About section update that links to the Architecture page while preserving R13.
- Focused unit/component tests.
- Focused E2E tests.
- Development Team handoff with changed files, copy-source disposition, static-versus-derived decision, About relationship decision, and verification output.
- `review.md` after Tech Lead implementation review.
- `qa.md` after QA review.

---

## Reference Implementation

**Location:** No prototype implementation is authoritative for this feature. The About page is the visual reference. The accepted STEP-09 implementation is the behavioral reference for synthetic supplier names, population summary wording, and Identity Slice state meanings.

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Direction

- Reuse About's page-level visual patterns.
- Reuse app-shell navigation conventions.
- Reuse existing canonical UI wording where the page explains Identity Slice states:
  - Surfaced Divergence.
  - No surfaced Divergence.
  - No Observed Baseline.
- Keep diagrams semantic and accessible.
- Treat public case studies as provenance only.

### Rejected Assumptions

- Do not copy prototype code or introduce a diagramming dependency.
- Do not turn the Architecture page into a developer file map.
- Do not make DocuWare, live access, or production integration part of the core architecture claim.
- Do not treat STEP-09 supplier state content as a second source of truth unless a static-copy drift test or safe derived-data approach is included.

---

## Acceptance Checks

- [x] `mod-w/validation/moderator-register.md` contains the STEP-10 Step approval entry before Development Team briefing (A-079).
- [x] Moderator implementation-plan approval A-080 is recorded before STEP-10 code, test, or documentation implementation.
- [x] STEP-09 final gate sequencing is explicitly overridden for STEP-10 only by A-079; STEP-09's own final gate remains pending.
- [ ] The app exposes a lazy `/architecture` route implemented by a standalone Angular component.
- [ ] The Architecture component uses separate `.ts`, `.html`, and `.scss` files.
- [ ] Component-local state or derived display state uses Angular signals where needed.
- [ ] Primary navigation reads Dashboard | About | Architecture and uses existing active-link semantics.
- [ ] The page reuses About's visual language or has explicit Moderator-approved Designer review for any new visual pattern.
- [ ] The page contains semantic, accessible diagrams or flow explanations without images, canvas, SVG-only diagrams, Mermaid, CDN libraries, or external diagram dependencies.
- [ ] The page explains source data, mapping, CAV domain, and presentation as separate responsibilities.
- [ ] The page explains the repository/adapter boundary as source-independent and does not make DocuWare a dependency of CAV or IDP-Align's core architecture.
- [ ] The live-source extension point is described as future/source-independent and not as a claim that live integration currently exists.
- [ ] The page explains CAV Level 1 claim boundaries and does not claim Level 2+, Attribution, causality, correctness, failure, risk, business significance, producer blame, remediation, or business-intent judgment.
- [ ] The page explains Identity Slices with independent Observed Baselines.
- [ ] The page explains population-specific Divergence using the STEP-09 Supplier x Invoice scenario without changing fixtures or Dashboard behavior.
- [ ] The page distinguishes Surfaced Divergence, No surfaced Divergence, and No Observed Baseline.
- [ ] No surfaced Divergence is never described as normal, stable, healthy, correct, or aligned, and is never equated with No Observed Baseline.
- [ ] `Producer x Document Type` is presented as an IDP Identity Slice pattern, not as a CAV primitive.
- [ ] Public case studies are presented only as research provenance, not as customers, datasets, requirements, or evidence of synthetic Divergences.
- [ ] Sport Auto Plus wording stays within `research-references.md` section 4a: authority-specific traffic-notice document-structure variation motivates `Authority x Traffic Notice`.
- [ ] "Production DocuWare integration" is not listed as a not-implemented item.
- [ ] The page contains no interview, interviewer, employer-directed, or interview-date framing.
- [ ] Implemented versus synthetic capability is clearly labeled.
- [ ] Future research is clearly labeled as future, not implemented.
- [ ] External public research-case links use `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] Synthetic supplier names and slice states match the STEP-09 fixture behavior; if rendered statically, a component or E2E test catches drift from the fixture names/states.
- [ ] If the About Architecture section is shortened, About still satisfies R13 and links to `/architecture`.
- [ ] If About is left unchanged, R13 still passes and the Architecture page does not duplicate interview framing.
- [ ] Unit/component tests cover route component rendering, required sections, boundary copy, forbidden terms/claims, safe external links, semantic diagrams, and static-copy drift if applicable.
- [ ] E2E tests cover top-nav route access, direct `/architecture` route load, key sections, safe links, active navigation state, and basic accessibility landmarks/headings.
- [ ] Guardrail tests reject alert/anomaly/violation/breach/intent/delta as current-behavior CAV terms in Architecture page copy, allowing reserved-term mentions only when explicitly framed as future/not implemented.
- [ ] No app code outside approved STEP-10 scope changes.
- [ ] `npm run lint` passes under the project-approved Node.js version.
- [ ] `npm run build` passes under the project-approved Node.js version.
- [ ] `npm test -- --watch=false` passes under the project-approved Node.js version.
- [ ] `npm run test:e2e` passes under the project-approved Node.js version.
- [ ] Development Team handoff lists changed files, copy-source disposition, static-versus-derived decision, About relationship decision, intentionally unchanged boundaries, and verification output.
- [ ] Tech Lead review is completed in `review.md` and accepted by the Moderator before QA begins.
- [ ] QA review is completed in `qa.md` before final Moderator gate.

---

## Test Expectations

### Unit / Component

- Architecture component renders one `h1`, expected section headings, and no interview-date or employer-directed framing.
- Architecture component renders semantic flow/diagram markup with accessible labels or captions.
- Boundary-copy tests verify CAV Level 1 only, source-independent adapter boundary, implemented versus synthetic labels, future research labels, and no live-integration claim.
- Guardrail tests reject forbidden current-scope terms and overclaims.
- Safe-link tests verify all external links use `target="_blank"` and `rel` containing both `noopener` and `noreferrer`.
- Static-copy drift test, if static supplier/slice-state copy is used, verifies the rendered supplier names and states match the STEP-09 fixture-derived expectations.
- App shell tests verify the Architecture nav link, route target, and active-page semantics.
- About tests are updated only if About is intentionally shortened or linked.

### E2E

- Direct navigation to `/architecture` renders the Architecture page.
- Top navigation reaches Dashboard, About, and Architecture, with correct active state.
- Architecture page exposes the key content sections and boundary copy in the browser.
- Public research links open externally with safe-link attributes.
- Keyboard tab order reaches the Architecture nav link and page links.
- Basic accessibility checks verify landmarks, heading hierarchy, and absence of obvious focus traps.

### Build / Quality Gates

- `npm run lint`
- `npm run build`
- `npm test -- --watch=false`
- `npm run test:e2e`

Run gates under the project-approved Node.js version already used by recent accepted Steps.

---

## Plan

1. Moderator reviews and, if appropriate, approves this STEP-10 draft for Development Team briefing and implementation planning only.
2. Development Team verifies STEP-09 final-gate status or requests Moderator override before planning implementation timing.
3. Development Team obtains the approved Architecture-page copy or states a bounded reconstruction approach in the implementation plan.
4. Development Team proposes an implementation plan identifying content source, static-versus-derived slice-state decision, About relationship decision, files, tests, and verification commands.
5. Moderator approves the implementation plan before any code, test, or documentation implementation begins.
6. Development Team implements only the approved plan.
7. Development Team verifies lint, build, unit/component tests, and E2E.
8. Tech Lead reviews implementation in `review.md`.
9. Moderator accepts Tech Lead review before QA begins.
10. QA performs independent review in `qa.md`.
11. Moderator final gate determines STEP-10 completion.

---

## Moderator Decisions Needed

- Whether to approve STEP-10 as the active next implementation Step for Development Team briefing and implementation planning.
- Whether STEP-10 implementation must wait for STEP-09 final gate, or whether the Moderator records an explicit override.
- Whether About's existing Architecture section should be shortened to link to the new page or left unchanged.
- Whether Designer review is waived on the condition that the page inherits About patterns and uses semantic markup only.
- Whether Product Owner review is required after QA because STEP-10 adds a permanent public product surface with bounded research provenance.

---

## Change Notes

| Date       | Change                | Reason                                                                                   |
| ---------- | --------------------- | ---------------------------------------------------------------------------------------- |
| 2026-09-27 | Initial STEP-10 draft | Draft bounded implementation Step after R14 admission and A-078 Tech Lead authorization. |

---

## Review Notes

Tech Lead review must verify that the implementation is a routed explanatory product surface only and did not change domain behavior.

Review must pay special attention to:

- no interview framing on the Architecture page;
- no CAV Level 2+, Attribution, causality, correctness, failure, risk, business significance, producer blame, remediation, or business-intent claims;
- correct distinction among Surfaced Divergence, No surfaced Divergence, and No Observed Baseline;
- case studies as provenance only;
- source-independent adapter boundary;
- static supplier/slice-state copy cannot silently drift from STEP-09 fixtures;
- About still satisfies R13.

---

## QA Notes

QA should independently verify:

- rendered navigation and `/architecture` route;
- key required sections and boundary copy;
- safe external links;
- semantic diagram accessibility;
- forbidden-claim guardrails;
- STEP-09 supplier/slice-state consistency;
- About R13 preservation;
- lint, build, unit/component tests, and E2E pass under the project-approved Node.js version.

---

MOD-W v5.0.1
