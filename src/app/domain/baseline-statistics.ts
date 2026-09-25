// Plain descriptive statistics used to summarize Observed Baselines.
// Callers pass at least one value.

export function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Sample standard deviation (n - 1 denominator); zero when there are fewer than two values. */
export function sampleStandardDeviation(values: readonly number[]): number {
  if (values.length < 2) return 0;
  const average = mean(values);
  const squares = values.reduce((sum, value) => sum + (value - average) ** 2, 0);
  return Math.sqrt(squares / (values.length - 1));
}

export function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

/** How often one categorical value occurs, as a count and as a share of all values. */
export interface ValueFrequency {
  readonly value: string;
  readonly count: number;
  readonly share: number;
}

/** Frequency of each distinct value, most frequent first; equal counts sort by value. */
export function frequencyDistribution(values: readonly string[]): ValueFrequency[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, count, share: count / values.length }))
    .sort((a, b) => b.count - a.count || (a.value < b.value ? -1 : a.value > b.value ? 1 : 0));
}
