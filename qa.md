# QA Review - STEP-04

**Project:** IDP-Align  
**Step:** STEP-04 - Divergence List, Detail, Baseline, And Evidence Trace  
**QA date:** 2026-09-25  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, `step-04.md`, `review.md`, or the register.  
**Repository state reviewed:** `master` `933aece` ("feat: surface divergence evidence on dashboard"), clean working tree. Gate re-checked at `ac434f6` ("docs: record step 04 tech lead acceptance"), which changes only `moderator-register.md`.  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-04, verdict "Pass for QA" (after the A-036 tablet-breakpoint rework)  
**Verdict:** **Pass with notes.** All 28 acceptance checks pass. AC12, AC15, and AC18 pass with notes. There are no implementation blockers. QA-023 (Medium, process) is resolved by A-037. The Moderator accepted QA-024 (Low) as a known display limitation and closed QA-025 (Info) with no action.

The STEP-03 QA record is preserved at tag `step-03`. `qa.md` at that tag is identical to `qa.md` at `933aece`.

---

## Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-034 | Present. |
| Development Team implementation-plan approval | A-035 | Present. Adopts Tech Lead conditions for resolved KPI, component location, data flow, QA-014, QA-018, QA-019, and tab-panel focus. |
| Rework-plan approval (tablet breakpoint) | A-036 | Present. Records the Development Team's browser evidence and approves hand-back for Tech Lead re-review. |
| Tech Lead review acceptance before QA | A-037 | Present, recorded in `ac434f6` after this QA session started. Accepts `review.md` "Pass for QA" for the `933aece` package. Resolves QA-023. |

QA started on the Moderator's direct brief before A-037 existed. The Moderator then recorded A-037 in response to QA-023. A-037 accepts the same `933aece` package QA reviewed, and `ac434f6` changes no implementation files, so the QA evidence below still applies. Each A-037 QA condition is covered: replay rendering, independent workflow Divergences, baseline and Evidence copy, `resolved` wording, the 768-1279px tablet layout, scope creep, and Node.js v26.0.0 verification. No process blocker remains.

---

## Scope Of Review

`933aece` changes 31 files:

- **Dashboard feature:** `dashboard.facade.ts`, `dashboard.component.ts/html/scss`, and their specs.
- **New shared UI under `src/app/shared/ui/divergence/`:** Status Badge, Divergence Card, Divergence Detail, Baseline Reference Panel, Evidence Trace, and the display-only `divergence-format.ts`. Each has a spec.
- **Test-only helper:** `src/testing/divergence-builders.ts`.
- **Role artifacts:** `review.md` (Tech Lead) and `moderator-register.md` (A-034 to A-036).

Not changed: domain logic under `src/app/domain/`, repositories, replay adapters, fixtures, About files, routes, `package.json`, and the shared guardrail patterns (last changed in STEP-02 `ddcde42`).

---

## Automated Command Results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | **Passed.** "All files pass linting." Exit 0. |
| `fnm exec --using=v26.0.0 npm.cmd run build` | **Passed.** Exit 0, no warnings, no `spawn EPERM`. Initial total 262.14 kB raw / 75.22 kB transfer. `dashboard-component` is 40.55 kB and `about-component` is 10.41 kB, the same as STEP-03. |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | **Passed.** 26 test files, 337 tests. Exit 0. Matches `review.md` and A-036. |

---

## Rendered Browser Check

QA served the production build (`dist/idp-align/browser`) from a local static server and drove it with the repo's installed Playwright Chromium. The scripts, screenshots, and rendered-text dump are in the QA session scratchpad. No repository file was added or changed.

### Content and selection

