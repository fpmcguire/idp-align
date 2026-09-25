import {
  HOUR_MS,
  at,
  documentObservation,
  taskObservation,
  testApprovalSlice,
  testDocumentSlice,
} from '../../testing/observation-builders';
import { DEFAULT_DETECTION_CONFIG } from './divergence-detection';
import {
  deriveObservedBaseline,
  isInReferenceWindow,
  isWithinObservedBaseline,
  referenceWindowFor,
} from './observed-baseline';

const WINDOW = { from: at(0), to: '2026-08-31T00:00:00.000Z' };

const amounts = (values: readonly number[]) =>
  values.map((amount, i) => documentObservation(`d${i}`, at(i), { amount }));

describe('referenceWindowFor', () => {
  it('should run from the earliest observation to the configured days after that UTC day starts', () => {
    const observations = [
      documentObservation('b', at(5)),
      documentObservation('a', at(0, 15)),
    ];

    expect(referenceWindowFor(observations, 28)).toEqual({
      from: at(0, 15),
      to: '2026-08-31T00:00:00.000Z',
    });
  });

  it('should return null when there are no observations', () => {
    expect(referenceWindowFor([], 28)).toBeNull();
  });

  it('should include the start and exclude the end of the window', () => {
    const inside = documentObservation('in', '2026-08-30T23:59:59.999Z');
    const boundary = documentObservation('end', WINDOW.to);

    expect(isInReferenceWindow(documentObservation('start', WINDOW.from), WINDOW)).toBe(true);
    expect(isInReferenceWindow(inside, WINDOW)).toBe(true);
    expect(isInReferenceWindow(boundary, WINDOW)).toBe(false);
  });
});

