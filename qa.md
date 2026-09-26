# QA Review - STEP-06

**Project:** IDP-Align  
**Step:** STEP-06 - Divergence Analysis Chart View  
**QA date:** 2026-09-26  
**QA role:** Claude Code, acting as QA (not Development Team, not Tech Lead). QA did not edit implementation files, `step-06.md`, `review.md`, or the Moderator Register.  
**Repository state reviewed:** `master` `194437b` ("feat(step-06): add divergence analysis view"), clean working tree.  
**Tech Lead input:** `review.md` Tech Lead Review - STEP-06, verdict "Pass for QA", accepted by the Moderator in A-050  
**Verdict:** **Pass with notes.** All 25 acceptance checks pass. AC7 (categorical) passes on spec evidence only, because replay data has no categorical Divergence. There are no implementation blockers and no findings above Info.

The STEP-05 QA record is preserved at tag `step-05` (`aedd71f`). `qa.md` at that tag is identical to `qa.md` at `194437b`.

---

## Gate Check

| Gate | Register entry | Result |
| --- | --- | --- |
| Step approval before Development Team briefing | A-048 | Present. Committed in `9da93ad` / `61e39a5`, before implementation. |
| Implementation-plan approval | A-049 | Present. Committed in `d743120`, before `194437b`. It approves the in-page pattern, same-Identity-Slice visible options, Evidence-only series, and scratchpad browser evidence. |
| Tech Lead review acceptance before QA | A-050 | Present. Committed in `b4e6509`. It accepts `review.md` "Pass for QA" with no Must Fix or Could Fix Later findings. |

A-050 and `review.md` describe the reviewed package as "uncommitted". It was then committed as `194437b` together with `review.md`. The committed package matches the Tech Lead evidence exactly: 30 files and 470 tests, initial total 266.65 kB, and `dashboard-component` 250.58 kB. See QA-030.

---

## Scope Of Review

`194437b` changes 20 files:

- **New shared UI:** `divergence-analysis-view.ts` (view-model projections), `divergence-analysis/` (analysis component), and `divergence-chart/` (Chart.js wrapper, `chart-factory.ts`, chart model), each with specs.
- **Dashboard:** `dashboard.component.ts/html`, a new `dashboard-analysis.scss`, `dashboard.facade.ts` (`analysisOptions`), and their specs.
- **Test helper:** `src/testing/fake-chart-factory.ts`.
- **Role artifact:** `review.md`.

Unchanged between `aedd71f` and `194437b`: `src/app/domain/`, `src/app/data/` (including replay fixtures), `src/app/features/about/`, `app.routes.ts`, `package.json`, `angular.json`, and `src/index.html`. `chart.js` ^4.5.1 and `chartjs-plugin-annotation` ^3.1.0 were already declared dependencies.

The only removed spec line is the STEP-05 "no action buttons in list/detail" guardrail. It was widened to allow exactly one `open-analysis` button, and it still blocks every other button plus `a, input, select, textarea`. `review.md` already accepts this change. No other STEP-05 spec was removed or weakened.

---

## Automated Command Results (Node.js v26.0.0 via fnm)

| Command | Result |
| --- | --- |
| `fnm exec --using=v26.0.0 node --version` | `v26.0.0` |
| `fnm exec --using=v26.0.0 npm.cmd run lint` | **Passed.** "All files pass linting." |
| `fnm exec --using=v26.0.0 npm.cmd run build` | **Passed.** No warnings. Initial total 266.65 kB raw / 76.40 kB transfer. `dashboard-component` 250.58 kB / 70.22 kB. `about-component` 10.41 kB / 3.06 kB (unchanged from STEP-05). |
| `fnm exec --using=v26.0.0 npm.cmd test -- --watch=false` | **Passed.** 30 test files, 470 tests. Exit 0. |

These results match `review.md` and A-050. All three commands ran outside the sandbox, so the known `spawn EPERM` did not occur.

---

## Static Checks

