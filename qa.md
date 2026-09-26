# QA Review - STEP-07

**Project:** IDP-Align  
**Step:** STEP-07 - Workflow Stream Parity And Cross-Stream Consistency  
**QA date:** 2026-09-26  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, `step-07.md`, `review.md`, or the Moderator Register.  
**Repository state reviewed:** `master` `e19b580` ("feat(step-07): complete workflow parity implementation"), clean working tree.  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-07, verdict "Pass for QA", accepted by the Moderator in A-055 (`3be6020`)  
**Verdict:** **Pass with notes.** All 27 acceptance checks pass. The categorical workflow check passes on spec evidence only, because replay browser data exposes numeric workflow Divergences only. There are no implementation blockers and no findings above Info.

The STEP-06 QA record is preserved at tag `step-06` (`a382c43`). `qa.md` at that tag is identical to `qa.md` at `e19b580`.

---

## Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-053 | Present. Committed in `2a5b6ea` / `2f832d0`, before implementation. |
| Implementation-plan approval | A-054 | Present. Committed in `f39b7a6`, before `e19b580`. It selects KPI Option C, approves the test-only categorical builder, and approves the Dimension-specific Evidence label on condition that Document specs are checked. |
| Tech Lead review acceptance before QA | A-055 | Present. Committed in `3be6020`, before `e19b580`. It accepts `review.md` "Pass for QA" with no Must Fix or Could Fix Later findings. |

A-055 and `review.md` describe the reviewed package as "uncommitted". The Moderator then committed it as `e19b580` together with `review.md`. The committed package matches the Tech Lead evidence exactly: 30 test files, 496 tests, initial total 266.65 kB, and `dashboard-component` 251.42 kB. See QA-032.

---

## Scope Of Review

`e19b580` changes 14 files (diff from `step-06`, excluding MOD-W governance files):

- **Dashboard:** `dashboard.component.ts` (new `identity-slices` KPI, `identitySliceKpiNote` per stream, Workflow filter label "workflow step / runtime", and Trend note) and `dashboard.facade.ts` (`identitySliceCoverage`).
- **Shared UI:** `divergence-format.ts` (`comparedValueLabel`, `INSTANCE_STATE_LABELS`), plus `evidence-trace.component.ts/html` (Dimension-specific value label).
- **Test helper:** `src/testing/divergence-builders.ts` (`taskOutcomeDivergence()`, test-only).
- **Specs:** dashboard component and facade, divergence-analysis-view, divergence-analysis, divergence-detail, divergence-format, and evidence-trace.
- **Role artifact:** `review.md`.

These paths are unchanged between `step-06` and `e19b580`: `package.json`, `package-lock.json`, `angular.json`, `src/app/domain/`, `src/app/data/` (including replay fixtures), `src/app/features/about/`, `src/app/app.routes.ts`, and `src/index.html`.

**Removed spec lines:** every removed assertion was replaced with an updated counterpart in the same test. The changes are:

- KPI arrays gain a fifth value, for example `['3','3','0','—']` becomes `['3','3','0','2 of 4','—']`.
- The label list gains "Identity Slices with Divergences".
- The Trend note assertion changes from "added in a later Step" to the new note, plus a `not.toMatch(/later Step/)` guard.
- The Workflow filter label changes from "step / route" to "step / runtime".
- The instance state `completed` becomes `Completed`.
- Builder lists are widened to include `taskOutcomeDivergence()`.

No spec was deleted or weakened.

---

## Automated Command Results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | **Passed.** "All files pass linting." Exit 0. |
| `fnm exec --using=v26.0.0 npm.cmd run build` | **Passed.** No warnings. Initial total 266.65 kB raw / 76.42 kB transfer. `dashboard-component` 251.42 kB / 70.30 kB. `about-component` 10.41 kB / 3.06 kB (unchanged from STEP-06). Exit 0. |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | **Passed.** 30 test files, 496 tests (STEP-06: 470). Exit 0. |

