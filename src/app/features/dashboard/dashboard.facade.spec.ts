import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { StreamKind } from '../../domain/stream';
import { DashboardFacade } from './dashboard.facade';

const info = (streamKind: StreamKind, observationCount: number): StreamSourceInfo => ({
  streamKind,
  sourceKind: 'replay',
  synthetic: true,
  observationCount,
  identitySliceCount: 2,
  observationWindow: { from: '2026-08-03T00:00:00.000Z', to: '2026-09-11T00:00:00.000Z' },
});

function createFacade(getSourceInfo: (stream: StreamKind) => Observable<StreamSourceInfo>) {
  const repository = {
    getSourceInfo,
    getIdentitySlices: () => EMPTY,
    getObservations: () => EMPTY,
    getObservedTruth: () => EMPTY,
  } as StreamObservationRepository;

  TestBed.configureTestingModule({
    providers: [DashboardFacade, { provide: StreamObservationRepository, useValue: repository }],
  });
  return TestBed.inject(DashboardFacade);
}

describe('DashboardFacade', () => {
  it('should expose source info for both streams through the repository interface', () => {
    const facade = createFacade(stream => of(info(stream, stream === 'document' ? 12 : 7)));

    expect(facade.sourceInfo()).toEqual({ document: info('document', 12), workflow: info('workflow', 7) });
  });

  it('should expose no source info when the repository cannot be read', () => {
    const facade = createFacade(() => throwError(() => new Error('unavailable')));

    expect(facade.sourceInfo()).toEqual({});
  });
});