| Check | Result |
| --- | --- |
| Bundled Chart.js | `chart-factory.ts` imports `chart.js` (tree-shaken `Chart.register` of line, bar, point, linear, and category parts) and `chartjs-plugin-annotation` from npm. |
| No CDN or runtime script loading | No `cdn`, `jsdelivr`, `unpkg`, `cdnjs`, or `<script>` appears in `src`. The built `index.html` has one local module script. The built JS contains no third-party script URLs. The only URLs are pre-existing documentation links, W3C namespaces, and Angular's own security-docs string. |
| No direct fixture imports | No `data/replay` or `fixture` reference appears in non-spec files under `features/` or `shared/`. |
| No live access | No `HttpClient`, `fetch(`, or `XMLHttpRequest` appears in `features/` or `shared/`. |
| No recomputation | `toDivergenceChartModel` maps `evidence.items` values and `withinBaseline` flags, and `baseline.summary.mean` / `baseline.range`. Categorical shares use the existing `baselineShareOf` and `observed.distribution`. No detector or baseline builder is called. |
| Shared UI stays presentational | The only `inject` calls in `shared/ui/divergence` are `CHART_FACTORY` and `DestroyRef`. Dimension switching emits `dimensionSelect`, and the dashboard routes it to `selectDivergence`. |
| Metric options | `DashboardFacade.analysisOptions` returns visible Divergences in the stream's onset order with the selected Divergence's Identity Slice. It returns an empty list when nothing is selected. |
| Chart lifecycle | `afterRenderEffect` updates the chart in place for the same kind and destroys and recreates it when the kind changes. `DestroyRef.onDestroy` destroys it. Specs cover create-once, update-same, replace-on-kind-change, and destroy. |

---

## Rendered Browser Check

QA served the production build (`dist/idp-align/browser`) from a local static server and drove it with the repo's installed Playwright Chromium. The script (`qa06.cjs`), screenshots, and rendered-copy dump are in the QA session scratchpad. No repository file was added or changed. An init script counted live `ResizeObserver` observations and window `resize` listeners, so Chart.js listener leaks would show up. **Result: 72/72 checks passed.** No console errors, no page errors, and no external requests occurred.

The first run stopped at the filter step because of a script bug: option labels have padding whitespace, so the script chose the same Identity Slice. QA fixed the script, trimmed the labels, and reran everything. The results below are from the full rerun.

### Open and back (item 1)

| Check | Observed |
| --- | --- |
| Entry point | The detail pane shows "Open Divergence Analysis" only when a Divergence is selected. It is absent in the hidden-selection state. |
| Open | The analysis replaces the list/detail container. The filter bar stays visible. Focus moves to `h3#analysis-heading` ("Divergence Analysis", `tabindex=-1`). The analysis `data-divergence-id` equals the selected detail's ID. |
| Back | "Back to Divergence list" restores list/detail with the same Divergence selected. Focus returns to "Open Divergence Analysis". The canvas is removed. |
| Keyboard | Enter on the trigger opens the analysis. Tab from the heading reaches Back. Space on Back returns focus to the trigger. |
| Back after a dimension switch | The detail shows the switched-to Divergence, and exactly one card has `aria-current="true"`. |
| Stream switch while open | ArrowLeft on the tablist closes the analysis, shows the document list/detail, and keeps focus on the active tab. The canvas is removed. |

### Chart data and rendering (items 3, 5, 6)

| Check | Observed |
| --- | --- |
| Document: Alpha Office Supplies (synthetic) · Invoice, Amount | Numeric line chart with 4 Evidence markers. The Observed Baseline range box is 1,149.38–1,287.92 and the dashed mean is 1,218.65. A vertical onset line sits at 31 Aug. The y-axis title is "Amount" and the x-axis title is "Observed at (UTC)". |
| Evidence-only series | The table values (1,872.40, 1,905.00, 1,846.20, 1,889.60) exactly match the STEP-04 Evidence Trace values in the detail pane for the same Divergence. Every row says "Outside the Observed Baseline", matching "4 of 4". |
| Side context | Evidence observations, Observed Baseline, Observed, Magnitude (+659.65, +54.1%, +28.6 SD), Onset, Duration (10 d 0 h), and Latest observed all appear, plus the status badge (Ongoing) and the existing Baseline Reference Panel. |
| Workflow: Approval, Response time | 6 Evidence markers well above the 31 min–1 h 11 min band. Mean 51 min. Onset 5 Sep. The chart is consistent with the side context and the 6 table rows. |
| Rendering | The canvas draws non-transparent pixels in every opened state (for example 47,268 px on the document chart). |

### Categorical coverage limitation (item 7)

**Replay browser data exposes numeric Divergences only.** Every Divergence rendered in the browser was `data-chart-kind="numeric"`: document Amount, and workflow Task duration, Response time, and Workflow runtime. QA could not render categorical behavior in the browser. It is **spec-covered only**:

