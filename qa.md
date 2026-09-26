# QA Review - STEP-05

**Project:** IDP-Align  
**Step:** STEP-05 - Filtering, Sorting, Empty, Loading, And Error States  
**QA date:** 2026-09-25  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, `step-05.md`, `review.md`, or the register.  
**Repository state reviewed:** `master` `dcd0e80` ("feat: add dashboard filtering and states"), clean working tree.  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-05, verdict "Pass for QA", accepted by the Moderator in A-042  
**Verdict:** **Pass with notes.** All 29 acceptance checks pass. AC7, AC12, and AC15 pass with notes. There are no implementation blockers. QA-026 (Low, accessibility) and QA-027 (Info, process) need Moderator disposition.

The STEP-04 QA record is preserved at tag `step-04`. `qa.md` at that tag is identical to `qa.md` at `dcd0e80`.

---

## Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-040 | Present. Recorded in `ad4ea0e`, before the implementation commit. |
| Development Team implementation-plan approval | A-041 | Present. Includes a Recording Note (see below). Adopts the Tech Lead decisions on per-stream state, the filtered-empty reset, time range anchoring, and browser evidence. |
| Tech Lead review acceptance before QA | A-042 | Present. Accepts `review.md` "Pass for QA" with no Must Fix or Could Fix Later findings. |

### A-041 process traceability

- The Recording Note says the Moderator approved the plan in session before any code was written. It says the Development Team recorded the entry afterwards, at the Moderator's explicit instruction, for this instance only. It also says register entries otherwise remain the Moderator's to record.
- The entry is consistent with that note. Its "Next authorized action" line ("STEP-05 implementation is complete and verified; hand off for Tech Lead review") was written after implementation, not at plan approval.
- A-041 and A-042 were committed in `dcd0e80` together with the implementation. The register itself does not show that the plan was approved before code was written. That fact depends on the Moderator's statement in the Recording Note. QA accepts the note as the Moderator's attestation, and the Tech Lead also accepted it. A-042 is the Moderator's own entry and accepts the package, which ratifies A-041 on the record.
- **Result:** Traceable. No blocker. See QA-027 for the commit-timing note.

---

## Scope Of Review

`dcd0e80` changes 11 files:

- **Dashboard feature:** new `dashboard-filters.ts` and its spec, plus `dashboard.facade.ts`, `dashboard.component.ts/html/scss`, and their specs.
- **Test helper:** `src/testing/claim-guardrail-patterns.ts` adds `SEVERITY_RISK_PATTERN`. `CLAIM_GUARDRAIL_PATTERNS` is unchanged, so the About spec is unaffected, as A-041 requires.
- **Role artifacts:** `review.md` (Tech Lead) and `moderator-register.md` (A-041, A-042).

Not changed: `src/app/domain/`, `src/app/data/`, replay fixtures, About files, routes, shared Divergence UI components, `package.json`.

---

## Automated Command Results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | **Passed.** "All files pass linting." Exit 0. |
| `fnm exec --using=v26.0.0 npm.cmd run build` | **Passed.** Exit 0, no warnings, no `spawn EPERM`. Initial total 264.78 kB raw / 75.89 kB transfer. `dashboard-component` 50.59 kB / 12.06 kB. `about-component` 10.41 kB / 3.06 kB (unchanged from STEP-04). |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | **Passed.** 27 test files, 408 tests. Exit 0. |

These match `review.md` and A-042 exactly.

---

## Rendered Browser Check

QA served the production build (`dist/idp-align/browser`) from a local static server and drove it with the repo's installed Playwright Chromium. The scripts, screenshots, and rendered-text dump are in the QA session scratchpad. No repository file was added or changed.

The app uses zoneless change detection, so the DOM updates shortly after each input. QA's first script read the DOM immediately after clicks and got 6 false failures. They all passed when re-run with a short settle wait. The table below reports the settled results.

### Happy path and controls

