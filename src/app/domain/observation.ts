import { SourceReference } from './source-reference';
import { StreamKind } from './stream';

interface ObservationBase {
  readonly id: string;
  readonly identitySliceId: string;
  /** ISO 8601 timestamp of the observed behavior. */
  readonly observedAt: string;
  /** Source records this observation was built from; never empty. */
  readonly sources: readonly SourceReference[];
}

export interface MonetaryAmount {
  readonly value: number;
  readonly currency: string;
}

/** Observed document index-field values for one stored document. */
export interface DocumentObservation extends ObservationBase {
  readonly streamKind: 'document';
  readonly vendor: string;
  readonly documentType: string;
  readonly amount: MonetaryAmount;
  /** ISO 8601 calendar date (YYYY-MM-DD). */
  readonly documentDate: string;
}

/** Observed execution of one workflow task. */
export interface WorkflowTaskObservation extends ObservationBase {
  readonly streamKind: 'workflow';
  readonly recordType: 'task';
  readonly workflowName: string;
  readonly instanceId: string;
  readonly step: string;
  /** Time from task assignment to confirmation. */
  readonly taskDurationMs: number;
  /** Time from task assignment to pickup by a decision agent. */
  readonly responseTimeMs?: number;
  readonly decision?: string;
  readonly decisionAgent?: string;
  /** Route taken through an error exit, when the task left through one. */
  readonly errorExit?: string;
}

export type WorkflowInstanceState = 'completed' | 'running' | 'failed' | 'stopped';

/** Observed runtime of one whole workflow instance. */
export interface WorkflowRuntimeObservation extends ObservationBase {
  readonly streamKind: 'workflow';
  readonly recordType: 'runtime';
  readonly workflowName: string;
  readonly instanceId: string;
  readonly runtimeMs: number;
  readonly state: WorkflowInstanceState;
}

export type WorkflowObservation = WorkflowTaskObservation | WorkflowRuntimeObservation;

export type Observation = DocumentObservation | WorkflowObservation;

export type ObservationFor<K extends StreamKind> = Extract<Observation, { streamKind: K }>;

/** Inclusive span between the earliest and latest observation timestamps. */
export interface ObservationWindow {
  readonly from: string;
  readonly to: string;
}

export function observationWindowOf(
  observations: readonly Observation[],
): ObservationWindow | null {
  if (observations.length === 0) return null;
  const times = observations.map(o => o.observedAt).sort();
  return { from: times[0], to: times[times.length - 1] };
}