- `divergence-analysis-view.spec.ts`, "categorical chart model": carries no numeric band, mean, or range. The summary says "A categorical Observed Baseline has no numeric range, so none is drawn." The table lists each value's reference share.
- `divergence-chart.component.spec.ts`: renders grouped share bars and the minimum-share line with no box annotation. The categorical legend has no range or band. The chart is replaced when the kind changes.
- `divergence-analysis.component.spec.ts`: "should explain the categorical chart without a numeric band".

QA also checked the code: `categoricalConfig` defines only the `minValueShare` line annotation, with no box.

### Metric switching (items 4, 8, 10)

| Check | Observed |
| --- | --- |
| Options | Workflow Approval Identity Slice: "Task duration" and "Response time" in a `role="group"` labeled "Dimension", with `aria-pressed` on each button. Workflow runtime and the document Divergence show a single text label: "Dimension: … No other Divergence in this Identity Slice is shown under the current filters." |
| Keyboard switch | Tab moves between the toggle buttons, and Enter on "Response time" switches. `aria-pressed` moves to it, focus stays on it, and activating the pressed option again is a no-op. |
| Coherence | The analysis Divergence ID, canvas `aria-label`, chart summary, side context, and table all update together. Still one canvas, redrawn. |
| Sort while open | Changing Sort by does not reorder the options (onset order, as designed). |
| Filters while open | Filtering to another Identity Slice shows "The selected Divergence is hidden by the current filters…" with no canvas. Clear filters restores the same Divergence and chart, and focus stays on Clear filters. Filtering to the same slice keeps both options. |

### Accessibility summaries (item 9)

The canvas has `role="img"`, a descriptive `aria-label`, and `aria-describedby="analysis-chart-summary"`, which resolves to a visible `figcaption` text summary. A visible text legend and a captioned data table ("Chart data: Evidence observations for …") with `scope="col"` headers follow. The side context is a `<dl>` under the heading "Divergence summary".

### Chart lifecycle (item 11)

| Check | Observed |
| --- | --- |
| Before opening | 0 canvases, 0 live ResizeObserver observations, 0 window `resize` listeners. |
| While open | Exactly 1 canvas, 1 live observation, and 1 `resize` listener. |
| After 10 metric switches and 5 back/reopen cycles | Still 1 canvas, 1 live observation, and 1 `resize` listener. No growth. |
| After closing | 0 canvases, 0 live observations, and 0 `resize` listeners, the same as the initial state. |

### Responsive layouts (item 10)

The table shows analysis-view geometry on the Workflow Approval Divergence. "Clipped" counts toggle and Back buttons outside the viewport.

| Width | List/detail (STEP-05) | Analysis layout | Canvas | Clipped controls | Page overflow |
| --- | --- | --- | --- | --- | --- |
| 1440px | Two-column (612 / 764) | Chart and side context side by side | 895×320 | 0 | No |
| 1280px | Two-column (540 / 676) | Side by side | 788×320 | 0 | No |
| 1279px | Stacked (1231) | Stacked | 1197×320 | 0 | No |
| 768px | Stacked (736) | Stacked | 702×320 | 0 | No |
| 375px | Stacked (343) | Stacked | 309×260 | 0 | No |

The list/detail widths at 1440/1280/1279 match STEP-05 QA exactly. At 375px, axis ticks and legend stay readable, and the data table wraps within its container without horizontal scrolling.

### STEP-05 regression (item 12)

| Check | Observed |
| --- | --- |
| Tabs | Only the active tab carries `aria-controls`, and it resolves to the rendered panel. ArrowLeft switches stream and focus. |
| Filters, sort, hidden selection | Identity Slice filtering, Clear filters (focus kept), and hidden-selection copy in both list/detail and analysis work. Selecting a card and then filtering it out shows `detail-hidden` with no open-analysis button. |
| Breakpoints | 1280px is two-column and 1279px is stacked, unchanged. |
| Loading, unavailable, empty | Not reachable with replay data, as in STEP-05. The STEP-05 specs for these states all still pass (part of 470). The analysis only opens from a selected Divergence and closes on stream switch, so it cannot be open over those states. |

### Wording probes (item 13)

QA scanned the full rendered analysis text for the document Amount, workflow Approval, and workflow runtime Divergences:

