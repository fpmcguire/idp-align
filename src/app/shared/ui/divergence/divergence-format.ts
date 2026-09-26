import { formatDate, formatNumber, formatPercent } from '@angular/common';
import { Divergence, DivergenceStatus } from '../../../domain/divergence';
import {
  DIVERGENCE_DIMENSIONS,
  DimensionValue,
  DivergenceDimension,
} from '../../../domain/divergence-dimension';
import { EvidenceContext } from '../../../domain/evidence';
import { WorkflowInstanceState } from '../../../domain/observation';
import { ObservedBaseline } from '../../../domain/observed-baseline';

// Display formatting for Divergence records. These helpers only turn values the STEP-03 domain
// already computed into text; they derive no baselines, distances, or statuses.

const LOCALE = 'en-US';
const MINUTE_MS = 60_000;

export interface DisplayField {
  readonly label: string;
  readonly value: string;
}

export const STATUS_LABELS: Readonly<Record<DivergenceStatus, string>> = {
  ongoing: 'Ongoing',
  reviewed: 'Reviewed',
  resolved: 'Resolved',
  muted: 'Muted',
};

/**
 * Status wording for the detail view. Every status is a finding lifecycle marker only. For
 * `resolved` (QA-019), the observation that ended the sustained run is not part of the Evidence,
 * so the copy says so rather than implying the trace shows it.
 */
export const STATUS_DESCRIPTIONS: Readonly<Record<DivergenceStatus, string>> = {
  ongoing:
    'Ongoing — the latest observation on this dimension is outside the Observed Baseline.',
  resolved:
    'Resolved — finding lifecycle status. A later observation on this dimension was within the ' +
    'Observed Baseline, which ended the sustained run. That observation is not listed in the ' +
    'Evidence trace.',
  reviewed: 'Reviewed — finding lifecycle status.',
  muted: 'Muted — finding lifecycle status.',
};

export function dimensionLabel(dimension: DivergenceDimension): string {
  return DIVERGENCE_DIMENSIONS[dimension].label;
}

/** Names the observed value an Evidence item was compared on, such as "Response time (compared value)". */
export function comparedValueLabel(dimension: DivergenceDimension): string {
  return `${dimensionLabel(dimension)} (compared value)`;
}

/** Workflow instance states as the source names them. Shown as recorded, not interpreted. */
export const INSTANCE_STATE_LABELS: Readonly<Record<WorkflowInstanceState, string>> = {
  completed: 'Completed',
  running: 'Running',
  failed: 'Failed',
  stopped: 'Stopped',
};

/** Whole minutes as "2 d 3 h", "22 h 49 min", or "12 min". */
export function formatDuration(ms: number): string {
  let minutes = Math.round(Math.abs(ms) / MINUTE_MS);
  const days = Math.floor(minutes / 1440);
  minutes -= days * 1440;
  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  if (days > 0) return `${days} d ${hours} h`;
  if (hours > 0) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
}

/** Categorical dimension values, with the domain's outcome prefixes spelled out. */
export function formatCategoricalValue(value: string): string {
  if (value.startsWith('decision:')) return `Decision: ${value.slice('decision:'.length)}`;
  if (value.startsWith('error-exit:')) return `Error exit: ${value.slice('error-exit:'.length)}`;
  return value;
}

export function formatDimensionValue(dimension: DivergenceDimension, value: DimensionValue): string {
  if (typeof value === 'string') return formatCategoricalValue(value);
  switch (DIVERGENCE_DIMENSIONS[dimension].unit) {
    case 'milliseconds':
      return formatDuration(value);
    case 'amount':
      return formatNumber(value, LOCALE, '1.2-2');
    default:
      return String(value);
  }
}

/** Numeric difference with an explicit sign, in the dimension's unit. */
export function formatSignedDifference(dimension: DivergenceDimension, difference: number): string {
  return `${difference < 0 ? '−' : '+'}${formatDimensionValue(dimension, Math.abs(difference))}`;
}

export function formatShare(share: number): string {
  return formatPercent(share, LOCALE, '1.0-1');
}

function formatSigned(value: number, text: string): string {
  return `${value < 0 ? '−' : '+'}${text}`;
}

export function formatUtc(iso: string): string {
  return `${formatDate(iso, 'd MMM y, HH:mm', LOCALE, 'UTC')} UTC`;
}

