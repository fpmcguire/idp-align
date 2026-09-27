import { Observable, firstValueFrom, toArray } from 'rxjs';
import { STREAM_KINDS } from '../../domain/stream';
import { StreamObservationRepository } from '../stream-observation.repository';
import { ReplayStreamObservationRepository } from './replay-stream-observation.repository';

const collect = <T>(source: Observable<T>) => firstValueFrom(source.pipe(toArray()));

/** Expectations every StreamObservationRepository implementation must meet, for both streams. */
function describeRepositoryContract(name: string, create: () => StreamObservationRepository) {
  describe(`${name} repository contract`, () => {
    let repository: StreamObservationRepository;

    beforeEach(() => {
      repository = create();
    });

    for (const stream of STREAM_KINDS) {
      describe(`${stream} stream`, () => {
        it('should emit each result once and complete', async () => {
          expect((await collect(repository.getSourceInfo(stream))).length).toBe(1);
          expect((await collect(repository.getIdentitySlices(stream))).length).toBe(1);
          expect((await collect(repository.getObservations(stream))).length).toBe(1);
          expect((await collect(repository.getObservedTruth(stream))).length).toBe(1);
        });

        it('should return only this stream', async () => {
          const slices = await firstValueFrom(repository.getIdentitySlices(stream));
          const observations = await firstValueFrom(repository.getObservations(stream));

          expect(slices.length).toBeGreaterThan(0);
          expect(observations.length).toBeGreaterThan(0);
          expect(slices.every(s => s.streamKind === stream)).toBe(true);
          expect(observations.every(o => o.streamKind === stream)).toBe(true);
        });

        it('should link every observation to a listed Identity Slice and a source record', async () => {
          const sliceIds = new Set(
            (await firstValueFrom(repository.getIdentitySlices(stream))).map(s => s.id),
          );
          const observations = await firstValueFrom(repository.getObservations(stream));

          for (const observation of observations) {
            expect(sliceIds.has(observation.identitySliceId)).toBe(true);
            expect(observation.sources.length).toBeGreaterThan(0);
            expect(observation.sources.every(s => s.recordId !== '')).toBe(true);
          }
          expect(new Set(observations.map(o => o.id)).size).toBe(observations.length);
        });

        it('should report source info that matches the observations', async () => {
          const info = await firstValueFrom(repository.getSourceInfo(stream));
          const slices = await firstValueFrom(repository.getIdentitySlices(stream));
          const observations = await firstValueFrom(repository.getObservations(stream));
          const times = observations.map(o => o.observedAt).sort();

          expect(info.streamKind).toBe(stream);
          expect(info.observationCount).toBe(observations.length);
          expect(info.identitySliceCount).toBe(slices.length);
          expect(info.observationWindow).toEqual({ from: times[0], to: times[times.length - 1] });
        });

        it('should return Observed Truth covering every observation once, in time order', async () => {
          const truth = await firstValueFrom(repository.getObservedTruth(stream));
          const observations = await firstValueFrom(repository.getObservations(stream));

          expect(truth.flatMap(t => t.observations).length).toBe(observations.length);
          for (const { identitySlice, observations: sliceObservations } of truth) {
            expect(sliceObservations.every(o => o.identitySliceId === identitySlice.id)).toBe(true);
            const times = sliceObservations.map(o => o.observedAt);
            expect(times).toEqual([...times].sort());
          }
        });
      });
    }
  });
}

describeRepositoryContract('Replay', () => new ReplayStreamObservationRepository());

describe('ReplayStreamObservationRepository', () => {
  const repository = new ReplayStreamObservationRepository();

  it('should describe itself as a synthetic replay source', async () => {
    for (const stream of STREAM_KINDS) {
      const info = await firstValueFrom(repository.getSourceInfo(stream));
      expect(info.sourceKind).toBe('replay');
      expect(info.synthetic).toBe(true);
    }
  });

  // STEP-09 appended 20 Delta and Epsilon invoice records; the observation window is unchanged.
  it('should serve the document fixture as 58 observations across 8 Identity Slices', async () => {
    const info = await firstValueFrom(repository.getSourceInfo('document'));

    expect(info.observationCount).toBe(58);
    expect(info.identitySliceCount).toBe(8);
    expect(info.observationWindow).toEqual({
      from: '2026-08-03T15:00:00.000Z',
      to: '2026-09-11T15:00:00.000Z',
    });
  });

  it('should serve the workflow fixture as task and runtime observations across 4 Identity Slices', async () => {
    const observations = await firstValueFrom(repository.getObservations('workflow'));
    const slices = await firstValueFrom(repository.getIdentitySlices('workflow'));

    expect(observations.filter(o => o.recordType === 'task').length).toBe(60);
    expect(observations.filter(o => o.recordType === 'runtime').length).toBe(20);
    expect(slices.map(s => s.step)).toEqual(['Invoice review', 'Approval', 'Payment release', null]);
  });

  it('should make no network requests', async () => {
    const fetchSpy = vi.fn();
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open');
    vi.stubGlobal('fetch', fetchSpy);
    try {
      const fresh = new ReplayStreamObservationRepository();
      for (const stream of STREAM_KINDS) {
        await firstValueFrom(fresh.getSourceInfo(stream));
        await firstValueFrom(fresh.getObservedTruth(stream));
      }
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(xhrOpen).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      xhrOpen.mockRestore();
    }
  });
});
