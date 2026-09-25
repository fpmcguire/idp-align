import { DimensionValue, dimensionValue } from './divergence-dimension';
import { Observation, WorkflowInstanceState, byObservedAt } from './observation';
import { ObservedBaseline, isWithinObservedBaseline } from './observed-baseline';
import { SourceReference } from './source-reference';

export interface DocumentEvidenceContext {
  readonly recordType: 'document';
  readonly vendor: string;
  readonly documentType: string;
  readonly currency: string;
  readonly documentDate: string;
}

/**
 * Observed workflow task fields. Decision, decision agent, and error exit are shown as context
 * from the observed event only; they do not attribute a cause to the Divergence.
 */
export interface WorkflowTaskEvidenceContext {
  readonly recordType: 'task';
  readonly instanceId: string;
  readonly step: string;
  readonly decision?: string;
  readonly decisionAgent?: string;
  readonly errorExit?: string;
}

export interface WorkflowRuntimeEvidenceContext {
  readonly recordType: 'runtime';
  readonly instanceId: string;
  readonly state: WorkflowInstanceState;
}

export type EvidenceContext =
  | DocumentEvidenceContext
  | WorkflowTaskEvidenceContext
  | WorkflowRuntimeEvidenceContext;

/** One supporting observation, with its source records and the value compared to the baseline. */
export interface EvidenceTraceItem {
  readonly observationId: string;
  readonly observedAt: string;
  readonly sources: readonly SourceReference[];
  readonly value: DimensionValue;
  readonly withinBaseline: boolean;
  /** Numeric dimensions only: observed value minus the baseline mean. */
  readonly distanceFromBaselineMean: number | null;
  readonly context: EvidenceContext;
}

/** Observations supporting a Divergence, in chronological order, tied to one baseline snapshot. */
export interface Evidence {
  readonly baselineId: string;
  readonly items: readonly EvidenceTraceItem[];
}

export function evidenceContextOf(observation: Observation): EvidenceContext {
  if (observation.streamKind === 'document') {
    return {
      recordType: 'document',
      vendor: observation.vendor,
      documentType: observation.documentType,
      currency: observation.amount.currency,
      documentDate: observation.documentDate,
    };
  }
  if (observation.recordType === 'runtime') {
    return { recordType: 'runtime', instanceId: observation.instanceId, state: observation.state };
  }
  return {
    recordType: 'task',
    instanceId: observation.instanceId,
    step: observation.step,
    ...(observation.decision !== undefined && { decision: observation.decision }),
    ...(observation.decisionAgent !== undefined && { decisionAgent: observation.decisionAgent }),
    ...(observation.errorExit !== undefined && { errorExit: observation.errorExit }),
  };
}

/**
 * Builds chronological Evidence for a baseline from supporting observations. Observations with no
 * value on the baseline's dimension are left out.
 */
export function buildEvidence(
  baseline: ObservedBaseline,
  observations: readonly Observation[],
): Evidence {
  const items = [...observations].sort(byObservedAt).flatMap((observation): EvidenceTraceItem[] => {
    const value = dimensionValue(baseline.dimension, observation);
    if (value === null) return [];
    return [
      {
        observationId: observation.id,
        observedAt: observation.observedAt,
        sources: observation.sources,
        value,
        withinBaseline: isWithinObservedBaseline(baseline, value),
        distanceFromBaselineMean:
          baseline.valueKind === 'numeric' && typeof value === 'number'
            ? value - baseline.summary.mean
            : null,
        context: evidenceContextOf(observation),
      },
    ];
  });
  return { baselineId: baseline.id, items };
}
