import { TestBed } from '@angular/core/testing';
import { DIVERGENCE_STATUSES, DivergenceStatus } from '../../../../domain/divergence';
import { StatusBadgeComponent } from './status-badge.component';

function render(status: DivergenceStatus) {
  const fixture = TestBed.createComponent(StatusBadgeComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('[data-testid="status-badge"]') as HTMLElement;
}

describe('StatusBadgeComponent', () => {
  it('should label every Divergence status', () => {
    expect(DIVERGENCE_STATUSES.map(status => render(status).textContent?.trim())).toEqual([
      'Ongoing',
      'Reviewed',
      'Resolved',
      'Muted',
    ]);
  });

  it('should expose the status for styling', () => {
    expect(render('ongoing').dataset['status']).toBe('ongoing');
  });

  // QA-019: `resolved` is a finding lifecycle status only.
  it('should render resolved as a status label only', () => {
    const badge = render('resolved');

    expect(badge.textContent?.trim()).toBe('Resolved');
    expect(badge.textContent).not.toMatch(/remediat|fix|correct|converg|success/i);
    expect(badge.tagName).toBe('SPAN');
  });
});
