import { TestBed } from '@angular/core/testing';
import { IdentitySliceStatesComponent } from './identity-slice-states.component';
import { IdentitySliceStateView } from './identity-slice-states.model';

const state = (overrides: Partial<IdentitySliceStateView>): IdentitySliceStateView => ({
  identitySliceId: 'document/kappa/invoice',
  label: 'Kappa Paper (synthetic) · Invoice',
  population: 'Invoice',
  observationCount: 10,
  referenceObservationCount: 6,
  comparedObservationCount: 4,
  observedBaselineCount: 4,
  dimensionCount: 4,
  divergenceCount: 0,
  state: 'no-surfaced-divergence',
  ...overrides,
});

const STATES: readonly IdentitySliceStateView[] = [
  state({ identitySliceId: 'a', label: 'Alpha · Invoice', divergenceCount: 1, state: 'surfaced-divergence' }),
  state({ identitySliceId: 'b', label: 'Beta · Invoice' }),
  state({
    identitySliceId: 'c',
    label: 'Beta · Credit note',
    population: 'Credit note',
    observedBaselineCount: 0,
    state: 'no-observed-baseline',
  }),
  state({ identitySliceId: 'd', label: 'Delta · Invoice', divergenceCount: 2, state: 'surfaced-divergence' }),
];

function render(states: readonly IdentitySliceStateView[]) {
  const fixture = TestBed.createComponent(IdentitySliceStatesComponent);
  fixture.componentRef.setInput('states', states);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const cells = (row: Element) =>
  Array.from(row.querySelectorAll('th, td')).map(c => c.textContent?.replace(/\s+/g, ' ').trim());

describe('IdentitySliceStatesComponent', () => {
  it('should render one row per Identity Slice in the given order', () => {
    const rows = Array.from(render(STATES).querySelectorAll('[data-testid="slice-state-row"]'));

    expect(rows.map(cells)).toEqual([
      ['Alpha · Invoice', '6', '4', '4 of 4 dimensions', '1 surfaced Divergence'],
      ['Beta · Invoice', '6', '4', '4 of 4 dimensions', 'No surfaced Divergence'],
      ['Beta · Credit note', '6', '4', '0 of 4 dimensions', 'No Observed Baseline'],
      ['Delta · Invoice', '6', '4', '4 of 4 dimensions', '2 surfaced Divergences'],
    ]);
  });

  it('should expose each state for styling and use row headers for Identity Slices', () => {
    const el = render(STATES);
    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-testid="slice-state-row"]'));

    expect(rows.map(r => r.dataset['state'])).toEqual([
      'surfaced-divergence',
      'no-surfaced-divergence',
      'no-observed-baseline',
      'surfaced-divergence',
    ]);
    expect(rows.every(r => r.querySelector('th')?.getAttribute('scope') === 'row')).toBe(true);
    expect(el.querySelector('table caption')?.textContent).toContain('Detector output per Identity Slice');
  });

  it('should describe individual Identity Slices without judging behavior or the stream as a whole', () => {
    const text = render(STATES).textContent ?? '';

    expect(text).toContain('compared only with its own Observed Baselines');
    expect(text).not.toMatch(
      /\bstab(le|ility)|\bnormal|healthy|\bcorrect|incorrect|fail|defect|violation|\brisk|root[- ]cause|alert|anomal|severit/i,
    );
  });

  it('should offer no controls', () => {
    expect(render(STATES).querySelector('button, a, select, input')).toBeNull();
  });
});