| Check | Observed |
| --- | --- |
| Document stream | 1 card (Alpha Office Supplies (synthetic) · Invoice, Amount). KPIs 1 / 1 / 0 / "—". "Showing 1 of 1 Divergence". Default detail shows the card's Divergence. |
| Workflow stream | 3 cards in STEP-04 onset order: Approval Task duration, Approval Response time, Workflow runtime. KPIs 3 / 3 / 0 / "—". |
| Controls | Identity Slice, Time range, Status, Sort by, and Clear filters are all enabled. None is a placeholder. |
| Identity Slice options | Repository slices for the active stream only: 6 document vendor / document type slices, then 4 workflow step / runtime slices after switching. Sorted A–Z, plus "All Identity Slices". |
| Status options | "All statuses" plus "Ongoing" (the only status present in replay data). |
| Time range | "All observations", "Last 30 days of observations", "Last 7 days of observations". Note: "Measured back from the latest observation in this stream, 11 Sep 2026 (UTC)" (document) and "12 Sep 2026" (workflow). Every replay Divergence is still observed in the last 7 days, so time presets do not narrow replay data. The narrowing path is covered by `dashboard-filters.spec.ts`. |
| Sort | Onset, Identity Slice (A–Z), Dimension (A–Z), Status (lifecycle order). Dimension moves Response time ahead of Task duration. Identity Slice and Status keep onset order for equal keys (stable). |
| KPI copy | "Counts include every Divergence in this stream. Filters do not change them." KPIs stay 1 / 1 / 0 under a filter that hides every card. |
| Console | No console errors or page errors. |

### Filtered-empty, selection, and stream switching

| Check | Observed |
| --- | --- |
| Filtered-empty | Identity Slice = Alpha Office Supplies (synthetic) · Credit note shows "No matching Divergences … 1 Divergence is hidden. Use Clear filters to show them." Summary "Showing 0 of 1 Divergence". The no-Divergence empty state is not shown. No extra reset button. |
| Detail with no explicit choice | "No Divergence to show under the current filters." No stale detail. |
| Hidden selection | After a card is clicked and then filtered out: "The selected Divergence is hidden by the current filters…". Clear filters restores the same `data-divergence-id` in the detail. |
| Workflow hidden selection | Select the Workflow runtime card, sort by Dimension, filter to the Approval slice and the last 30 days: 2 cards, detail says the choice is hidden. |
| Stream switching after filters | Switching to document shows its own defaults (or its own status filter when set). Switching back to workflow keeps the Approval slice, last 30 days, Dimension sort, 2 cards, and the hidden-selection message. The select values match the retained state. |
| Clear filters | Resets only the active stream's filters, keeps the sort (Dimension), and restores the chosen Divergence. |

### Accessibility and keyboard

| Check | Observed |
| --- | --- |
| Tab `aria-controls` | Only the active tab carries `aria-controls`, and it resolves to the rendered `stream-panel-*`. The inactive tab has none. Fixes the pre-existing STEP-04 issue. |
| Tablist keys | ArrowLeft, ArrowRight, Home, and End move selection and focus. The tablist is a single tab stop. |
| Tab order | Active tab → Identity Slice → Time range → Status → Sort by → Clear filters → each card. Same order in both streams. |
| Visible focus | Every stop has a solid 2px outline. |
| Clear filters | `aria-disabled="true"`, not natively disabled, while no filter is set, so it stays focusable. Enter on it is a no-op. With a filter set, Space clears the filters, focus stays on the button, and it returns to `aria-disabled`. Focus is never dropped. |
| Retry focus | Not reachable with replay data. Spec "should read the stream again through the facade and move focus to the list" covers it. |

### Responsive layout (`.list-detail-container`)

| Width | Layout | Horizontal overflow |
| --- | --- | --- |
| 1920px | Two-column (list 612 / detail 764) | No |
| 1280px | Two-column (540 / 676) | No |
| 1279px | Stacked (1231) | No |
| 1024px | Stacked | No |
| 768px | Stacked | No |
| 767px | Stacked | No |
| 390px | Stacked | No |

This matches STEP-04 and `design-spec.md`. The column widths at 1280px and 1920px are the same as in STEP-04 QA.