| Check | Observed |
| --- | --- |
| Document stream list | 1 card: "Alpha Office Supplies (synthetic) · Invoice", Amount, Ongoing. Observed mean 1,878.30 over 4 observations. Observed Baseline mean 1,218.65, range 1,149.38 to 1,287.92. Magnitude +659.65 (+54.1%, +28.6 SD). Onset 31 Aug 2026, duration 10 d 0 h. |
| Document KPIs | Total 1, Ongoing 1, Resolved 0 ("Finding lifecycle status"), Trend "—" ("Trend analysis is added in a later Step"). |
| Workflow stream list | 3 sibling cards in onset order: Approval Task duration (onset 07:00), Approval Response time (07:00), and Workflow runtime (07:03), all Ongoing, all on 5 Sep 2026. |
| Workflow KPIs | Total 3, Ongoing 3, Resolved 0, Trend "—". |
| Selection | Clicking each card updates the detail pane to that Divergence (`data-divergence-id` matches). `aria-current="true"` is on the selected card only. Each card has `aria-controls="divergence-detail"`. |
| Keyboard | Tab moves between cards (native buttons). Enter and Space both select. A 2px focus outline is visible. |
| Stream switching | Selecting the third workflow card, switching to document, then back keeps the workflow selection. The document stream shows only its own card and detail. |
| Evidence Trace | 4 items (document) and 6 items per workflow Divergence, all in chronological order by `datetime`. Each shows timestamp, "Outside Observed Baseline", compared value, difference from baseline mean, context fields, and source references (`system / resource / recordId`). |
| Baseline panel | Method "Mean ± the larger of 3 standard deviations or 5% of the mean". Reference window ends "31 Aug 2026, 00:00 UTC (end exclusive)". Sample size 8 (document) or 12 (workflow). Mean, SD, median, reference min to max, and within-baseline range are shown. |
| Actions and charts | Filters are all `disabled`. No other buttons or links in the stream panel. No `canvas` or chart elements. |
| Console | No console errors or page errors. |

### Responsive layout (`.list-detail-container`)

| Width | Layout | Horizontal overflow |
| --- | --- | --- |
| 1920px | Two-column (list 612 / detail 764) | No |
| 1400px | Two-column (594 / 742) | No |
| 1280px | Two-column (540 / 676) | No |
| 1279px | Stacked (full width) | No |
| 1200px | Stacked | No |
| 1024px | Stacked | No |
| 768px | Stacked | No |
| 390px | Stacked | No |

This matches `design-spec.md` (tablet 768-1279px stacked) and A-036.

### Wording probes over all rendered states

QA scanned the full rendered text with each Divergence selected in turn, in both streams:

| Probe | Result |
| --- | --- |
| Causation / relation (`caus`, `because`, `due to`, `led to`, `result in/from`, `driv`, `trigger`, `explain`, `related`, `linked`, `depend`, `attribut`, `root`) | None |
| Remediation (`remediat`, `correct(ed/ion)`, `fixed`, `repair`, `recover`, `restor`, `back to normal`, `healthy`, `normalized`, `converg`, `success`) | None |
| Business judgment (`failure`, `defect`, `non-conform`, `violation`, `breach`, `bad`, `incorrect`, `wrong`, `error` except the "Error exit" field label) | None |
| Alert-style (`alert`, `anomal`, `warning`, `critical`, `severity`) | None |
| Rename / entity matching (`renam`, `same vendor`, `entity`, `match`) | Only false positives: "entity" inside "Identity Slice". No rename or matching claim. |

The only copy mentioning correctness is the negation "do not assess business correctness" in the header foundation note.

---

