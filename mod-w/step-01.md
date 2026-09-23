# STEP-01 - Dashboard Foundation, Stream Shell, And About View

---

## Goal

Replace the generated Angular starter screen with the production dashboard foundation for IDP-Align: app shell, dashboard route, routed About / Project Context view, design tokens, stream tabs, and reusable layout regions for summary, filters, divergence list, and detail.

This Step establishes structure and approved terminology only. It does not implement full replay ingestion, baseline calculation, sustained divergence detection, or Chart.js analysis.

---

## Related Requirements

- R6 - Angular signals-only dashboard presenting document and workflow streams as separate but consistently modeled Level 1 views.
- R9 - Use canonical CAV v1.0 vocabulary and preserve MOD-W artifact structure.
- R10 - Maintain Domain Research and References documenting the sources that shaped scope.
- R13 - Provide a routed About / Project Context view explaining IDP-Align's intent, dashboard UI, architecture, MOD-W workflow, CAV Level 1 scope, project boundaries, and current-version MOD-W assessment without target-organization naming or formal certification claims.

---

## Related Design IDs

| Design ID | Design element | Design intent to preserve | Product requirement |
| --- | --- | --- | --- |
| DS-001 | Dashboard home layout | Two-column list/detail frame on desktop and responsive stacked behavior below desktop. | R6 |
| DS-002 | Stream selector tabs | Document and Workflow are first-class stream views. | R6 |
| DS-003 | Summary KPI cards | Reserve summary area for total, active, resolved, and trend metrics. | R6 |
| DS-008 | Filter/sort bar | Reserve filter/sort controls in the dashboard flow. | R6 |
| DS-011 | Empty state | Provide an empty/no-selection state without inventing new product behavior. | R6 |
| DS-012 | Loading state | Establish skeleton/loading styling if data placeholders need it. | R6 |

No existing Design ID covers the About / Project Context view. Treat it as Product Owner-added explanatory scope controlled by this Step and `architecture.md` D12.

---

## Assigned Dev Team Interface

- [x] Claude Code
- [ ] Claude Design

## Moderator Approval

**Register:** `mod-w/validation/moderator-register.md`  
**Step approval entry:** A-002 - STEP-01 Development Team Briefing Approval  
**Status:** Approved for Development Team briefing and implementation planning only.

Development Team may not write code until the Moderator approves its implementation plan and the plan approval is recorded in the Moderator Register.

---

## Scope

- Remove the generated Angular starter content from `src/app/app.html`.
- Create or update route structure for a dashboard-first app.
- Add a routed About / Project Context page, reachable from top navigation in the app shell.
- Add a dashboard shell using Angular standalone components and signals.
- Add design tokens matching approved palette, spacing, border, and typography direction.
- Add Document and Workflow stream tabs with accessible button/tab behavior.
- Add placeholder summary KPI, filter bar, divergence list, and detail regions using canonical CAV wording.
- Add About copy as a one-page project brief geared toward interview reviewers, explaining project intent, dashboard UI, architecture, MOD-W, CAV Level 1, and scope boundaries.
- Include a short architecture summary that describes the app as a feature-sliced/layered Angular app with a repository/adapter boundary between business/domain code and replay, live BFF/API, or future database-backed data sources.
- Include that IDP-Align is a MOD-W project and that the build assesses the current MOD-W version in a realistic project setting.
- Ensure About copy and new STEP-01 user-facing explanatory copy do not mention the target organization or company-specific product/API names.
- Add focused unit tests for shell rendering and stream switching.
- Add focused tests for About route rendering and forbidden-name absence in visible copy.
- Keep all visible copy within CAV Level 1 terminology.

---

## Out Of Scope

- Real external-platform API integration or backend/proxy work.
- Replay fixture modeling beyond minimal placeholder stream metadata.
- Observed Baseline calculation.
- Sustained Divergence detection.
- Evidence Trace implementation.
- Divergence actions such as mute, copy, or mark reviewed.
- Chart.js analysis screen.
- Authentication, settings, export, notifications, or bulk actions.
- Company-specific or vendor-specific naming in the About view, app navigation, new user-facing explanatory copy, test fixture labels, or code comments introduced by STEP-01.

---

## Inputs

