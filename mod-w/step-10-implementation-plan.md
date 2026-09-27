# STEP-10 Implementation Plan - Architecture Page

**Step:** `mod-w/step-10.md`
**Step approval:** A-079 (briefing and implementation planning; STEP-09 final-gate sequencing overridden for STEP-10 only)
**Author:** Development Team (Claude Code)
**Date:** 2026-09-27
**Status:** Approved with conditions - A-080

The Moderator approved this plan under A-080. Development Team implementation is authorized only within this plan and its recorded conditions. This file remains the approved plan; implementation evidence and handoff are recorded separately.

---

## 1. Current State

| Area         | Finding                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Routes       | `app.routes.ts` has lazy `dashboard` and `about` routes and a `**` redirect to `dashboard`.                                                 |
| Navigation   | `app-shell.component.html` has Dashboard and About links using `routerLinkActive="active"` and `ariaCurrentWhenActive="page"`.              |
| About        | `about-architecture` section contains a layer flow paragraph, a four-item layer list, and an adapter-replacement paragraph.                 |
| Fixture      | `document-replay.fixture.ts` defines five synthetic suppliers (Alpha, Beta, Gamma, Delta, Epsilon) and exports `DOCUMENT_REPLAY_FIXTURE`.   |
| Slice states | `features/dashboard/identity-slice-states.ts` exports `toIdentitySliceStates` and `toPopulationSummaries`.                                  |
| Research     | `research-references.md` section 4a lists the Giebeler-Feuerschutz, Piening Personal, and Sport Auto Plus case-study URLs and their limits. |

---

## 2. Route And Navigation

