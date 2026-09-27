import { firstValueFrom } from 'rxjs';
import { CLAIM_GUARDRAIL_PATTERNS } from '../../../testing/claim-guardrail-patterns';
import {
  DEFAULT_DETECTION_CONFIG,
  detectStreamDivergences,
} from '../../domain/divergence-detection';
import { isWithinObservedBaseline } from '../../domain/observed-baseline';
import { StreamKind } from '../../domain/stream';
import { StreamObservationRepository } from '../stream-observation.repository';
import { ReplayStreamObservationRepository } from './replay-stream-observation.repository';

// Runs the domain detector over replay observations read through the repository interface, the
// same path later dashboard Steps will use. Fixture files are not imported here.

const repository: StreamObservationRepository = new ReplayStreamObservationRepository();

const ALPHA_INVOICE = 'document/alpha-office-supplies-synthetic/invoice';
const DELTA_INVOICE = 'document/delta-packaging-supplies-synthetic/invoice';
const EPSILON_INVOICE = 'document/epsilon-print-services-synthetic/invoice';
const INVOICE_SLICE_IDS = [
  ALPHA_INVOICE,
  'document/beta-freight-services-synthetic/invoice',
  DELTA_INVOICE,
  EPSILON_INVOICE,
  'document/gamma-facilities-care-synthetic/invoice',
];

async function detect(stream: StreamKind) {
  const slices = await firstValueFrom(repository.getIdentitySlices(stream));
  const observations = await firstValueFrom(repository.getObservations(stream));
  return detectStreamDivergences(slices, observations);
}

