import { dimensionsFor } from '../../domain/divergence-dimension';
import { StreamDivergenceResult } from '../../domain/divergence-detection';
import { IdentitySlice } from '../../domain/identity-slice';
import { Observation } from '../../domain/observation';
import { isInReferenceWindow } from '../../domain/observed-baseline';
import {
  IdentitySliceStateView,
  PopulationSummaryView,
} from '../../shared/ui/identity-slice-states/identity-slice-states.model';

/**
 * Population an Identity Slice is counted in: the document type for a document Identity Slice
 * (for example every Supplier x Invoice Identity Slice), or the workflow for a workflow one. It is a
 * grouping for presentation only, not a new domain primitive.
 */
export function identitySlicePopulation(slice: IdentitySlice): string {
  return slice.streamKind === 'document' ? slice.documentType : slice.workflowName;
}

/**
 * Detector output per Identity Slice, read from one stream's detection result. Reference and
 * compared observations follow the detector: inside the reference window, and from its end on.
 * Ordered by population in first-seen order, then by label.
 */
export function toIdentitySliceStates(
  slices: readonly IdentitySlice[],
  observations: readonly Observation[],
  result: StreamDivergenceResult,
): IdentitySliceStateView[] {
  const window = result.referenceWindow;
  const populations = [...new Set(slices.map(identitySlicePopulation))];

  return slices
    .map((slice): IdentitySliceStateView => {
      const own = observations.filter(o => o.identitySliceId === slice.id);
      const observedBaselineCount = result.baselines.filter(
        b => b.identitySliceId === slice.id,
      ).length;
      const divergenceCount = result.divergences.filter(
        d => d.identitySlice.id === slice.id,
      ).length;
      return {
        identitySliceId: slice.id,
        label: slice.label,
        population: identitySlicePopulation(slice),
        observationCount: own.length,
        referenceObservationCount: window
          ? own.filter(o => isInReferenceWindow(o, window)).length
          : 0,
        comparedObservationCount: window
          ? own.filter(o => Date.parse(o.observedAt) >= Date.parse(window.to)).length
          : 0,
        observedBaselineCount,
        dimensionCount: dimensionsFor(slice).length,
        divergenceCount,
        state:
          divergenceCount > 0
            ? 'surfaced-divergence'
            : observedBaselineCount > 0
              ? 'no-surfaced-divergence'
              : 'no-observed-baseline',
      };
    })
    .sort(
      (a, b) =>
        populations.indexOf(a.population) - populations.indexOf(b.population) ||
        a.label.localeCompare(b.label, 'en-US'),
    );
}

/** Identity Slices observed per population, and how many of them surfaced a Divergence. */
export function toPopulationSummaries(
  states: readonly IdentitySliceStateView[],
): PopulationSummaryView[] {
  const byPopulation = new Map<string, IdentitySliceStateView[]>();
  for (const state of states) {
    byPopulation.set(state.population, [...(byPopulation.get(state.population) ?? []), state]);
  }
  return [...byPopulation].map(([population, members]) => ({
    population,
    identitySliceCount: members.length,
    withSurfacedDivergence: members.filter(s => s.state === 'surfaced-divergence').length,
  }));
}
