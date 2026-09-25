import { TestBed } from '@angular/core/testing';
import { amountDivergence, workflowDivergences } from '../../../../../testing/divergence-builders';
import { Divergence } from '../../../../domain/divergence';
import { EvidenceTraceComponent } from './evidence-trace.component';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
/** Text of each child element, joined with spaces (dt/dd pairs render without whitespace). */
const childText = (el: Element | null | undefined) =>
  Array.from(el?.children ?? []).map(c => normalize(c.textContent)).join(' ');

function render(divergence: Divergence) {
  const fixture = TestBed.createComponent(EvidenceTraceComponent);
  fixture.componentRef.setInput('evidence', divergence.evidence);
  fixture.componentRef.setInput('dimension', divergence.dimension);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const items = Array.from(el.querySelectorAll<HTMLElement>('[data-testid="evidence-item"]'));
  return { el, items };
}

const field = (item: HTMLElement, testId: string) =>
  normalize(item.querySelector(`[data-testid="${testId}"]`)?.textContent);
const contextFields = (item: HTMLElement) =>
  Array.from(item.querySelectorAll('[data-testid="evidence-context-field"]')).map(childText);

describe('EvidenceTraceComponent', () => {
  it('should render one item per Evidence item in chronological order', () => {
    const divergence = amountDivergence();
    const { el, items } = render(divergence);
    const times = items.map(i => i.querySelector('time')!.getAttribute('datetime')!);

    expect(items.map(i => i.dataset['observationId'])).toEqual(
      divergence.evidence.items.map(i => i.observationId),
    );
    expect([...times].sort()).toEqual(times);
    expect(normalize(el.querySelector('[data-testid="evidence-trace-note"]')?.textContent)).toBe(
      '4 supporting observations, oldest first.',
    );
  });

  it('should render timestamp, compared value, distance, baseline indication, and source', () => {
    const [first] = render(amountDivergence()).items;

    expect(field(first, 'evidence-time')).toBe('2 Sep 2026, 12:00 UTC');
    expect(field(first, 'evidence-value')).toBe('1,500.00');
    expect(field(first, 'evidence-distance')).toBe('+500.00');
    expect(field(first, 'evidence-baseline-indicator')).toBe('Outside Observed Baseline');
    expect(field(first, 'evidence-source')).toBe('test / Document / doc-c0');
  });

  it('should render document context values', () => {
    const [first] = render(amountDivergence()).items;

    expect(contextFields(first)).toEqual([
      'Vendor Kappa Paper (synthetic)',
      'Document type Invoice',
      'Currency EUR',
      'Document date 2026-09-02',
    ]);
  });

  it('should render workflow instance and decision agent only as observed context', () => {
    const [task, runtime] = workflowDivergences();
    const [taskItem] = render(task).items;
    const [runtimeItem] = render(runtime).items;

    expect(field(taskItem, 'evidence-value')).toBe('5 h 0 min');
    expect(contextFields(taskItem)).toEqual([
      'Workflow instance wf-c0',
      'Step Approval',
      'Decision Approve',
      'Decision agent Test approver role (synthetic)',
    ]);
    expect(contextFields(runtimeItem)).toEqual([
      'Workflow instance wf-c0',
      'Instance state completed',
    ]);
    expect(taskItem.textContent).not.toMatch(/caus|because|due to|led to|attribut|root/i);
  });
});
