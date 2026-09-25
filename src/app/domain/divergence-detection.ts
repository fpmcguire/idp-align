import { Divergence, SustainedCriteria, detectSustainedDivergences } from './divergence';
import { dimensionsFor } from './divergence-dimension';
import { IdentitySliceFor } from './identity-slice';
import { ObservationFor } from './observation';
import {
  ObservedBaseline,
  ObservedBaselineConfig,
  ReferenceWindow,
  deriveObservedBaseline,
  isInReferenceWindow,
  referenceWindowFor,
} from './observed-baseline';
import { toObservedTruth } from './observed-truth';
import { StreamKind } from './stream';

export type DivergenceDetectionConfig = ObservedBaselineConfig & SustainedCriteria;

/** MVP detection parameters. Every value is recorded on the baselines and Divergences it shapes. */
export const DEFAULT_DETECTION_CONFIG: DivergenceDetectionConfig = {
  referenceWindowDays: 28,
  minReferenceSampleSize: 4,
  rangeStandardDeviations: 3,
  minRangeRelativeHalfWidth: 0.05,
  minValueShare: 0.1,
  minConsecutiveObservations: 3,
};

export interface StreamDivergenceResult {
  /** Null when the stream has no observations. */
  readonly referenceWindow: ReferenceWindow | null;
  readonly baselines: readonly ObservedBaseline[];
  readonly divergences: readonly Divergence[];
}

/**
 * Derives Observed Baselines and detects sustained Divergences for one stream. Observations inside
 * the stream's reference window build the baselines; later observations are the candidates.
 *
 * Each Identity Slice and dimension is evaluated independently against its own Observed Baseline.
 * When one underlying workflow change moves both a workflow step slice and the Workflow runtime
 * slice (QA-014), each slice that meets the sustained criteria yields its own Divergence. Neither
 * is suppressed, marked as derived, or linked to the other: doing so would assert that one change
 * explains the other, which is causal Attribution and outside CAV Level 1.
 */
export function detectStreamDivergences<K extends StreamKind>(
  slices: readonly IdentitySliceFor<K>[],
  observations: readonly ObservationFor<K>[],
  config: DivergenceDetectionConfig = DEFAULT_DETECTION_CONFIG,
): StreamDivergenceResult {
  const referenceWindow = referenceWindowFor(observations, config.referenceWindowDays);
  if (!referenceWindow) return { referenceWindow, baselines: [], divergences: [] };

  const baselines: ObservedBaseline[] = [];
  const divergences: Divergence[] = [];

  for (const truth of toObservedTruth(slices, observations)) {
    const reference = truth.observations.filter(o => isInReferenceWindow(o, referenceWindow));
    const candidates = truth.observations.filter(
      o => Date.parse(o.observedAt) >= Date.parse(referenceWindow.to),
    );

    for (const dimension of dimensionsFor(truth.identitySlice)) {
      const baseline = deriveObservedBaseline(
        truth.identitySlice,
        dimension,
        reference,
        referenceWindow,
        config,
      );
      if (!baseline) continue;
      baselines.push(baseline);
      divergences.push(
        ...detectSustainedDivergences(truth.identitySlice, baseline, candidates, config),
      );
    }
  }

  return { referenceWindow, baselines, divergences };
}