## Acceptance Check Results (`mod-w/step-04.md`)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| AC1 | Register contains STEP-04 Step approval | Pass | A-034. |
| AC2 | Dashboard-facing code computes Divergences from repository slices and observations via STEP-03 helpers | Pass | `DashboardFacade.streamDivergences` calls `repository.getIdentitySlices`/`getObservations`, then `detectStreamDivergences`. Facade spec "should compute Divergences only from repository slices and observations". |
| AC3 | No direct replay fixture imports in dashboard components | Pass | `grep` for `data/replay` and `fixture` in non-spec files under `features/dashboard` and `shared/ui` finds nothing. |
| AC4 | No inline baseline or Divergence calculation | Pass | Components import only `divergence-format.ts`, which formats record values. The only detector reference in the UI layer is the facade call. `orderByOnset` is a display sort. |
| AC5 | Document stream renders the Alpha Office Supplies amount Divergence | Pass | Browser check and spec "should render the document stream Divergence from replay data". |
| AC6 | Workflow stream renders Approval task-duration, Approval response-time, and Workflow runtime Divergences | Pass | Browser check (3 cards) and spec "should render the workflow stream Divergences in onset order". |
| AC7 | Cards render Identity Slice, dimension, observed, magnitude, onset or duration, and status | Pass | `divergence-card.component.html`. Browser card text. |
| AC8 | Selecting updates detail with an accessible selected state | Pass | Native `<button>`, `aria-current`, `aria-controls`. Enter and Space verified in browser. |
| AC9 | Stream switching updates list, KPIs, selection, and labels without leaking state | Pass | Per-stream `selectedIds` in the facade. Browser check and specs "should keep each stream's own selection" and "should not show document Divergences in the workflow stream". |
| AC10 | Detail renders Identity Slice, dimension, status, onset, latest observed, duration, observed summary, and magnitude | Pass | `divergence-detail.component.ts` quick stats. Browser detail text. |
| AC11 | Baseline panel renders method, reference window, sample size, and range or distribution | Pass | Numeric path verified in browser. The categorical distribution path has no replay Divergence, so it is covered by `baseline-reference-panel.component.spec.ts` only. |
| AC12 | Evidence Trace is chronological with timestamp, compared value, source/context, and baseline indication | **Pass with note** | Chronology verified in browser for all 4 Divergences. The domain sorts items with `byObservedAt`, and the component preserves order. See QA-024: day-scale compared values drop minutes, so a value and its difference do not always reconcile on screen. |
| AC13 | `instanceId`, route, runtime, and decision agent shown only as Evidence context | Pass | Rendered as neutral `dt/dd` fields ("Workflow instance", "Decision agent", "Instance state") inside Evidence items only. Code comment: "Context only, never a cause." |
| AC14 | QA-014: no implied causation between Approval and Workflow runtime Divergences | Pass | Cards are ungrouped `<li>` siblings. No card references another card's id. Causation probe finds nothing. List note says each Divergence has its own Observed Baseline. See Risks for the shared data values. |
| AC15 | QA-019: `resolved` presented only as lifecycle status | **Pass with note** | Replay produces no `resolved` Divergence, so this path is not visible in the browser. `STATUS_DESCRIPTIONS.resolved` says "finding lifecycle status" and states that the ending observation is not listed in the Evidence trace. This matches `detectSustainedDivergences` semantics. It is covered by `divergence-detail.component.spec.ts` "resolved status" and `divergence-format.spec.ts`. The Resolved KPI note is "Finding lifecycle status". |
| AC16 | QA-018: no broader rename/entity-matching claims | Pass | Rename probe is clean. Card spec "should render a categorical Divergence without rename or matching claims (QA-018)". |
| AC17 | KPIs reflect computed records without chart behavior | Pass | `DashboardFacade.counts`. Document 1/1/0, workflow 3/3/0. Trend is a textual placeholder. No canvas. |
| AC18 | Truthful empty state that does not appear when Divergences exist | **Pass with note** | Both replay streams have Divergences, so no empty state renders in the browser, as expected. The empty and unavailable states are covered only by the non-replay repository specs in `dashboard.component.spec.ts`. |
| AC19 | Filters disabled or placeholder-only | Pass | All three `select`s are `disabled`, with note "Filters become available in a later Step." |
| AC20 | No functional user actions | Pass | No buttons or links in the stream panel besides cards. Specs "should offer no user actions". |
| AC21 | No About copy or About tests changed | Pass | No About files in `933aece`. The About chunk size is unchanged. |
| AC22 | No fixtures, detector changes, live calls, credentials, OAuth, backend, or non-replay adapters | Pass | Diff is limited to dashboard, shared UI, test helper, and role artifacts. No `HttpClient`, `fetch`, or token strings in the UI layer. |
| AC23 | No Level 2+, Intent, reserved Level 3+, Attribution, business-judgment, defect, or violation claims | Pass | Guardrail specs and QA wording probes. |
| AC24 | Dashboard guardrail tests still cover required categories | Pass | `CLAIM_GUARDRAIL_PATTERNS` unchanged. It covers endorsement, private access, production readiness, business judgment, reserved terms, and alert/anomaly. The dashboard spec now runs every pattern against each selected Divergence in both streams. |
| AC25 | Tests cover rendering, selection, switching, empty/detail states, baseline panel, Evidence Trace, status wording, and QA-014/QA-019 | Pass | See the spec list in `dashboard.component.spec.ts`, `dashboard.facade.spec.ts`, and the six `shared/ui/divergence` specs. |
| AC26 | `npm run lint` passes on v26.0.0 | Pass | See above. |
| AC27 | `npm run build` passes on v26.0.0 | Pass | See above. |
| AC28 | `npm test -- --watch=false` passes on v26.0.0 | Pass | 26 files, 337 tests. |

