import { DIVERGENCE_STATUSES, Divergence, DivergenceStatus } from '../../domain/divergence';
import { DIVERGENCE_DIMENSIONS } from '../../domain/divergence-dimension';

// Dashboard filtering and sorting over Divergence records the domain detector already computed.
// Nothing here derives Observed Baselines, sustained runs, statuses, or any ranking of findings.

const DAY_MS = 24 * 60 * 60 * 1000;

/** Presets measured back from the latest observation in the stream, not from today. */
export type TimeRangePreset = 'all' | 'last-30-days' | 'last-7-days';

export const TIME_RANGE_DAYS: Readonly<Record<Exclude<TimeRangePreset, 'all'>, number>> = {
  'last-30-days': 30,
  'last-7-days': 7,
};

export interface DivergenceFilters {
  /** Identity Slice id, or null for every Identity Slice in the stream. */
  readonly identitySliceId: string | null;
  readonly timeRange: TimeRangePreset;
  /** Lifecycle status, or null for every status. */
  readonly status: DivergenceStatus | null;
}

export const DEFAULT_FILTERS: DivergenceFilters = {
  identitySliceId: null,
  timeRange: 'all',
  status: null,
};

export type DivergenceSortKey = 'onset' | 'identity-slice' | 'dimension' | 'status';

export const DEFAULT_SORT: DivergenceSortKey = 'onset';

export function hasActiveFilters(filters: DivergenceFilters): boolean {
  return (
    filters.identitySliceId !== null || filters.timeRange !== 'all' || filters.status !== null
  );
}

/**
 * Earliest time a Divergence must still have been observed at to fall in the range, or null when
 * the range is unbounded or the stream has no observations to measure from.
 */
export function timeRangeStart(
  preset: TimeRangePreset,
  latestObservedAt: string | null,
): number | null {
  if (preset === 'all' || latestObservedAt === null) return null;
  return Date.parse(latestObservedAt) - TIME_RANGE_DAYS[preset] * DAY_MS;
}

/**
 * Keeps Divergences that match every filter. A Divergence is in a time range when it was observed
 * during it: its latest observation is at or after the range start, whatever its onset.
 */
export function applyDivergenceFilters(
  divergences: readonly Divergence[],
  filters: DivergenceFilters,
  latestObservedAt: string | null,
): Divergence[] {
  const start = timeRangeStart(filters.timeRange, latestObservedAt);
  return divergences.filter(
    d =>
      (filters.identitySliceId === null || d.identitySlice.id === filters.identitySliceId) &&
      (filters.status === null || d.status === filters.status) &&
      (start === null || Date.parse(d.latestObservedAt) >= start),
  );
}

const compareText = (a: string, b: string) => a.localeCompare(b, 'en-US');

const COMPARATORS: Readonly<
  Record<Exclude<DivergenceSortKey, 'onset'>, (a: Divergence, b: Divergence) => number>
> = {
  'identity-slice': (a, b) => compareText(a.identitySlice.label, b.identitySlice.label),
  dimension: (a, b) =>
    compareText(DIVERGENCE_DIMENSIONS[a.dimension].label, DIVERGENCE_DIMENSIONS[b.dimension].label),
  // Lifecycle order only; it does not rank findings by importance.
  status: (a, b) => DIVERGENCE_STATUSES.indexOf(a.status) - DIVERGENCE_STATUSES.indexOf(b.status),
};

/**
 * Orders Divergences that are already in onset order. `onset` keeps that order. Other keys use a
 * stable sort, so equal keys keep onset order.
 */
export function sortDivergences(
  divergences: readonly Divergence[],
  sortKey: DivergenceSortKey,
): Divergence[] {
  if (sortKey === 'onset') return [...divergences];
  return [...divergences].sort(COMPARATORS[sortKey]);
}

/** Lifecycle statuses present in the Divergences, in lifecycle order. */
export function statusesPresent(divergences: readonly Divergence[]): DivergenceStatus[] {
  return DIVERGENCE_STATUSES.filter(status => divergences.some(d => d.status === status));
}
