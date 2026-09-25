import { ValueFrequency, frequencyDistribution, mean } from './baseline-statistics';
import { DimensionValue, DivergenceDimension, dimensionValue } from './divergence-dimension';
import { Evidence, buildEvidence } from './evidence';
import { IdentitySlice } from './identity-slice';
import { Observation, byObservedAt } from './observation';
import {
  CategoricalObservedBaseline,
  NumericObservedBaseline,
  ObservedBaseline,
  baselineShareOf,
  isWithinObservedBaseline,
} from './observed-baseline';
import { StreamKind } from './stream';

/**
 * Lifecycle marker for a Divergence finding. The detector sets only `ongoing` or `resolved`;
 * `reviewed` and `muted` are reserved for later user actions. `resolved` means observed behavior
 * returned within the Observed Baseline. It is a finding lifecycle state only and does not imply
 * remediation, Convergence, or business correctness.
 */
export type DivergenceStatus = 'ongoing' | 'reviewed' | 'resolved' | 'muted';

export const DIVERGENCE_STATUSES: readonly DivergenceStatus[] = [
  'ongoing',
  'reviewed',
  'resolved',
  'muted',
];

export interface SustainedCriteria {
  /** Fewest consecutive out-of-baseline observations that make a Divergence. */
  readonly minConsecutiveObservations: number;
}

export interface NumericObservedSummary {
  readonly valueKind: 'numeric';
  readonly count: number;
  readonly mean: number;
  readonly min: number;
  readonly max: number;
  readonly latest: number;
}

export interface CategoricalObservedSummary {
  readonly valueKind: 'categorical';
  readonly count: number;
  readonly dominantValue: string;
  readonly distribution: readonly ValueFrequency[];
  readonly latest: string;
}

export type ObservedSummary = NumericObservedSummary | CategoricalObservedSummary;

/** Size of the departure from the Observed Baseline, for explanation only. */
export interface NumericMagnitude {
  readonly valueKind: 'numeric';
  readonly differenceFromBaselineMean: number;
  /** Difference as a share of the absolute baseline mean; null when the mean is zero. */
  readonly relativeDifference: number | null;
  /** Difference in baseline standard deviations; null when the baseline has no spread. */
  readonly standardDeviations: number | null;
}

export interface CategoricalMagnitude {
  readonly valueKind: 'categorical';
  readonly observedDominantValue: string;
  /** Share of reference observations that had the observed dominant value. */
  readonly baselineShareOfObservedValue: number;
}

export type Magnitude = NumericMagnitude | CategoricalMagnitude;

/**
 * Sustained departure from an Observed Baseline for one Identity Slice and dimension. It surfaces
 * a change with its Evidence; it does not judge the change as right or wrong.
 */
export interface Divergence {
  readonly id: string;
  readonly streamKind: StreamKind;
  readonly identitySlice: IdentitySlice;
  readonly dimension: DivergenceDimension;
  readonly baseline: ObservedBaseline;
  readonly observed: ObservedSummary;
  readonly magnitude: Magnitude;
  /** Time of the first out-of-baseline observation in the sustained run. */
  readonly onset: string;
  readonly latestObservedAt: string;
  readonly durationMs: number;
  readonly status: DivergenceStatus;
  readonly sustainedCriteria: SustainedCriteria;
  readonly evidence: Evidence;
}

interface Point {
  readonly observation: Observation;
  readonly value: DimensionValue;
}

/**
 * Evaluates candidate observations in chronological order against one Observed Baseline. A run is
 * a sequence of consecutive out-of-baseline observations; any within-baseline observation ends it.
 * Only runs of at least `minConsecutiveObservations` become Divergences, so a one-off
 * out-of-baseline observation never does. A run still open at the latest candidate is `ongoing`;
 * a run that ended is `resolved`.
 */
export function detectSustainedDivergences(
  identitySlice: IdentitySlice,
  baseline: ObservedBaseline,
  candidateObservations: readonly Observation[],
  criteria: SustainedCriteria,
): Divergence[] {
  const points = [...candidateObservations].sort(byObservedAt).flatMap((observation): Point[] => {
    const value = dimensionValue(baseline.dimension, observation);
    return value === null ? [] : [{ observation, value }];
  });

  const runs: Point[][] = [];
  let current: Point[] = [];
  for (const point of points) {
    if (isWithinObservedBaseline(baseline, point.value)) {
      if (current.length > 0) runs.push(current);
      current = [];
    } else {
      current.push(point);
    }
  }
  if (current.length > 0) runs.push(current);

  const latest = points.at(-1);
  return runs
    .filter(run => run.length >= criteria.minConsecutiveObservations)
    .map(run =>
      toDivergence(identitySlice, baseline, run, run.at(-1) === latest ? 'ongoing' : 'resolved', {
        minConsecutiveObservations: criteria.minConsecutiveObservations,
      }),
    );
}

function toDivergence(
  identitySlice: IdentitySlice,
  baseline: ObservedBaseline,
  run: readonly Point[],
  status: DivergenceStatus,
  sustainedCriteria: SustainedCriteria,
): Divergence {
  const onset = run[0].observation.observedAt;
  const latestObservedAt = run[run.length - 1].observation.observedAt;
  const { observed, magnitude } =
    baseline.valueKind === 'numeric'
      ? numericFinding(baseline, run.map(p => Number(p.value)))
      : categoricalFinding(baseline, run.map(p => String(p.value)));

  return {
    id: `divergence:${baseline.id}:${run[0].observation.id}`,
    streamKind: identitySlice.streamKind,
    identitySlice,
    dimension: baseline.dimension,
    baseline,
    observed,
    magnitude,
    onset,
    latestObservedAt,
    durationMs: Date.parse(latestObservedAt) - Date.parse(onset),
    status,
    sustainedCriteria,
    evidence: buildEvidence(
      baseline,
      run.map(p => p.observation),
    ),
  };
}

function numericFinding(baseline: NumericObservedBaseline, values: readonly number[]) {
  const observedMean = mean(values);
  const difference = observedMean - baseline.summary.mean;
  const baselineMean = baseline.summary.mean;
  const spread = baseline.summary.standardDeviation;
  const observed: NumericObservedSummary = {
    valueKind: 'numeric',
    count: values.length,
    mean: observedMean,
    min: Math.min(...values),
    max: Math.max(...values),
    latest: values[values.length - 1],
  };
  const magnitude: NumericMagnitude = {
    valueKind: 'numeric',
    differenceFromBaselineMean: difference,
    relativeDifference: baselineMean === 0 ? null : difference / Math.abs(baselineMean),
    standardDeviations: spread === 0 ? null : difference / spread,
  };
  return { observed, magnitude };
}

function categoricalFinding(baseline: CategoricalObservedBaseline, values: readonly string[]) {
  const distribution = frequencyDistribution(values);
  const observed: CategoricalObservedSummary = {
    valueKind: 'categorical',
    count: values.length,
    dominantValue: distribution[0].value,
    distribution,
    latest: values[values.length - 1],
  };
  const magnitude: CategoricalMagnitude = {
    valueKind: 'categorical',
    observedDominantValue: distribution[0].value,
    baselineShareOfObservedValue: baselineShareOf(baseline, distribution[0].value),
  };
  return { observed, magnitude };
}