These results match `review.md` and A-055. QA ran all three commands outside the sandbox, so the known `spawn EPERM` did not occur.

---

## Static Checks

| Check | Result |
| --- | --- |
| No direct fixture imports | No `data/replay` or `fixture` reference appears in non-spec files under `src/app/features` or `src/app/shared`. No production file imports `src/testing`. |
| Test-only categorical builder | `taskOutcomeDivergence()` exists only in `src/testing/divergence-builders.ts`. It is used only from specs. |
| No live access | No `HttpClient`, `fetch(`, or `XMLHttpRequest` appears in `features/` or `shared/`. |
| Shared UI stays presentational | The only `inject` calls in `shared/ui/divergence` are the existing `CHART_FACTORY` and `DestroyRef`. `comparedValueLabel` and `INSTANCE_STATE_LABELS` are pure display helpers. |
| KPI uses existing facade data | `identitySliceCoverage` reads only the stream's ready state: the distinct `identitySlice.id` values of its Divergences out of `state.identitySlices.length`. It does not call a detector or baseline builder, and it does not count decision agents or routes. It returns `null` while the stream is loading or unavailable. |
| No recomputation added | The diff adds no call to detection or baseline code. The facade's existing `detectStreamDivergences` call in `readStream` is unchanged from STEP-05/06. |
| Wording in added production lines | A probe over added non-spec lines for compar/align/risk/sever/caus/attribut/fail/alert/anomal/reconcil/correlat/cross found only `comparedValueLabel` identifiers, the "(compared value)" label, and the `failed: 'Failed'` source-state label (see QA-031). |

---

## Rendered Browser Check

QA served the production build (`dist/idp-align/browser`) from a local static server and drove it with the repo's installed Playwright Chromium. The script (`qa07.cjs`), logs, screenshots, and a rendered-copy dump are in the QA session scratchpad. The script was written independently of the Development Team's browser script. No repository file was added or changed. An init script counted live `ResizeObserver` observations and window `resize` listeners, as in STEP-06 QA.

**Result: 115/115 checks passed.** No console errors, no page errors, and no external requests occurred.

Run history:

- **First run:** stopped at the detail checks because of a QA script bug. It read `dt/dd` inside `detail-stat`, but `detail-stat` is the `<dd>` itself.
- **Second run:** 114/115. The one failure was a false positive in the live-access wording probe. `\bsupport` matched "4 supporting observations", which is the Evidence Trace note and was already present at `step-06`. It makes no support or contact claim.
- **Third run:** QA narrowed the probe to `\bsupport(?!ing observations)` and reran everything. The third run passed 115/115. The results below are from that run.

### 1-2. Identity Slices with Divergences KPI

| Check | Document | Workflow |
| --- | --- | --- |
| KPI order | Total Divergences / Ongoing / Resolved / Identity Slices with Divergences / Trend | Same |
| Value | **1 of 6** | **2 of 4** |
| Numerator = distinct Identity Slices among the cards | 1 (Alpha Office Supplies · Invoice) | 2 (Approval, Workflow runtime) |
| Denominator = stream Identity Slices | 6 = 6 filter options = "across 6 Identity Slices" in the replay source line | 4 = 4 filter options = "across 4 Identity Slices" |
| Note | "Vendor / document type Identity Slices in this stream" | "Workflow steps and Workflow runtime in this stream" |
| Filters | — | The value stays "2 of 4" with the Payment release filter applied, which matches the scope note "Counts include every Divergence in this stream. Filters do not change them." |

The wording is descriptive and within-stream only. Neither stream's note mentions the other stream. The KPI text has no compare, versus, alignment, reconciliation, correlation, risk, severity, critical, attention, concern, issue, health, or gap wording. The Trend note now reads "Not charted here. Divergence Analysis charts a selected Divergence's Evidence over time." It no longer says "later Step".

### 3. Workflow filter options

The label reads "Identity Slice (workflow step / runtime)" and no longer says "step / route". The options are the four actual workflow Identity Slices: Invoice approval (synthetic) · Approval, · Invoice review, · Payment release, and · Workflow runtime. That count equals the KPI denominator.

