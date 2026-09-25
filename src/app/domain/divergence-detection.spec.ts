import {
  MINUTE_MS,
  TEST_VENDOR,
  TEST_WORKFLOW,
  at,
  documentObservation,
  DocumentOverrides,
  runtimeObservation,
  taskObservation,
  TaskOverrides,
  testApprovalSlice,
  testDocumentSlice,
  testRuntimeSlice,
} from '../../testing/observation-builders';
import { Divergence } from './divergence';
import { DEFAULT_DETECTION_CONFIG, detectStreamDivergences } from './divergence-detection';
import { documentIdentitySlice, workflowIdentitySlice } from './identity-slice';
import { WorkflowObservation } from './observation';

const dimensionsOf = (divergences: readonly Divergence[]) =>
  divergences.map(d => [d.identitySlice.id, d.dimension]);

describe('detectStreamDivergences', () => {
  it('should use the approved MVP detection parameters by default', () => {
    expect(DEFAULT_DETECTION_CONFIG).toEqual({
      referenceWindowDays: 28,
      minReferenceSampleSize: 4,
      rangeStandardDeviations: 3,
      minRangeRelativeHalfWidth: 0.05,
      minValueShare: 0.1,
      minConsecutiveObservations: 3,
    });
  });

  it('should return no baselines or Divergences for a stream without observations', () => {
    expect(detectStreamDivergences([testDocumentSlice], [])).toEqual({
      referenceWindow: null,
      baselines: [],
      divergences: [],
    });
  });

  describe('document stream', () => {
    // Ten reference documents over the first 28 days: 1000-1020 EUR, stored at 15:00 on the
    // document date. Candidates start on 2026-08-31, after the reference window.
    const history = Array.from({ length: 10 }, (_, i) =>
      documentObservation(`h${i}`, at(i * 2, 15), { amount: 1000 + (i % 3) * 10 }),
    );
    const recent = (overrides: readonly DocumentOverrides[]) =>
      overrides.map((o, i) =>
        documentObservation(`c${i}`, at(28 + i * 2, 15), { amount: 1010, ...o }),
      );
    const detect = (overrides: readonly DocumentOverrides[]) =>
      detectStreamDivergences([testDocumentSlice], [...history, ...recent(overrides)]);

    const vendorVariant = { vendor: 'KAPPA PAPER (SYNTHETIC)' };
    const amountShift = { amount: 1500 };
    const currencySwitch = { currency: 'USD' };
    const lateDocument = { documentDate: '2026-08-26' };

    it('should derive one Observed Baseline per document dimension', () => {
      const { baselines } = detect([{}, {}, {}]);

      expect(baselines.map(b => [b.dimension, b.method, b.sampleSize])).toEqual([
        ['vendor-representation', 'reference-frequency-distribution', 10],
        ['amount-value', 'mean-standard-deviation-range', 10],
        ['amount-currency', 'reference-frequency-distribution', 10],
        ['document-date-lag', 'mean-standard-deviation-range', 10],
      ]);
    });

    it('should emit no Divergence while observations stay within the Observed Baselines', () => {
      expect(detect([{}, {}, {}, {}]).divergences).toEqual([]);
    });

    it('should detect sustained vendor representation Divergence within the same Identity Slice', () => {
      const { divergences } = detect([vendorVariant, vendorVariant, vendorVariant]);

      expect(dimensionsOf(divergences)).toEqual([[testDocumentSlice.id, 'vendor-representation']]);
      expect(divergences[0].observed).toMatchObject({ dominantValue: 'KAPPA PAPER (SYNTHETIC)' });
    });

    it('should detect a sustained amount shift as amount only, leaving currency unchanged', () => {
      const { divergences } = detect([amountShift, amountShift, amountShift]);

      expect(dimensionsOf(divergences)).toEqual([[testDocumentSlice.id, 'amount-value']]);
    });

    it('should detect a sustained currency switch as currency only, not as an amount change', () => {
      const { divergences } = detect([currencySwitch, currencySwitch, currencySwitch]);

      expect(dimensionsOf(divergences)).toEqual([[testDocumentSlice.id, 'amount-currency']]);
    });

    it('should report amount and currency separately when both change', () => {
      const both = { ...amountShift, ...currencySwitch };

      expect(dimensionsOf(detect([both, both, both]).divergences)).toEqual([
        [testDocumentSlice.id, 'amount-value'],
        [testDocumentSlice.id, 'amount-currency'],
      ]);
    });

    it('should detect sustained document date to storage time Divergence', () => {
      const { divergences } = detect([lateDocument, lateDocument, lateDocument]);

      expect(dimensionsOf(divergences)).toEqual([[testDocumentSlice.id, 'document-date-lag']]);
    });

    for (const [name, change] of Object.entries({
      vendorVariant,
      amountShift,
      currencySwitch,
      lateDocument,
    })) {
      it(`should not surface a one-off ${name} observation`, () => {
        expect(detect([change, {}, {}, {}]).divergences).toEqual([]);
        expect(detect([{}, change, {}]).divergences).toEqual([]);
      });
    }

    it('should derive no baseline for a slice with too few reference observations', () => {
      const creditNote = (id: string, day: number) =>
        documentObservation(id, at(day, 15), { documentType: 'Credit note', amount: 80 });
      const sparse = [creditNote('n1', 4), creditNote('n2', 18), creditNote('n3', 30)];
      const creditNoteSlice = documentIdentitySlice(TEST_VENDOR, 'Credit note');

      const { baselines } = detectStreamDivergences(
        [testDocumentSlice, creditNoteSlice],
        [...history, ...sparse],
      );

      expect(baselines.length).toBe(4);
      expect(baselines.some(b => b.identitySliceId === creditNoteSlice.id)).toBe(false);
    });
  });

  describe('workflow stream', () => {
    const release = workflowIdentitySlice(TEST_WORKFLOW, 'Payment release');
    const slices = [testApprovalSlice, release, testRuntimeSlice];

    // Ten reference instances: Approval takes 60-62 min with 10-12 min response time, Payment
    // release is automated with no response time, and runtime is 150-170 min.
    const history = Array.from({ length: 10 }, (_, i) => [
      taskObservation(`a${i}`, at(i * 2, 10), {
        instanceId: `i${i}`,
        taskDurationMs: (60 + (i % 3)) * MINUTE_MS,
        responseTimeMs: (10 + (i % 3)) * MINUTE_MS,
      }),
      taskObservation(`p${i}`, at(i * 2, 11), {
        instanceId: `i${i}`,
        step: 'Payment release',
        taskDurationMs: 3 * MINUTE_MS,
        responseTimeMs: undefined,
        decision: 'Release',
      }),
      runtimeObservation(`r${i}`, at(i * 2, 12), (150 + (i % 3) * 10) * MINUTE_MS, `i${i}`),
    ]).flat();

    const recentApproval = (overrides: readonly TaskOverrides[]) =>
      overrides.map((o, i) =>
        taskObservation(`ca${i}`, at(28 + i, 10), { instanceId: `n${i}`, ...o }),
      );
    const recentRelease = (overrides: readonly TaskOverrides[]) =>
      overrides.map((o, i) =>
        taskObservation(`cp${i}`, at(28 + i, 11), {
          instanceId: `n${i}`,
          step: 'Payment release',
          taskDurationMs: 3 * MINUTE_MS,
          responseTimeMs: undefined,
          decision: 'Release',
          ...o,
        }),
      );
    const recentRuntime = (minutes: readonly number[]) =>
      minutes.map((m, i) => runtimeObservation(`cr${i}`, at(28 + i, 12), m * MINUTE_MS, `n${i}`));
    const detect = (...recent: (readonly WorkflowObservation[])[]) =>
      detectStreamDivergences(slices, [...history, ...recent.flat()]);

    const slowTask = { taskDurationMs: 180 * MINUTE_MS };
    const slowResponse = { responseTimeMs: 60 * MINUTE_MS };
    const errorExit = { errorExit: 'Export exit' };

    it('should derive task baselines per step and skip response time where the step has none', () => {
      const { baselines } = detect();

      expect(baselines.map(b => [b.identitySliceId, b.dimension])).toEqual([
        [testApprovalSlice.id, 'task-duration'],
        [testApprovalSlice.id, 'response-time'],
        [testApprovalSlice.id, 'task-outcome'],
        [release.id, 'task-duration'],
        [release.id, 'task-outcome'],
        [testRuntimeSlice.id, 'workflow-runtime'],
      ]);
    });

    it('should detect sustained task duration Divergence', () => {
      const { divergences } = detect(recentApproval([slowTask, slowTask, slowTask]));

      expect(dimensionsOf(divergences)).toEqual([[testApprovalSlice.id, 'task-duration']]);
    });

    it('should detect sustained response time Divergence', () => {
      const { divergences } = detect(recentApproval([slowResponse, slowResponse, slowResponse]));

      expect(dimensionsOf(divergences)).toEqual([[testApprovalSlice.id, 'response-time']]);
    });

    it('should detect a sustained error exit route as task outcome Divergence', () => {
      const { divergences } = detect(recentRelease([errorExit, errorExit, errorExit]));

      expect(dimensionsOf(divergences)).toEqual([[release.id, 'task-outcome']]);
      expect(divergences[0].magnitude).toEqual({
        valueKind: 'categorical',
        observedDominantValue: 'error-exit:Export exit',
        baselineShareOfObservedValue: 0,
      });
    });

    it('should detect sustained workflow runtime Divergence', () => {
      const { divergences } = detect(recentRuntime([400, 420, 410]));

      expect(dimensionsOf(divergences)).toEqual([[testRuntimeSlice.id, 'workflow-runtime']]);
    });

    it('should not surface one-off task, response, error exit, or runtime observations', () => {
      expect(detect(recentApproval([slowTask, {}, {}])).divergences).toEqual([]);
      expect(detect(recentApproval([{}, slowResponse, {}])).divergences).toEqual([]);
      expect(detect(recentRelease([errorExit, {}, {}])).divergences).toEqual([]);
      expect(detect(recentRuntime([400, 160, 150])).divergences).toEqual([]);
    });

    it('should keep decision agent as Evidence context, not a dimension', () => {
      const { divergences } = detect(recentApproval([slowTask, slowTask, slowTask]));

      expect(divergences.map(d => String(d.dimension))).not.toContain('decision-agent');
      expect(divergences[0].evidence.items[0].context).toMatchObject({
        decisionAgent: 'Test approver role (synthetic)',
      });
    });
  });

  // QA-014: one underlying workflow change can move both a step slice and the Workflow runtime
  // slice. Each slice is evaluated independently against its own Observed Baseline; both are
  // emitted when both meet the sustained criteria, with no link, suppression, or "derived" mark,
  // because relating them would be a causal (Attribution) claim.
  describe('QA-014 Approval step and Workflow runtime overlap', () => {
    const instance = (id: string, day: number, approvalMinutes: number, runtimeMinutes: number) => [
      taskObservation(`${id}-approval`, at(day, 10), {
        instanceId: id,
        taskDurationMs: approvalMinutes * MINUTE_MS,
      }),
      runtimeObservation(`${id}-runtime`, at(day, 11), runtimeMinutes * MINUTE_MS, id),
    ];
    const slices = [testApprovalSlice, testRuntimeSlice];

    it('should emit independent Divergences for both slices when both meet the sustained criteria', () => {
      const history = Array.from({ length: 10 }, (_, i) =>
        instance(`h${i}`, i * 2, 60 + (i % 3), 90 + (i % 3)),
      ).flat();
      const recent = [0, 1, 2].map(i => instance(`n${i}`, 28 + i, 600, 630)).flat();

      const { divergences } = detectStreamDivergences(slices, [...history, ...recent]);

      expect(dimensionsOf(divergences)).toEqual([
        [testApprovalSlice.id, 'task-duration'],
        [testRuntimeSlice.id, 'workflow-runtime'],
      ]);
    });

    it('should not link, suppress, or mark either Divergence as derived from the other', () => {
      const history = Array.from({ length: 10 }, (_, i) =>
        instance(`h${i}`, i * 2, 60 + (i % 3), 90 + (i % 3)),
      ).flat();
      const recent = [0, 1, 2].map(i => instance(`n${i}`, 28 + i, 600, 630)).flat();

      const [approval, runtime] = detectStreamDivergences(slices, [
        ...history,
        ...recent,
      ]).divergences;

      for (const divergence of [approval, runtime]) {
        expect(Object.keys(divergence).sort()).toEqual([
          'baseline',
          'dimension',
          'evidence',
          'id',
          'identitySlice',
          'latestObservedAt',
          'magnitude',
          'observed',
          'onset',
          'status',
          'streamKind',
          'sustainedCriteria',
          'durationMs',
        ].sort());
        expect(JSON.stringify(divergence)).not.toMatch(/attribut|cause|derived|related/i);
      }
      expect(approval.baseline.id).not.toBe(runtime.baseline.id);
      expect(approval.evidence.baselineId).toBe(approval.baseline.id);
      expect(runtime.evidence.baselineId).toBe(runtime.baseline.id);
      // The same instances appear in both Evidence traces as observed context only.
      const instances = (d: Divergence) =>
        d.evidence.items.map(i => ('instanceId' in i.context ? i.context.instanceId : null));
      expect(instances(approval)).toEqual(['n0', 'n1', 'n2']);
      expect(instances(runtime)).toEqual(['n0', 'n1', 'n2']);
    });

    it('should evaluate each slice on its own baseline, emitting only the step when runtime stays within', () => {
      // Runtime history is widely spread, so the same step change stays within its baseline.
      const history = Array.from({ length: 10 }, (_, i) =>
        instance(`h${i}`, i * 2, 60 + (i % 3), 200 + (i % 3) * 60),
      ).flat();
      const recent = [0, 1, 2].map(i => instance(`n${i}`, 28 + i, 75, 275)).flat();

      const { divergences } = detectStreamDivergences(slices, [...history, ...recent]);

      expect(dimensionsOf(divergences)).toEqual([[testApprovalSlice.id, 'task-duration']]);
    });
  });
});