export function formatUtcDate(iso: string): string {
  return formatDate(iso, 'd MMM y', LOCALE, 'UTC');
}

/** Short observed summary for a Divergence card. */
export function observedSummaryText(divergence: Divergence): string {
  const { observed, dimension } = divergence;
  if (observed.valueKind === 'numeric') {
    return `Mean ${formatDimensionValue(dimension, observed.mean)} across ${observed.count} observations`;
  }
  const dominant = observed.distribution[0];
  return (
    `${formatCategoricalValue(observed.dominantValue)} in ${formatShare(dominant.share)} ` +
    `of ${observed.count} observations`
  );
}

/** Additional observed values for the detail view. */
export function observedDetailText(divergence: Divergence): string {
  const { observed, dimension } = divergence;
  if (observed.valueKind === 'numeric') {
    const value = (v: number) => formatDimensionValue(dimension, v);
    return `Min ${value(observed.min)}, max ${value(observed.max)}, latest ${value(observed.latest)}`;
  }
  return `Latest ${formatCategoricalValue(observed.latest)}`;
}

/** Short Observed Baseline reference for a Divergence card. */
export function baselineSummaryText(baseline: ObservedBaseline): string {
  if (baseline.valueKind === 'numeric') {
    const value = (v: number) => formatDimensionValue(baseline.dimension, v);
    return (
      `Mean ${value(baseline.summary.mean)}, range ${value(baseline.range.lower)} to ` +
      value(baseline.range.upper)
    );
  }
  return (
    `${formatCategoricalValue(baseline.summary.dominantValue)} in ` +
    `${formatShare(baseline.summary.dominantShare)} of reference observations`
  );
}

export function magnitudeText(divergence: Divergence): string {
  const { magnitude, dimension } = divergence;
  if (magnitude.valueKind === 'categorical') {
    return (
      `${formatCategoricalValue(magnitude.observedDominantValue)} seen in ` +
      `${formatShare(magnitude.baselineShareOfObservedValue)} of reference observations`
    );
  }
  const extras: string[] = [];
  if (magnitude.relativeDifference !== null) {
    extras.push(
      formatSigned(magnitude.relativeDifference, formatShare(Math.abs(magnitude.relativeDifference))),
    );
  }
  if (magnitude.standardDeviations !== null) {
    extras.push(
      formatSigned(
        magnitude.standardDeviations,
        `${formatNumber(Math.abs(magnitude.standardDeviations), LOCALE, '1.1-1')} SD`,
      ),
    );
  }
  const difference = `${formatSignedDifference(dimension, magnitude.differenceFromBaselineMean)} from baseline mean`;
  return extras.length > 0 ? `${difference} (${extras.join(', ')})` : difference;
}

export function baselineMethodText(baseline: ObservedBaseline): string {
  if (baseline.valueKind === 'numeric') {
    return (
      `Mean ± the larger of ${baseline.rule.standardDeviations} standard deviations or ` +
      `${formatShare(baseline.rule.minRelativeHalfWidth)} of the mean`
    );
  }
  return (
    `Reference frequency distribution; values seen in less than ` +
    `${formatShare(baseline.rule.minValueShare)} of reference observations are outside the ` +
    `Observed Baseline`
  );
}

/** Observed source fields carried with one Evidence item. Context only, never a cause. */
export function evidenceContextFields(context: EvidenceContext): DisplayField[] {
  switch (context.recordType) {
    case 'document':
      return [
        { label: 'Vendor', value: context.vendor },
        { label: 'Document type', value: context.documentType },
        { label: 'Currency', value: context.currency },
        { label: 'Document date', value: context.documentDate },
      ];
    case 'task':
      return [
        { label: 'Workflow instance', value: context.instanceId },
        { label: 'Step', value: context.step },
        ...optionalField('Decision', context.decision),
        ...optionalField('Decision agent', context.decisionAgent),
        ...optionalField('Error exit', context.errorExit),
      ];
    case 'runtime':
      return [
        { label: 'Workflow instance', value: context.instanceId },
        { label: 'Instance state', value: INSTANCE_STATE_LABELS[context.state] },
      ];
  }
}

function optionalField(label: string, value: string | undefined): DisplayField[] {
  return value === undefined ? [] : [{ label, value }];
}
