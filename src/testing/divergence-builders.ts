// Test-only Divergence records for UI specs. Each one is produced by the STEP-03 detector from
// synthetic observations, so specs render real domain records. Production code must not import this.

import { Divergence } from '../app/domain/divergence';
import { detectStreamDivergences } from '../app/domain/divergence-detection';
import { IdentitySlice } from '../app/domain/identity-slice';
import { Observation } from '../app/domain/observation';
import {
  MINUTE_MS,
  at,
  documentObservation,
  runtimeObservation,
  taskObservation,
  testApprovalSlice,
  testDocumentSlice,
  testRuntimeSlice,
} from './observation-builders';

/** Reference amounts: mean 1000, sample SD √50, so the within-baseline range is 950 to 1050. */
const REFERENCE_AMOUNTS = [1000, 1010, 990, 1000, 1005, 995];

/** Candidate days: after the 28-day reference window that starts on day 0. */
const CANDIDATE_DAYS = [30, 31, 32, 33];

function detect(slices: readonly IdentitySlice[], observations: readonly Observation[]) {
  return detectStreamDivergences(slices, observations).divergences;
}

/**
 * One `amount-value` Divergence: four candidate invoices at 1500 against a 1000 baseline. With
 * `resolved`, a later 1000 invoice ends the sustained run (QA-019); that observation, `doc-r`, is
 * not part of the Evidence.
 */
export function amountDivergence(options: { resolved?: boolean } = {}): Divergence {
  const observations = [
    ...REFERENCE_AMOUNTS.map((amount, i) => documentObservation(`doc-${i}`, at(i), { amount })),
    ...CANDIDATE_DAYS.map((day, i) => documentObservation(`doc-c${i}`, at(day), { amount: 1500 })),
    ...(options.resolved ? [documentObservation('doc-r', at(34), { amount: 1000 })] : []),
  ];
  const [divergence] = detect([testDocumentSlice], observations);
  return divergence;
}

/** One `vendor-representation` Divergence: a case-only variant within the same Identity Slice. */
export function vendorRepresentationDivergence(): Divergence {
  const observations = [
    ...REFERENCE_AMOUNTS.map((_, i) => documentObservation(`doc-${i}`, at(i))),
    ...CANDIDATE_DAYS.slice(0, 3).map((day, i) =>
      documentObservation(`doc-c${i}`, at(day), { vendor: 'KAPPA PAPER (SYNTHETIC)' }),
    ),
  ];
  const [divergence] = detect([testDocumentSlice], observations);
  return divergence;
}

/**
 * Approval `task-duration` and Workflow runtime Divergences that share workflow instances, as in
 * QA-014. Returned in detector order: task duration, then workflow runtime.
 */
export function workflowDivergences(): readonly Divergence[] {
  const observations = [
    ...REFERENCE_AMOUNTS.flatMap((_, i) => [
      taskObservation(`task-${i}`, at(i), { instanceId: `wf-${i}` }),
      runtimeObservation(`run-${i}`, at(i, 13), 70 * MINUTE_MS, `wf-${i}`),
    ]),
    ...CANDIDATE_DAYS.slice(0, 3).flatMap((day, i) => [
      taskObservation(`task-c${i}`, at(day), {
        instanceId: `wf-c${i}`,
        taskDurationMs: 300 * MINUTE_MS,
      }),
      runtimeObservation(`run-c${i}`, at(day, 13), 320 * MINUTE_MS, `wf-c${i}`),
    ]),
  ];
  return detect([testApprovalSlice, testRuntimeSlice], observations);
}

/**
 * One categorical workflow `task-outcome` Divergence: three Approval tasks that left through an
 * error exit after reference tasks that all ended with the "Approve" decision. Test data only;
 * replay data has no categorical workflow Divergence.
 */
export function taskOutcomeDivergence(): Divergence {
  const observations = [
    ...REFERENCE_AMOUNTS.map((_, i) => taskObservation(`task-${i}`, at(i))),
    ...CANDIDATE_DAYS.slice(0, 3).map((day, i) =>
      taskObservation(`task-c${i}`, at(day), { errorExit: 'Test error exit (synthetic)' }),
    ),
  ];
  return detect([testApprovalSlice], observations).find(d => d.dimension === 'task-outcome')!;
}
