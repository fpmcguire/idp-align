import { Observable } from 'rxjs';
import { IdentitySliceFor } from '../domain/identity-slice';
import { ObservationFor, ObservationWindow } from '../domain/observation';
import { ObservedTruth } from '../domain/observed-truth';
import { StreamKind } from '../domain/stream';

/** Neutral facts about the data source behind a stream. Carries no CAV findings. */
export interface StreamSourceInfo {
  readonly streamKind: StreamKind;
  readonly sourceKind: 'replay';
  readonly synthetic: boolean;
  readonly observationCount: number;
  readonly identitySliceCount: number;
  readonly observationWindow: ObservationWindow | null;
}

/**
 * Source-agnostic access to stream observations. Dashboard-facing code depends on this contract;
 * the replay adapter implements it now, and a BFF/API adapter can implement it later.
 */
export abstract class StreamObservationRepository {
  abstract getSourceInfo(stream: StreamKind): Observable<StreamSourceInfo>;
  abstract getIdentitySlices<K extends StreamKind>(
    stream: K,
  ): Observable<readonly IdentitySliceFor<K>[]>;
  abstract getObservations<K extends StreamKind>(stream: K): Observable<readonly ObservationFor<K>[]>;
  abstract getObservedTruth<K extends StreamKind>(stream: K): Observable<readonly ObservedTruth<K>[]>;
}
