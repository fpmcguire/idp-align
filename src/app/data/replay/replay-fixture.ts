import { IdentitySliceFor } from '../../domain/identity-slice';
import { ObservationFor } from '../../domain/observation';
import { StreamKind } from '../../domain/stream';

export interface PublicDocumentationReference {
  readonly title: string;
  readonly url: string;
}

export interface ReplayFixtureMetadata {
  readonly fixtureId: string;
  readonly streamKind: StreamKind;
  readonly description: string;
  /** Replay fixtures are always synthetic; they never contain exported system data. */
  readonly synthetic: true;
  /** Public documentation the record shapes follow. */
  readonly shapedFrom: readonly PublicDocumentationReference[];
  readonly notes: readonly string[];
}

/** Local replay data used to simulate observed document or workflow behavior. */
export interface ReplayFixture<TRecords> {
  readonly metadata: ReplayFixtureMetadata;
  readonly records: TRecords;
}

/** Domain data mapped from one stream's replay fixture. */
export interface StreamReplayData<K extends StreamKind> {
  readonly slices: readonly IdentitySliceFor<K>[];
  readonly observations: readonly ObservationFor<K>[];
}

export function uniqueSlices<T extends { readonly id: string }>(slices: readonly T[]): T[] {
  return [...new Map(slices.map(s => [s.id, s])).values()];
}
