import { TestBed } from '@angular/core/testing';
import { PopulationSummaryView } from './identity-slice-states.model';
import { PopulationSummaryComponent } from './population-summary.component';

function render(summaries: readonly PopulationSummaryView[]) {
  const fixture = TestBed.createComponent(PopulationSummaryComponent);
  fixture.componentRef.setInput('summaries', summaries);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const lines = (el: HTMLElement) =>
  Array.from(el.querySelectorAll('[data-testid="population-summary"]')).map(l =>
    l.textContent?.replace(/\s+/g, ' ').trim(),
  );

describe('PopulationSummaryComponent', () => {
  it('should state Identity Slices observed and surfaced per population', () => {
    const el = render([
      { population: 'Invoice', identitySliceCount: 5, withSurfacedDivergence: 1 },
      { population: 'Credit note', identitySliceCount: 1, withSurfacedDivergence: 0 },
    ]);

    expect(lines(el)).toEqual([
      'Invoice: 5 Identity Slices observed / 1 with surfaced Divergence',
      'Credit note: 1 Identity Slice observed / 0 with surfaced Divergence',
    ]);
  });

  it('should render nothing without populations', () => {
    expect(render([]).querySelector('[data-testid="population-summaries"]')).toBeNull();
  });

  it('should not claim stability or judge the population', () => {
    const text = render([{ population: 'Invoice', identitySliceCount: 5, withSurfacedDivergence: 1 }])
      .textContent;

    expect(text).not.toMatch(/\bstab(le|ility)|\bnormal|healthy|\bcorrect|fail|\brisk|alert|anomal/i);
  });
});