### Wording probes over rendered states

QA scanned the full rendered text in five states: document ready, document filtered-empty, document hidden-selection, workflow ready, and workflow filtered.

| Probe | Result |
| --- | --- |
| Severity / risk (`severit`, `risk`, `critical`, `urgen`, `priorit`, `high impact`) | None |
| Causation / Attribution (`caus`, `because`, `due to`, `led to`, `result in/from`, `driv`, `trigger`, `explain`, `attribut`, `root`) | None |
| Business judgment (`failure`, `defect`, `non-conform`, `violation`, `breach`, `bad`, `incorrect`, `wrong`) | None |
| Alert-style (`alert`, `anomal`, `warning`) | None |
| Live access / support (`live`, `connect`, `tenant`, `api call`, `support`, `contact`) | Only a false positive: "supporting observations" in the STEP-04 Evidence Trace copy. |
| Level 2+ / reserved (`Level 2`–`9`, `intent`, `alignment delta`, `envelope`, `drift velocity`, `converg`) | None |

The loading, unavailable, and no-Divergence copy does not render with replay data. QA reviewed it in the template, and spec guardrail tests cover it.

---

## Acceptance Check Results (`mod-w/step-05.md`)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| AC1 | Register contains the STEP-05 Step approval before briefing | Pass | A-040 in `ad4ea0e`. See Gate Check for A-041 and A-042. |
| AC2 | Filter controls are functional, not disabled placeholders | Pass | Browser check. Spec "should render enabled filter and sort controls with repository Identity Slices". |
| AC3 | Identity Slice filtering narrows only the active stream | Pass | Browser check. Facade `filtersByStream`. Spec "should narrow only the stream whose filters change". |
| AC4 | Time range uses a documented timestamp and tests cover it | Pass | `latestObservedAt`, anchored to the stream's latest observation (`timeRangeStart`, `applyDivergenceFilters`). Documented in code, in A-041, and in the UI note. Filter spec tests cover the range edge and an early-onset Divergence. |
| AC5 | Status filtering uses `DivergenceStatus` without severity or risk wording | Pass | Options come from `statusesPresent`. Sort comment says "Lifecycle order only; it does not rank findings". Severity probe is clean. `SEVERITY_RISK_PATTERN` runs in the dashboard guardrail specs. |
| AC6 | Clear filters resets the active stream and restores Divergences | Pass | Browser check (keeps the sort, restores the selection). Specs under "clear filters". |
| AC7 | Sort reorders by supported options, stable for equal keys | **Pass with note** | `sortDivergences` uses `Array.prototype.sort` (stable) over onset-ordered input. Browser check for Dimension. Replay data cannot show Status ordering across different statuses (all Ongoing), so `dashboard-filters.spec.ts` covers it. |
| AC8 | Default ordering stays deterministic and matches STEP-04 | Pass | `DEFAULT_SORT = 'onset'`. `orderByOnset` is unchanged. The browser order matches STEP-04 QA. |
| AC9 | KPI behavior is explicit in copy and tests | Pass | Counts are unfiltered. The copy says so. Spec "should keep KPI counts for the whole stream and say so" and the facade counts spec. |
| AC10 | Selection/detail stays coherent when filters or stream switching hide the selection | Pass | `DashboardFacade.selection` reports `hiddenByFilters` and never substitutes another Divergence. Browser check in both streams. |
| AC11 | Empty state distinguishes no Divergences from no filter matches | Pass | Separate `empty` and `filtered-empty` list states with distinct copy. Browser check (filtered-empty). Spec "should distinguish no matches under filters from no Divergences". |
| AC12 | Loading state renders first, with accessible copy that does not imply live access | **Pass with note** | Replay data resolves before first paint, so loading is never visible in the browser. Subject-backed specs cover it: "should render accessible loading text and skeletons before data is ready" (`aria-busy`, text in a `role="status"` summary, skeletons `aria-hidden`) and "should not imply live access in loading copy". |
| AC13 | Error/unavailable state renders without implying a live DocuWare failure | Pass | "Divergences unavailable. Divergence data is not available for this stream." A source that errors or completes empty is unavailable, not empty. Covered by specs. |
| AC14 | Retry goes through the facade/repository and is tested | Pass | `retry()` → `reload` Subject → `readStream` re-reads through the repository. Specs "should read an unavailable stream again through the repository on retry" and "should show loading again while a retry is being read". No support or external links. |
| AC15 | Stream tab accessibility is valid, and inactive tabs do not point to missing panels | **Pass with note** | Browser check and spec "should not point an inactive tab at a panel that is not rendered". See QA-026: a separate dangling `aria-describedby` exists in the no-Divergence state. |
| AC16 | Keyboard navigation is predictable with visible focus | Pass | Browser tab order, tablist keys, Clear filters focus safety, 2px focus outlines. Retry focus handoff is covered by specs. |
| AC17 | Responsive: 1280px+ two-column, 768-1279px stacked, <768px single stacked | Pass | Browser geometry table. The SCSS breakpoint is unchanged. |
| AC18 | No direct replay fixture imports in dashboard components | Pass | `grep` for `data/replay` and `fixture` in non-spec files under `features/` and `shared/` finds nothing. |
| AC19 | No inline Observed Baseline derivation or sustained detection | Pass | The only detector call is the existing `detectStreamDivergences` in `DashboardFacade.readStream`. `dashboard-filters.ts` only filters and sorts records. |
| AC20 | Shared Divergence UI stays presentational | Pass | No files under `shared/ui/divergence/` changed. |
| AC21 | No About copy or About tests changed | Pass | No About files in `dcd0e80`. `CLAIM_GUARDRAIL_PATTERNS` is unchanged. The About chunk size is unchanged. |
| AC22 | No fixtures, detector changes, live calls, credentials, OAuth, backend/proxy, or non-replay adapters | Pass | Diff scope (see above). No `HttpClient` or `fetch` in the UI layer. |
| AC23 | No Level 2+, Intent, reserved Level 3+, Attribution, business-judgment, defect, or violation claims | Pass | Wording probes and guardrail specs. |
| AC24 | Guardrail tests cover the required categories plus severity-as-risk | Pass | `DASHBOARD_GUARDRAIL_PATTERNS` = `CLAIM_GUARDRAIL_PATTERNS` + `severityOrRisk`. Runs per stream against the selected, hidden-selection, filtered-empty, and non-replay state copy. |
| AC25 | Tests cover filtering, sorting, switching, selection under filters, states, accessibility, and responsive where practical | Pass | `dashboard-filters.spec.ts`, facade specs ("filters and sort", "selection under filters", "stream data state"), and component specs. jsdom does not test the responsive layout, so the browser check covers it, which is acceptable under "where practical". |
| AC26 | Browser checks cover the happy path, filtered-empty, switching after filters, keyboard focus, and 1279/1280 | Pass | This QA browser check (see above), independent of the Development Team's throwaway evidence. |
| AC27 | `npm run lint` passes on v26.0.0 | Pass | See above. |
| AC28 | `npm run build` passes on v26.0.0 | Pass | See above. |
| AC29 | `npm test -- --watch=false` passes on v26.0.0 | Pass | 27 files, 408 tests. |