### 4. Workflow cards

| Card | Dimension | Magnitude | Onset · Duration | Status |
| --- | --- | --- | --- | --- |
| Invoice approval (synthetic) · Approval | Task duration | +18 h 35 min from baseline mean (+408.2%, +60.5 SD) | 5 Sep 2026 · 7 d 1 h | Ongoing |
| Invoice approval (synthetic) · Approval | Response time | +53 min from baseline mean (+103.9%, +8.0 SD) | 5 Sep 2026 · 7 d 1 h | Ongoing |
| Invoice approval (synthetic) · Workflow runtime | Workflow runtime | +18 h 35 min from baseline mean (+352.7%, +68.7 SD) | 5 Sep 2026 · 7 d 1 h | Ongoing |

Each card is a `<button>`. Its accessible name contains the Identity Slice, the Dimension, and the status. After selection it carries `aria-current="true"`. The card's Magnitude, onset day, Duration, and status equal the detail pane values for the same `data-divergence-id`.

### 5. Workflow detail and Evidence Trace

| Check | Observed |
| --- | --- |
| Detail context | For all three workflow Divergences: Onset, Latest observed, Duration, Observed, Observed values, Observed Baseline, Magnitude, and Sustained criterion; the lifecycle status note; and the Baseline Reference Panel (reference window, sample size, and no target, expected, or intended wording). |
| Evidence count | 6 items for each Divergence. This equals the trace note ("6 supporting observations") and the "across 6 observations" figure in Observed. Items are oldest first. |
| Task rows (Approval) | Workflow instance, Step (Approval, matching the Identity Slice), Decision (Approve), and Decision agent (Finance approver role (synthetic)). Sources cite TaskExecutionTimes, TaskReactionTimes, TaskDecisions, and TaskDecisionUsers. No Error exit appears, because none is present in this Evidence. |
| Task duration / response time values | Duration-formatted, for example "21 h 50 min … 23 h 21 min" (task duration) and "1 h 35 min … 1 h 45 min" (response time). |
| Runtime rows | Workflow instance and Instance state. Sources are WorkflowRuntimes records. All six visible states are "Completed" (a source state name). |
| Analysis side context | 7 stats (Evidence observations, Observed Baseline, Observed, Magnitude, Onset, Duration, Latest observed), plus the status badge and Baseline Reference Panel. |

Error behavior (Error exit) and categorical Decision or route outcome values do not occur in browser-visible workflow Evidence. They are spec-covered. See item 11.

### 6. Evidence labels

| Stream / Dimension | Value label |
| --- | --- |
| Document · Amount | **Amount (compared value)** (4 rows). Document context fields are unchanged: Vendor, Document type, Currency, Document date. |
| Workflow · Task duration | Task duration (compared value) |
| Workflow · Response time | Response time (compared value) |
| Workflow · Workflow runtime | Workflow runtime (compared value) |

Categorical labels are spec-covered in `evidence-trace.component.spec.ts`: "Vendor representation (compared value)" and "Decision or route outcome (compared value)" with the value "Error exit: Test error exit (synthetic)" and no distance row. The label names the observed Dimension and does not imply a target.

### 7. Filters, sorting, and states

