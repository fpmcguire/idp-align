import { documentIdentitySlice } from './identity-slice';
import { DocumentObservation, observationWindowOf } from './observation';
import { toObservedTruth } from './observed-truth';

const alpha = documentIdentitySlice('Alpha (synthetic)', 'Invoice');
const beta = documentIdentitySlice('Beta (synthetic)', 'Invoice');
const unused = documentIdentitySlice('Gamma (synthetic)', 'Invoice');

const observation = (id: string, sliceId: string, observedAt: string): DocumentObservation => ({
  id,
  streamKind: 'document',
  identitySliceId: sliceId,
  observedAt,
  sources: [{ system: 'test', resource: 'Document', recordId: id }],
  vendor: 'unused',
  documentType: 'Invoice',
  amount: { value: 100, currency: 'EUR' },
  documentDate: observedAt.slice(0, 10),
});

describe('observationWindowOf', () => {
  it('should return the earliest and latest observation times', () => {
    const window = observationWindowOf([
      observation('b', alpha.id, '2026-08-10T00:00:00.000Z'),
      observation('a', alpha.id, '2026-08-03T00:00:00.000Z'),
      observation('c', alpha.id, '2026-09-11T00:00:00.000Z'),
    ]);

    expect(window).toEqual({ from: '2026-08-03T00:00:00.000Z', to: '2026-09-11T00:00:00.000Z' });
  });

  it('should return null when there are no observations', () => {
    expect(observationWindowOf([])).toBeNull();
  });
});

describe('toObservedTruth', () => {
  const observations = [
    observation('a2', alpha.id, '2026-08-10T00:00:00.000Z'),
    observation('b1', beta.id, '2026-08-05T00:00:00.000Z'),
    observation('a1', alpha.id, '2026-08-03T00:00:00.000Z'),
    observation('x1', 'document/not-listed', '2026-08-04T00:00:00.000Z'),
  ];

  it('should group observations by Identity Slice in chronological order', () => {
    const truth = toObservedTruth([alpha, beta], observations);

    expect(truth.map(t => t.identitySlice.id)).toEqual([alpha.id, beta.id]);
    expect(truth[0].observations.map(o => o.id)).toEqual(['a1', 'a2']);
    expect(truth[0].observationWindow).toEqual({
      from: '2026-08-03T00:00:00.000Z',
      to: '2026-08-10T00:00:00.000Z',
    });
    expect(truth[1].observations.map(o => o.id)).toEqual(['b1']);
  });

  it('should omit slices without observations and ignore observations from unlisted slices', () => {
    const truth = toObservedTruth([alpha, unused], observations);

    expect(truth.map(t => t.identitySlice.id)).toEqual([alpha.id]);
    expect(truth.flatMap(t => t.observations).map(o => o.id)).not.toContain('x1');
  });

  it('should carry observed records only, with no derived statistics', () => {
    const [first] = toObservedTruth([alpha], observations);

    expect(Object.keys(first).sort()).toEqual(
      ['identitySlice', 'observationWindow', 'observations', 'streamKind'].sort(),
    );
  });

  it('should not reorder the input array', () => {
    const input = [...observations];
    toObservedTruth([alpha, beta], input);

    expect(input).toEqual(observations);
  });
});
