import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, Subject, of, throwError } from 'rxjs';
import {
  CLAIM_GUARDRAIL_PATTERNS,
  REPLAY_SOURCE_AVOID_WORDS,
  SEVERITY_RISK_PATTERN,
} from '../../../testing/claim-guardrail-patterns';
import { at, documentObservation, testDocumentSlice } from '../../../testing/observation-builders';
import { provideStreamObservationRepository } from '../../data/provide-stream-observation-repository';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { DocumentIdentitySlice } from '../../domain/identity-slice';
import { StreamKind } from '../../domain/stream';
import { DashboardComponent } from './dashboard.component';

/** Claim guardrails plus the dashboard-only severity/risk check (STEP-05). */
const DASHBOARD_GUARDRAIL_PATTERNS = {
  ...CLAIM_GUARDRAIL_PATTERNS,
  severityOrRisk: SEVERITY_RISK_PATTERN,
};

/** A replay Identity Slice per stream with no Divergences, for filtered-empty checks. */
const UNMATCHED_SLICE: Readonly<Record<StreamKind, string>> = {
  document: 'Beta Freight Services (synthetic) · Invoice',
  workflow: 'Invoice approval (synthetic) · Invoice review',
};

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
/** Rendered text with every text node separated, so word-boundary guardrail patterns apply. */
const spacedText = (root: Element | null | undefined) => {
  if (!root) return '';
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? '');
  return normalize(parts.join(' '));
};
/** Text of each child element, joined with spaces (dt/dd pairs render without whitespace). */
const childText = (el: Element | null | undefined) =>
  Array.from(el?.children ?? []).map(c => normalize(c.textContent)).join(' ');

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let el: HTMLElement;

  const tab = (kind: string) =>
    el.querySelector<HTMLButtonElement>(`[data-testid="stream-tab-${kind}"]`)!;
  const pressKey = (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  };
  const replaySource = () => el.querySelector('[data-testid="stream-replay-source"]');
  const cards = () =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('[data-testid="divergence-card"]'));
  const cardSummary = () =>
    cards().map(c => [
      normalize(c.querySelector('[data-testid="card-identity-slice"]')?.textContent),
      normalize(c.querySelector('[data-testid="card-dimension"]')?.textContent),
      normalize(c.querySelector('[data-testid="status-badge"]')?.textContent),
    ]);
  const detail = () => el.querySelector<HTMLElement>('[data-testid="divergence-detail"]');
  const detailStat = (label: string) =>
    normalize(el.querySelector(`[data-testid="detail-stat"][data-stat="${label}"]`)?.textContent);
  const evidenceItems = () =>
    Array.from(el.querySelectorAll<HTMLElement>('[data-testid="evidence-item"]'));
  const kpiValues = () =>
    Array.from(el.querySelectorAll('[data-testid="kpi-value"]')).map(v => normalize(v.textContent));
  const switchTo = (stream: StreamKind) => {
    component.selectStream(stream);
    fixture.detectChanges();
  };
  const control = (testId: string) =>
    el.querySelector<HTMLSelectElement>(`[data-testid="${testId}"]`)!;
  const optionLabels = (testId: string) =>
    Array.from(control(testId).options).map(o => normalize(o.textContent));
  const selectedLabel = (testId: string) =>
    normalize(control(testId).selectedOptions[0]?.textContent);
  /** Picks an option by its visible label, as a user would. */
  const choose = (testId: string, label: string) => {
    const select = control(testId);
    const option = Array.from(select.options).find(o => normalize(o.textContent) === label);
    if (!option) throw new Error(`No "${label}" option in ${testId}`);
    select.value = option.value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };
  const clearButton = () => el.querySelector<HTMLButtonElement>('[data-testid="clear-filters"]')!;
  const resultSummary = () => normalize(el.querySelector('[data-testid="result-summary"]')?.textContent);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideStreamObservationRepository()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard header with CAV Level 1 framing', () => {
    expect(el.querySelector('.dashboard-header h1')?.textContent).toContain('IDP-Align Dashboard');
    expect(el.querySelector('.stream-subtitle')?.textContent).toContain('CAV Level 1');
  });

  it('should describe active sustained Divergence detection truthfully', () => {
    expect(normalize(el.querySelector('[data-testid="foundation-note"]')?.textContent)).toBe(
      'Sustained Divergence detection runs over synthetic replay data. Surfaced Divergences ' +
        'describe observed behavior and do not assess business correctness.'
    );
    expect(el.textContent).not.toMatch(/no Divergences are shown yet|added in later Steps/i);
  });

  describe('stream tabs', () => {
    it('should expose a tablist with two tabs', () => {
      expect(el.querySelector('[role="tablist"]')).toBeTruthy();
      expect(el.querySelectorAll('[role="tab"]').length).toBe(2);
    });

    it('should default to the document stream with semantic selected state', () => {
      expect(component.activeStream()).toBe('document');
      expect(tab('document').getAttribute('aria-selected')).toBe('true');
      expect(tab('workflow').getAttribute('aria-selected')).toBe('false');
      expect(tab('document').tabIndex).toBe(0);
      expect(tab('workflow').tabIndex).toBe(-1);
    });

    it('should link the selected tab to the tab panel', () => {
      const panel = el.querySelector('[role="tabpanel"]')!;
      expect(tab('document').getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(tab('document').id);
    });

    it('should not point an inactive tab at a panel that is not rendered', () => {
      for (const stream of ['document', 'workflow'] as const) {
        switchTo(stream);
        const inactive = stream === 'document' ? 'workflow' : 'document';

        expect(tab(inactive).hasAttribute('aria-controls')).toBe(false);
        for (const t of Array.from(el.querySelectorAll('[role="tab"][aria-controls]'))) {
          expect(el.querySelector(`#${t.getAttribute('aria-controls')}`)).toBeTruthy();
        }
      }
    });

    it('should leave the tab panel out of the tab order when it holds focusable cards', () => {
      const panel = el.querySelector<HTMLElement>('[role="tabpanel"]')!;

      expect(panel.querySelectorAll('button:not([disabled])').length).toBeGreaterThan(0);
      expect(panel.hasAttribute('tabindex')).toBe(false);
    });

    it('should keep heading hierarchy under the view heading', () => {
      expect(el.querySelectorAll('h1').length).toBe(1);
      expect(el.querySelector('[data-testid="stream-heading"]')?.tagName).toBe('H2');
      expect(detail()?.querySelector('h3')).toBeTruthy();
      expect(Array.from(detail()!.querySelectorAll('h4')).map(h => h.textContent)).toEqual([
        'Observed Baseline',
        'Evidence trace',
      ]);
    });

    it('should switch to workflow stream on click and update aria-selected', () => {
      tab('workflow').click();
      fixture.detectChanges();

      expect(component.activeStream()).toBe('workflow');
      expect(tab('workflow').getAttribute('aria-selected')).toBe('true');
      expect(tab('document').getAttribute('aria-selected')).toBe('false');
      expect(el.querySelector('[role="tabpanel"]')!.id).toBe('stream-panel-workflow');
    });

    it('should switch back to document stream on click', () => {
      switchTo('workflow');

      tab('document').click();
      fixture.detectChanges();

      expect(component.activeStream()).toBe('document');
    });

    it('should support arrow, Home, and End keys', () => {
      pressKey(tab('document'), 'ArrowRight');
      expect(component.activeStream()).toBe('workflow');
      expect(document.activeElement).toBe(tab('workflow'));

      pressKey(tab('workflow'), 'ArrowRight');
      expect(component.activeStream()).toBe('document');

      pressKey(tab('document'), 'ArrowLeft');
      expect(component.activeStream()).toBe('workflow');

      pressKey(tab('workflow'), 'Home');
      expect(component.activeStream()).toBe('document');

      pressKey(tab('document'), 'End');
      expect(component.activeStream()).toBe('workflow');
    });
  });

  describe('stream-specific shell content', () => {
    it('should show document stream context by default', () => {
      expect(el.querySelector('[data-testid="stream-heading"]')?.textContent).toContain('Document stream');
      expect(el.querySelector('[data-testid="stream-source-note"]')?.textContent).toContain(
        'DocuWare Platform REST API'
      );
      expect(el.querySelector('[data-testid="filter-bar"]')?.textContent).toContain('vendor / document type');
    });

    it('should show workflow stream context after switching', () => {
      switchTo('workflow');

      expect(el.querySelector('[data-testid="stream-heading"]')?.textContent).toContain('Workflow stream');
      expect(el.querySelector('[data-testid="stream-source-note"]')?.textContent).toContain(
        'DocuWare Workflow Analytics API'
      );
      expect(el.querySelector('[data-testid="filter-bar"]')?.textContent).toContain('workflow step / route');
    });

    it('should render enabled filter and sort controls with repository Identity Slices', () => {
      const selects = el.querySelectorAll<HTMLSelectElement>('.filter-select');
      expect(selects.length).toBe(4);
      selects.forEach(s => expect(s.disabled).toBe(false));

      expect(optionLabels('filter-identity-slice')).toEqual([
        'All Identity Slices',
        'Alpha Office Supplies (synthetic) · Credit note',
        'Alpha Office Supplies (synthetic) · Invoice',
        'Beta Freight Services (synthetic) · Credit note',
        'Beta Freight Services (synthetic) · Invoice',
        'Gamma Facilities Care (synthetic) · Credit note',
        'Gamma Facilities Care (synthetic) · Invoice',
      ]);
      expect(el.textContent).not.toContain('Filters become available in a later Step.');
    });
  });

  describe('filter and sort controls', () => {
    it('should offer time range presets measured from the latest observation', () => {
      expect(optionLabels('filter-timerange')).toEqual([
        'All observations',
        'Last 30 days of observations',
        'Last 7 days of observations',
      ]);
      expect(normalize(el.querySelector('[data-testid="time-range-note"]')?.textContent)).toBe(
        'Measured back from the latest observation in this stream, 11 Sep 2026 (UTC).'
      );
      expect(control('filter-timerange').getAttribute('aria-describedby')).toBe('time-range-note');
    });

    it('should offer only the lifecycle statuses present in the stream', () => {
      expect(optionLabels('filter-status')).toEqual(['All statuses', 'Ongoing']);
    });

    it('should offer onset, Identity Slice, dimension, and status sort options', () => {
      expect(optionLabels('sort-select')).toEqual([
        'Onset (earliest first)',
        'Identity Slice (A–Z)',
        'Dimension (A–Z)',
        'Status (lifecycle order)',
      ]);
      expect(control('sort-select').value).toBe('onset');
    });

    it('should list the workflow stream Identity Slices after switching', () => {
      switchTo('workflow');

      expect(optionLabels('filter-identity-slice')).toEqual([
        'All Identity Slices',
        'Invoice approval (synthetic) · Approval',
        'Invoice approval (synthetic) · Invoice review',
        'Invoice approval (synthetic) · Payment release',
        'Invoice approval (synthetic) · Workflow runtime',
      ]);
    });

    it('should narrow the list by Identity Slice', () => {
      switchTo('workflow');

      choose('filter-identity-slice', 'Invoice approval (synthetic) · Approval');

      expect(cardSummary()).toEqual([
        ['Invoice approval (synthetic) · Approval', 'Task duration', 'Ongoing'],
        ['Invoice approval (synthetic) · Approval', 'Response time', 'Ongoing'],
      ]);
      expect(resultSummary()).toBe('Showing 2 of 3 Divergences');
    });

    it('should narrow the list by status', () => {
      choose('filter-status', 'Ongoing');

      expect(cardSummary().length).toBe(1);
      expect(resultSummary()).toBe('Showing 1 of 1 Divergence');
    });

    it('should keep replay Divergences observed in the last 7 days', () => {
      switchTo('workflow');

      choose('filter-timerange', 'Last 7 days of observations');

      expect(cardSummary().length).toBe(3);
    });

    it('should reorder the list by the chosen sort', () => {
      switchTo('workflow');

      choose('sort-select', 'Dimension (A–Z)');

      expect(cardSummary().map(([, dimension]) => dimension)).toEqual([
        'Response time',
        'Task duration',
        'Workflow runtime',
      ]);
    });

    it('should keep KPI counts for the whole stream and say so', () => {
      switchTo('workflow');

      choose('filter-identity-slice', 'Invoice approval (synthetic) · Workflow runtime');

      expect(cardSummary().length).toBe(1);
      expect(kpiValues()).toEqual(['3', '3', '0', '—']);
      expect(normalize(el.querySelector('[data-testid="kpi-scope-note"]')?.textContent)).toBe(
        'Counts include every Divergence in this stream. Filters do not change them.'
      );
    });
  });

  describe('filtered-empty state', () => {
    beforeEach(() => choose('filter-identity-slice', 'Beta Freight Services (synthetic) · Invoice'));

    it('should distinguish no matches under filters from no Divergences', () => {
      expect(cards().length).toBe(0);
      expect(el.querySelector('[data-testid="empty-state"]')).toBeNull();
      expect(normalize(el.querySelector('[data-testid="filtered-empty-state"]')?.textContent)).toBe(
        'No matching Divergences No Divergences in the Document stream match the current filters. ' +
          '1 Divergence is hidden. Use Clear filters to show them.'
      );
      expect(resultSummary()).toBe('Showing 0 of 1 Divergence');
    });

    it('should show no stale detail', () => {
      expect(detail()).toBeNull();
      expect(normalize(el.querySelector('[data-testid="detail-empty"]')?.textContent)).toBe(
        'No Divergence to show under the current filters.'
      );
    });

    it('should keep the filter controls available to change or clear', () => {
      expect(control('filter-identity-slice').disabled).toBe(false);
      expect(clearButton().disabled).toBe(false);
      expect(clearButton().hasAttribute('aria-disabled')).toBe(false);
    });

    it('should add no reset control of its own', () => {
      expect(el.querySelector('[data-testid="filtered-empty-state"] button')).toBeNull();
    });
  });

  describe('clear filters', () => {
    it('should be focusable but aria-disabled while no filter is set', () => {
      expect(clearButton().disabled).toBe(false);
      expect(clearButton().getAttribute('aria-disabled')).toBe('true');

      clearButton().focus();
      clearButton().click();
      fixture.detectChanges();

      expect(document.activeElement).toBe(clearButton());
      expect(cardSummary().length).toBe(1);
    });

    it('should reset the filters and restore the Divergences', () => {
      switchTo('workflow');
      choose('filter-identity-slice', 'Invoice approval (synthetic) · Invoice review');
      choose('filter-timerange', 'Last 30 days of observations');
      expect(cards().length).toBe(0);

      clearButton().focus();
      clearButton().click();
      fixture.detectChanges();

      expect(cardSummary().length).toBe(3);
      expect(control('filter-identity-slice').value).toBe('');
      expect(control('filter-timerange').value).toBe('all');
      expect(clearButton().getAttribute('aria-disabled')).toBe('true');
      expect(document.activeElement).toBe(clearButton());
    });

    it('should keep the chosen sort', () => {
      switchTo('workflow');
      choose('sort-select', 'Status (lifecycle order)');
      choose('filter-status', 'Ongoing');

      clearButton().click();
      fixture.detectChanges();

      expect(control('sort-select').value).toBe('status');
    });
  });

  describe('selection and detail under filters', () => {
    beforeEach(() => {
      switchTo('workflow');
      cards()[2].click();
      fixture.detectChanges();
    });

    it('should say the selected Divergence is hidden instead of showing stale detail', () => {
      choose('filter-identity-slice', 'Invoice approval (synthetic) · Approval');

      expect(detail()).toBeNull();
      expect(normalize(el.querySelector('[data-testid="detail-hidden"]')?.textContent)).toBe(
        'The selected Divergence is hidden by the current filters. Choose a Divergence from the ' +
          'list, or clear filters to show it again.'
      );
      expect(cards().some(c => c.getAttribute('aria-current') === 'true')).toBe(false);
    });

    it('should show the selected Divergence again after clearing filters', () => {
      const runtimeId = detail()?.dataset['divergenceId'];
      choose('filter-identity-slice', 'Invoice approval (synthetic) · Approval');

      clearButton().click();
      fixture.detectChanges();

      expect(detail()?.dataset['divergenceId']).toBe(runtimeId);
      expect(cards()[2].getAttribute('aria-current')).toBe('true');
    });

    it('should let another visible Divergence be chosen while one is hidden', () => {
      choose('filter-identity-slice', 'Invoice approval (synthetic) · Approval');

      cards()[1].click();
      fixture.detectChanges();

      expect(normalize(detail()?.textContent)).toContain('Dimension: Response time');
    });

    it('should keep the selection when the sort changes', () => {
      const runtimeId = detail()?.dataset['divergenceId'];

      choose('sort-select', 'Dimension (A–Z)');

      expect(detail()?.dataset['divergenceId']).toBe(runtimeId);
    });
  });

  describe('stream switching with filters', () => {
    it("should keep each stream's own filters and sort", () => {
      switchTo('workflow');
      choose('filter-identity-slice', 'Invoice approval (synthetic) · Approval');
      choose('sort-select', 'Dimension (A–Z)');

      switchTo('document');
      expect(cardSummary().length).toBe(1);
      expect(control('filter-identity-slice').value).toBe('');
      expect(control('sort-select').value).toBe('onset');
      expect(clearButton().getAttribute('aria-disabled')).toBe('true');

      switchTo('workflow');
      expect(selectedLabel('filter-identity-slice')).toBe('Invoice approval (synthetic) · Approval');
      expect(control('sort-select').value).toBe('dimension');
      expect(cardSummary().map(([, dimension]) => dimension)).toEqual(['Response time', 'Task duration']);
    });

    it('should keep a filtered-empty stream after switching away and back', () => {
      choose('filter-identity-slice', 'Beta Freight Services (synthetic) · Invoice');

      switchTo('workflow');
      expect(cardSummary().length).toBe(3);

      switchTo('document');
      expect(el.querySelector('[data-testid="filtered-empty-state"]')).toBeTruthy();
    });
  });

  describe('summary KPIs', () => {
    it('should show total, ongoing, resolved, and trend regions', () => {
      const labels = Array.from(el.querySelectorAll('.kpi-label')).map(l => l.textContent?.trim());
      expect(labels).toEqual(['Total Divergences', 'Ongoing', 'Resolved', 'Trend']);
    });

    it('should count the document stream Divergences', () => {
      expect(kpiValues()).toEqual(['1', '1', '0', '—']);
      expect(el.querySelector('[data-testid="kpi-card-document-total"]')?.textContent).toContain(
        'Across vendor / document type Identity Slices'
      );
    });

    it('should count the workflow stream Divergences after switching', () => {
      switchTo('workflow');

      expect(kpiValues()).toEqual(['3', '3', '0', '—']);
      expect(el.querySelector('[data-testid="kpi-card-workflow-total"]')?.textContent).toContain(
        'Across workflow step and runtime Identity Slices'
      );
    });

    // QA-019: the Resolved count is a finding lifecycle status only.
    it('should present the resolved count as a lifecycle status', () => {
      const resolved = el.querySelector('[data-testid="kpi-card-document-resolved"]');

      expect(childText(resolved)).toBe('Resolved 0 Finding lifecycle status');
    });

    it('should keep trend as a non-chart placeholder', () => {
      const trend = el.querySelector('[data-testid="kpi-card-document-trend"]');

      expect(trend?.textContent).not.toMatch(/\d/);
      expect(trend?.textContent).toContain('Trend analysis is added in a later Step');
      expect(el.querySelector('canvas, svg')).toBeNull();
    });
  });

  describe('Divergence list', () => {
    it('should render the document stream Divergence from replay data', () => {
      expect(cardSummary()).toEqual([
        ['Alpha Office Supplies (synthetic) · Invoice', 'Amount', 'Ongoing'],
      ]);
      expect(el.querySelector('[data-testid="empty-state"]')).toBeNull();
    });

    it('should render the workflow stream Divergences in onset order', () => {
      switchTo('workflow');

      expect(cardSummary()).toEqual([
        ['Invoice approval (synthetic) · Approval', 'Task duration', 'Ongoing'],
        ['Invoice approval (synthetic) · Approval', 'Response time', 'Ongoing'],
        ['Invoice approval (synthetic) · Workflow runtime', 'Workflow runtime', 'Ongoing'],
      ]);
      expect(el.querySelector('[data-testid="empty-state"]')).toBeNull();
    });

    it('should render observed, baseline, magnitude, onset, and duration on each card', () => {
      for (const stream of ['document', 'workflow'] as const) {
        switchTo(stream);
        for (const card of cards()) {
          for (const field of ['card-observed', 'card-baseline', 'card-magnitude']) {
            expect(normalize(card.querySelector(`[data-testid="${field}"]`)?.textContent)).not.toBe('');
          }
          expect(normalize(card.querySelector('[data-testid="card-timeline"]')?.textContent)).toMatch(
            /^Onset .+ · Duration .+$/
          );
        }
      }
    });
  });

  describe('selection and detail', () => {
    it('should select the first Divergence by default', () => {
      expect(cards()[0].getAttribute('aria-current')).toBe('true');
      expect(detail()?.dataset['divergenceId']).toBe(cards()[0].dataset['divergenceId']);
    });

    it('should render the document Divergence detail with Observed Baseline and Evidence', () => {
      const text = normalize(detail()?.textContent);

      expect(detail()?.querySelector('h3')?.textContent).toBe(
        'Alpha Office Supplies (synthetic) · Invoice'
      );
      expect(text).toContain('Dimension: Amount');
      expect(detailStat('Onset')).toBe('31 Aug 2026, 15:00 UTC');
      expect(detailStat('Latest observed')).toBe('10 Sep 2026, 15:00 UTC');
      expect(detailStat('Duration')).toBe('10 d 0 h');
      expect(detailStat('Magnitude')).toBe('+659.65 from baseline mean (+54.1%, +28.6 SD)');
      expect(normalize(el.querySelector('[data-testid="baseline-sample-size"]')?.textContent)).toBe(
        '8 reference observations'
      );
      expect(normalize(el.querySelector('[data-testid="baseline-reference-window"]')?.textContent)).toBe(
        '3 Aug 2026, 15:00 UTC to 31 Aug 2026, 00:00 UTC (end exclusive)'
      );
      expect(evidenceItems().map(i => i.dataset['observationId'])).toEqual([
        'document/1024',
        'document/1027',
        'document/1030',
        'document/1035',
      ]);
    });

    it('should update the detail and selected state when another card is clicked', () => {
      switchTo('workflow');
      const runtimeCard = cards()[2];

      runtimeCard.click();
      fixture.detectChanges();

      expect(cards().map(c => c.getAttribute('aria-current'))).toEqual([null, null, 'true']);
      expect(detail()?.dataset['divergenceId']).toBe(runtimeCard.dataset['divergenceId']);
      expect(normalize(detail()?.textContent)).toContain('Dimension: Workflow runtime');
      expect(evidenceItems().length).toBe(6);
    });

    it('should connect every card to the detail region', () => {
      const pane = el.querySelector('[data-testid="detail-pane"]')!;

      expect(cards().every(c => c.getAttribute('aria-controls') === pane.id)).toBe(true);
    });

    it('should render chronological workflow Evidence with observed context', () => {
      switchTo('workflow');
      const times = evidenceItems().map(i => i.querySelector('time')!.getAttribute('datetime')!);

      expect(times.length).toBe(6);
      expect([...times].sort()).toEqual(times);
      expect(evidenceItems().every(i => i.textContent?.includes('Workflow instance'))).toBe(true);
      expect(evidenceItems()[0].textContent).toContain('Decision agent');
      expect(
        evidenceItems().every(i =>
          i.querySelector('[data-testid="evidence-baseline-indicator"]')?.textContent?.includes('Outside')
        )
      ).toBe(true);
    });

    it('should offer no user actions in the list or detail', () => {
      for (const stream of ['document', 'workflow'] as const) {
        switchTo(stream);
        const regions = el.querySelector('.list-detail-container')!;
        const buttons = Array.from(regions.querySelectorAll<HTMLElement>('button'));

        expect(buttons.every(b => b.dataset['testid'] === 'divergence-card')).toBe(true);
        expect(regions.querySelectorAll('a, input, select, textarea').length).toBe(0);
        expect(regions.textContent).not.toMatch(
          /copy details|\bmute\b|mark (as )?reviewed|export|open investigation/i
        );
      }
    });
  });

  describe('stream switching', () => {
    it("should keep each stream's own selection", () => {
      switchTo('workflow');
      cards()[1].click();
      fixture.detectChanges();
      const workflowSelection = cards()[1].dataset['divergenceId'];

      switchTo('document');
      expect(cardSummary().length).toBe(1);
      expect(detail()?.textContent).toContain('Alpha Office Supplies');

      switchTo('workflow');
      expect(detail()?.dataset['divergenceId']).toBe(workflowSelection);
      expect(cards()[1].getAttribute('aria-current')).toBe('true');
    });

    it('should not show document Divergences in the workflow stream', () => {
      switchTo('workflow');

      expect(el.querySelector('.list-detail-container')?.textContent).not.toContain(
        'Alpha Office Supplies'
      );
    });
  });

  // QA-014: the Approval and Workflow runtime Divergences are sibling findings, not a chain.
  describe('workflow stream presentation without causation (QA-014)', () => {
    beforeEach(() => switchTo('workflow'));

    it('should render the Approval and Workflow runtime Divergences as ungrouped siblings', () => {
      const items = el.querySelectorAll('.divergence-cards > li');

      expect(items.length).toBe(3);
      items.forEach(item => {
        expect(item.querySelectorAll('[data-testid="divergence-card"]').length).toBe(1);
      });
    });

    it('should not reference one Divergence from another card', () => {
      const ids = cards().map(c => c.dataset['divergenceId']!);

      cards().forEach((card, i) => {
        const others = ids.filter((_, j) => j !== i);
        expect(others.some(id => card.outerHTML.includes(id))).toBe(false);
      });
    });

    it('should not imply that one Divergence caused or explains another', () => {
      for (const index of [0, 1, 2]) {
        cards()[index].click();
        fixture.detectChanges();
        const text = spacedText(el.querySelector('.list-detail-container'));

        expect(text).not.toMatch(
          /caus|because|due to|led to|result(s|ed)? (in|from)|driv|trigger|explain|related|linked|depend|attribut|root/i
        );
      }
    });

    it('should state that each Divergence has its own Observed Baseline', () => {
      expect(normalize(el.querySelector('[data-testid="list-note"]')?.textContent)).toBe(
        'Each Divergence is compared with its own Observed Baseline for one Identity Slice and dimension.'
      );
    });
  });

  describe('replay source line', () => {
    it('should state neutral document replay source facts', () => {
      expect(normalize(replaySource()?.textContent)).toBe(
        'Replay source: 38 synthetic document observations across 6 Identity Slices, ' +
          '3 Aug–11 Sep 2026 (UTC).'
      );
    });

    it('should state neutral workflow replay source facts after switching', () => {
      switchTo('workflow');

      expect(normalize(replaySource()?.textContent)).toBe(
        'Replay source: 80 synthetic workflow observations across 4 Identity Slices, 3 Aug–12 Sep 2026 (UTC).'
      );
    });

    it('should avoid wording that reads as a finding in either stream', () => {
      for (const stream of ['document', 'workflow'] as const) {
        switchTo(stream);
        expect(replaySource()?.textContent).not.toMatch(REPLAY_SOURCE_AVOID_WORDS);
      }
    });
  });

  describe('claim guardrails in rendered dashboard copy (QA-006)', () => {
    for (const stream of ['document', 'workflow'] as const) {
      describe(`${stream} stream`, () => {
        let texts: string[];

        beforeEach(() => {
          switchTo(stream);
          // Check the rendered dashboard with each Divergence of the stream selected in turn.
          texts = cards().map((_, i) => {
            cards()[i].click();
            fixture.detectChanges();
            return spacedText(el);
          });
        });

        it('should render the copy being checked, including Divergence content', () => {
          expect(texts.length).toBeGreaterThan(0);
          for (const text of texts) {
            expect(text).toContain('DocuWare');
            expect(text).toContain('Replay source:');
            expect(text).toContain('Observed Baseline');
            expect(text).toContain('Evidence trace');
          }
        });

        it('should also check the hidden-selection and filtered-empty copy', () => {
          const filteredTexts: string[] = [];
          if (stream === 'workflow') {
            choose('filter-identity-slice', 'Invoice approval (synthetic) · Approval');
            filteredTexts.push(spacedText(el));
            expect(el.querySelector('[data-testid="detail-hidden"]')).toBeTruthy();
          }
          choose('filter-identity-slice', UNMATCHED_SLICE[stream]);
          choose('filter-timerange', 'Last 7 days of observations');
          filteredTexts.push(spacedText(el));
          expect(el.querySelector('[data-testid="filtered-empty-state"]')).toBeTruthy();

          for (const text of filteredTexts) {
            for (const pattern of Object.values(DASHBOARD_GUARDRAIL_PATTERNS)) {
              expect(text).not.toMatch(pattern);
            }
          }
        });

        for (const [name, pattern] of Object.entries(DASHBOARD_GUARDRAIL_PATTERNS)) {
          it(`should not contain ${name} claims`, () => {
            for (const text of texts) {
              expect(text).not.toMatch(pattern);
            }
          });
        }
      });
    }
  });
});