| Check | Observed |
| --- | --- |
| Sorting | Each of the 4 sort options gives the same order when reselected. With Identity Slice (A–Z), the two equal-key Approval Divergences keep onset order (Task duration → Response time). Dimension (A–Z) gives Response time → Task duration → Workflow runtime. Status (lifecycle order), with all Divergences Ongoing, keeps onset order. |
| Time range / status | "Last 7 days" and "Ongoing" each keep all 3 workflow Divergences, which is correct because all are ongoing up to 12 Sep. |
| Filtered-empty | The Payment release filter shows "No matching Divergences. No Divergences in the Workflow stream match the current filters. 3 Divergences are hidden. Use Clear filters to show them." The detail says "No Divergence to show under the current filters." with no analysis button. |
| Hidden selection | Selecting Workflow runtime and then filtering to Approval shows the `detail-hidden` copy, no analysis button, and the 2 Approval cards. Clear filters restores the same selection, and focus stays on Clear filters. |
| Stream independence | QA set the Workflow filter to Workflow runtime and the sort to Dimension, then switched to Document. Document still had "All Identity Slices", onset sort, and 1 card. Switching back to Workflow restored its own filter, sort, and selection. |
| Loading / unavailable / retry | Not reachable with bundled replay data (as in STEP-05/06). These states are spec-covered and pass as part of the 496 tests. The facade specs cover loading, completes-without-data as unavailable, retry re-read, and loading during retry, and KPI coverage is `null` while loading or unavailable. The dashboard specs cover the unavailable state, retry, disabled controls, pending KPIs (now five "—"), and no analysis while loading or unavailable. |

### 8. Workflow analysis

| Check | Observed |
| --- | --- |
| Open | Enter on "Open Divergence Analysis" opens the analysis for the same Divergence. Focus moves to `h3#analysis-heading`. The list/detail is replaced, the filter bar stays visible, and exactly 1 canvas renders. |
| Workflow Approval metric switching | A `role="group"` offers "Task duration" and "Response time" with `aria-pressed`. Tab and Enter switch to Response time, `aria-pressed` moves, and focus stays on the pressed option. The chart summary and canvas `aria-label` update. There is still 1 canvas, and the observer and listener counts are unchanged ({roLive 1, resize 1}). |
| Table | 6 rows, equal to the Evidence values. |
| Lifecycle | After 10 switches and 5 back/reopen cycles: 1 canvas, 1 live observation, and 1 resize listener. After closing: 0 canvases, 0 observations, and 0 listeners, the same as the initial page. |
| Back | Space on Back restores list/detail with the switched-to Divergence selected. Exactly one card has `aria-current`. Focus returns to the trigger and the canvas is removed. |
| Filter-hidden while open | Filtering to Workflow runtime shows `analysis-hidden` with no canvas. Clear filters restores the same Divergence and chart. |
| Workflow runtime chart | Numeric chart. It shows a single Dimension label ("Dimension: Workflow runtime. No other Divergence in this Identity Slice is shown under the current filters."). The canvas label is "Chart of Workflow runtime for Invoice approval (synthetic) · Workflow runtime: observed Evidence values over time against the Observed Baseline mean and range". |
| Stream switch while open | ArrowLeft on the tablist closes the analysis, focuses the Document tab, and removes the canvas. ArrowRight returns to Workflow with the analysis still closed. |

### 9. STEP-05 / STEP-06 regression

| Check | Observed |
| --- | --- |
| Tabs | Only the active tab has `aria-controls`, and it resolves to the rendered panel. Roving `tabindex` gives exactly one tab `tabindex=0`. Arrow keys move stream and focus. |
| Document analysis | The table values are 1,872.40, 1,905.00, 1,846.20, and 1,889.60, identical to STEP-06 QA. Back returns focus to the trigger. |
| Breakpoints | List/detail widths are 612/764 at 1440px, 540/676 at 1280px, and 1231 stacked at 1279px in both streams. This is identical to STEP-05 and STEP-06 QA. |
| Analysis canvas sizes | 895×320, 788×320, 1197×320, 702×320, and 309×260 at 1440, 1280, 1279, 768, and 375px. This is identical to STEP-06 QA. |

### 10. Keyboard and responsive

**Keyboard:** Tab from the Workflow tab reaches, in order, the Identity Slice filter, Time range, Status, Sort by, Clear filters, the three cards, and Open Divergence Analysis. Enter and Space on a card select it. The focused card shows a solid 2px outline.

The table shows the layout in both streams. "KPI rows" is the number of rows the five KPI cards wrap into. "Clipped / overflow" counts KPI cards or KPI text that is clipped or overflows.

