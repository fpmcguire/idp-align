import {
  ValueFrequency,
  frequencyDistribution,
  mean,
  median,
  sampleStandardDeviation,
} from './baseline-statistics';
import {
  DIVERGENCE_DIMENSIONS,
  DimensionValue,
  DivergenceDimension,
  dimensionValue,
} from './divergence-dimension';
import { IdentitySlice } from './identity-slice';
import { Observation, byObservedAt, observationWindowOf } from './observation';
import { StreamKind } from './stream';

const DAY_MS = 86_400_000;

/** Named, explainable method used to summarize the reference observations. */
export type BaselineMethod = 'mean-standard-deviation-range' | 'reference-frequency-distribution';

/** Period an Observed Baseline is derived from: `from` is inclusive, `to` is exclusive. */
export interface ReferenceWindow {
  readonly from: string;
  readonly to: string;
}

export interface ObservedBaselineConfig {
  /** Length of the reference window, counted from the start of the first observed UTC day. */
  readonly referenceWindowDays: number;
  /** Fewest reference observations needed before a baseline is derived. */
  readonly minReferenceSampleSize: number;
  /** Numeric range half-width in sample standard deviations. */
  readonly rangeStandardDeviations: number;
  /** Numeric range half-width floor as a share of the absolute mean. */
  readonly minRangeRelativeHalfWidth: number;
  /** Categorical values seen in a smaller share of reference observations are out of baseline. */
  readonly minValueShare: number;
}

interface ObservedBaselineBase {
  readonly id: string;
  /** Snapshots are immutable; a recalculation would produce a new version, not edit this one. */
  readonly version: number;
  readonly streamKind: StreamKind;
  readonly identitySliceId: string;
  readonly dimension: DivergenceDimension;
  readonly referenceWindow: ReferenceWindow;
  readonly sampleSize: number;
  /** Observations the baseline was derived from, in chronological order. */
  readonly referenceObservationIds: readonly string[];
}

export interface NumericBaselineSummary {
  readonly mean: number;
  readonly standardDeviation: number;
  readonly median: number;
  readonly min: number;
  readonly max: number;
}

export interface NumericObservedBaseline extends ObservedBaselineBase {
  readonly valueKind: 'numeric';
  readonly method: 'mean-standard-deviation-range';
  readonly summary: NumericBaselineSummary;
  /** Values inside this inclusive range are within the Observed Baseline. */
  readonly range: { readonly lower: number; readonly upper: number };
  readonly rule: { readonly standardDeviations: number; readonly minRelativeHalfWidth: number };
}

export interface CategoricalBaselineSummary {
  readonly dominantValue: string;
  readonly dominantShare: number;
  readonly distribution: readonly ValueFrequency[];
}

export interface CategoricalObservedBaseline extends ObservedBaselineBase {
  readonly valueKind: 'categorical';
  readonly method: 'reference-frequency-distribution';
  readonly summary: CategoricalBaselineSummary;
  readonly rule: { readonly minValueShare: number };
}

/**
 * Reference derived from historical observed behavior for one Identity Slice and dimension. It
 * describes what has been observed, not what should happen.
 */
export type ObservedBaseline = NumericObservedBaseline | CategoricalObservedBaseline;

const BASELINE_VERSION = 1;

/**
 * Reference window for one stream: from its earliest observation until `referenceWindowDays` after
 * the start of that UTC day. Null when there are no observations.
 */
export function referenceWindowFor(
  observations: readonly Observation[],
  referenceWindowDays: number,
): ReferenceWindow | null {
  const span = observationWindowOf(observations);
  if (!span) return null;
  const firstDayStart = Math.floor(Date.parse(span.from) / DAY_MS) * DAY_MS;
  return {
    from: span.from,
    to: new Date(firstDayStart + referenceWindowDays * DAY_MS).toISOString(),
  };
}

export function isInReferenceWindow(observation: Observation, window: ReferenceWindow): boolean {
  const time = Date.parse(observation.observedAt);
  return time >= Date.parse(window.from) && time < Date.parse(window.to);
}

/**
 * Derives an Observed Baseline from reference observations for one Identity Slice and dimension.
 * Observations without a value on the dimension are not counted. Returns null when fewer than
 * `minReferenceSampleSize` values remain.
 */
export function deriveObservedBaseline(
  identitySlice: IdentitySlice,
  dimension: DivergenceDimension,
  referenceObservations: readonly Observation[],
  referenceWindow: ReferenceWindow,
  config: ObservedBaselineConfig,
): ObservedBaseline | null {
  const points = [...referenceObservations].sort(byObservedAt).flatMap(observation => {
    const value = dimensionValue(dimension, observation);
    return value === null ? [] : [{ id: observation.id, value }];
  });
  if (points.length < config.minReferenceSampleSize) return null;

  const base: ObservedBaselineBase = {
    id: `baseline:${identitySlice.id}:${dimension}:${referenceWindow.from}..${referenceWindow.to}`,
    version: BASELINE_VERSION,
    streamKind: identitySlice.streamKind,
    identitySliceId: identitySlice.id,
    dimension,
    referenceWindow,
    sampleSize: points.length,
    referenceObservationIds: points.map(p => p.id),
  };

  if (DIVERGENCE_DIMENSIONS[dimension].valueKind === 'numeric') {
    const values = points.map(p => Number(p.value));
    const summary: NumericBaselineSummary = {
      mean: mean(values),
      standardDeviation: sampleStandardDeviation(values),
      median: median(values),
      min: Math.min(...values),
      max: Math.max(...values),
    };
    const halfWidth = Math.max(
      config.rangeStandardDeviations * summary.standardDeviation,
      config.minRangeRelativeHalfWidth * Math.abs(summary.mean),
    );
    return {
      ...base,
      valueKind: 'numeric',
      method: 'mean-standard-deviation-range',
      summary,
      range: { lower: summary.mean - halfWidth, upper: summary.mean + halfWidth },
      rule: {
        standardDeviations: config.rangeStandardDeviations,
        minRelativeHalfWidth: config.minRangeRelativeHalfWidth,
      },
    };
  }

  const distribution = frequencyDistribution(points.map(p => String(p.value)));
  return {
    ...base,
    valueKind: 'categorical',
    method: 'reference-frequency-distribution',
    summary: {
      dominantValue: distribution[0].value,
      dominantShare: distribution[0].share,
      distribution,
    },
    rule: { minValueShare: config.minValueShare },
  };
}

/** Share of reference observations that had this categorical value; zero when never seen. */
export function baselineShareOf(baseline: CategoricalObservedBaseline, value: string): number {
  return baseline.summary.distribution.find(f => f.value === value)?.share ?? 0;
}

/**
 * Whether one observed value sits within the Observed Baseline: inside the numeric range, or a
 * categorical value seen in at least `minValueShare` of reference observations.
 */
export function isWithinObservedBaseline(
  baseline: ObservedBaseline,
  value: DimensionValue,
): boolean {
  if (baseline.valueKind === 'numeric') {
    return (
      typeof value === 'number' && value >= baseline.range.lower && value <= baseline.range.upper
    );
  }
  return baselineShareOf(baseline, String(value)) >= baseline.rule.minValueShare;
}
