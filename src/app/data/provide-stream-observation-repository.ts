import { Provider } from '@angular/core';
import { ReplayStreamObservationRepository } from './replay/replay-stream-observation.repository';
import { StreamObservationRepository } from './stream-observation.repository';

/** Binds the repository interface to the local replay adapter. Swap the class to change source. */
export function provideStreamObservationRepository(): Provider[] {
  return [{ provide: StreamObservationRepository, useClass: ReplayStreamObservationRepository }];
}