describe('deriveObservedBaseline', () => {
  it('should summarize a numeric dimension with the named method and every reference field', () => {
    const reference = amounts([1030, 1000, 1020, 1010]).reverse();

    const baseline = deriveObservedBaseline(
      testDocumentSlice,
      'amount-value',
      reference,
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    );

    expect(baseline).toEqual({
      id: `baseline:${testDocumentSlice.id}:amount-value:${WINDOW.from}..${WINDOW.to}`,
      version: 1,
      streamKind: 'document',
      identitySliceId: testDocumentSlice.id,
      dimension: 'amount-value',
      referenceWindow: WINDOW,
      sampleSize: 4,
      referenceObservationIds: ['d0', 'd1', 'd2', 'd3'],
      valueKind: 'numeric',
      method: 'mean-standard-deviation-range',
      summary: {
        mean: 1015,
        standardDeviation: expect.closeTo(12.91, 2),
        median: 1015,
        min: 1000,
        max: 1030,
      },
      range: { lower: expect.closeTo(964.25, 6), upper: expect.closeTo(1065.75, 6) },
      rule: { standardDeviations: 3, minRelativeHalfWidth: 0.05 },
    });
  });

  it('should widen the range to three standard deviations when that exceeds the 5% floor', () => {
    const baseline = deriveObservedBaseline(
      testDocumentSlice,
      'amount-value',
      amounts([900, 1000, 1100, 1000]),
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    );

    expect(baseline?.valueKind === 'numeric' && baseline.range.lower).toBeCloseTo(755.05, 1);
    expect(baseline?.valueKind === 'numeric' && baseline.range.upper).toBeCloseTo(1244.95, 1);
  });

  it('should keep a 5% range around a history with no spread', () => {
    const baseline = deriveObservedBaseline(
      testDocumentSlice,
      'amount-value',
      amounts([1000, 1000, 1000, 1000]),
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    )!;

    expect(baseline.valueKind === 'numeric' && baseline.range).toEqual({
      lower: expect.closeTo(950, 6),
      upper: expect.closeTo(1050, 6),
    });
    expect(isWithinObservedBaseline(baseline, 1049)).toBe(true);
    expect(isWithinObservedBaseline(baseline, 1051)).toBe(false);
  });

  it('should summarize a categorical dimension as a reference frequency distribution', () => {
    const reference = Array.from({ length: 10 }, (_, i) =>
      documentObservation(`d${i}`, at(i), { currency: i === 4 ? 'USD' : 'EUR' }),
    );

    const baseline = deriveObservedBaseline(
      testDocumentSlice,
      'amount-currency',
      reference,
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    )!;

    expect(baseline.valueKind).toBe('categorical');
    expect(baseline.method).toBe('reference-frequency-distribution');
    expect(baseline.sampleSize).toBe(10);
    expect(baseline.valueKind === 'categorical' && baseline.summary).toEqual({
      dominantValue: 'EUR',
      dominantShare: 0.9,
      distribution: [
        { value: 'EUR', count: 9, share: 0.9 },
        { value: 'USD', count: 1, share: 0.1 },
      ],
    });
    expect(baseline.valueKind === 'categorical' && baseline.rule).toEqual({ minValueShare: 0.1 });
  });

  it('should treat categorical values below the minimum reference share as out of baseline', () => {
    const reference = Array.from({ length: 10 }, (_, i) =>
      documentObservation(`d${i}`, at(i), { currency: i === 4 ? 'USD' : 'EUR' }),
    );
    const baseline = deriveObservedBaseline(
      testDocumentSlice,
      'amount-currency',
      reference,
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    )!;

    expect(isWithinObservedBaseline(baseline, 'EUR')).toBe(true);
    expect(isWithinObservedBaseline(baseline, 'USD')).toBe(true);
    expect(isWithinObservedBaseline(baseline, 'CHF')).toBe(false);
    const stricter = deriveObservedBaseline(testDocumentSlice, 'amount-currency', reference, WINDOW, {
      ...DEFAULT_DETECTION_CONFIG,
      minValueShare: 0.2,
    })!;
    expect(isWithinObservedBaseline(stricter, 'USD')).toBe(false);
  });

  it('should not derive a baseline from fewer than the minimum reference observations', () => {
    expect(
      deriveObservedBaseline(
        testDocumentSlice,
        'amount-value',
        amounts([1000, 1010, 1020]),
        WINDOW,
        DEFAULT_DETECTION_CONFIG,
      ),
    ).toBeNull();
  });

  it('should count only observations that carry the dimension', () => {
    const reference = [
      taskObservation('t0', at(0)),
      taskObservation('t1', at(1)),
      taskObservation('t2', at(2)),
      taskObservation('t3', at(3), { responseTimeMs: undefined }),
      taskObservation('t4', at(4)),
    ];

    const baseline = deriveObservedBaseline(
      testApprovalSlice,
      'response-time',
      reference,
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    );

    expect(baseline?.sampleSize).toBe(4);
    expect(baseline?.referenceObservationIds).toEqual(['t0', 't1', 't2', 't4']);
    expect(
      deriveObservedBaseline(
        testApprovalSlice,
        'response-time',
        reference.slice(0, 4),
        WINDOW,
        DEFAULT_DETECTION_CONFIG,
      ),
    ).toBeNull();
  });

  it('should keep an exact range when every reference value is zero', () => {
    const reference = Array.from({ length: 4 }, (_, i) => documentObservation(`d${i}`, at(i, 0)));

    const baseline = deriveObservedBaseline(
      testDocumentSlice,
      'document-date-lag',
      reference,
      WINDOW,
      DEFAULT_DETECTION_CONFIG,
    )!;

    expect(isWithinObservedBaseline(baseline, 0)).toBe(true);
    expect(isWithinObservedBaseline(baseline, HOUR_MS)).toBe(false);
  });

  it('should derive the same snapshot regardless of input order', () => {
    const reference = amounts([1000, 1030, 1010, 1020, 990]);
    const derive = (observations: typeof reference) =>
      deriveObservedBaseline(
        testDocumentSlice,
        'amount-value',
        observations,
        WINDOW,
        DEFAULT_DETECTION_CONFIG,
      );

    expect(derive([...reference].reverse())).toEqual(derive(reference));
  });
});