| Probe | Result |
| --- | --- |
| Severity / risk | None |
| Causation / Attribution | None |
| Business judgment (failure, defect, non-conformance, violation, breach, incorrect, wrong) | None |
| Alert / anomaly / warning | None |
| Live access / support / tenant | None |
| Level 2+ / reserved Level 3+ terms | None |
| User actions (mute, mark reviewed, resolve, export, copy details, assign, comment, investigation) | None |

A probe over the diff's added lines found only code identifiers and guardrail assertions. Guardrail specs apply `CLAIM_GUARDRAIL_PATTERNS` and `SEVERITY_RISK_PATTERN` to all analysis copy.

---

## Acceptance Check Results (`mod-w/step-06.md`)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| AC1 | Register contains STEP-06 Step approval before briefing | Pass | A-048. See Gate Check. |
| AC2 | Analysis reachable from the selected Divergence, with a clear accessible path back | Pass | Browser open/back, keyboard, and focus handoff. |
| AC3 | Chart.js and annotation plugin bundled; no CDN or runtime script loading | Pass | Static checks. No external requests in the browser. |
| AC4 | Uses existing Divergence, Observed Baseline, and Evidence; no direct fixture imports | Pass | Static checks. Table equals the Evidence Trace. |
| AC5 | No baseline recomputation or detection | Pass | `toDivergenceChartModel` and `analysis*` helpers only project. The domain is unchanged. |
| AC6 | Numeric: observed vs Observed Baseline, readable axes, markers, band | Pass | Browser screenshots in both streams. See QA-028 for tick readability. |
| AC7 | Categorical: truthful, no fake numeric band | **Pass with note** | Spec-covered only. Replay data has no categorical Divergence. See "Categorical coverage limitation". |
| AC8 | Metric options derived from selected-stream data; switching updates chart and summary coherently | Pass | `analysisOptions` plus the browser switching checks. |
| AC9 | Side context: baseline, observed, magnitude, onset, duration, latest, status | Pass | Browser side context. |
| AC10 | Accessible non-canvas summary or table | Pass | Figcaption summary, text legend, and captioned table. |
| AC11 | Toggles expose selected state and are keyboard-operable | Pass | `aria-pressed`, Tab/Enter/Space, and focus retained. |
| AC12 | Chart lifecycle clean, no duplicate canvases or listeners | Pass | Instrumented browser counts and lifecycle specs. |
| AC13 | Selection coherent on stream switch, filters, and no Divergence available | Pass | Stream switch closes the analysis. Filter-hidden copy. Clear filters restores. The no-selection `analysis-empty` branch is spec/template-covered. |
| AC14 | Loading, unavailable, no-Divergence, and filtered-hidden states truthful, with no broken chart | Pass | Hidden state has no canvas (browser). Other states are unreachable with replay data. STEP-05 specs pass. |
| AC15 | Responsive without clipped controls or overlapping text | Pass | Geometry table and screenshots at 1440/1280/1279/768/375. |
| AC16 | STEP-05 filters, sorting, states, keyboard, and 1279/1280 do not regress | Pass | Regression table. All STEP-05 specs are retained and pass. |
| AC17 | Shared Divergence UI stays presentational | Pass | Static checks. |
| AC18 | No About copy or tests changed | Pass | No About files in the diff. The About chunk is unchanged at 10.41 kB. |
| AC19 | No fixtures, detectors, live calls, credentials, OAuth, backend/proxy, or adapters | Pass | Diff scope and static checks. |
| AC20 | No Level 2+, Intent, Level 3+, Attribution, business judgment, alert/anomaly, or severity-as-risk claims | Pass | Wording probes and guardrail specs. |
| AC21 | Unit/component tests cover mapping, switching, selection, a11y, numeric/categorical, and lifecycle | Pass | `divergence-analysis-view.spec.ts`, `divergence-chart.component.spec.ts`, `divergence-analysis.component.spec.ts`, and the dashboard component and facade specs. |
| AC22 | Browser or rendered checks cover rendering, switching, keyboard, and responsive | Pass | This QA browser check, independent of the Development Team evidence. |
| AC23 | `npm run lint` on v26.0.0 | Pass | See above. |
| AC24 | `npm run build` on v26.0.0 | Pass | See above. |
| AC25 | `npm test -- --watch=false` on v26.0.0 | Pass | 30 files, 470 tests. |

### Design ID check

