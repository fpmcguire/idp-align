import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CLAIM_GUARDRAIL_PATTERNS,
  SEVERITY_RISK_PATTERN,
} from '../../../../../testing/claim-guardrail-patterns';
import {
  amountDivergence,
  vendorRepresentationDivergence,
} from '../../../../../testing/divergence-builders';
import { fakeChartFactory } from '../../../../../testing/fake-chart-factory';
import { Divergence } from '../../../../domain/divergence';
import { AnalysisDimensionOption } from '../divergence-analysis-view';
import { DivergenceAnalysisComponent } from './divergence-analysis.component';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
/** Rendered text with every text node separated, so word-boundary guardrail patterns apply. */
const spacedText = (root: Element | null | undefined) => {
  if (!root) return '';
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? '');
  return normalize(parts.join(' '));
};

describe('DivergenceAnalysisComponent', () => {
  let fixture: ComponentFixture<DivergenceAnalysisComponent>;
  let el: HTMLElement;

  const render = (divergence: Divergence, options: readonly AnalysisDimensionOption[] = []) => {
    fixture.componentRef.setInput('divergence', divergence);
    fixture.componentRef.setInput('dimensionOptions', options);
    fixture.detectChanges();
  };
  const text = (testId: string) => normalize(el.querySelector(`[data-testid="${testId}"]`)?.textContent);
  const stat = (label: string) =>
    normalize(el.querySelector(`[data-testid="analysis-stat"][data-stat="${label}"]`)?.textContent);
  const optionButtons = () =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('[data-testid="dimension-option"]'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DivergenceAnalysisComponent],
      providers: [fakeChartFactory().provider()],
    });
    fixture = TestBed.createComponent(DivergenceAnalysisComponent);
    el = fixture.nativeElement;
  });

  it('should show the Identity Slice and lifecycle status', () => {
    render(amountDivergence());

    expect(text('analysis-identity-slice')).toBe('Kappa Paper (synthetic) · Invoice');
    expect(text('status-badge')).toBe('Ongoing');
    expect(text('analysis-status-note')).toBe(
      'Ongoing — the latest observation on this dimension is outside the Observed Baseline.',
    );
  });

  describe('side context', () => {
    it('should show counts, baseline, observed, magnitude, onset, duration, and latest time', () => {
      render(amountDivergence());

      expect(stat('Evidence observations')).toBe(
        '4 of 4 Evidence observations outside the Observed Baseline',
      );
      expect(stat('Observed Baseline')).toBe('Mean 1,000.00, range 950.00 to 1,050.00');
      expect(stat('Observed')).toBe('Mean 1,500.00 across 4 observations');
      expect(stat('Magnitude')).toBe('+500.00 from baseline mean (+50%, +70.7 SD)');
      expect(stat('Onset')).toBe('2 Sep 2026, 12:00 UTC');
      expect(stat('Duration')).toBe('3 d 0 h');
      expect(stat('Latest observed')).toBe('5 Sep 2026, 12:00 UTC');
    });

    it('should reuse the read-only Observed Baseline reference panel', () => {
      render(amountDivergence());

      expect(el.querySelector('[data-testid="analysis-context"] [data-testid="baseline-panel"]')).toBeTruthy();
    });
  });

  describe('non-canvas summary', () => {
    it('should describe the chart canvas with the text summary', () => {
      render(amountDivergence());
      const canvas = el.querySelector('canvas')!;
      const summary = el.querySelector('[data-testid="analysis-chart-summary"]')!;

      expect(canvas.getAttribute('aria-describedby')).toBe(summary.id);
      expect(normalize(summary.textContent)).toContain('The chart plots 4 Evidence observations');
    });

    it('should render the chart data as a table with a caption and column headers', () => {
      render(amountDivergence());
      const table = el.querySelector('[data-testid="analysis-table"]')!;

      expect(normalize(table.querySelector('caption')?.textContent)).toBe(
        'Chart data: Evidence observations for Amount',
      );
      expect(Array.from(table.querySelectorAll('th[scope="col"]')).map(th => normalize(th.textContent))).toEqual([
        'Observed at',
        'Value',
        'Distance from Observed Baseline mean',
        'Position',
      ]);
      expect(table.querySelectorAll('[data-testid="analysis-table-row"]').length).toBe(4);
    });

    it('should explain the categorical chart without a numeric band', () => {
      render(vendorRepresentationDivergence());

      expect(text('analysis-chart-summary')).toContain(
        'A categorical Observed Baseline has no numeric range, so none is drawn.',
      );
      expect(el.querySelector('[data-testid="divergence-chart"]')?.getAttribute('data-chart-kind')).toBe(
        'categorical',
      );
      expect(spacedText(el)).not.toMatch(/confidence|band/i);
    });
  });

  describe('dimension switching', () => {
    const first = amountDivergence();
    const options: AnalysisDimensionOption[] = [
      { divergenceId: first.id, label: 'Amount' },
      { divergenceId: 'other', label: 'Currency' },
    ];

    it('should expose the selected dimension with aria-pressed in a labelled group', () => {
      render(first, options);
      const group = el.querySelector('[data-testid="dimension-toggle"]')!;

      expect(group.getAttribute('role')).toBe('group');
      expect(group.getAttribute('aria-label')).toBe('Dimension');
      expect(optionButtons().map(b => [normalize(b.textContent), b.getAttribute('aria-pressed')])).toEqual([
        ['Amount', 'true'],
        ['Currency', 'false'],
      ]);
      expect(optionButtons().every(b => b.type === 'button')).toBe(true);
    });

    it('should report a different dimension to the parent, and not the current one', () => {
      render(first, options);
      const emitted: string[] = [];
      fixture.componentInstance.dimensionSelect.subscribe(id => emitted.push(id));

      optionButtons()[0].click();
      optionButtons()[1].click();

      expect(emitted).toEqual(['other']);
    });

    it('should keep the same buttons when the selected dimension changes, so focus stays', () => {
      render(first, options);
      const before = optionButtons();
      before[1].focus();

      render({ ...first, id: 'other' }, options);

      expect(optionButtons()).toEqual(before);
      expect(document.activeElement).toBe(before[1]);
      expect(before[1].getAttribute('aria-pressed')).toBe('true');
    });

    it('should show the only dimension as text when there is nothing to switch to', () => {
      render(first, [options[0]]);

      expect(el.querySelector('[data-testid="dimension-toggle"]')).toBeNull();
      expect(text('analysis-dimension')).toBe(
        'Dimension: Amount. No other Divergence in this Identity Slice is shown under the current filters.',
      );
    });
  });

  it('should offer no action controls beyond dimension switching', () => {
    render(amountDivergence());

    expect(el.querySelectorAll('button').length).toBe(0);
    expect(spacedText(el)).not.toMatch(/\b(mute|mark reviewed|resolve|export|copy details)\b/i);
  });

  it('should keep rendered copy within CAV Level 1 wording', () => {
    for (const divergence of [amountDivergence(), vendorRepresentationDivergence()]) {
      render(divergence);
      const copy = spacedText(el);
      for (const pattern of [...Object.values(CLAIM_GUARDRAIL_PATTERNS), SEVERITY_RISK_PATTERN]) {
        expect(copy).not.toMatch(pattern);
      }
    }
  });
});
