import { TestBed } from '@angular/core/testing';
import {
  amountDivergence,
  vendorRepresentationDivergence,
} from '../../../../../testing/divergence-builders';
import { ObservedBaseline } from '../../../../domain/observed-baseline';
import { BaselineReferencePanelComponent } from './baseline-reference-panel.component';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
/** Text of each child element, joined with spaces (dt/dd pairs render without whitespace). */
const childText = (el: Element | null | undefined) =>
  Array.from(el?.children ?? []).map(c => normalize(c.textContent)).join(' ');

function render(baseline: ObservedBaseline) {
  const fixture = TestBed.createComponent(BaselineReferencePanelComponent);
  fixture.componentRef.setInput('baseline', baseline);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  return {
    el,
    text: (testId: string) => normalize(el.querySelector(`[data-testid="${testId}"]`)?.textContent),
  };
}

describe('BaselineReferencePanelComponent', () => {
  it('should title the panel as the Observed Baseline', () => {
    const { el } = render(amountDivergence().baseline);

    expect(el.querySelector('h4')?.textContent).toBe('Observed Baseline');
  });

  it('should render method, reference window, sample size, and numeric range', () => {
    const { el, text } = render(amountDivergence().baseline);
    const numeric = Array.from(el.querySelectorAll('[data-testid="baseline-numeric-field"]')).map(
      childText,
    );

    expect(text('baseline-method')).toBe(
      'Mean ± the larger of 3 standard deviations or 5% of the mean',
    );
    expect(text('baseline-reference-window')).toBe(
      '3 Aug 2026, 12:00 UTC to 31 Aug 2026, 00:00 UTC (end exclusive)',
    );
    expect(text('baseline-sample-size')).toBe('6 reference observations');
    expect(numeric).toEqual([
      'Mean 1,000.00',
      'Standard deviation 7.07',
      'Median 1,000.00',
      'Reference min to max 990.00 to 1,010.00',
      'Within-baseline range 950.00 to 1,050.00',
    ]);
    expect(el.querySelector('[data-testid="baseline-distribution"]')).toBeNull();
  });

  it('should render the categorical reference distribution', () => {
    const { el, text } = render(vendorRepresentationDivergence().baseline);

    expect(text('baseline-method')).toContain('Reference frequency distribution');
    expect(text('baseline-sample-size')).toBe('6 reference observations');
    expect(text('baseline-distribution')).toBe('Kappa Paper (synthetic): 6 (100%)');
    expect(el.querySelectorAll('[data-testid="baseline-numeric-field"]').length).toBe(0);
  });

  it('should not describe the Observed Baseline as a target or an editable setting', () => {
    const { el } = render(amountDivergence().baseline);

    expect(el.textContent).not.toMatch(/target|intend|intent|policy|expected|edit/i);
    expect(el.querySelectorAll('button, input, select, textarea').length).toBe(0);
  });
});
