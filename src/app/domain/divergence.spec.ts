import {
  DAY_MS,
  MINUTE_MS,
  at,
  documentObservation,
  taskObservation,
  testApprovalSlice,
  testDocumentSlice,
} from '../../testing/observation-builders';
import { detectSustainedDivergences } from './divergence';
import { DEFAULT_DETECTION_CONFIG } from './divergence-detection';
import { DivergenceDimension } from './divergence-dimension';
import { Observation } from './observation';
import { ObservedBaseline, deriveObservedBaseline } from './observed-baseline';

const WINDOW = { from: at(0), to: '2026-08-31T00:00:00.000Z' };
const CRITERIA = { minConsecutiveObservations: 3 };

// Reference amounts 1000-1030 EUR give an Observed Baseline range of about 964-1066.
const documentBaseline = (dimension: DivergenceDimension): ObservedBaseline =>
  deriveObservedBaseline(
    testDocumentSlice,
    dimension,
    [1000, 1010, 1020, 1030].map((amount, i) => documentObservation(`h${i}`, at(i), { amount })),
    WINDOW,
    DEFAULT_DETECTION_CONFIG,
  )!;

/** Candidate documents two days apart from 2026-08-31, one per amount. */
const candidates = (values: readonly number[]) =>
  values.map((amount, i) => documentObservation(`c${i}`, at(28 + i * 2), { amount }));

const detect = (observations: readonly Observation[], dimension: DivergenceDimension = 'amount-value') =>
  detectSustainedDivergences(testDocumentSlice, documentBaseline(dimension), observations, CRITERIA);

describe('detectSustainedDivergences', () => {
  it('should emit one Divergence for three consecutive out-of-baseline observations', () => {
    const [divergence, ...rest] = detect(candidates([1500, 1510, 1490]));

    expect(rest).toEqual([]);
    expect(divergence).toMatchObject({
      id: `divergence:${divergence.baseline.id}:c0`,
      streamKind: 'document',
      identitySlice: testDocumentSlice,
      dimension: 'amount-value',
      onset: at(28),
      latestObservedAt: at(32),
      durationMs: 4 * DAY_MS,
      status: 'ongoing',
      sustainedCriteria: { minConsecutiveObservations: 3 },
      observed: { valueKind: 'numeric', count: 3, mean: 1500, min: 1490, max: 1510, latest: 1490 },
    });
    expect(divergence.magnitude).toEqual({
      valueKind: 'numeric',
      differenceFromBaselineMean: 485,
      relativeDifference: expect.closeTo(485 / 1015, 6),
      standardDeviations: expect.closeTo(485 / 12.91, 1),
    });
    expect(divergence.evidence.items.map(i => i.observationId)).toEqual(['c0', 'c1', 'c2']);
  });

  it('should not emit a Divergence for a single out-of-baseline observation', () => {
    expect(detect(candidates([1500]))).toEqual([]);
    expect(detect(candidates([1010, 1500, 1010, 1020]))).toEqual([]);
  });

  it('should not emit a Divergence for a run shorter than the sustained criteria', () => {
    expect(detect(candidates([1500, 1510, 1010]))).toEqual([]);
  });

  it('should restart the run when a within-baseline observation interrupts it', () => {
    expect(detect(candidates([1500, 1510, 1010, 1500, 1510]))).toEqual([]);
  });

  it('should emit separate Divergences for separate sustained runs', () => {
    const divergences = detect(candidates([1500, 1510, 1490, 1010, 1600, 1610, 1620]));

    expect(divergences.map(d => [d.onset, d.status])).toEqual([
      [at(28), 'resolved'],
      [at(36), 'ongoing'],
    ]);
    expect(new Set(divergences.map(d => d.id)).size).toBe(2);
  });

  it('should mark a run that returned within the baseline as resolved, a lifecycle state only', () => {
    const [divergence] = detect(candidates([1500, 1510, 1490, 1010]));

    expect(divergence.status).toBe('resolved');
    expect(divergence.latestObservedAt).toBe(at(32));
    // Resolved says the observed behavior returned within the Observed Baseline. It carries no
    // remediation, Convergence, or business-correctness meaning.
    expect(JSON.stringify(divergence)).not.toMatch(/remediat|converg|correct|fixed/i);
  });

  it('should evaluate candidates in chronological order regardless of input order', () => {
    const divergences = detect(candidates([1500, 1510, 1490]).reverse());

    expect(divergences.length).toBe(1);
    expect(divergences[0].onset).toBe(at(28));
  });

  it('should describe a categorical Divergence by its observed value and baseline share', () => {
    const observations = [0, 1, 2].map(i =>
      documentObservation(`c${i}`, at(28 + i), { currency: 'USD' }),
    );

    const [divergence] = detect(observations, 'amount-currency');

    expect(divergence.observed).toEqual({
      valueKind: 'categorical',
      count: 3,
      dominantValue: 'USD',
      distribution: [{ value: 'USD', count: 3, share: 1 }],
      latest: 'USD',
    });
    expect(divergence.magnitude).toEqual({
      valueKind: 'categorical',
      observedDominantValue: 'USD',
      baselineShareOfObservedValue: 0,
    });
  });

  it('should skip observations without the dimension instead of ending the run', () => {
    const baseline = deriveObservedBaseline(
      testApprovalSlice,
      'response-time',
      [0, 1, 2, 3].map(i => taskObservation(`h${i}`, at(i))),
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    )!;
    const slow = { responseTimeMs: 60 * MINUTE_MS };
    const observations = [
      taskObservation('c0', at(28), slow),
      taskObservation('c1', at(29), { responseTimeMs: undefined }),
      taskObservation('c2', at(30), slow),
      taskObservation('c3', at(31), slow),
    ];

    const [divergence] = detectSustainedDivergences(
      testApprovalSlice,
      baseline,
      observations,
      CRITERIA,
    );

    expect(divergence.evidence.items.map(i => i.observationId)).toEqual(['c0', 'c2', 'c3']);
    expect(divergence.status).toBe('ongoing');
  });
});