| Design ID | Result |
| --- | --- |
| DS-015 | In-page analysis (as approved in A-049): observed Evidence vs Observed Baseline mean and range, onset marker, metric switching, and side summary. "Full-screen" is replaced by the in-page pattern, per the Step's conflict resolution. |
| DS-005 | The selected Divergence stays the single source of truth across open, switch, back, and filters. |
| DS-006 | The existing Baseline Reference Panel is reused in the side context. |
| DS-007 | The table rows are the Divergence's Evidence observations, identical to the Evidence Trace and unmodified. |
| DS-013 | The existing status badge and lifecycle description appear. No new status semantics. |

---

## Findings

### QA-028 - Info (cosmetic): numeric y-axis ticks fall on uneven duration values

Chart.js chooses the y-axis tick positions, and `formatDimensionValue` then formats them. For duration dimensions the labels are uneven, for example "2 h 13 min, 1 h 57 min, 1 h 40 min … 33 min, 17 min" (Response time at 1440px) and "22 h 13 min, 19 h 27 min, 16 h 40 min …" (Task duration at 375px). The labels are accurate and readable, and the band, mean, and markers sit correctly. `review.md` already notes this.  
**Proposed disposition:** No rework for STEP-06. The Moderator may carry it to a later polish pass, such as duration-aligned `stepSize`.

### QA-029 - Info (accessibility, latent): the table's horizontal scroll container is not keyboard-focusable

`.table-scroll` in `divergence-analysis.component.scss` sets `overflow-x: auto`, but the wrapper has no `tabindex`, role, or label. If the table ever scrolled horizontally, keyboard-only users could not scroll it. **This does not occur today:** the table did not scroll horizontally at any tested width, including 375px, where it wraps.  
**Proposed disposition:** No rework. Carry it to a later accessibility pass if wider tables appear.

### QA-030 - Info (process / traceability): `review.md` was committed with the implementation

A-049 and A-050 were committed separately and in order before `194437b`, which addresses the QA-027 carry-forward note for approvals. `review.md` itself was committed in the implementation commit `194437b`, and A-050 describes the package as "uncommitted". The committed package matches the Tech Lead evidence exactly (470 tests and identical bundle sizes).  
**Proposed disposition:** No action. Recorded for traceability only.

---

## Regressions Or Risks

- No functional regressions. All STEP-05 specs are retained and pass. Only the action-button guardrail was widened, and only for `open-analysis`. The STEP-05 browser behavior and breakpoints match STEP-05 QA.
- **Replay coverage gap:** no categorical Divergence exists, and multi-option switching exists only for the Workflow Approval Identity Slice. Other dimension combinations are covered by specs with builder data.
- **Chart colors** are read from CSS tokens when the chart is configured. The app has no theme switching today, so they cannot go stale. A future theme toggle would need the chart to re-read them.
- **Carried forward, unchanged:** QA-014, QA-019, and QA-024 (day-scale duration precision, visible as "10 d 0 h" and "7 d 1 h") remain as dispositioned earlier. QA-027 remains a process note.

---

## Manual Checks Required

- **Moderator:** disposition QA-028, QA-029, and QA-030 (no rework proposed), then record QA acceptance.
- **Optional human visual pass:** QA checked geometry, focus, and copy programmatically and inspected screenshots at 1440px and 375px. It did not judge visual polish of the chart colors against the dark theme beyond legibility.
- **Optional screen reader check:** QA did not test with NVDA or VoiceOver how the canvas `role="img"` name and description, the `aria-pressed` toggles, or the focus move to the analysis heading are announced.

---

## Known Limitations

- Categorical chart behavior is spec-covered only. Replay browser data exposes numeric Divergences only.
- Loading, unavailable/retry, no-Divergence, and `resolved`-status paths still do not occur with replay data. QA verified them from specs and code.
- QA read the chart contents from screenshots and from the table and summary text, not from the Chart.js instance. Chart.js is module-scoped in the bundle and not reachable from the page.
- The browser check used Chromium only. QA did not mutation-test the specs, because that would require editing implementation files.

---

## Recommended Routing

QA does not implement fixes. No rework is proposed.

1. The Moderator dispositions QA-028, QA-029, and QA-030.
2. The Moderator records QA acceptance of this review in the register.
3. The STEP-06 final Moderator gate follows.

QA does not accept its own review.

MOD-W v5.0.1
