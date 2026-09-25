import { firstValueFrom } from 'rxjs';
import { CLAIM_GUARDRAIL_PATTERNS } from '../../../testing/claim-guardrail-patterns';
import { detectStreamDivergences } from '../../domain/divergence-detection';
import { StreamKind } from '../../domain/stream';
import { StreamObservationRepository } from '../stream-observation.repository';
import { ReplayStreamObservationRepository } from './replay-stream-observation.repository';

// Runs the domain detector over replay observations read through the repository interface, the
// same path later dashboard Steps will use. Fixture files are not imported here.

const repository: StreamObservationRepository = new ReplayStreamObservationRepository();

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

      expect(sliceIds.sort()).toEqual([
        'document/alpha-office-supplies-synthetic/invoice',
        'document/beta-freight-services-synthetic/invoice',
        'document/gamma-facilities-care-synthetic/invoice',
      ]);
      expect(baselines.length).toBe(12);
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