- `mod-w/product.md`
- `mod-w/design/design-spec.md`
- `mod-w/design/prototype-README.md`
- `mod-w/design/architecture-notes.md`
- `mod-w/design/project/Dashboard.dc.html`
- `mod-w/design/project/WorkflowDashboard.dc.html`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`

---

## Expected File Changes

- `src/app/app.ts`
- `src/app/app.html`
- `src/app/app.scss`
- `src/app/app.routes.ts`
- `src/styles.scss`
- New files under `src/app/features/dashboard/`
- New files under `src/app/features/about/`
- New files under `src/app/shared/ui/` if useful for narrow shell components
- `src/app/app.spec.ts` or dashboard-specific spec files

---

## Reference Implementation

**Location:** `mod-w/design/project/Dashboard.dc.html`, `mod-w/design/project/WorkflowDashboard.dc.html`, `mod-w/design/project/EmptyState.dc.html`

**Disposition:**

- [ ] Adopt as-is
- [x] Adopt with modifications
- [ ] Reject
- [ ] None

### Required Changes

- Preserve approved layout intent and visual hierarchy, not design-tool source code.
- Convert inline styles to SCSS and design tokens.
- Convert simulated click handlers to Angular signal state.
- Use accessible native controls and visible focus states.
- Keep dashboard responsive, including single-column behavior below tablet width.
- Use placeholder data only where needed to prove layout; do not imply completed CAV logic.
- Add the About route from Product Owner scope; it has no prototype reference implementation.

---

## Acceptance Checks

- [ ] Generated Angular starter content is gone from the rendered app.
- [ ] The first screen is the IDP-Align dashboard shell, not a landing page.
- [ ] `mod-w/validation/moderator-register.md` contains Step approval entry `A-002`.
- [ ] A routed About / Project Context view is reachable from top navigation in the app shell.
- [ ] About view is a one-page project brief geared toward interview reviewers and explains project intent, dashboard UI, architecture, MOD-W workflow, CAV Level 1, and scope boundaries.
- [ ] About view includes an architecture summary explaining the repository/adapter boundary and how replay data can later be replaced by live BFF/API or future database-backed data sources without rewriting the dashboard.
- [ ] About view states that IDP-Align is a MOD-W project assessing the current MOD-W version without claiming formal certification or benchmark status.
- [ ] About view, app navigation, new user-facing explanatory copy, test fixture labels, and code comments introduced by STEP-01 do not mention the target organization or company-specific product/API names.
- [ ] Document and Workflow stream tabs are visible, accessible, and switch active shell content using signals.
- [ ] Shell includes summary, filter/sort, list, and detail regions aligned with DS-001, DS-002, DS-003, DS-008, DS-011, and DS-012.
- [ ] UI copy uses Observed Truth, Identity Slice, Observed Baseline, Divergence, Evidence, and Stream correctly where those concepts appear.
- [ ] No current feature is labeled as Declared Intention, Alignment Delta, Envelope, Breach, Drift Velocity, Convergence, or Attribution.
- [ ] Unit tests cover app/dashboard shell rendering, stream switching, About route rendering, and forbidden-name absence in visible copy.
- [ ] `npm run build` passes.
- [ ] `npm test` passes, or any test-run limitation is documented for Tech Lead review.

---

## Plan

1. Confirm Moderator Register entry `A-002` exists before implementation planning.
2. Create dashboard and About feature routes from the Angular app shell, exposing About in top navigation.
3. Add global design tokens and scoped styles matching the approved dark palette.
4. Implement signal-backed active stream state and layout placeholders.
5. Write the About page as a neutral one-page project brief for interview reviewers; include the MOD-W project/current-version assessment angle and the architecture summary.
6. Update tests for starter removal, stream switching, About rendering, top-navigation access, and forbidden-name absence.
7. Run build and test commands.

---

## Change Notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-09-21 | Initial Step authored | Begin implementation with a narrow dashboard foundation. |
| 2026-09-23 | Added routed About / Project Context view | Product Owner requested reviewer-facing explanation without naming target vendor/interview organization. |
| 2026-09-23 | Added MOD-W assessment angle to About scope | Moderator clarified acceptable About content. |
| 2026-09-23 | Added architecture summary requirement | Moderator requested explicit repository/adapter boundary and About-page architecture explanation. |
| 2026-09-23 | Added Moderator Register approval reference and About placement/depth decisions | Moderator approved A-002 and clarified pre-briefing decisions. |

---

MOD-W v5.0.1