| Width | List/detail | KPI rows | Clipped / overflow | Analysis | Clipped controls | Page overflow |
| --- | --- | --- | --- | --- | --- | --- |
| 1440px | Two-column | 1 | 0 / 0 | Side by side | 0 | No |
| 1280px | Two-column | 1 | 0 / 0 | Side by side | 0 | No |
| 1279px | Stacked | 1 | 0 / 0 | Stacked | 0 | No |
| 768px | Stacked | 2 (3 + 2) | 0 / 0 | Stacked | 0 | No |
| 375px | Stacked | 5 | 0 / 0 | Stacked | 0 | No |

The fifth KPI does not break the shared layout at any tested width. The analysis table did not scroll horizontally at any width, so the QA-029 condition still does not occur.

### 11. Categorical coverage limitation

**Replay browser data still exposes numeric workflow Divergences only**: Task duration, Response time, and Workflow runtime. QA could not render categorical workflow behavior in the browser. It is **spec-covered only**, using the test-only `taskOutcomeDivergence()` builder:

- `divergence-analysis.component.spec.ts`: "should chart a workflow task outcome as categorical shares without a numeric band".
- `divergence-detail.component.spec.ts`: "should render a categorical workflow task outcome with its reference distribution".
- `evidence-trace.component.spec.ts`: "should label categorical document and workflow values by their dimension" (the Decision or route outcome label, the Error exit value, and no distance row).
- `divergence-analysis-view.spec.ts`: "should carry no numeric band, mean, or range for a categorical baseline".

No fixture, detector, threshold, or reference window was changed to make a categorical case visible.

### 12. Wording probes

QA scanned the full rendered stream panel for Document and Workflow (list, detail, and Evidence), plus the analysis views for Document Amount, Workflow Approval (after the metric switch), and Workflow runtime:

| Probe | Result |
| --- | --- |
| Severity / risk | None |
| Causation / Attribution / root cause | None |
| Business judgment (fail*, defect, non-conformance, violation, breach, incorrect, wrong) | None |
| Alert / anomaly / warning | None |
| Live access / support / tenant | None (after excluding the pre-existing "supporting observations"; see run history) |
| Level 2+ / reserved Level 3+ terms | None |
| Cross-stream reconciliation / correlation / comparison | None |
| User actions (mute, mark reviewed, resolve, export, copy details, assign, comment, investigation) | None |

---

