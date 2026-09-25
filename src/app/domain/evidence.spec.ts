import {
  MINUTE_MS,
  at,
  documentObservation,
  runtimeObservation,
  taskObservation,
  testApprovalSlice,
  testDocumentSlice,
} from '../../testing/observation-builders';
import { DEFAULT_DETECTION_CONFIG, detectStreamDivergences } from './divergence-detection';
import { dimensionValue } from './divergence-dimension';
import { buildEvidence, evidenceContextOf } from './evidence';
import { deriveObservedBaseline } from './observed-baseline';

const WINDOW = { from: at(0), to: '2026-08-31T00:00:00.000Z' };

describe('Evidence', () => {
  const baseline = deriveObservedBaseline(
    testDocumentSlice,
    'amount-value',
    [1000, 1010, 1020, 1030].map((amount, i) => documentObservation(`h${i}`, at(i), { amount })),
    WINDOW,
    DEFAULT_DETECTION_CONFIG,
  )!;

  it('should list items in chronological order with sources, value, and distance from baseline', () => {
    const later = documentObservation('c2', at(30), { amount: 1500 });
    const earlier = documentObservation('c1', at(29), { amount: 1015 });

    const evidence = buildEvidence(baseline, [later, earlier]);

    expect(evidence.baselineId).toBe(baseline.id);
    expect(evidence.items).toEqual([
      {
        observationId: 'c1',
        observedAt: at(29),
        sources: earlier.sources,
        value: 1015,
        withinBaseline: true,
        distanceFromBaselineMean: 0,
        context: {
          recordType: 'document',
          vendor: earlier.vendor,
          documentType: 'Invoice',
          currency: 'EUR',
          documentDate: '2026-09-01',
        },
      },
      expect.objectContaining({
        observationId: 'c2',
        value: 1500,
        withinBaseline: false,
        distanceFromBaselineMean: 485,
      }),
    ]);
  });

  it('should carry decision and decision agent from the observed task as context only', () => {
    expect(evidenceContextOf(taskObservation('t1', at(0), { instanceId: 'i-1' }))).toEqual({
      recordType: 'task',
      instanceId: 'i-1',
      step: 'Approval',
      decision: 'Approve',
      decisionAgent: 'Test approver role (synthetic)',
    });
  });

  it('should carry an error exit route as context', () => {
    expect(evidenceContextOf(taskObservation('t1', at(0), { errorExit: 'Export exit' }))).toEqual({
      recordType: 'task',
      instanceId: 't1',
      step: 'Approval',
      errorExit: 'Export exit',
    });
  });

  it('should carry the instance and state for workflow runtime observations', () => {
    expect(evidenceContextOf(runtimeObservation('r1', at(0), 90 * MINUTE_MS, 'i-1'))).toEqual({
      recordType: 'runtime',
      instanceId: 'i-1',
      state: 'completed',
    });
  });

  describe('reconstruction', () => {
    const history = Array.from({ length: 10 }, (_, i) =>
      taskObservation(`h${i}`, at(i * 2), { taskDurationMs: (60 + (i % 3)) * MINUTE_MS }),
    );
    const recent = [0, 1, 2].map(i =>
      taskObservation(`c${i}`, at(30 - i), { taskDurationMs: 300 * MINUTE_MS }),
    );
    const observations = [...recent, ...history];
    const byId = new Map(observations.map(o => [o.id, o]));
    const [divergence] = detectStreamDivergences([testApprovalSlice], observations).divergences;

    it('should rebuild the same Observed Baseline from its referenced observations', () => {
      const referenced = divergence.baseline.referenceObservationIds.map(id => byId.get(id)!);

      expect(
        deriveObservedBaseline(
          testApprovalSlice,
          divergence.dimension,
          referenced,
          divergence.baseline.referenceWindow,
          DEFAULT_DETECTION_CONFIG,
        ),
      ).toEqual(divergence.baseline);
    });

    it('should reference source observations whose values match each Evidence item', () => {
      for (const item of divergence.evidence.items) {
        const observation = byId.get(item.observationId)!;

        expect(item.value).toBe(dimensionValue(divergence.dimension, observation));
        expect(item.observedAt).toBe(observation.observedAt);
        expect(item.sources).toEqual(observation.sources);
        expect(item.sources.length).toBeGreaterThan(0);
      }
    });

    it('should list Evidence items chronologically from onset to latest observation', () => {
      const times = divergence.evidence.items.map(i => i.observedAt);

      expect(times).toEqual([at(28), at(29), at(30)]);
      expect(times[0]).toBe(divergence.onset);
      expect(times.at(-1)).toBe(divergence.latestObservedAt);
    });
  });
});
