import { Injectable, Signal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { Divergence } from '../../domain/divergence';
import { detectStreamDivergences } from '../../domain/divergence-detection';
import { StreamKind } from '../../domain/stream';

export type StreamSourceInfoByStream = Partial<Record<StreamKind, StreamSourceInfo>>;

/** Divergences per stream; a stream is absent until loaded or if its source cannot be read. */
export type DivergencesByStream = Partial<Record<StreamKind, readonly Divergence[]>>;

export interface DivergenceCounts {
  readonly total: number;
  readonly ongoing: number;
  readonly resolved: number;
}

/**
 * Display order for Divergences: onset, earliest first. The sort is stable, so Divergences with
 * the same onset keep the detector's order (Identity Slice, then dimension).
 */
export function orderByOnset(divergences: readonly Divergence[]): Divergence[] {
  return [...divergences].sort((a, b) => Date.parse(a.onset) - Date.parse(b.onset));
}

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

  /** Sustained Divergences per stream, computed by the domain detector from repository data. */
  readonly divergences: Signal<DivergencesByStream> = toSignal(
    forkJoin({
      document: this.streamDivergences('document'),
      workflow: this.streamDivergences('workflow'),
    }).pipe(
      map(result => {
        const byStream: DivergencesByStream = {};
        if (result.document) byStream.document = result.document;
        if (result.workflow) byStream.workflow = result.workflow;
        return byStream;
      }),
    ),
    { initialValue: {} },
  );

  private readonly selectedIds = signal<Partial<Record<StreamKind, string>>>({});

  /** Chooses the Divergence to show in a stream's detail view. Each stream keeps its own choice. */
  select(stream: StreamKind, divergenceId: string) {
    this.selectedIds.update(ids => ({ ...ids, [stream]: divergenceId }));
  }

  /** The chosen Divergence, else the first in the stream; null when the stream has none. */
  selectedDivergence(stream: StreamKind): Divergence | null {
    const divergences = this.divergences()[stream] ?? [];
    const selectedId = this.selectedIds()[stream];
    return divergences.find(d => d.id === selectedId) ?? divergences[0] ?? null;
  }

  /** Status counts for a stream; null while its Divergences are unavailable. */
  counts(stream: StreamKind): DivergenceCounts | null {
    const divergences = this.divergences()[stream];
    if (!divergences) return null;
    return {
      total: divergences.length,
      ongoing: divergences.filter(d => d.status === 'ongoing').length,
      resolved: divergences.filter(d => d.status === 'resolved').length,
    };
  }

  private streamDivergences(stream: StreamKind): Observable<readonly Divergence[] | null> {
    return forkJoin({
      slices: this.repository.getIdentitySlices(stream),
      observations: this.repository.getObservations(stream),
    }).pipe(
      map(({ slices, observations }) =>
        orderByOnset(detectStreamDivergences(slices, observations).divergences),
      ),
      catchError(() => of(null)),
    );
  }
}