## Acceptance Check Results (`mod-w/step-07.md`)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| AC1 | Register contains STEP-07 Step approval before briefing | Pass | A-053. See Gate Check. |
| AC2 | Workflow uses the same shared layout, tabs, filter/sort, list/detail, Evidence Trace, Baseline panel, status badge, and analysis surface | Pass | One `StreamConfig`-driven view. The browser shows identical structure and breakpoints in both streams. |
| AC3 | Workflow KPI labels and values are workflow-specific and data-backed | Pass | "2 of 4" with the note "Workflow steps and Workflow runtime in this stream". It is computed by `identitySliceCoverage` and cross-checked against the cards, filter options, and replay source line. |
| AC4 | Workflow cards show correct slice, Dimension, magnitude, onset, duration, status, and accessible labels | Pass | Item 4. |
| AC5 | Workflow detail shows baseline, observed, magnitude, onset, duration, latest, status, and reconstructable Evidence | Pass | Item 5. |
| AC6 | Workflow Evidence exposes step, route, decision agent, duration, response time, error, and runtime when present | Pass | Step, Decision, Decision agent, task duration, response time, runtime, and instance state appear in the browser. Error exit and route outcome are spec-covered (no browser-visible case). |
| AC7 | Workflow Evidence context implies no Attribution, root cause, judgment, or severity | Pass with note | Wording probes and guardrail specs. See QA-031 for the "Failed" source-state label (not browser-visible). |
| AC8 | Workflow filters work and do not affect Document state | Pass | Item 7, stream independence. |
| AC9 | Workflow sorting deterministic and stable for equal keys | Pass | Item 7, sorting. The facade/filter sort specs pass. |
| AC10 | Hidden-selection, filtered-empty, no-Divergence, loading, unavailable, and retry states truthful and source-neutral | Pass | Hidden and filtered-empty were checked in the browser. The others are spec-covered because replay data cannot reach them. |
| AC11 | Stream switching preserves per-stream filter, sort, and selection | Pass | Item 7, plus the facade spec "should narrow only the stream whose filters change". |
| AC12 | Workflow analysis opens, gives an accessible back path, and closes on stream switch or hidden selection | Pass | Item 8. |
| AC13 | Metric options derive from visible same-slice Divergences; Workflow Approval switching coherent | Pass | Item 8. |
| AC14 | Chart/table use existing data and import no fixtures | Pass | Static checks. The table equals the Evidence. |
| AC15 | Categorical behavior browser-verified or spec-covered with the limitation recorded | Pass with note | Spec-covered only. See item 11. |
| AC16 | Shared UI stays presentational | Pass | Static checks. |
| AC17 | Dashboard does not recompute baselines or Divergences inline | Pass | No new detection or baseline call. The KPI counts existing records. |
| AC18 | No About copy or tests changed | Pass | No About files in the diff. The About chunk is unchanged at 10.41 kB. |
| AC19 | No fixtures, detectors, thresholds, windows, lifecycle semantics, live calls, credentials, OAuth, backend/proxy, adapters, or package/chart changes | Pass | Diff scope and static checks. |
| AC20 | No Level 2+, Level 3+, Attribution, judgment, alert/anomaly, or severity-as-risk claims | Pass | Wording probes and guardrail specs. |
| AC21 | Document behavior does not regress | Pass | Document KPI, Evidence, analysis, and breakpoints match STEP-06. The only change is the approved "Amount (compared value)" label and the fifth KPI. |
| AC22 | STEP-05/06 behavior does not regress | Pass | Item 9. All earlier specs are retained and updated, none weakened. |
| AC23 | Unit/component tests cover workflow summary, cards, detail, Evidence, filters/sorting, analysis options, guardrails, a11y, and categorical | Pass | 26 new tests (470 → 496) across the dashboard component and facade, detail, Evidence Trace, format, and analysis specs. |
| AC24 | Browser or rendered checks cover the happy path, Approval switching, filter-hidden, keyboard/focus, and responsive layouts | Pass | This QA browser check (115/115), independent of the Development Team evidence. |
| AC25 | `npm run lint` on v26.0.0 | Pass | See above. |
| AC26 | `npm run build` on v26.0.0 | Pass | See above. |
| AC27 | `npm test -- --watch=false` on v26.0.0 | Pass | 30 files, 496 tests. |

### Design ID check

| Design ID | Result |
| --- | --- |
| DS-001 / DS-002 | The shared shell and accessible tabs are unchanged, and the workflow stream uses the same layout. |
| DS-003 / DS-010 | The fifth shared KPI is workflow-specific in its note and data-backed. The shared KPI pattern is preserved at every width. |
| DS-004 / DS-013 | Workflow cards use the shared card with workflow slice and Dimension copy. Lifecycle status semantics are unchanged. |
| DS-005 / DS-006 | Workflow detail is as complete as Document detail. The Baseline panel shows the reference window and sample with no target wording. |
| DS-007 / DS-014 | Workflow Evidence rows are reconstructable, with instance, step, decision, decision agent, and source records, and Dimension-specific value labels. |
| DS-008 / DS-011 / DS-012 | Filter copy matches the real workflow slices. Filtered-empty and hidden copy is truthful. Loading and unavailable states are spec-covered and source-neutral. |
| DS-015 | Workflow analysis uses the same surface. Approval metric switching and runtime chart behavior are preserved. |
| DS-009 | Not changed beyond the shared KPI layout fallout approved in A-054. |

---

## Findings

### QA-031 - Info (wording, latent): the "Failed" source-state label is in the shared format helper

