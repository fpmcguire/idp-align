import { TestBed } from '@angular/core/testing';
import { CLAIM_GUARDRAIL_PATTERNS } from '../../../../../testing/claim-guardrail-patterns';
import {
  amountDivergence,
  taskOutcomeDivergence,
  vendorRepresentationDivergence,
  workflowDivergences,
} from '../../../../../testing/divergence-builders';
import { Divergence } from '../../../../domain/divergence';
import { DivergenceDetailComponent } from './divergence-detail.component';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
/** Rendered text with every text node separated, so word-boundary guardrail patterns apply. */
const spacedText = (root: Element | null | undefined) => {
  if (!root) return '';
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? '');
  return normalize(parts.join(' '));
};

function render(divergence: Divergence) {
  const fixture = TestBed.createComponent(DivergenceDetailComponent);
  fixture.componentRef.setInput('divergence', divergence);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  return {
    el,
    text: (testId: string) => normalize(el.querySelector(`[data-testid="${testId}"]`)?.textContent),
    stat: (label: string) =>
      normalize(el.querySelector(`[data-testid="detail-stat"][data-stat="${label}"]`)?.textContent),
  };
}

describe('DivergenceDetailComponent', () => {
  it('should render Identity Slice, dimension, and status', () => {
    const { el, text } = render(amountDivergence());

    expect(el.querySelector('h3')?.textContent).toBe('Kappa Paper (synthetic) · Invoice');
    expect(text('detail-dimension')).toBe('Dimension: Amount');
    expect(text('status-badge')).toBe('Ongoing');
    expect(text('detail-status-note')).toBe(
      'Ongoing — the latest observation on this dimension is outside the Observed Baseline.',
    );
  });

  it('should render onset, latest observed time, duration, observed summary, and magnitude', () => {
    const { stat } = render(amountDivergence());

    expect(stat('Onset')).toBe('2 Sep 2026, 12:00 UTC');
    expect(stat('Latest observed')).toBe('5 Sep 2026, 12:00 UTC');
    expect(stat('Duration')).toBe('3 d 0 h');
    expect(stat('Observed')).toBe('Mean 1,500.00 across 4 observations');
    expect(stat('Observed values')).toBe('Min 1,500.00, max 1,500.00, latest 1,500.00');
    expect(stat('Observed Baseline')).toBe('Mean 1,000.00, range 950.00 to 1,050.00');
    expect(stat('Magnitude')).toBe('+500.00 from baseline mean (+50%, +70.7 SD)');
    expect(stat('Sustained criterion')).toBe(
      'At least 3 consecutive observations outside the Observed Baseline',
    );
  });

  it('should include the Observed Baseline panel and the Evidence trace', () => {
    const { el } = render(amountDivergence());

    expect(el.querySelector('[data-testid="baseline-panel"]')).toBeTruthy();
    expect(el.querySelectorAll('[data-testid="evidence-item"]').length).toBe(4);
  });

  it('should offer no user actions', () => {
    const { el } = render(amountDivergence());

    expect(el.querySelectorAll('button, a, input, select, textarea').length).toBe(0);
  });

  // QA-019: one returning observation marks the Divergence resolved and is not in its Evidence.
  describe('resolved status', () => {
    const divergence = amountDivergence({ resolved: true });

    it('should present resolved only as a finding lifecycle status', () => {
      const { el, text } = render(divergence);

      expect(divergence.status).toBe('resolved');
      expect(text('status-badge')).toBe('Resolved');
      expect(text('detail-status-note')).toContain('finding lifecycle status');
      expect(el.textContent).not.toMatch(/remediat|fixed|corrected|converg|success|business/i);
    });

    it('should not imply the Evidence trace includes the resolving observation', () => {
      const { el, text } = render(divergence);
      const itemIds = Array.from(
        el.querySelectorAll<HTMLElement>('[data-testid="evidence-item"]'),
      ).map(i => i.dataset['observationId']);

      expect(text('detail-status-note')).toContain(
        'That observation is not listed in the Evidence trace.',
      );
      expect(itemIds).not.toContain('doc-r');
      expect(itemIds.length).toBe(4);
    });
  });

  // QA-018: the detector compares representations within one Identity Slice only.
  it('should not claim vendor rename or entity matching', () => {
    const { el, text } = render(vendorRepresentationDivergence());

    expect(text('detail-dimension')).toBe('Dimension: Vendor representation');
    expect(el.textContent).not.toMatch(/renam|same vendor|entity|matched|matching/i);
  });

  it('should keep rendered detail copy within the claim guardrails', () => {
    for (const divergence of [
      amountDivergence(),
      amountDivergence({ resolved: true }),
      vendorRepresentationDivergence(),
      ...workflowDivergences(),
      taskOutcomeDivergence(),
    ]) {
      const text = spacedText(render(divergence).el);
      for (const pattern of Object.values(CLAIM_GUARDRAIL_PATTERNS)) {
        expect(text).not.toMatch(pattern);
      }
    }
  });

  describe('workflow Divergences', () => {
    it('should render workflow timing values as durations in every section', () => {
      const [task] = workflowDivergences();
      const { el, text, stat } = render(task);

      expect(text('detail-identity-slice')).toBe('Test approval (synthetic) · Approval');
      expect(text('detail-dimension')).toBe('Dimension: Task duration');
      expect(stat('Observed')).toBe('Mean 5 h 0 min across 3 observations');
      expect(stat('Observed values')).toBe('Min 5 h 0 min, max 5 h 0 min, latest 5 h 0 min');
      expect(stat('Magnitude')).toMatch(/^\+4 h 0 min from baseline mean/);
      expect(
        Array.from(el.querySelectorAll('[data-testid="baseline-numeric-field"] dd')).every(dd =>
          /\d+ (d|h|min)/.test(dd.textContent ?? ''),
        ),
      ).toBe(true);
      expect(el.querySelectorAll('[data-testid="evidence-item"]').length).toBe(3);
    });

    // Spec-only coverage: replay data has no categorical workflow Divergence.
    it('should render a categorical workflow task outcome with its reference distribution', () => {
      const { el, text, stat } = render(taskOutcomeDivergence());

      expect(text('detail-dimension')).toBe('Dimension: Decision or route outcome');
      expect(stat('Observed')).toBe('Error exit: Test error exit (synthetic) in 100% of 3 observations');
      expect(stat('Observed Baseline')).toBe('Decision: Approve in 100% of reference observations');
      expect(text('baseline-distribution')).toBe('Decision: Approve: 6 (100%)');
      expect(el.textContent).not.toMatch(/caus|because|due to|attribut|root|failure|violation/i);
    });
  });
});
