import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of } from 'rxjs';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { StreamKind } from '../../domain/stream';

export type StreamSourceInfoByStream = Partial<Record<StreamKind, StreamSourceInfo>>;

/** Dashboard-facing access to stream data through the repository interface. */
@Injectable()
export class DashboardFacade {
  private readonly repository = inject(StreamObservationRepository);

  /** Neutral source facts per stream; empty until loaded or if the source cannot be read. */
  readonly sourceInfo: Signal<StreamSourceInfoByStream> = toSignal(
    forkJoin({
      document: this.repository.getSourceInfo('document'),
      workflow: this.repository.getSourceInfo('workflow'),
    }).pipe(catchError(() => of({}))),
    { initialValue: {} },
  );
}
