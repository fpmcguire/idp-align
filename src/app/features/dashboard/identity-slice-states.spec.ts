import { at, documentObservation, testDocumentSlice } from '../../../testing/observation-builders';
import { detectStreamDivergences } from '../../domain/divergence-detection';
import { documentIdentitySlice, workflowIdentitySlice } from '../../domain/identity-slice';
import {
  identitySlicePopulation,
  toIdentitySliceStates,
  toPopulationSummaries,
} from './identity-slice-states';

describe('Identity Slice states', () => {
  it('should group document Identity Slices by document type and workflow ones by workflow', () => {
    expect(identitySlicePopulation(documentIdentitySlice('Kappa (synthetic)', 'Invoice'))).toBe('Invoice');
    expect(identitySlicePopulation(workflowIdentitySlice('Flow (synthetic)', 'Approval'))).toBe(
      'Flow (synthetic)',
    );
    expect(identitySlicePopulation(workflowIdentitySlice('Flow (synthetic)', null))).toBe(
      'Flow (synthetic)',
    );
  });

  it('should read surfaced and no-baseline states from the detection result', () => {
    const sparse = documentIdentitySlice('Lambda (synthetic)', 'Invoice');
    const observations = [
      ...[1000, 1010, 990, 1000, 1005, 995].map((amount, i) =>
        documentObservation(`doc-${i}`, at(i), { amount }),
      ),
      ...[30, 31, 32].map((day, i) => documentObservation(`doc-c${i}`, at(day), { amount: 1500 })),
      documentObservation('sparse-0', at(1), { vendor: 'Lambda (synthetic)' }),
    ];
    const slices = [testDocumentSlice, sparse];
    const states = toIdentitySliceStates(
      slices,
      observations,
      detectStreamDivergences(slices, observations),
    );

    expect(
      states.map(s => [s.label, s.state, s.referenceObservationCount, s.comparedObservationCount]),
    ).toEqual([
      ['Kappa Paper (synthetic) · Invoice', 'surfaced-divergence', 6, 3],
      ['Lambda (synthetic) · Invoice', 'no-observed-baseline', 1, 0],
    ]);
    expect(toPopulationSummaries(states)).toEqual([
      { population: 'Invoice', identitySliceCount: 2, withSurfacedDivergence: 1 },
    ]);
  });

  it('should report baselines without a surfaced Divergence when compared values stay in range', () => {
    const observations = [1000, 1010, 990, 1000, 1005, 995, 1002, 998, 1001].map((amount, i) =>
      documentObservation(`doc-${i}`, at(i < 6 ? i : 24 + i), { amount }),
    );
    const [state] = toIdentitySliceStates(
      [testDocumentSlice],
      observations,
      detectStreamDivergences([testDocumentSlice], observations),
    );

    expect(state).toMatchObject({
      state: 'no-surfaced-divergence',
      observedBaselineCount: 4,
      divergenceCount: 0,
      comparedObservationCount: 3,
    });
  });

  it('should count zero reference and compared observations with no observations', () => {
    const [state] = toIdentitySliceStates(
      [testDocumentSlice],
      [],
      detectStreamDivergences([testDocumentSlice], []),
    );

    expect(state).toMatchObject({
      observationCount: 0,
      referenceObservationCount: 0,
      comparedObservationCount: 0,
      state: 'no-observed-baseline',
    });
  });

  it('should order populations by first appearance, then Identity Slices by label', () => {
    const credit = documentIdentitySlice('Alpha (synthetic)', 'Credit note');
    const zeta = documentIdentitySlice('Zeta (synthetic)', 'Invoice');
    const alpha = documentIdentitySlice('Alpha (synthetic)', 'Invoice');
    const states = toIdentitySliceStates(
      [zeta, credit, alpha],
      [],
      detectStreamDivergences([zeta, credit, alpha], []),
    );

    expect(states.map(s => s.label)).toEqual([
      'Alpha (synthetic) · Invoice',
      'Zeta (synthetic) · Invoice',
      'Alpha (synthetic) · Credit note',
    ]);
  });
});
