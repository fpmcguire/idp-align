import { CLAIM_GUARDRAIL_PATTERNS } from '../../testing/claim-guardrail-patterns';
import {
  MINUTE_MS,
  at,
  documentObservation,
  runtimeObservation,
  taskObservation,
  testApprovalSlice,
  testDocumentSlice,
  testRuntimeSlice,
} from '../../testing/observation-builders';
import { DIVERGENCE_STATUSES } from './divergence';
import { DEFAULT_DETECTION_CONFIG, detectStreamDivergences } from './divergence-detection';
import { DIVERGENCE_DIMENSIONS } from './divergence-dimension';

// Domain records introduced in STEP-03 are later rendered by the dashboard, so their names and
// values are checked against the same CAV Level 1 terminology guardrails as rendered copy.
const DOMAIN_TERMINOLOGY_GUARDRAILS = {
  reservedTerms: CLAIM_GUARDRAIL_PATTERNS.reservedTerms,
  nonCanonicalFindingNames: CLAIM_GUARDRAIL_PATTERNS.nonCanonicalFindingNames,
  attribution: CLAIM_GUARDRAIL_PATTERNS.attribution,
  businessJudgment: CLAIM_GUARDRAIL_PATTERNS.businessJudgment,
  higherCavLevels: CLAIM_GUARDRAIL_PATTERNS.higherCavLevels,
  intent: /\bintent|\btarget|\bpolicy|\brequired|\bexpected/i,
};

const documentOutput = detectStreamDivergences(
  [testDocumentSlice],
  [
    ...Array.from({ length: 8 }, (_, i) =>
      documentObservation(`h${i}`, at(i * 3), { amount: 1000 + i }),
    ),
    ...[0, 1, 2].map(i =>
      documentObservation(`c${i}`, at(28 + i), {
        amount: 2000,
        currency: 'USD',
        vendor: 'KAPPA PAPER (SYNTHETIC)',
      }),
    ),
  ],
);

const workflowOutput = detectStreamDivergences(
  [testApprovalSlice, testRuntimeSlice],
  [
    ...Array.from({ length: 8 }, (_, i) => [
      taskObservation(`a${i}`, at(i * 3), { instanceId: `i${i}` }),
      runtimeObservation(`r${i}`, at(i * 3, 13), 90 * MINUTE_MS, `i${i}`),
    ]).flat(),
    ...[0, 1, 2].map(i =>
      taskObservation(`ca${i}`, at(28 + i), {
        instanceId: `n${i}`,
        taskDurationMs: 600 * MINUTE_MS,
        responseTimeMs: 90 * MINUTE_MS,
        errorExit: 'Export exit',
      }),
    ),
    ...[0, 1, 2].map(i => runtimeObservation(`cr${i}`, at(28 + i, 13), 700 * MINUTE_MS, `n${i}`)),
  ],
);

const SUBJECTS = {
  'dimension definitions': DIVERGENCE_DIMENSIONS,
  'Divergence statuses': DIVERGENCE_STATUSES,
  'detection parameter names': Object.keys(DEFAULT_DETECTION_CONFIG),
  'document detection output': documentOutput,
  'workflow detection output': workflowOutput,
};

describe('STEP-03 domain terminology', () => {
  it('should produce Divergences in both synthetic streams, so the output being checked is real', () => {
    expect(documentOutput.divergences.length).toBe(3);
    expect(workflowOutput.divergences.length).toBe(4);
  });

  it('should use the canonical Divergence status values', () => {
    expect(DIVERGENCE_STATUSES).toEqual(['ongoing', 'reviewed', 'resolved', 'muted']);
  });

  for (const [subject, value] of Object.entries(SUBJECTS)) {
    describe(subject, () => {
      const serialized = JSON.stringify(value);

      for (const [name, pattern] of Object.entries(DOMAIN_TERMINOLOGY_GUARDRAILS)) {
        it(`should not contain ${name} wording`, () => {
          expect(serialized).not.toMatch(pattern);
        });
      }
    });
  }
});
