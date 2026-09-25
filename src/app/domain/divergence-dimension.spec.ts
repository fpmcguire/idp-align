import {
  HOUR_MS,
  MINUTE_MS,
  at,
  documentObservation,
  runtimeObservation,
  taskObservation,
  testApprovalSlice,
  testDocumentSlice,
  testRuntimeSlice,
} from '../../testing/observation-builders';
import { DIVERGENCE_DIMENSIONS, dimensionValue, dimensionsFor } from './divergence-dimension';

describe('DivergenceDimension', () => {
  it('should evaluate document, workflow step, and workflow runtime slices on their own dimensions', () => {
    expect(dimensionsFor(testDocumentSlice)).toEqual([
      'vendor-representation',
      'amount-value',
      'amount-currency',
      'document-date-lag',
    ]);
    expect(dimensionsFor(testApprovalSlice)).toEqual(['task-duration', 'response-time', 'task-outcome']);
    expect(dimensionsFor(testRuntimeSlice)).toEqual(['workflow-runtime']);
  });

  it('should define every dimension for the stream that observes it', () => {
    for (const slice of [testDocumentSlice, testApprovalSlice, testRuntimeSlice]) {
      for (const dimension of dimensionsFor(slice)) {
        expect(DIVERGENCE_DIMENSIONS[dimension].dimension).toBe(dimension);
        expect(DIVERGENCE_DIMENSIONS[dimension].streamKind).toBe(slice.streamKind);
      }
    }
  });

  it('should keep decision agent out of the dimensions (Evidence context only)', () => {
    const serialized = JSON.stringify(DIVERGENCE_DIMENSIONS);

    expect(serialized).not.toMatch(/agent/i);
  });

  describe('document values', () => {
    const observation = documentObservation('d1', at(0, 15), {
      vendor: 'Kappa Paper (synthetic)',
      amount: 1234.5,
      currency: 'USD',
      documentDate: '2026-08-01',
    });

    it('should read vendor representation as the raw vendor text', () => {
      expect(dimensionValue('vendor-representation', observation)).toBe('Kappa Paper (synthetic)');
    });

    it('should read amount value and currency as separate dimensions', () => {
      expect(dimensionValue('amount-value', observation)).toBe(1234.5);
      expect(dimensionValue('amount-currency', observation)).toBe('USD');
    });

    it('should read document date to storage time in milliseconds', () => {
      expect(dimensionValue('document-date-lag', observation)).toBe(2 * 24 * HOUR_MS + 15 * HOUR_MS);
    });

    it('should return null for workflow dimensions', () => {
      expect(dimensionValue('task-duration', observation)).toBeNull();
      expect(dimensionValue('workflow-runtime', observation)).toBeNull();
    });
  });

  describe('workflow values', () => {
    it('should read task duration and response time', () => {
      const task = taskObservation('t1', at(0), {
        taskDurationMs: 90 * MINUTE_MS,
        responseTimeMs: 15 * MINUTE_MS,
      });

      expect(dimensionValue('task-duration', task)).toBe(90 * MINUTE_MS);
      expect(dimensionValue('response-time', task)).toBe(15 * MINUTE_MS);
    });

    it('should return null response time when the task has none', () => {
      const task = taskObservation('t1', at(0), { responseTimeMs: undefined });

      expect(dimensionValue('response-time', task)).toBeNull();
    });

    it('should read task outcome as a decision or an error exit route', () => {
      expect(dimensionValue('task-outcome', taskObservation('t1', at(0)))).toBe('decision:Approve');
      expect(
        dimensionValue('task-outcome', taskObservation('t2', at(0), { errorExit: 'Export exit' })),
      ).toBe('error-exit:Export exit');
    });

    it('should read workflow runtime only from runtime observations', () => {
      const runtime = runtimeObservation('r1', at(0), 120 * MINUTE_MS);

      expect(dimensionValue('workflow-runtime', runtime)).toBe(120 * MINUTE_MS);
      expect(dimensionValue('task-duration', runtime)).toBeNull();
      expect(dimensionValue('workflow-runtime', taskObservation('t1', at(0)))).toBeNull();
    });
  });
});
