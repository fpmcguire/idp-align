// Test-only builders for synthetic domain observations. Specs import this file; production code
// must not.

import { documentIdentitySlice, workflowIdentitySlice } from '../app/domain/identity-slice';
import {
  DocumentObservation,
  WorkflowRuntimeObservation,
  WorkflowTaskObservation,
} from '../app/domain/observation';

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export const TEST_VENDOR = 'Kappa Paper (synthetic)';
export const TEST_WORKFLOW = 'Test approval (synthetic)';

export const testDocumentSlice = documentIdentitySlice(TEST_VENDOR, 'Invoice');
export const testApprovalSlice = workflowIdentitySlice(TEST_WORKFLOW, 'Approval');
export const testRuntimeSlice = workflowIdentitySlice(TEST_WORKFLOW, null);

/** ISO time `dayOffset` days after 2026-08-03 at the given UTC hour. */
export const at = (dayOffset: number, hour = 12) =>
  new Date(Date.UTC(2026, 7, 3 + dayOffset, hour)).toISOString();

export interface DocumentOverrides {
  readonly vendor?: string;
  readonly documentType?: string;
  readonly amount?: number;
  readonly currency?: string;
  readonly documentDate?: string;
}

/** Document observation; defaults to 1000 EUR, dated the day it was stored. */
export function documentObservation(
  id: string,
  observedAt: string,
  overrides: DocumentOverrides = {},
): DocumentObservation {
  const vendor = overrides.vendor ?? TEST_VENDOR;
  const documentType = overrides.documentType ?? 'Invoice';
  return {
    id,
    streamKind: 'document',
    identitySliceId: documentIdentitySlice(vendor, documentType).id,
    observedAt,
    sources: [{ system: 'test', resource: 'Document', recordId: id }],
    vendor,
    documentType,
    amount: { value: overrides.amount ?? 1000, currency: overrides.currency ?? 'EUR' },
    documentDate: overrides.documentDate ?? observedAt.slice(0, 10),
  };
}

export type TaskOverrides = Partial<
  Pick<
    WorkflowTaskObservation,
    | 'step'
    | 'instanceId'
    | 'taskDurationMs'
    | 'responseTimeMs'
    | 'decision'
    | 'decisionAgent'
    | 'errorExit'
  >
>;

/** Approval task observation; defaults to 60 min duration, 10 min response time, "Approve". */
export function taskObservation(
  id: string,
  observedAt: string,
  overrides: TaskOverrides = {},
): WorkflowTaskObservation {
  const step = overrides.step ?? 'Approval';
  // Passing `responseTimeMs: undefined` builds a task with no response time.
  const responseTimeMs =
    'responseTimeMs' in overrides ? overrides.responseTimeMs : 10 * MINUTE_MS;
  return {
    id,
    streamKind: 'workflow',
    recordType: 'task',
    identitySliceId: workflowIdentitySlice(TEST_WORKFLOW, step).id,
    observedAt,
    sources: [{ system: 'test', resource: 'Task', recordId: id }],
    workflowName: TEST_WORKFLOW,
    instanceId: overrides.instanceId ?? id,
    step,
    taskDurationMs: overrides.taskDurationMs ?? 60 * MINUTE_MS,
    ...(responseTimeMs !== undefined && { responseTimeMs }),
    ...(overrides.errorExit !== undefined
      ? { errorExit: overrides.errorExit }
      : {
          decision: overrides.decision ?? 'Approve',
          decisionAgent: overrides.decisionAgent ?? 'Test approver role (synthetic)',
        }),
  };
}

/** Workflow runtime observation for one instance. */
export function runtimeObservation(
  id: string,
  observedAt: string,
  runtimeMs: number,
  instanceId = id,
): WorkflowRuntimeObservation {
  return {
    id,
    streamKind: 'workflow',
    recordType: 'runtime',
    identitySliceId: testRuntimeSlice.id,
    observedAt,
    sources: [{ system: 'test', resource: 'Runtime', recordId: id }],
    workflowName: TEST_WORKFLOW,
    instanceId,
    runtimeMs,
    state: 'completed',
  };
}
