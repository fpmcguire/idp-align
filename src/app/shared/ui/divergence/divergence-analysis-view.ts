import { Divergence } from '../../../domain/divergence';
import { baselineShareOf } from '../../../domain/observed-baseline';
import {
  DisplayField,
  baselineSummaryText,
  dimensionLabel,
  formatCategoricalValue,
  formatDimensionValue,
  formatDuration,
  formatShare,
  formatSignedDifference,
  formatUtc,
  formatUtcDate,
  magnitudeText,
  observedSummaryText,
} from './divergence-format';
import {
  CategoricalShare,
  DivergenceChartModel,
} from './divergence-chart/divergence-chart.model';

// Presentation projections for the Divergence Analysis view. Like divergence-format.ts, these only
// rearrange values the domain already computed: Evidence values and their within-baseline flags,
// the Observed Baseline snapshot, and the observed summary. They derive no baselines or findings.

/** One dimension the analysis can switch to: a Divergence in the same Identity Slice. */
export interface AnalysisDimensionOption {
  readonly divergenceId: string;
  readonly label: string;
}

export interface AnalysisTableRow {
  readonly observationId: string;
  readonly observedAt: string;
  readonly value: string;
  /** Numeric: distance from the baseline mean. Categorical: reference share of the value. */
  readonly comparison: string;
  readonly position: string;
}

export interface AnalysisTable {
  readonly comparisonHeading: string;
  readonly rows: readonly AnalysisTableRow[];
}

/**
 * Dimension options for Divergences in one Identity Slice, in the given order. When the same
 * dimension appears more than once, the onset date tells the options apart.
 */
export function toAnalysisDimensionOptions(
  divergences: readonly Divergence[],
): AnalysisDimensionOption[] {
  return divergences.map(divergence => {
    const label = dimensionLabel(divergence.dimension);
    const repeated = divergences.some(
      d => d !== divergence && d.dimension === divergence.dimension,
    );
    return {
      divergenceId: divergence.id,
      label: repeated ? `${label} (onset ${formatUtcDate(divergence.onset)})` : label,
    };
  });
}

/** Chart model: numeric Evidence over time, or categorical shares. No band is made for categories. */
export function toDivergenceChartModel(divergence: Divergence): DivergenceChartModel {
  const { baseline, observed, evidence, dimension } = divergence;
  if (baseline.valueKind === 'numeric') {
    return {
      kind: 'numeric',
      dimension,
      points: evidence.items.map(item => ({
        x: Date.parse(item.observedAt),
        y: Number(item.value),
        withinBaseline: item.withinBaseline,
      })),
      baselineMean: baseline.summary.mean,
      baselineRange: { lower: baseline.range.lower, upper: baseline.range.upper },
      onset: Date.parse(divergence.onset),
    };
  }

  const observedShares =
    observed.valueKind === 'categorical' ? observed.distribution : [];
  const values = [
    ...baseline.summary.distribution.map(f => f.value),
    ...observedShares.map(f => f.value),
  ].filter((value, index, all) => all.indexOf(value) === index);
  const categories: CategoricalShare[] = values.map(value => ({
    value,
    label: formatCategoricalValue(value),
    referenceShare: baselineShareOf(baseline, value),
    observedShare: observedShares.find(f => f.value === value)?.share ?? 0,
  }));
  return { kind: 'categorical', dimension, categories, minValueShare: baseline.rule.minValueShare };
}

function outsideCount(divergence: Divergence): number {
  return divergence.evidence.items.filter(item => !item.withinBaseline).length;
}

/** Evidence count with how many observations sit outside the Observed Baseline. */
export function evidenceCountText(divergence: Divergence): string {
  const total = divergence.evidence.items.length;
  return `${outsideCount(divergence)} of ${total} Evidence observations outside the Observed Baseline`;
}

/** Accessible name for the chart image. */
export function analysisChartLabel(divergence: Divergence): string {
  const subject = `${dimensionLabel(divergence.dimension)} for ${divergence.identitySlice.label}`;
  return divergence.baseline.valueKind === 'numeric'
    ? `Chart of ${subject}: observed Evidence values over time against the Observed Baseline mean and range`
    : `Chart of ${subject}: share of each value in reference observations and in Evidence observations`;
}

/** Plain-text description of what the chart shows, for non-visual review. */
export function analysisChartSummary(divergence: Divergence): string {
  const { baseline, dimension, evidence } = divergence;
  const total = evidence.items.length;
  const span = `from ${formatUtc(divergence.onset)} to ${formatUtc(divergence.latestObservedAt)}`;
  if (baseline.valueKind === 'numeric') {
    const value = (v: number) => formatDimensionValue(dimension, v);
    return (
      `The chart plots ${total} Evidence observations ${span}. ` +
      `${outsideCount(divergence)} are outside the Observed Baseline range of ` +
      `${value(baseline.range.lower)} to ${value(baseline.range.upper)}. ` +
      `${observedSummaryText(divergence)}; Observed Baseline mean ${value(baseline.summary.mean)}.`
    );
  }
  return (
    `The chart compares the share of each value in ${baseline.sampleSize} reference observations ` +
    `with its share in ${total} Evidence observations ${span}. ` +
    `${observedSummaryText(divergence)}. Values seen in less than ` +
    `${formatShare(baseline.rule.minValueShare)} of reference observations are outside the ` +
    `Observed Baseline. A categorical Observed Baseline has no numeric range, so none is drawn.`
  );
}

/** Side context for the analysis: counts, summaries, magnitude, and timing. */
export function analysisContextFields(divergence: Divergence): DisplayField[] {
  return [
    { label: 'Evidence observations', value: evidenceCountText(divergence) },
    { label: 'Observed Baseline', value: baselineSummaryText(divergence.baseline) },
    { label: 'Observed', value: observedSummaryText(divergence) },
    { label: 'Magnitude', value: magnitudeText(divergence) },
    { label: 'Onset', value: formatUtc(divergence.onset) },
    { label: 'Duration', value: formatDuration(divergence.durationMs) },
    { label: 'Latest observed', value: formatUtc(divergence.latestObservedAt) },
  ];
}

/** The chart's data as a table, one row per Evidence observation. */
export function analysisTable(divergence: Divergence): AnalysisTable {
  const { baseline, dimension, evidence } = divergence;
  return {
    comparisonHeading:
      baseline.valueKind === 'numeric'
        ? 'Distance from Observed Baseline mean'
        : 'Share of reference observations with this value',
    rows: evidence.items.map(item => ({
      observationId: item.observationId,
      observedAt: formatUtc(item.observedAt),
      value: formatDimensionValue(dimension, item.value),
      comparison:
        baseline.valueKind === 'numeric'
          ? item.distanceFromBaselineMean === null
            ? '—'
            : formatSignedDifference(dimension, item.distanceFromBaselineMean)
          : formatShare(baselineShareOf(baseline, String(item.value))),
      position: item.withinBaseline
        ? 'Within the Observed Baseline'
        : 'Outside the Observed Baseline',
    })),
  };
}