describe('DashboardComponent with a non-replay repository', () => {
  const info = (streamKind: StreamKind): StreamSourceInfo => ({
    streamKind,
    sourceKind: 'replay',
    synthetic: true,
    observationCount: 3,
    identitySliceCount: 2,
    observationWindow: { from: '2025-12-30T10:00:00.000Z', to: '2026-01-02T10:00:00.000Z' },
  });

  let fixture: ComponentFixture<DashboardComponent>;

  const render = (repository: Partial<StreamObservationRepository>) => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: StreamObservationRepository,
          useValue: {
            getIdentitySlices: () => EMPTY,
            getObservations: () => EMPTY,
            getObservedTruth: () => EMPTY,
            ...repository,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };
  const byTestId = <T extends Element = HTMLElement>(el: HTMLElement, testId: string) =>
    el.querySelector<T>(`[data-testid="${testId}"]`);

  const kpiValues = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('[data-testid="kpi-value"]')).map(v => normalize(v.textContent));

  // Reference history only: an Observed Baseline is derived, but nothing is sustained after it.
  const referenceOnly = [1000, 1010, 990, 1000, 1005, 995].map((amount, i) =>
    documentObservation(`doc-${i}`, at(i), { amount })
  );
  // Three out-of-baseline invoices after the reference window make one ongoing Divergence.
  const candidateRun = [
    ...referenceOnly,
    ...[30, 31, 32].map((day, i) => documentObservation(`doc-c${i}`, at(day), { amount: 1500 })),
  ];
  // A later within-baseline invoice ends the run, so the Divergence is resolved.
  const resolvingObservation = documentObservation('doc-r', at(33), { amount: 1000 });

  it('should render whatever the repository interface provides', () => {
    const el = render({ getSourceInfo: stream => of(info(stream)) });

    expect(normalize(el.querySelector('[data-testid="stream-replay-source"]')?.textContent)).toContain(
      'Replay source: 3 synthetic document observations across 2 Identity Slices, 30 Dec 2025–2 Jan 2026 (UTC).'
    );
  });

  it('should show a truthful empty state for a stream with no Divergences', () => {
    const el = render({
      getSourceInfo: stream => of(info(stream)),
      getIdentitySlices: ((stream: StreamKind) =>
        of(stream === 'document' ? [testDocumentSlice] : [])) as StreamObservationRepository['getIdentitySlices'],
      getObservations: ((stream: StreamKind) =>
        of(stream === 'document' ? referenceOnly : [])) as StreamObservationRepository['getObservations'],
    });

    expect(normalize(el.querySelector('[data-testid="empty-state"]')?.textContent)).toBe(
      'No sustained Divergences No sustained Divergences in the Document stream replay data.'
    );
    expect(el.querySelectorAll('[data-testid="divergence-card"]').length).toBe(0);
    expect(el.querySelector('[data-testid="divergence-detail"]')).toBeNull();
    expect(normalize(el.querySelector('[data-testid="detail-empty"]')?.textContent)).toBe(
      'No Divergence to show.'
    );
    expect(kpiValues(el)).toEqual(['0', '0', '0', '—']);
  });

  it('should keep the tab panel focusable when it has no focusable content', () => {
    const el = render({
      getSourceInfo: stream => of(info(stream)),
      getIdentitySlices: (() => of([])) as StreamObservationRepository['getIdentitySlices'],
      getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
    });
    const panel = el.querySelector<HTMLElement>('[role="tabpanel"]')!;

    expect(panel.querySelectorAll('button:not([disabled])').length).toBe(0);
    expect(panel.tabIndex).toBe(0);
    panel.focus();
    expect(document.activeElement).toBe(panel);
  });

  it('should show an unavailable state, not an empty state, when Divergences cannot be read', () => {
    const el = render({
      getSourceInfo: stream => of(info(stream)),
      getIdentitySlices: () => throwError(() => new Error('unavailable')),
    });

    expect(el.querySelector('[data-testid="unavailable-state"]')?.textContent).toContain(
      'Divergence data is not available for this stream.'
    );
    expect(el.querySelector('[data-testid="empty-state"]')).toBeNull();
    expect(el.querySelector('[data-testid="detail-empty"]')).toBeTruthy();
    expect(kpiValues(el)).toEqual(['—', '—', '—', '—']);
    expect(el.querySelector('[data-testid="kpi-scope-note"]')).toBeNull();
  });

  describe('loading state', () => {
    let slices: Subject<readonly DocumentIdentitySlice[]>;
    let el: HTMLElement;

    beforeEach(() => {
      slices = new Subject();
      el = render({
        getSourceInfo: stream => of(info(stream)),
        getIdentitySlices: (() => slices) as unknown as StreamObservationRepository['getIdentitySlices'],
        getObservations: ((stream: StreamKind) =>
          of(stream === 'document' ? referenceOnly : [])) as StreamObservationRepository['getObservations'],
      });
    });

    it('should render accessible loading text and skeletons before data is ready', () => {
      const list = byTestId(el, 'divergence-list')!;

      expect(normalize(byTestId(el, 'result-summary')?.textContent)).toBe(
        'Loading Divergences for the Document stream…'
      );
      expect(byTestId(el, 'result-summary')?.getAttribute('role')).toBe('status');
      expect(list.getAttribute('aria-busy')).toBe('true');
      expect(byTestId(el, 'loading-state')?.getAttribute('aria-hidden')).toBe('true');
      expect(byTestId(el, 'unavailable-state')).toBeNull();
      expect(byTestId(el, 'empty-state')).toBeNull();
      expect(normalize(byTestId(el, 'detail-loading')?.textContent)).toBe(
        'Divergence detail is shown once Divergence data has loaded.'
      );
    });

    it('should show pending KPIs and disabled controls while loading', () => {
      expect(kpiValues(el)).toEqual(['—', '—', '—', '—']);
      expect(byTestId(el, 'kpi-card-document-total')?.textContent).toContain('Divergence data is loading');
      el.querySelectorAll<HTMLSelectElement>('.filter-select').forEach(s => expect(s.disabled).toBe(true));
      expect(byTestId<HTMLButtonElement>(el, 'clear-filters')?.disabled).toBe(true);
      expect(normalize(byTestId(el, 'controls-note')?.textContent)).toBe(
        'Filters and sorting are available once Divergence data has loaded.'
      );
      expect(el.querySelector<HTMLElement>('[role="tabpanel"]')!.tabIndex).toBe(0);
    });

    it('should not imply live access in loading copy', () => {
      const text = spacedText(el.querySelector('.list-detail-container'));

      expect(text).not.toMatch(/DocuWare|\blive\b|connect|fetch|server|API/i);
    });

    it('should render the stream once data is ready', () => {
      slices.next([testDocumentSlice]);
      slices.complete();
      fixture.detectChanges();

      expect(byTestId(el, 'loading-state')).toBeNull();
      expect(byTestId(el, 'divergence-list')?.hasAttribute('aria-busy')).toBe(false);
      expect(byTestId(el, 'empty-state')).toBeTruthy();
    });
  });

  describe('unavailable state and retry', () => {
    let attempts: number;
    let el: HTMLElement;

    beforeEach(() => {
      attempts = 0;
      el = render({
        getSourceInfo: stream => of(info(stream)),
        getIdentitySlices: ((stream: StreamKind) => {
          if (stream !== 'document') return of([]);
          attempts++;
          return attempts === 1 ? throwError(() => new Error('unavailable')) : of([testDocumentSlice]);
        }) as StreamObservationRepository['getIdentitySlices'],
        getObservations: ((stream: StreamKind) =>
          of(stream === 'document' ? candidateRun : [])) as StreamObservationRepository['getObservations'],
      });
    });

    it('should offer a retry control and disabled filters', () => {
      expect(normalize(byTestId(el, 'retry')?.textContent)).toBe('Try again');
      expect(byTestId<HTMLButtonElement>(el, 'clear-filters')?.disabled).toBe(true);
      expect(normalize(byTestId(el, 'controls-note')?.textContent)).toBe(
        'Filters and sorting are unavailable while Divergence data cannot be read.'
      );
      expect(el.querySelector<HTMLElement>('[role="tabpanel"]')!.hasAttribute('tabindex')).toBe(false);
    });

    it('should use local copy without support links or live-access claims', () => {
      const state = byTestId(el, 'unavailable-state')!;

      expect(state.querySelectorAll('a').length).toBe(0);
      expect(state.textContent).not.toMatch(/support|contact|DocuWare|\blive\b|server|connect/i);
    });

    it('should read the stream again through the facade and move focus to the list', async () => {
      byTestId<HTMLButtonElement>(el, 'retry')!.focus();
      byTestId<HTMLButtonElement>(el, 'retry')!.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(attempts).toBe(2);
      expect(byTestId(el, 'unavailable-state')).toBeNull();
      expect(el.querySelectorAll('[data-testid="divergence-card"]').length).toBe(1);
      expect(document.activeElement).toBe(byTestId(el, 'divergence-list'));
    });
  });

  it('should disable filter and sort controls in a stream with no Divergences', () => {
    const el = render({
      getSourceInfo: stream => of(info(stream)),
      getIdentitySlices: (() => of([testDocumentSlice])) as StreamObservationRepository['getIdentitySlices'],
      getObservations: (() => of(referenceOnly)) as StreamObservationRepository['getObservations'],
    });

    expect(byTestId(el, 'empty-state')).toBeTruthy();
    el.querySelectorAll<HTMLSelectElement>('.filter-select').forEach(s => expect(s.disabled).toBe(true));
    expect(normalize(byTestId(el, 'controls-note')?.textContent)).toBe(
      'There are no Divergences in this stream to filter or sort.'
    );
    expect(normalize(byTestId(el, 'result-summary')?.textContent)).toBe('');
  });

  it('should filter by a lifecycle status other than ongoing', () => {
    const el = render({
      getSourceInfo: stream => of(info(stream)),
      getIdentitySlices: ((stream: StreamKind) =>
        of(stream === 'document' ? [testDocumentSlice] : [])) as StreamObservationRepository['getIdentitySlices'],
      getObservations: ((stream: StreamKind) =>
        of(stream === 'document' ? [...candidateRun, resolvingObservation] : [])) as StreamObservationRepository['getObservations'],
    });
    const status = byTestId<HTMLSelectElement>(el, 'filter-status')!;

    expect(Array.from(status.options).map(o => normalize(o.textContent))).toEqual([
      'All statuses',
      'Resolved',
    ]);
    status.value = 'resolved';
    status.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(
      Array.from(el.querySelectorAll('[data-testid="divergence-card"]')).map(c => c.getAttribute('data-status'))
    ).toEqual(['resolved']);
  });

  it('should keep non-replay state copy within the claim guardrails', () => {
    const texts: string[] = [];
    const slices = new Subject<readonly DocumentIdentitySlice[]>();
    texts.push(
      spacedText(
        render({
          getSourceInfo: stream => of(info(stream)),
          getIdentitySlices: (() => slices) as unknown as StreamObservationRepository['getIdentitySlices'],
          getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
        })
      )
    );
    TestBed.resetTestingModule();
    texts.push(
      spacedText(
        render({
          getSourceInfo: stream => of(info(stream)),
          getIdentitySlices: () => throwError(() => new Error('unavailable')),
        })
      )
    );

    for (const text of texts) {
      for (const pattern of Object.values(DASHBOARD_GUARDRAIL_PATTERNS)) {
        expect(text).not.toMatch(pattern);
      }
    }
  });

  it('should omit the replay source line when the repository cannot be read', () => {
    const el = render({ getSourceInfo: () => throwError(() => new Error('unavailable')) });

    expect(el.querySelector('[data-testid="stream-replay-source"]')).toBeNull();
    expect(el.querySelector('[data-testid="kpi-section"]')).toBeTruthy();
  });
});
