# Cross Validation - IDP-Align

**Project:** IDP-Align
**Date:** 2026-09-21
**Status:** Active

---

## Purpose

Cross-validation keeps the MOD-W roles honest by comparing Development Team output, Tech Lead review, and QA evidence against the same approved artifacts.

---

## Roles

| Role | Primary responsibility |
| --- | --- |
| Moderator | Final decision authority and gate approvals. |
| Product Owner | Product scope and acceptance intent. |
| Designer | Approved user-facing design within `design-spec.md` authority. |
| Tech Lead / Codex | Architecture, roadmap, Step authoring, and technical review. |
| Development Team / Claude Code | Implements only the active approved Step. |
| QA | Verifies behavior after Tech Lead review. |

---

## Validation Order

1. Development Team implements the active `mod-w/step-xx.md`.
2. Development Team reports changed files, commands run, and acceptance check evidence.
3. Tech Lead reviews the diff against `product.md`, `design-spec.md`, `architecture.md`, `domain-language.md`, and the active Step.
4. Tech Lead writes `review.md` with Pass, Pass with changes, or Rework required.
5. QA validates only after Tech Lead approval or explicit Moderator override.
6. Moderator signs off or sends the work back to the appropriate role.

---

## Approval Record

All Moderator approvals and role/gate decisions for this project are recorded in `mod-w/validation/moderator-register.md`.

No MOD-W phase may advance unless the required approval entry exists in `mod-w/validation/moderator-register.md`.

Minimum required entries per Step:

1. Step approval before Development Team briefing.
2. Development Team implementation-plan approval before code changes.
3. Tech Lead review acceptance before QA, unless Moderator records an explicit override.
4. QA acceptance before final Step acceptance.
5. Moderator final gate before tagging, roadmap advancement, or marking the Step complete.

---

## Enforcement Checks

Before proceeding, each role must verify the relevant approval record:

- Development Team verifies active Step approval and implementation-plan approval.
- Tech Lead verifies implementation evidence before review and records whether QA may proceed.
- QA verifies Tech Lead acceptance or Moderator override before validation.
- Moderator verifies Tech Lead review and QA evidence before final gate.

Roadmap advancement, accepted Step tags, and any "complete" status require a final Moderator gate entry in `mod-w/validation/moderator-register.md`.

---

## Discrepancy Protocol

When artifacts conflict:

- Moderator instruction wins.
- `product.md` controls product scope.
- Approved `design-spec.md` controls user-facing visual behavior and interaction intent within its authority boundary.
- `architecture.md` controls technical decomposition, data flow, and implementation boundaries.
- `domain-language.md` controls terminology.
- Active `step-xx.md` controls implementation scope.

Do not silently resolve conflicts. Record the discrepancy in `mod-w/validation/discrepancies.md` or the active review artifact and request Moderator resolution when the conflict changes scope or authority.

---

## Evidence Requirements

- A Pass verdict requires evidence from diff, tests, or QA.
- Acceptance checks are unmet until proven.
- Prototype files are evidence only; production implementation must satisfy architecture, accessibility, tests, and repository conventions.

---

MOD-W v5.0.1