| File                                                   | Change                                                                                                                                                                                    |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/app.routes.ts`                                | Add a lazy `architecture` route before `**`. No repository providers.                                                                                                                     |
| `src/app/shared/ui/app-shell/app-shell.component.html` | Add a third link with the existing pattern (`routerLinkActive="active"`, `ariaCurrentWhenActive="page"`, `data-testid="nav-architecture"`). Nav reads Dashboard \| About \| Architecture. |

---

## 3. Architecture Component

New standalone component in `src/app/features/architecture/` with separate `.ts`, `.html`, `.scss`, and `.spec.ts` files.

### Structure

One `h1` ("Architecture") and one `h2` per required content area:

1. How IDP-Align works
2. From observations to Evidence
3. Population-specific Divergence
4. What CAV Level 1 establishes
5. Implemented and synthetic
6. Source-independent by design
7. Research provenance
8. Future research
9. Architectural principle

### Semantic diagrams

| Content                                                       | Markup                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Principal flow, "Today" flow, "A possible future source" flow | `<ol>` with `aria-label`; step connectors drawn by CSS only                                            |
| Supplier slice states                                         | `<table>` with `<caption>`, columns Identity Slice \| State                                            |
| Research cases                                                | `<dl>`: term = case study link, definition = `Producer x Document Type` example and section 4a wording |

No images, SVG, canvas, Mermaid, CDN libraries, or diagram dependencies.

### Signals

The supplier rows are a readonly constant exposed through a signal. The summary line ("5 Identity Slices observed / 1 with surfaced Divergence") is a `computed()` over those rows.

### Styling

Reuse the About page's container, typography, spacing, dark surfaces, borders, and callout patterns. No new visual pattern, so Designer review is not requested.

---

## 4. Copy-Source Disposition

Baseline: `mod-w/docs/architecture-page.txt`. The following changes are made where the baseline conflicts with authoritative sources:

| Baseline text                                                           | Change                                                                         | Authority                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| "failure or violation;"                                                 | "failure;"                                                                     | `domain-language.md` / Step guardrail: violation is not used as a CAV term |
| "public DocuWare documentation and customer case studies"               | "public DocuWare documentation and published DocuWare case studies"            | Step: case studies are not presented as customers                          |
| Principal flow lists "Observed Baselines" after "CAV Level 1 detection" | Single step: "CAV Level 1 detection against per-slice Observed Baselines"      | Baselines are derived before evaluation (`architecture.md`)                |
| Credit note Identity Slices                                             | Omitted; general No Observed Baseline vs. No surfaced Divergence sentence kept | Step: mention only with explicit distinction                               |

Kept as required by the Step:

- Sport Auto Plus wording uses the section 4a sentence exactly.
- The not-implemented list keeps "Live IDP connections" and has no DocuWare item.
- The "not a claim that live integration currently exists" sentence is kept.
- `StreamObservationRepository` exists in `src/app/data/` and is named as in the baseline.
- External links use the section 4a URLs with `target="_blank"` and `rel="noopener noreferrer"`.

---

## 5. Static Versus Derived Supplier Content

**Decision:** Static, as recommended by the Step.

**Drift test:** The component spec imports `DOCUMENT_REPLAY_FIXTURE` in test code only, runs it through the same mapping and detection path the Dashboard uses, and ends with `toIdentitySliceStates`. It asserts that the Invoice-population names and states equal the page's rows exactly. Presentation code never imports fixtures.

---

## 6. About Relationship

**Decision:** Shorten and link, as recommended by the Step.

- In `about-architecture`, keep the flow paragraph and one summary sentence. Replace the layer list with a link to `/architecture` ("See Architecture for the full explanation").
- All other R13 sections stay unchanged.
- Only About spec assertions that reference the removed list are adjusted; a link assertion is added.

---

## 7. Tests

### Component / unit

- Architecture: one `h1`; all `h2` headings; flow `ol` elements have `aria-label`; table has a caption.
- Boundary copy: CAV Level 1 only; not-live-integration sentence; Implemented, Synthetic, and Future labels.
- Forbidden terms: interview, interviewer, employer framing; alert, anomaly, violation, breach, intent, delta as current-behavior terms; normal, stable, healthy, correct, aligned near "No surfaced Divergence". Reuse `CLAIM_GUARDRAIL_PATTERNS` where applicable.
- `Producer x Document Type` presented as an Identity Slice pattern.
- All external links are safe.
- Static-copy drift test (section 5).
- App shell: nav order, Architecture `href`, `aria-current` on the active route.

### E2E (`e2e/architecture.spec.ts`, new)

- Direct load of `/architecture`.
- Top-nav access with correct active state.
- Key sections visible.
- Safe external links.
- Keyboard Tab reaches the Architecture nav link and page links.
- `banner`, `navigation`, and `main` landmarks; heading hierarchy.
- Add `/architecture` to `e2e/claim-guardrails.spec.ts` if that spec iterates over routes.

---

## 8. Affected Files

| File                                                           | Change                                 |
| -------------------------------------------------------------- | -------------------------------------- |
| `src/app/app.routes.ts`                                        | Add route                              |
| `src/app/shared/ui/app-shell/app-shell.component.html`         | Add nav link                           |
| `src/app/shared/ui/app-shell/app-shell.component.spec.ts`      | Nav tests                              |
| `src/app/features/architecture/architecture.component.ts`      | New                                    |
| `src/app/features/architecture/architecture.component.html`    | New                                    |
| `src/app/features/architecture/architecture.component.scss`    | New                                    |
| `src/app/features/architecture/architecture.component.spec.ts` | New                                    |
| `src/app/features/about/about.component.html`                  | Shorten Architecture section, add link |
| `src/app/features/about/about.component.spec.ts`               | Adjust assertions                      |
| `e2e/architecture.spec.ts`                                     | New                                    |
| `e2e/claim-guardrails.spec.ts`                                 | Add route, if applicable               |

---

## 9. Scope Preservation

Not changed: Divergence detection, Observed Baseline semantics, sustained-Divergence criteria, replay fixtures, repositories and repository contracts, Dashboard behavior, workflow behavior, README, `mod-w/docs/research-references.md`, and MOD-W approval artifacts.

---

## 10. Verification

Run under the project Node.js version via `fnm exec --using=v26.0.0 npm.cmd ...`:

- `npm run lint`
- `npm run build`
- `npm test -- --watch=false`
- `npm run test:e2e`

---

## 11. Decisions Requested From The Moderator

1. Approve the copy-source changes in section 4.
2. Approve static supplier content with the drift test (section 5).
3. Approve the About shorten-and-link option (section 6).
4. Confirm Designer review is not required (section 3).