### Design ID check

| Design ID | Result |
| --- | --- |
| DS-001 | Two-column list/detail from 1280px. Stacked below. |
| DS-003 | KPI values come from computed records. Trend is a non-chart placeholder. |
| DS-004 / DS-013 | Cards and status badges are present. The badge offers no action. |
| DS-005 / DS-006 / DS-007 / DS-014 | Detail, Baseline panel, and Evidence rows are present with source/context fields. |
| DS-009 / DS-010 | Stream-specific headings, source notes, Identity Slice labels, and KPI scope notes. |
| DS-011 | Empty and unavailable states are distinct (spec-verified only, see AC18). |

---

## Findings

### QA-023 - Medium (process / gate): Tech Lead review acceptance before QA is not recorded for STEP-04 — **Resolved by A-037**

The register's Required Gate Types table lists "Tech Lead review acceptance" as required before QA starts. It also says a skipped or reordered gate needs an explicit override entry. A-006, A-020, and A-031 recorded this gate for STEP-01 to STEP-03. For STEP-04 the register ends at A-036. A-036 approves hand-back for Tech Lead re-review but does not accept the resulting "Pass for QA" review.

**Impact:** Traceability only. The implementation is unaffected.  
**Proposed disposition:** The Moderator records the STEP-04 Tech Lead review acceptance, or an override with rationale, before recording QA acceptance.  
**Status:** Resolved. The Moderator recorded A-037 - STEP-04 Tech Lead Review Acceptance in commit `ac434f6`. QA confirmed that the commit changes only `moderator-register.md`. The entry was recorded after QA had started, not before, but it accepts the same package, so the gate is now satisfied on the record.

### QA-024 - Low (Evidence reconstruction / display precision): day-scale durations drop minutes — **Accepted by the Moderator**

`formatDuration` in `src/app/shared/ui/divergence/divergence-format.ts` shows `"{d} d {h} h"` once a value reaches 24 hours and drops the minutes. The spec asserts this: 2 d 3 h 20 min shows as "2 d 3 h".

Rendered example, Approval Task duration Evidence at 10 Sep 2026, 10:01 UTC:

- The compared value shows **"1 d 0 h"**.
- The difference from the baseline mean shows **"+20 h 19 min"**.
- The baseline mean shows **"4 h 33 min"**.

