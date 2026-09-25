import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdentitySliceFor } from '../../domain/identity-slice';
import { ObservationFor, observationWindowOf } from '../../domain/observation';
import { ObservedTruth, toObservedTruth } from '../../domain/observed-truth';
import { StreamKind } from '../../domain/stream';
import { StreamObservationRepository, StreamSourceInfo } from '../stream-observation.repository';
import { mapDocumentReplay } from './document-replay.mapper';
import { DOCUMENT_REPLAY_FIXTURE } from './fixtures/document-replay.fixture';
import { WORKFLOW_REPLAY_FIXTURE } from './fixtures/workflow-replay.fixture';
import { StreamReplayData } from './replay-fixture';
import { mapWorkflowReplay } from './workflow-replay.mapper';

type ReplayDataByStream = { readonly [K in StreamKind]: StreamReplayData<K> };

/** Serves synthetic replay fixtures from memory. Makes no network calls and needs no credentials. */
@Injectable()
export class ReplayStreamObservationRepository extends StreamObservationRepository {
  private readonly data: ReplayDataByStream = {
    document: mapDocumentReplay(DOCUMENT_REPLAY_FIXTURE.records),
    workflow: mapWorkflowReplay(WORKFLOW_REPLAY_FIXTURE.records),
  };

  getSourceInfo(stream: StreamKind): Observable<StreamSourceInfo> {
    const { slices, observations } = this.data[stream];
    return of({
      streamKind: stream,
      sourceKind: 'replay',
      synthetic: true,
      observationCount: observations.length,
      identitySliceCount: slices.length,
      observationWindow: observationWindowOf(observations),
    });
  }

  getIdentitySlices<K extends StreamKind>(stream: K): Observable<readonly IdentitySliceFor<K>[]> {
    return of(this.streamData(stream).slices);
  }

  getObservations<K extends StreamKind>(stream: K): Observable<readonly ObservationFor<K>[]> {
    return of(this.streamData(stream).observations);
  }

  getObservedTruth<K extends StreamKind>(stream: K): Observable<readonly ObservedTruth<K>[]> {
    const { slices, observations } = this.streamData(stream);
    return of(toObservedTruth(slices, observations));
  }

  private streamData<K extends StreamKind>(stream: K): StreamReplayData<K> {
    return this.data[stream];
  }
}