describe('Divergence detection over replay data', () => {
  describe('document stream', () => {
    it('should use a reference window of the first 28 days', async () => {
      const { referenceWindow } = await detect('document');

      expect(referenceWindow).toEqual({
        from: '2026-08-03T15:00:00.000Z',
        to: '2026-08-31T00:00:00.000Z',
      });
    });

    it('should surface one sustained amount Divergence for Alpha Office Supplies invoices', async () => {
      const { divergences } = await detect('document');

      expect(
        divergences.map(d => [d.identitySlice.label, d.dimension, d.status, d.onset]),
      ).toEqual([
        [
          'Alpha Office Supplies (synthetic) · Invoice',
          'amount-value',
          'ongoing',
          '2026-08-31T15:00:00.000Z',
        ],
      ]);
      expect(divergences[0].latestObservedAt).toBe('2026-09-10T15:00:00.000Z');
      expect(divergences[0].evidence.items.map(i => i.observationId)).toEqual([
        'document/1024',
        'document/1027',
        'document/1030',
        'document/1035',
      ]);
      expect(divergences[0].baseline.sampleSize).toBe(8);
    });

    it('should derive no baseline for credit notes, which have too few reference observations', async () => {
      const { baselines } = await detect('document');
      const sliceIds = [...new Set(baselines.map(b => b.identitySliceId))];

      expect(sliceIds.sort()).toEqual(INVOICE_SLICE_IDS);
      expect(baselines.length).toBe(20);
    });

    // STEP-09: Supplier Invoice Population Divergence. Five fictional Supplier x Invoice Identity
    // Slices each derive their own Observed Baselines; only Alpha surfaces a sustained Divergence.
    describe('Supplier Invoice Population Divergence (STEP-09)', () => {
      const PEER_SLICE_IDS = INVOICE_SLICE_IDS.filter(id => id !== ALPHA_INVOICE);

      it('should observe five Supplier x Invoice Identity Slices', async () => {
        const slices = await firstValueFrom(repository.getIdentitySlices('document'));
        const invoices = slices.filter(s => s.streamKind === 'document' && s.documentType === 'Invoice');

        expect(invoices.map(s => s.id).sort()).toEqual(INVOICE_SLICE_IDS);
      });

      it('should derive an amount Observed Baseline for each supplier from its own observations', async () => {
        const { baselines } = await detect('document');
        const observations = await firstValueFrom(repository.getObservations('document'));
        const amount = INVOICE_SLICE_IDS.map(id =>
          baselines.find(b => b.identitySliceId === id && b.dimension === 'amount-value'),
        );

        for (const baseline of amount) {
          expect(baseline).toBeDefined();
          for (const observationId of baseline!.referenceObservationIds) {
            expect(observations.find(o => o.id === observationId)?.identitySliceId).toBe(
              baseline!.identitySliceId,
            );
          }
        }
        const means = amount.map(b => (b?.valueKind === 'numeric' ? Math.round(b.summary.mean) : null));
        expect(new Set(means).size).toBe(INVOICE_SLICE_IDS.length);
      });

      it('should surface exactly one invoice-population Divergence, for Alpha only', async () => {
        const { divergences } = await detect('document');
        const invoiceDivergences = divergences.filter(d => INVOICE_SLICE_IDS.includes(d.identitySlice.id));

        expect(invoiceDivergences.map(d => [d.identitySlice.id, d.dimension])).toEqual([
          [ALPHA_INVOICE, 'amount-value'],
        ]);
        expect(divergences.length).toBe(1);
      });

      it('should not surface the same Divergence for peer supplier populations', async () => {
        const { baselines, divergences } = await detect('document');
        const observations = await firstValueFrom(repository.getObservations('document'));

        for (const sliceId of PEER_SLICE_IDS) {
          expect(divergences.some(d => d.identitySlice.id === sliceId)).toBe(false);
          const baseline = baselines.find(
            b => b.identitySliceId === sliceId && b.dimension === 'amount-value',
          );
          const compared = observations.filter(
            o => o.identitySliceId === sliceId && o.observedAt >= '2026-08-31T00:00:00.000Z',
          );
          expect(compared.length).toBeGreaterThan(0);
          for (const observation of compared) {
            expect(isWithinObservedBaseline(baseline!, observation.amount.value)).toBe(true);
          }
        }
      });

      it('should give the new peer populations enough compared observations to meet the sustained criteria', async () => {
        const observations = await firstValueFrom(repository.getObservations('document'));

        for (const sliceId of [DELTA_INVOICE, EPSILON_INVOICE]) {
          const compared = observations.filter(
            o => o.identitySliceId === sliceId && o.observedAt >= '2026-08-31T00:00:00.000Z',
          );
          expect(compared.length).toBeGreaterThanOrEqual(
            DEFAULT_DETECTION_CONFIG.minConsecutiveObservations,
          );
        }
      });

      it('should reconstruct the Alpha Divergence Evidence from source observations and its baseline', async () => {
        const { divergences } = await detect('document');
        const observations = await firstValueFrom(repository.getObservations('document'));
        const [alpha] = divergences;

        expect(alpha.evidence.baselineId).toBe(alpha.baseline.id);
        for (const item of alpha.evidence.items) {
          const source = observations.find(o => o.id === item.observationId);
          expect(source?.identitySliceId).toBe(ALPHA_INVOICE);
          expect(item.sources).toEqual(source?.sources);
          expect(item.value).toBe(source?.amount.value);
          expect(item.withinBaseline).toBe(false);
        }
        expect(alpha.baseline.referenceObservationIds.every(id => id.startsWith('document/10'))).toBe(true);
      });
    });
  });

  describe('workflow stream', () => {
    it('should surface sustained Approval step and Workflow runtime Divergences only', async () => {
      const { divergences } = await detect('workflow');

      expect(divergences.map(d => [d.identitySlice.label, d.dimension, d.status])).toEqual([
        ['Invoice approval (synthetic) · Approval', 'task-duration', 'ongoing'],
        ['Invoice approval (synthetic) · Approval', 'response-time', 'ongoing'],
        ['Invoice approval (synthetic) · Workflow runtime', 'workflow-runtime', 'ongoing'],
      ]);
      expect(divergences.every(d => d.evidence.items.length === 6)).toBe(true);
      expect(divergences.map(d => d.onset)).toEqual([
        '2026-09-05T07:00:00.000Z',
        '2026-09-05T07:00:00.000Z',
        '2026-09-05T07:03:00.000Z',
      ]);
    });

    it('should keep the earlier single error exit as reference history, not a Divergence', async () => {
      const { baselines, divergences } = await detect('workflow');
      const outcome = baselines.find(
        b => b.identitySliceId.endsWith('/payment-release') && b.dimension === 'task-outcome',
      );

      expect(outcome?.valueKind === 'categorical' && outcome.summary.distribution).toEqual([
        { value: 'decision:Release', count: 11, share: 11 / 12 },
        { value: 'error-exit:Payment export error exit', count: 1, share: 1 / 12 },
      ]);
      expect(divergences.some(d => d.identitySlice.id.endsWith('/payment-release'))).toBe(false);
    });

    it('should derive no response time baseline for the automated Payment release step', async () => {
      const { baselines } = await detect('workflow');

      expect(
        baselines.some(
          b => b.identitySliceId.endsWith('/payment-release') && b.dimension === 'response-time',
        ),
      ).toBe(false);
    });

    // QA-014: the Approval change also moves Workflow runtime. Both slices meet the sustained
    // criteria on their own baselines, so both are emitted, unlinked. Neither is presented as the
    // cause of the other.
    it('should emit the QA-014 Approval and Workflow runtime Divergences independently', async () => {
      const { divergences } = await detect('workflow');
      const [approval] = divergences;
      const runtime = divergences[2];
      const instances = (items: typeof approval.evidence.items) =>
        items.map(i => ('instanceId' in i.context ? i.context.instanceId : null));

      expect(approval.baseline.identitySliceId).not.toBe(runtime.baseline.identitySliceId);
      expect(instances(approval.evidence.items)).toEqual(instances(runtime.evidence.items));
      expect(JSON.stringify(divergences)).not.toMatch(/derived|related|cause/i);
    });

    it('should carry decision agent only as Evidence context', async () => {
      const { divergences } = await detect('workflow');

      expect(divergences[0].evidence.items[0].context).toMatchObject({
        recordType: 'task',
        decisionAgent: 'Finance approver role (synthetic)',
      });
    });
  });

  for (const stream of ['document', 'workflow'] as const) {
    it(`should keep ${stream} detection output within CAV Level 1 terminology`, async () => {
      const serialized = JSON.stringify(await detect(stream));

      expect(serialized).not.toMatch(CLAIM_GUARDRAIL_PATTERNS.reservedTerms);
      expect(serialized).not.toMatch(CLAIM_GUARDRAIL_PATTERNS.nonCanonicalFindingNames);
      expect(serialized).not.toMatch(CLAIM_GUARDRAIL_PATTERNS.attribution);
      expect(serialized).not.toMatch(CLAIM_GUARDRAIL_PATTERNS.higherCavLevels);
    });
  }
});