`INSTANCE_STATE_LABELS` in `divergence-format.ts` maps the DocuWare Workflow Analytics instance state `failed` to "Failed". It renders under the "Instance state" label in runtime Evidence rows. The word "failure" is on STEP-07's guardrail list, but this label reports a recorded source state, not a judgment. The raw value `failed` was already rendered before STEP-07; STEP-07 only capitalizes it. **This does not appear in the browser today:** every runtime Evidence row in the current Workflow runtime Divergence is "Completed". The replay fixture marks only instances with a Payment release error exit as `Failed`, and none of them is in the Divergence's Evidence. `review.md` describes the change as formatting runtime state "as source state names". A-054 does not address it explicitly.  
**Proposed disposition:** No rework. The Moderator may confirm that showing the source-state name "Failed" as factual Evidence context is acceptable, or route alternative wording later.

### QA-032 - Info (process / traceability): `review.md` was committed with the implementation

As with QA-030 in STEP-06, A-053, A-054, and A-055 were each committed separately and in order before `e19b580`. `review.md` itself was committed in the implementation commit, and A-055 describes the package as "uncommitted". The committed package matches the Tech Lead evidence exactly (496 tests and identical bundle sizes).  
**Proposed disposition:** No action. Recorded for traceability only.

### Carry-forward notes (not reopened)

- **QA-028** (uneven duration tick values): still visible, for example on the Workflow Approval Task duration and Response time y-axes. It remains an accepted Info-level polish note. STEP-07 did not route it.
- **QA-029** (non-focusable table scroll container): the table did not scroll horizontally at any tested width, including 375px. It remains an accepted latent accessibility note.

---

## Regressions Or Risks

- No functional regressions. All STEP-05 and STEP-06 specs are retained. Only the expected values changed for the fifth KPI, the Trend note, the filter label, and instance-state capitalization. STEP-05 and STEP-06 browser behavior, list/detail widths, and analysis canvas sizes match earlier QA exactly.
- **Replay coverage gap (unchanged):** there is no categorical workflow Divergence, no Error exit in visible Evidence, and no resolved-status Divergence. Multi-option metric switching exists only for the Workflow Approval Identity Slice. These paths are covered by specs with builder data.
- **KPI scope:** "Identity Slices with Divergences" ignores filters by design, which the scope note states. A user could still read "2 of 4" as a filtered figure while filters are active. The existing note mitigates this, and A-054 and `review.md` accept it.
- **Carried forward, unchanged:** QA-014, QA-019, and QA-024 (day-scale duration precision, for example "7 d 1 h"). QA-027 and QA-030 remain process notes.

---

## Manual Checks Required

- **Moderator:** disposition QA-031 and QA-032 (no rework proposed), then record QA acceptance.
- **Optional human visual pass:** QA checked geometry, focus, and copy programmatically and inspected screenshots, for example the Workflow list at 768px. It did not judge visual polish beyond legibility and layout integrity.
- **Optional screen reader check:** QA did not test with NVDA or VoiceOver how the card button names or the new KPI are announced. A card's accessible name is its full text content, which is long but complete.

---

## Known Limitations

- Categorical workflow behavior, Error exit Evidence, and the "Failed" instance-state label are spec-covered or code-reviewed only. Replay browser data exposes numeric workflow Divergences with "Completed" runtime states only.
- Loading, unavailable/retry, no-Divergence, and `resolved`-status paths still do not occur with replay data. QA verified them from specs and code. Those specs exercise the shared state paths, mostly with Document-stream repository stubs. They are not duplicated per stream.
- Equal-key sort stability could be observed in the browser for only one pair (the two Approval Divergences). Broader stability relies on the facade and filter specs.
- The browser check used Chromium only. QA did not mutation-test the specs, because that would require editing implementation files.

---

## Recommended Routing

QA does not implement fixes. No rework is proposed.

1. The Moderator dispositions QA-031 and QA-032.
2. The Moderator records QA acceptance of this review in the register.
3. The STEP-07 final Moderator gate follows.

QA does not accept its own review.

MOD-W v5.0.1
