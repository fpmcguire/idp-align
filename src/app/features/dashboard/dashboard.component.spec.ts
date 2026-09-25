import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of, throwError } from 'rxjs';
import {
  CLAIM_GUARDRAIL_PATTERNS,
  REPLAY_SOURCE_AVOID_WORDS,
} from '../../../testing/claim-guardrail-patterns';
import { at, documentObservation, testDocumentSlice } from '../../../testing/observation-builders';
import { provideStreamObservationRepository } from '../../data/provide-stream-observation-repository';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { StreamKind } from '../../domain/stream';
import { DashboardComponent } from './dashboard.component';

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

    it('should render disabled filters without invented identity slice values', () => {
      const selects = el.querySelectorAll<HTMLSelectElement>('.filter-select');
      expect(selects.length).toBe(3);
      selects.forEach(s => expect(s.disabled).toBe(true));

      const sliceOptions = el.querySelectorAll('[data-testid="filter-identity-slice"] option');
      expect(sliceOptions.length).toBe(1);
      expect(sliceOptions[0].textContent).toContain('All identity slices');
      expect(el.querySelector('.filter-note')?.textContent).toContain(
        'Filters become available in a later Step.'
      );
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

        for (const [name, pattern] of Object.entries(CLAIM_GUARDRAIL_PATTERNS)) {
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
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const kpiValues = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('[data-testid="kpi-value"]')).map(v => normalize(v.textContent));

  // Reference history only: an Observed Baseline is derived, but nothing is sustained after it.
  const referenceOnly = [1000, 1010, 990, 1000, 1005, 995].map((amount, i) =>
    documentObservation(`doc-${i}`, at(i), { amount })
  );

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
  });

  it('should omit the replay source line when the repository cannot be read', () => {
    const el = render({ getSourceInfo: () => throwError(() => new Error('unavailable')) });

    expect(el.querySelector('[data-testid="stream-replay-source"]')).toBeNull();
    expect(el.querySelector('[data-testid="kpi-section"]')).toBeTruthy();
  });
});
