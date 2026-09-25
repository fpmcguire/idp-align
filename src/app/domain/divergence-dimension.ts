import { IdentitySlice } from './identity-slice';
import { Observation } from './observation';
import { StreamKind } from './stream';

export type DocumentDivergenceDimension =
  | 'vendor-representation'
  | 'amount-value'
  | 'amount-currency'
  | 'document-date-lag';

export type WorkflowTaskDivergenceDimension = 'task-duration' | 'response-time' | 'task-outcome';

export type WorkflowRuntimeDivergenceDimension = 'workflow-runtime';

/** The observed behavior an Observed Baseline summarizes and a Divergence is measured on. */
export type DivergenceDimension =
  | DocumentDivergenceDimension
  | WorkflowTaskDivergenceDimension
  | WorkflowRuntimeDivergenceDimension;

export type DimensionValueKind = 'numeric' | 'categorical';

export type DimensionUnit = 'text' | 'amount' | 'currency-code' | 'milliseconds';

/** One observed value on a dimension: a number when numeric, text when categorical. */
export type DimensionValue = number | string;

export interface DivergenceDimensionDefinition {
  readonly dimension: DivergenceDimension;
  readonly streamKind: StreamKind;
  readonly valueKind: DimensionValueKind;
  readonly label: string;
  readonly unit: DimensionUnit;
}

// Decision agent is deliberately not a dimension. It is carried only as Evidence context, so
// showing it never reads as the cause of a Divergence (no Attribution).
export const DIVERGENCE_DIMENSIONS: Readonly<
  Record<DivergenceDimension, DivergenceDimensionDefinition>
> = {
  'vendor-representation': {
    dimension: 'vendor-representation',
    streamKind: 'document',
    valueKind: 'categorical',
    label: 'Vendor representation',
    unit: 'text',
  },
  'amount-value': {
    dimension: 'amount-value',
    streamKind: 'document',
    valueKind: 'numeric',
    label: 'Amount',
    unit: 'amount',
  },
  'amount-currency': {
    dimension: 'amount-currency',
    streamKind: 'document',
    valueKind: 'categorical',
    label: 'Currency',
    unit: 'currency-code',
  },
  'document-date-lag': {
    dimension: 'document-date-lag',
    streamKind: 'document',
    valueKind: 'numeric',
    label: 'Document date to storage time',
    unit: 'milliseconds',
  },
  'task-duration': {
    dimension: 'task-duration',
    streamKind: 'workflow',
    valueKind: 'numeric',
    label: 'Task duration',
    unit: 'milliseconds',
  },
  'response-time': {
    dimension: 'response-time',
    streamKind: 'workflow',
    valueKind: 'numeric',
    label: 'Response time',
    unit: 'milliseconds',
  },
  'task-outcome': {
    dimension: 'task-outcome',
    streamKind: 'workflow',
    valueKind: 'categorical',
    label: 'Decision or route outcome',
    unit: 'text',
  },
  'workflow-runtime': {
    dimension: 'workflow-runtime',
    streamKind: 'workflow',
    valueKind: 'numeric',
    label: 'Workflow runtime',
    unit: 'milliseconds',
  },
};

// Date representation is not a dimension: normalized document observations keep only an ISO
// calendar date, so the source's date encoding cannot be observed. Document date to storage time is
// the date-related behavior these observations support.
const DOCUMENT_DIMENSIONS: readonly DocumentDivergenceDimension[] = [
  'vendor-representation',
  'amount-value',
  'amount-currency',
  'document-date-lag',
];

const WORKFLOW_TASK_DIMENSIONS: readonly WorkflowTaskDivergenceDimension[] = [
  'task-duration',
  'response-time',
  'task-outcome',
];

const WORKFLOW_RUNTIME_DIMENSIONS: readonly WorkflowRuntimeDivergenceDimension[] = [
  'workflow-runtime',
];

/** Dimensions evaluated for an Identity Slice: document, workflow step, or workflow runtime. */
export function dimensionsFor(slice: IdentitySlice): readonly DivergenceDimension[] {
  if (slice.streamKind === 'document') return DOCUMENT_DIMENSIONS;
  return slice.step === null ? WORKFLOW_RUNTIME_DIMENSIONS : WORKFLOW_TASK_DIMENSIONS;
}

/**
 * Reads one dimension's value from an observation, or null when the observation does not carry
 * that behavior (for example a task with no response time, or a runtime record for a task
 * dimension). Amount is read as a plain number; currency is its own dimension.
 */
export function dimensionValue(
  dimension: DivergenceDimension,
  observation: Observation,
): DimensionValue | null {
  if (observation.streamKind === 'document') {
    switch (dimension) {
      case 'vendor-representation':
        return observation.vendor;
      case 'amount-value':
        return observation.amount.value;
      case 'amount-currency':
        return observation.amount.currency;
      case 'document-date-lag':
        return (
          Date.parse(observation.observedAt) -
          Date.parse(`${observation.documentDate}T00:00:00.000Z`)
        );
      default:
        return null;
    }
  }

  if (observation.recordType === 'runtime') {
    return dimension === 'workflow-runtime' ? observation.runtimeMs : null;
  }

  switch (dimension) {
    case 'task-duration':
      return observation.taskDurationMs;
    case 'response-time':
      return observation.responseTimeMs ?? null;
    case 'task-outcome':
      if (observation.errorExit !== undefined) return `error-exit:${observation.errorExit}`;
      return observation.decision !== undefined ? `decision:${observation.decision}` : null;
    default:
      return null;
  }
}