The actual value is 24 h 52 min, so 52 minutes are hidden, and the three rendered fields do not add up. The same happens on the Workflow runtime item at 10 Sep ("1 d 1 h" shown, 25 h 34 min actual) and in "Observed values … max 1 d 0 h". Card and detail durations such as "7 d 1 h" lose under 1% and are unaffected in practice.

**Impact:** The step's QA Notes ask that Evidence be "reconstructable from rendered fields". A user cannot reconcile compared value, difference, and baseline mean for day-scale workflow values. No data is lost: the domain record keeps exact milliseconds.  
**Proposed disposition:** Moderator choice. Either accept it as a display convention, or route a small rework so values near a day keep minutes (for example "1 d 0 h 52 min", or hours plus minutes below some threshold).  
**Moderator disposition:** Accepted as a known display limitation for STEP-04. Duration Evidence values stay intact in the domain record. Better duration formatting may be considered in a later UI polish step. No STEP-04 rework.

### QA-025 - Info (process / traceability): the review header says the work is uncommitted, but it was committed before QA — **Closed, no action**

`review.md` says "Current uncommitted Development Team STEP-04 work" and "The working tree is intentionally uncommitted per the Development Team handoff". A-036 says "Do not commit unless instructed." QA found the implementation, `review.md`, and A-034 to A-036 all in commit `933aece`, made before QA. QA cannot tell whether the Moderator instructed that commit. The reviewed content and the committed content agree: test count and bundle sizes match `review.md` exactly.

**Proposed disposition:** No rework. Note it for the final gate, as with QA-022.  
**Moderator disposition:** No action. `review.md` described the working tree as uncommitted at Tech Lead review time. The work was committed before QA on the Moderator's instruction.

---

## Regressions Or Risks

- No functional regressions. All STEP-01 to STEP-03 specs pass. The domain, fixtures, About view, routes, and guardrail patterns are unchanged.
- **Risk (QA-014, data not copy):** The Approval Task duration and Workflow runtime cards show the same magnitude (+18 h 35 min), the same onset day, and the same six workflow instance IDs in their Evidence. The UI does not link them, and the list note says each has its own Observed Baseline. Still, a reader could infer a relationship from the values alone. This comes from the replay data and the Level 1 scope, not from UI wording. The Product Owner may want to keep it in mind for later Attribution-adjacent copy.
- **Risk (QA-019):** The `resolved` wording is only exercised through unit-test builders. If a later fixture or source produces a `resolved` Divergence next to a new `ongoing` one on the same Identity Slice and dimension, the UI shows two sibling cards. It does not explain that they are separate sustained runs.
- **Pre-existing, not a STEP-04 regression:** The inactive stream tab's `aria-controls` points to a panel id that is not rendered. This has been the case since at least `step-03`.

---

## Manual Checks Required

- **Moderator:** record QA acceptance of this review. QA-023 is resolved by A-037, and QA-024 and QA-025 are dispositioned.
- **Optional human visual pass:** QA verified layout geometry, content, and focus programmatically and captured screenshots. It did not judge visual polish (spacing, badge colour contrast in both themes) against `design-spec.md` by eye.
- **Screen reader check (optional):** `aria-current="true"` on a button is announced differently across screen readers. QA did not test it with NVDA or VoiceOver.

---

## Known Limitations

- The `resolved`, categorical-baseline, empty-state, and unavailable-state paths do not occur in replay data. QA verified them from specs and code, not in the browser.
- QA did not mutation-test the specs, because that would require editing implementation files.
- The browser check used Chromium only.

---

## Recommended Routing

Per MOD-W, QA does not implement fixes. Proposed route:

1. Done: A-037 records the STEP-04 Tech Lead review acceptance (QA-023 resolved).
2. Done: the Moderator dispositioned QA-024 (accepted as a known display limitation, no rework) and QA-025 (no action).
3. The Moderator records QA acceptance of this review in the register.
4. The STEP-04 final gate follows.

QA does not accept its own review.

MOD-W v5.0.1
