import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  catchError,
  defaultIfEmpty,
  forkJoin,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { Divergence } from '../../domain/divergence';
import { detectStreamDivergences } from '../../domain/divergence-detection';
import { IdentitySlice } from '../../domain/identity-slice';
import { observationWindowOf } from '../../domain/observation';
import { StreamKind } from '../../domain/stream';
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  DivergenceFilters,
  DivergenceSortKey,
  applyDivergenceFilters,
  sortDivergences,
} from './dashboard-filters';

export type StreamSourceInfoByStream = Partial<Record<StreamKind, StreamSourceInfo>>;

/** Divergences per stream; a stream is absent until loaded or if its source cannot be read. */
export type DivergencesByStream = Partial<Record<StreamKind, readonly Divergence[]>>;

/** Where a stream's Divergence data stands: still being read, unreadable, or ready. */
export type StreamDataState =
  | { readonly status: 'loading' }
  | { readonly status: 'unavailable' }
  | {
      readonly status: 'ready';
      /** In onset order. */
      readonly divergences: readonly Divergence[];
      readonly identitySlices: readonly IdentitySlice[];
      /** Latest observation in the stream; time ranges are measured back from it. */
      readonly latestObservedAt: string | null;
    };

export interface DivergenceCounts {
  readonly total: number;
  readonly ongoing: number;
  readonly resolved: number;
}

/** How many of a stream's Identity Slices have at least one Divergence, within that stream only. */
export interface IdentitySliceCoverage {
  readonly withDivergences: number;
  readonly total: number;
}

/**
 * The Divergence to show in a stream's detail view. `hiddenByFilters` is true when the chosen
 * Divergence exists but the current filters hide it; the detail then shows no Divergence.
 */
export interface StreamSelection {
  readonly divergence: Divergence | null;
  readonly hiddenByFilters: boolean;
}

type ByStream<T> = Readonly<Record<StreamKind, T>>;

