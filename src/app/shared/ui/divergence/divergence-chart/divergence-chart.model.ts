import { DivergenceDimension } from '../../../../domain/divergence-dimension';

// Chart-ready projections of one existing Divergence. They carry values the domain already
// computed (Evidence values, the Observed Baseline snapshot, onset); the chart derives nothing.

/** One Evidence observation on a numeric dimension. `x` is the observation time in epoch ms. */
export interface MetricTimeSeriesPoint {
  readonly x: number;
  readonly y: number;
  readonly withinBaseline: boolean;
}

/** Numeric Evidence values over time, with the Observed Baseline mean and within-baseline range. */
export interface MetricTimeSeries {
  readonly kind: 'numeric';
  readonly dimension: DivergenceDimension;
  readonly points: readonly MetricTimeSeriesPoint[];
  readonly baselineMean: number;
  readonly baselineRange: { readonly lower: number; readonly upper: number };
  /** Onset in epoch ms. */
  readonly onset: number;
}

export interface CategoricalShare {
  readonly value: string;
  readonly label: string;
  /** Share of reference observations with this value, from the Observed Baseline snapshot. */
  readonly referenceShare: number;
  /** Share of Evidence observations with this value, from the observed summary. */
  readonly observedShare: number;
}

/**
 * Categorical values compared by share: reference observations against Evidence observations. A
 * categorical Observed Baseline has no numeric band, so none is modeled.
 */
export interface CategoricalShareComparison {
  readonly kind: 'categorical';
  readonly dimension: DivergenceDimension;
  readonly categories: readonly CategoricalShare[];
  /** Values seen in less than this share of reference observations are outside the baseline. */
  readonly minValueShare: number;
}

export type DivergenceChartModel = MetricTimeSeries | CategoricalShareComparison;
