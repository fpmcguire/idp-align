/**
 * What the detector produced for one Identity Slice: at least one surfaced Divergence, Observed
 * Baselines with no surfaced Divergence, or too few reference observations for any Observed
 * Baseline. It describes detector output only; it does not judge the Identity Slice's behavior.
 */
export type IdentitySliceStateKind =
  | 'surfaced-divergence'
  | 'no-surfaced-divergence'
  | 'no-observed-baseline';

/** Detector output for one Identity Slice, counted within its stream. */
export interface IdentitySliceStateView {
  readonly identitySliceId: string;
  readonly label: string;
  /** Group the Identity Slice is counted in: its document type, or its workflow. */
  readonly population: string;
  readonly observationCount: number;
  /** Observations inside the stream's reference window. */
  readonly referenceObservationCount: number;
  /** Observations after the reference window, compared with the Observed Baselines. */
  readonly comparedObservationCount: number;
  readonly observedBaselineCount: number;
  readonly dimensionCount: number;
  readonly divergenceCount: number;
  readonly state: IdentitySliceStateKind;
}

/** How many Identity Slices in one population were observed, and how many surfaced a Divergence. */
export interface PopulationSummaryView {
  readonly population: string;
  readonly identitySliceCount: number;
  readonly withSurfacedDivergence: number;
}