### Design ID check

| Design ID | Result |
| --- | --- |
| DS-001 | Two-column list/detail from 1280px. Stacked below. |
| DS-002 | Tabs keep keyboard behavior. Stale `aria-controls` fixed. |
| DS-004 | Cards stay selectable after filtering and sorting. |
| DS-005 | Detail reports a hidden or filtered state and never shows a stale Divergence. |
| DS-008 | Functional filter/sort bar. Severity is replaced with lifecycle status, as the Step's conflict resolution requires. |
| DS-011 | Distinct no-Divergence, filtered-empty, and unavailable states. No support links. |
| DS-012 | Loading text and static skeletons (spec-verified only, see AC12). |
| DS-013 | Status filter over lifecycle status. Badge semantics unchanged. |

---

## Findings

### QA-026 - Low (accessibility): the Time range select points to an unrendered note when a stream has no Divergences

In `dashboard.component.html`, the Time range select sets `[attr.aria-describedby]="timeRangeNote() ? 'time-range-note' : null"`. The `#time-range-note` paragraph renders only in the `@else if` branch after `controlsNote()`.

In the `empty` list state (the stream is ready, has observations, and has no Divergences):

- `timeRangeNote()` is non-null, because `latestObservedAt` is set.
- `controlsNote()` is also non-null ("There are no Divergences in this stream to filter or sort.").

