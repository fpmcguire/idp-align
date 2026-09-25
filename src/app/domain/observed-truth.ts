import { IdentitySliceFor } from './identity-slice';
import { ObservationFor, ObservationWindow, observationWindowOf } from './observation';
import { StreamKind } from './stream';

/** Evidence-backed observed behavior for one Identity Slice, in chronological order. */
export interface ObservedTruth<K extends StreamKind = StreamKind> {
  readonly streamKind: K;
  readonly identitySlice: IdentitySliceFor<K>;
  readonly observations: readonly ObservationFor<K>[];
  readonly observationWindow: ObservationWindow;
}

/**
 * Groups observations by Identity Slice. Slices without observations are omitted, and
 * observations whose slice is not listed are ignored. No values are aggregated or compared.
 */
export function toObservedTruth<K extends StreamKind>(
  slices: readonly IdentitySliceFor<K>[],
  observations: readonly ObservationFor<K>[],
): ObservedTruth<K>[] {
  return slices.flatMap(identitySlice => {
    const sliceObservations = observations
      .filter(o => o.identitySliceId === identitySlice.id)
      .sort((a, b) => a.observedAt.localeCompare(b.observedAt));
    const observationWindow = observationWindowOf(sliceObservations);
    if (!observationWindow) return [];
    return [
      {
        streamKind: identitySlice.streamKind as K,
        identitySlice,
        observations: sliceObservations,
        observationWindow,
      },
    ];
  });
}
