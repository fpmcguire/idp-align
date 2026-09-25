import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  amountDivergence,
  vendorRepresentationDivergence,
} from '../../../../../testing/divergence-builders';
import { Divergence } from '../../../../domain/divergence';
import { DivergenceCardComponent } from './divergence-card.component';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

describe('DivergenceCardComponent', () => {
  let fixture: ComponentFixture<DivergenceCardComponent>;

  const render = (divergence: Divergence, selected = false) => {
    fixture = TestBed.createComponent(DivergenceCardComponent);
    fixture.componentRef.setInput('divergence', divergence);
    fixture.componentRef.setInput('selected', selected);
    fixture.componentRef.setInput('detailId', 'divergence-detail');
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('[data-testid="divergence-card"]') as HTMLButtonElement;
  };
  const text = (card: HTMLElement, testId: string) =>
    normalize(card.querySelector(`[data-testid="${testId}"]`)?.textContent);

  it('should render the Divergence summary fields from the record', () => {
    const divergence = amountDivergence();
    const card = render(divergence);

    expect(text(card, 'card-identity-slice')).toBe('Kappa Paper (synthetic) · Invoice');
    expect(text(card, 'card-dimension')).toBe('Amount');
    expect(text(card, 'status-badge')).toBe('Ongoing');
    expect(text(card, 'card-observed')).toBe('Mean 1,500.00 across 4 observations');
    expect(text(card, 'card-baseline')).toBe('Mean 1,000.00, range 950.00 to 1,050.00');
    expect(text(card, 'card-magnitude')).toBe('+500.00 from baseline mean (+50%, +70.7 SD)');
    expect(text(card, 'card-timeline')).toBe('Onset 2 Sep 2026 · Duration 3 d 0 h');
    expect(card.dataset['divergenceId']).toBe(divergence.id);
  });

  it('should render a categorical Divergence without rename or matching claims (QA-018)', () => {
    const card = render(vendorRepresentationDivergence());

    expect(text(card, 'card-dimension')).toBe('Vendor representation');
    expect(text(card, 'card-observed')).toContain('KAPPA PAPER (SYNTHETIC)');
    expect(card.textContent).not.toMatch(/renam|same vendor|entity|match/i);
  });

  it('should be a native button that controls the detail region', () => {
    const card = render(amountDivergence());

    expect(card.tagName).toBe('BUTTON');
    expect(card.type).toBe('button');
    expect(card.getAttribute('aria-controls')).toBe('divergence-detail');
  });

  it('should mark only the selected card as current', () => {
    expect(render(amountDivergence(), true).getAttribute('aria-current')).toBe('true');
    expect(render(amountDivergence(), false).hasAttribute('aria-current')).toBe(false);
  });

  it('should emit the Divergence id when chosen', () => {
    const divergence = amountDivergence();
    const card = render(divergence);
    const emitted: string[] = [];
    fixture.componentInstance.cardSelect.subscribe(id => emitted.push(id));

    card.click();

    expect(emitted).toEqual([divergence.id]);
  });
});