const LOADING: StreamDataState = { status: 'loading' };
const UNAVAILABLE: StreamDataState = { status: 'unavailable' };

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

  private readonly reload: ByStream<Subject<void>> = {
    document: new Subject<void>(),
    workflow: new Subject<void>(),
  };

  private readonly states: ByStream<Signal<StreamDataState>> = {
    document: this.loadState('document'),
    workflow: this.loadState('workflow'),
  };

  /** Sustained Divergences per stream, computed by the domain detector from repository data. */
  readonly divergences: Signal<DivergencesByStream> = computed(() => {
    const byStream: DivergencesByStream = {};
    for (const stream of ['document', 'workflow'] as const) {
      const state = this.states[stream]();
      if (state.status === 'ready') byStream[stream] = state.divergences;
    }
    return byStream;
  });

  private readonly filtersByStream = signal<ByStream<DivergenceFilters>>({
    document: DEFAULT_FILTERS,
    workflow: DEFAULT_FILTERS,
  });
  private readonly sortByStream = signal<ByStream<DivergenceSortKey>>({
    document: DEFAULT_SORT,
    workflow: DEFAULT_SORT,
  });
  private readonly selectedIds = signal<Partial<Record<StreamKind, string>>>({});

  streamState(stream: StreamKind): StreamDataState {
    return this.states[stream]();
  }

  /** Reads a stream again through the repository, for example after it could not be read. */
  retry(stream: StreamKind) {
    this.reload[stream].next();
  }

  filters(stream: StreamKind): DivergenceFilters {
    return this.filtersByStream()[stream];
  }

  /** Changes one stream's filters. Each stream keeps its own filters. */
  setFilters(stream: StreamKind, change: Partial<DivergenceFilters>) {
    this.filtersByStream.update(all => ({ ...all, [stream]: { ...all[stream], ...change } }));
  }

  /** Resets one stream's filters. Its sort and selection are kept. */
  clearFilters(stream: StreamKind) {
    this.setFilters(stream, DEFAULT_FILTERS);
  }

  sortKey(stream: StreamKind): DivergenceSortKey {
    return this.sortByStream()[stream];
  }

  setSort(stream: StreamKind, sortKey: DivergenceSortKey) {
    this.sortByStream.update(all => ({ ...all, [stream]: sortKey }));
  }

  /** The stream's Divergences after its filters and sort; null while they are unavailable. */
  visibleDivergences(stream: StreamKind): Divergence[] | null {
    const state = this.states[stream]();
    if (state.status !== 'ready') return null;
    const filtered = applyDivergenceFilters(
      state.divergences,
      this.filters(stream),
      state.latestObservedAt,
    );
    return sortDivergences(filtered, this.sortKey(stream));
  }

  /** Chooses the Divergence to show in a stream's detail view. Each stream keeps its own choice. */
  select(stream: StreamKind, divergenceId: string) {
    this.selectedIds.update(ids => ({ ...ids, [stream]: divergenceId }));
  }

  /**
   * The chosen Divergence while the filters show it. A chosen Divergence the filters hide is
   * reported as hidden, not replaced, so clearing the filters shows it again. With no choice in
   * the stream, the first visible Divergence is shown.
   */
  selection(stream: StreamKind): StreamSelection {
    const visible = this.visibleDivergences(stream) ?? [];
    const selectedId = this.selectedIds()[stream];
    const chosen = this.divergences()[stream]?.find(d => d.id === selectedId);
    if (chosen && !visible.includes(chosen)) return { divergence: null, hiddenByFilters: true };
    return { divergence: chosen ?? visible[0] ?? null, hiddenByFilters: false };
  }

  selectedDivergence(stream: StreamKind): Divergence | null {
    return this.selection(stream).divergence;
  }

  /**
   * Divergences the analysis view can switch between: the visible Divergences that share the
   * selected Divergence's Identity Slice, including it. They keep the stream's onset order, not the
   * list sort, so the options do not move when the sort changes. Empty with no selection.
   */
  analysisOptions(stream: StreamKind): Divergence[] {
    const selected = this.selectedDivergence(stream);
    if (!selected) return [];
    const visible = new Set(this.visibleDivergences(stream));
    return (this.divergences()[stream] ?? []).filter(
      d => visible.has(d) && d.identitySlice.id === selected.identitySlice.id,
    );
  }

  /** Status counts for all of a stream's Divergences, whatever the filters; null while unavailable. */
  counts(stream: StreamKind): DivergenceCounts | null {
    const divergences = this.divergences()[stream];
    if (!divergences) return null;
    return {
      total: divergences.length,
      ongoing: divergences.filter(d => d.status === 'ongoing').length,
      resolved: divergences.filter(d => d.status === 'resolved').length,
    };
  }

  /**
   * Identity Slices in the stream with at least one Divergence, out of all the stream's Identity
   * Slices, whatever the filters; null while unavailable. It counts existing records only.
   */
  identitySliceCoverage(stream: StreamKind): IdentitySliceCoverage | null {
    const state = this.states[stream]();
    if (state.status !== 'ready') return null;
    return {
      withDivergences: new Set(state.divergences.map(d => d.identitySlice.id)).size,
      total: state.identitySlices.length,
    };
  }

  private loadState(stream: StreamKind): Signal<StreamDataState> {
    return toSignal(
      this.reload[stream].pipe(
        startWith(undefined),
        switchMap(() => this.readStream(stream).pipe(startWith(LOADING))),
      ),
      { initialValue: LOADING },
    );
  }

  /** A source that errors, or completes without data, is unavailable rather than empty. */
  private readStream(stream: StreamKind): Observable<StreamDataState> {
    return forkJoin({
      slices: this.repository.getIdentitySlices(stream),
      observations: this.repository.getObservations(stream),
    }).pipe(
      map(({ slices, observations }): StreamDataState => ({
        status: 'ready',
        divergences: orderByOnset(detectStreamDivergences(slices, observations).divergences),
        identitySlices: slices,
        latestObservedAt: observationWindowOf(observations)?.to ?? null,
      })),
      defaultIfEmpty(UNAVAILABLE),
      catchError(() => of(UNAVAILABLE)),
    );
  }
}