So the note is not rendered, but the select still references `time-range-note`. This is the same kind of dangling IDREF that STEP-05 fixed for the inactive tab.

**Impact:** Minor. The select is disabled in this state, and replay data never reaches it, so it was not observable in the browser. It is only reachable through a non-replay repository. The spec "should disable filter and sort controls in a stream with no Divergences" does not assert `aria-describedby`.  
**Proposed disposition:** Moderator choice. Either route a small rework (Tech Lead → Development Team), where the Time range select references the note only when the note renders, with a spec assertion for the empty state. Or accept it as a known limitation and carry it to a later accessibility pass.

### QA-027 - Info (process / traceability): A-041 and A-042 were committed together with the implementation

`review.md` and A-042 describe the package as "Current STEP-05 implementation package in the working tree", and A-041 says "Do not commit unless instructed." QA found the implementation, `review.md`, A-041, and A-042 all in the single commit `dcd0e80`, made before QA. The committed package matches what the Tech Lead reviewed: the test count (408) and bundle sizes match `review.md` exactly.

As a result, the register does not show on its own that plan approval came before code. That order rests on the A-041 Recording Note, which the Moderator directed.

**Proposed disposition:** No rework. Record it at the final gate, as with QA-025. If the Moderator wants the approval order visible in history, future plan approvals can be committed before implementation starts.

---

## Regressions Or Risks

- No functional regressions. All earlier specs pass. The domain, fixtures, About view, routes, and shared Divergence UI are unchanged.
- **Replay coverage gap:** The replay data has only `ongoing` Divergences, all observed within the last 7 days. The time range presets and cross-status sorting therefore never change what the browser shows. Their behavior is proven only by helper and facade specs with builder data.
- **Zoneless render timing:** The DOM updates asynchronously after input. This is not a user-facing issue, but any future committed e2e suite needs to use Playwright's auto-waiting assertions rather than immediate reads.
- **Carried forward, unchanged:** QA-014 (shared workflow values could suggest a relationship), QA-019 (sibling `resolved`/`ongoing` runs), and QA-024 (day-scale duration precision) remain as dispositioned in A-039. Filters do not make them worse. Filtering to the Approval slice separates the Approval cards from Workflow runtime, and no copy links them.

---

## Manual Checks Required

- **Moderator:** disposition QA-026 and QA-027, then record QA acceptance.
- **Optional human visual pass:** QA checked geometry, focus, and copy programmatically and captured screenshots at 1279px (filter bar), 1280px, and 390px. It did not judge visual polish by eye, including the skeleton appearance and the `aria-disabled` Clear filters styling in both themes.
- **Optional screen reader check:** QA did not test with NVDA or VoiceOver how the `role="status"` result summary is announced on each filter change and stream switch, or whether an `aria-disabled` button reads as dimmed.

---

## Known Limitations

- Loading, unavailable/retry, no-Divergence, and `resolved`-status paths do not occur with replay data. QA verified them from specs and code, not in the browser.
- QA did not mutation-test the specs, because that would require editing implementation files.
- The browser check used Chromium only.

---

## Recommended Routing

Per MOD-W, QA does not implement fixes. Proposed route:

1. The Moderator dispositions QA-026: route rework (Tech Lead in `review.md` → Development Team → Tech Lead re-review → QA re-check), or accept it as a known limitation.
2. The Moderator dispositions QA-027 (no action proposed).
3. The Moderator records QA acceptance of this review in the register.
4. The STEP-05 final gate follows.

QA does not accept its own review.

MOD-W v5.0.1
