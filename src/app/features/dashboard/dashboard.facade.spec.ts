import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, Subject, of, throwError } from 'rxjs';
import { amountDivergence } from '../../../testing/divergence-builders';
import { at, documentObservation, testDocumentSlice } from '../../../testing/observation-builders';
import { provideStreamObservationRepository } from '../../data/provide-stream-observation-repository';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { Divergence } from '../../domain/divergence';
import { IdentitySlice } from '../../domain/identity-slice';
import { Observation } from '../../domain/observation';
import { StreamKind } from '../../domain/stream';
import { DashboardFacade, orderByOnset } from './dashboard.facade';

const info = (streamKind: StreamKind, observationCount: number): StreamSourceInfo => ({
  streamKind,
  sourceKind: 'replay',
  synthetic: true,
  observationCount,
  identitySliceCount: 2,
  observationWindow: { from: '2026-08-03T00:00:00.000Z', to: '2026-09-11T00:00:00.000Z' },
});

function createFacade(repository: Partial<StreamObservationRepository>) {
  TestBed.configureTestingModule({
    providers: [
      DashboardFacade,
      {
        provide: StreamObservationRepository,
        useValue: {
          getSourceInfo: () => EMPTY,
          getIdentitySlices: () => EMPTY,
          getObservations: () => EMPTY,
          getObservedTruth: () => EMPTY,
          ...repository,
        },
      },
    ],
  });
  return TestBed.inject(DashboardFacade);
}

function createReplayFacade() {
  TestBed.configureTestingModule({
    providers: [DashboardFacade, provideStreamObservationRepository()],
  });
  return TestBed.inject(DashboardFacade);
}

const summary = (divergences: readonly Divergence[] | undefined) =>
  (divergences ?? []).map(d => [d.identitySlice.label, d.dimension, d.status]);

describe('DashboardFacade', () => {
  describe('source info', () => {
    it('should expose source info for both streams through the repository interface', () => {
      const facade = createFacade({
        getSourceInfo: (stream: StreamKind): Observable<StreamSourceInfo> =>
          of(info(stream, stream === 'document' ? 12 : 7)),
      });

      expect(facade.sourceInfo()).toEqual({
        document: info('document', 12),
        workflow: info('workflow', 7),
      });
    });

    it('should expose no source info when the repository cannot be read', () => {
      const facade = createFacade({ getSourceInfo: () => throwError(() => new Error('unavailable')) });

      expect(facade.sourceInfo()).toEqual({});
    });
  });

  describe('Divergences from replay data', () => {
    it('should surface the Alpha Office Supplies amount Divergence in the document stream', () => {
      const facade = createReplayFacade();

      expect(summary(facade.divergences().document)).toEqual([
        ['Alpha Office Supplies (synthetic) · Invoice', 'amount-value', 'ongoing'],
      ]);
    });

    it('should surface the Approval and Workflow runtime Divergences in the workflow stream', () => {
      const facade = createReplayFacade();

      expect(summary(facade.divergences().workflow)).toEqual([
        ['Invoice approval (synthetic) · Approval', 'task-duration', 'ongoing'],
        ['Invoice approval (synthetic) · Approval', 'response-time', 'ongoing'],
        ['Invoice approval (synthetic) · Workflow runtime', 'workflow-runtime', 'ongoing'],
      ]);
    });

    it('should count Divergences per stream', () => {
      const facade = createReplayFacade();

      expect(facade.counts('document')).toEqual({ total: 1, ongoing: 1, resolved: 0 });
      expect(facade.counts('workflow')).toEqual({ total: 3, ongoing: 3, resolved: 0 });
    });
  });

  describe('Identity Slice coverage (STEP-07)', () => {
    it('should count Identity Slices with Divergences within each stream', () => {
      const facade = createReplayFacade();

      expect(facade.identitySliceCoverage('document')).toEqual({ withDivergences: 1, total: 8 });
      // Approval (two Divergences) and Workflow runtime, out of three steps plus Workflow runtime.
      expect(facade.identitySliceCoverage('workflow')).toEqual({ withDivergences: 2, total: 4 });
    });

    it('should count every Identity Slice in the stream, whatever the filters', () => {
      const facade = createReplayFacade();
      facade.setFilters('workflow', {
        identitySliceId: 'workflow/invoice-approval-synthetic/runtime',
      });

      expect(facade.visibleDivergences('workflow')?.length).toBe(1);
      expect(facade.identitySliceCoverage('workflow')).toEqual({ withDivergences: 2, total: 4 });
    });

    it('should report no coverage while a stream is loading or unavailable', () => {
      const slices = new Subject<readonly IdentitySlice[]>();
      const facade = createFacade({
        getIdentitySlices: ((stream: StreamKind) =>
          stream === 'document' ? slices : EMPTY) as unknown as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.identitySliceCoverage('document')).toBeNull();
      expect(facade.identitySliceCoverage('workflow')).toBeNull();
    });

    it('should report zero of the stream slices when none has a Divergence', () => {
      const facade = createFacade({
        getIdentitySlices: (() => of([testDocumentSlice])) as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() =>
          of([documentObservation('doc-0', at(0))])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.identitySliceCoverage('document')).toEqual({ withDivergences: 0, total: 1 });
    });
  });

  describe('population summaries and Identity Slice states (STEP-09)', () => {
    const stateOf = (facade: DashboardFacade, label: string) =>
      facade.identitySliceStates('document')?.find(s => s.label === label);

    it('should summarize each document population by Identity Slices observed and surfaced', () => {
      const facade = createReplayFacade();

      expect(facade.populationSummaries('document')).toEqual([
        { population: 'Invoice', identitySliceCount: 5, withSurfacedDivergence: 1 },
        { population: 'Credit note', identitySliceCount: 3, withSurfacedDivergence: 0 },
      ]);
    });

    it('should summarize the workflow stream by workflow with the same generic grouping', () => {
      const facade = createReplayFacade();

      expect(facade.populationSummaries('workflow')).toEqual([
        { population: 'Invoice approval (synthetic)', identitySliceCount: 4, withSurfacedDivergence: 2 },
      ]);
    });

    it('should list every document Identity Slice state, invoices first, then by label', () => {
      const facade = createReplayFacade();

      expect(facade.identitySliceStates('document')?.map(s => [s.label, s.state])).toEqual([
        ['Alpha Office Supplies (synthetic) · Invoice', 'surfaced-divergence'],
        ['Beta Freight Services (synthetic) · Invoice', 'no-surfaced-divergence'],
        ['Delta Packaging Supplies (synthetic) · Invoice', 'no-surfaced-divergence'],
        ['Epsilon Print Services (synthetic) · Invoice', 'no-surfaced-divergence'],
        ['Gamma Facilities Care (synthetic) · Invoice', 'no-surfaced-divergence'],
        ['Alpha Office Supplies (synthetic) · Credit note', 'no-observed-baseline'],
        ['Beta Freight Services (synthetic) · Credit note', 'no-observed-baseline'],
        ['Gamma Facilities Care (synthetic) · Credit note', 'no-observed-baseline'],
      ]);
    });

    it('should count reference and compared observations per Identity Slice as the detector splits them', () => {
      const facade = createReplayFacade();

      expect(stateOf(facade, 'Alpha Office Supplies (synthetic) · Invoice')).toMatchObject({
        observationCount: 12,
        referenceObservationCount: 8,
        comparedObservationCount: 4,
        observedBaselineCount: 4,
        dimensionCount: 4,
        divergenceCount: 1,
      });
      expect(stateOf(facade, 'Delta Packaging Supplies (synthetic) · Invoice')).toMatchObject({
        observationCount: 10,
        referenceObservationCount: 6,
        comparedObservationCount: 4,
        observedBaselineCount: 4,
        divergenceCount: 0,
      });
      expect(stateOf(facade, 'Beta Freight Services (synthetic) · Credit note')).toMatchObject({
        observedBaselineCount: 0,
        divergenceCount: 0,
      });
    });

    it('should keep population summaries and states whatever the filters', () => {
      const facade = createReplayFacade();
      facade.setFilters('document', {
        identitySliceId: 'document/delta-packaging-supplies-synthetic/invoice',
      });

      expect(facade.visibleDivergences('document')).toEqual([]);
      expect(facade.populationSummaries('document')?.[0].withSurfacedDivergence).toBe(1);
      expect(facade.identitySliceStates('document')?.length).toBe(8);
    });

    it('should report no summaries or states while a stream is loading or unavailable', () => {
      const facade = createFacade({});

      expect(facade.populationSummaries('document')).toBeNull();
      expect(facade.identitySliceStates('workflow')).toBeNull();
    });
  });

  describe('source-agnostic computation', () => {
    it('should compute Divergences only from repository slices and observations', () => {
      const calls: string[] = [];
      const observations = [
        ...[1000, 1010, 990, 1000, 1005, 995].map((amount, i) =>
          documentObservation(`doc-${i}`, at(i), { amount }),
        ),
        ...[30, 31, 32].map((day, i) => documentObservation(`doc-c${i}`, at(day), { amount: 1500 })),
      ];
      const facade = createFacade({
        getIdentitySlices: ((stream: StreamKind) => {
          calls.push(`slices:${stream}`);
          return of(stream === 'document' ? [testDocumentSlice] : []);
        }) as StreamObservationRepository['getIdentitySlices'],
        getObservations: ((stream: StreamKind) => {
          calls.push(`observations:${stream}`);
          return of(stream === 'document' ? observations : []);
        }) as StreamObservationRepository['getObservations'],
      });

      expect(summary(facade.divergences().document)).toEqual([
        ['Kappa Paper (synthetic) · Invoice', 'amount-value', 'ongoing'],
      ]);
      expect(facade.divergences().workflow).toEqual([]);
      expect(calls.sort()).toEqual([
        'observations:document',
        'observations:workflow',
        'slices:document',
        'slices:workflow',
      ]);
    });

    it('should report a stream as unavailable, not empty, when it cannot be read', () => {
      const facade = createFacade({
        getIdentitySlices: ((stream: StreamKind) =>
          stream === 'document'
            ? throwError(() => new Error('unavailable'))
            : of([])) as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.divergences()).toEqual({ workflow: [] });
      expect(facade.counts('document')).toBeNull();
      expect(facade.counts('workflow')).toEqual({ total: 0, ongoing: 0, resolved: 0 });
      expect(facade.selectedDivergence('document')).toBeNull();
    });

    it('should count resolved Divergences as a lifecycle status', () => {
      const observations = [
        ...[1000, 1010, 990, 1000, 1005, 995].map((amount, i) =>
          documentObservation(`doc-${i}`, at(i), { amount }),
        ),
        ...[30, 31, 32].map((day, i) => documentObservation(`doc-c${i}`, at(day), { amount: 1500 })),
        documentObservation('doc-r', at(33), { amount: 1000 }),
      ];
      const facade = createFacade({
        getIdentitySlices: ((stream: StreamKind) =>
          of(stream === 'document' ? [testDocumentSlice] : [])) as StreamObservationRepository['getIdentitySlices'],
        getObservations: ((stream: StreamKind) =>
          of(stream === 'document' ? observations : [])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.counts('document')).toEqual({ total: 1, ongoing: 0, resolved: 1 });
    });
  });

  describe('ordering', () => {
    it('should order by onset, keeping detector order for equal onsets', () => {
      const base = amountDivergence();
      const withOnset = (id: string, onset: string): Divergence => ({ ...base, id, onset });
      const ordered = orderByOnset([
        withOnset('c', '2026-09-05T07:03:00.000Z'),
        withOnset('a', '2026-09-05T07:00:00.000Z'),
        withOnset('b', '2026-09-05T07:00:00.000Z'),
        withOnset('first', '2026-09-01T00:00:00.000Z'),
      ]);

      expect(ordered.map(d => d.id)).toEqual(['first', 'a', 'b', 'c']);
    });
  });

  describe('selection', () => {
    it('should default to the first Divergence in each stream', () => {
      const facade = createReplayFacade();

      expect(facade.selectedDivergence('document')?.id).toBe(facade.divergences().document![0].id);
      expect(facade.selectedDivergence('workflow')?.id).toBe(facade.divergences().workflow![0].id);
    });

    it('should keep a separate selection per stream', () => {
      const facade = createReplayFacade();
      const runtime = facade.divergences().workflow![2];

      facade.select('workflow', runtime.id);

      expect(facade.selectedDivergence('workflow')?.id).toBe(runtime.id);
      expect(facade.selectedDivergence('document')?.id).toBe(facade.divergences().document![0].id);
    });

    it('should fall back to the first Divergence when the chosen id is not in the stream', () => {
      const facade = createReplayFacade();
      const workflowId = facade.divergences().workflow![1].id;

      facade.select('document', workflowId);

      expect(facade.selectedDivergence('document')?.id).toBe(facade.divergences().document![0].id);
    });

    it('should select nothing in a stream with no Divergences', () => {
      const facade = createFacade({
        getIdentitySlices: (() => of([])) as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.selectedDivergence('document')).toBeNull();
      expect(facade.counts('document')).toEqual({ total: 0, ongoing: 0, resolved: 0 });
    });
  });

  describe('stream data state', () => {
    it('should be loading until the repository provides stream data', () => {
      const slices = new Subject<readonly IdentitySlice[]>();
      const facade = createFacade({
        getIdentitySlices: (() => slices) as unknown as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.streamState('document')).toEqual({ status: 'loading' });
      expect(facade.visibleDivergences('document')).toBeNull();
      expect(facade.counts('document')).toBeNull();

      slices.next([]);
      slices.complete();

      expect(facade.streamState('document')).toEqual({
        status: 'ready',
        divergences: [],
        identitySlices: [],
        identitySliceStates: [],
        latestObservedAt: null,
      });
    });

    it('should report a stream that completes without data as unavailable, not loading', () => {
      const facade = createFacade({});

      expect(facade.streamState('document')).toEqual({ status: 'unavailable' });
      expect(facade.streamState('workflow')).toEqual({ status: 'unavailable' });
    });

    it('should expose the Identity Slices and latest observation of a ready stream', () => {
      const facade = createReplayFacade();
      const state = facade.streamState('document');

      expect(state.status === 'ready' && state.identitySlices.length).toBe(8);
      expect(state.status === 'ready' && state.latestObservedAt).toBe('2026-09-11T15:00:00.000Z');
    });

    it('should read an unavailable stream again through the repository on retry', () => {
      let attempts = 0;
      const facade = createFacade({
        getIdentitySlices: ((stream: StreamKind) => {
          if (stream === 'document') attempts++;
          return stream === 'document' && attempts === 1
            ? throwError(() => new Error('unavailable'))
            : of([]);
        }) as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() => of([])) as StreamObservationRepository['getObservations'],
      });

      expect(facade.streamState('document').status).toBe('unavailable');

      facade.retry('document');

      expect(attempts).toBe(2);
      expect(facade.streamState('document').status).toBe('ready');
      expect(facade.streamState('workflow').status).toBe('ready');
    });

    it('should show loading again while a retry is being read', () => {
      const reads: Subject<readonly Observation[]>[] = [];
      const facade = createFacade({
        getIdentitySlices: (() => of([])) as StreamObservationRepository['getIdentitySlices'],
        getObservations: (() => {
          const read = new Subject<readonly Observation[]>();
          reads.push(read);
          return read;
        }) as unknown as StreamObservationRepository['getObservations'],
      });
      facade.streamState('document');
      reads[0].error(new Error('unavailable'));
      expect(facade.streamState('document').status).toBe('unavailable');

      facade.retry('document');

      expect(facade.streamState('document').status).toBe('loading');
    });
  });

  describe('filters and sort', () => {
    const approvalSliceId = (facade: DashboardFacade) =>
      facade.divergences().workflow![0].identitySlice.id;

    it('should start with default filters and onset sort in each stream', () => {
      const facade = createReplayFacade();

      for (const stream of ['document', 'workflow'] as const) {
        expect(facade.filters(stream)).toEqual({ identitySliceId: null, timeRange: 'all', status: null });
        expect(facade.sortKey(stream)).toBe('onset');
        expect(facade.visibleDivergences(stream)).toEqual(facade.divergences()[stream]);
      }
    });

    it('should narrow only the stream whose filters change', () => {
      const facade = createReplayFacade();

      facade.setFilters('workflow', { identitySliceId: approvalSliceId(facade) });

      expect(summary(facade.visibleDivergences('workflow')!)).toEqual([
        ['Invoice approval (synthetic) · Approval', 'task-duration', 'ongoing'],
        ['Invoice approval (synthetic) · Approval', 'response-time', 'ongoing'],
      ]);
      expect(facade.visibleDivergences('document')!.length).toBe(1);
      expect(facade.filters('document').identitySliceId).toBeNull();
    });

    it('should keep counts for all of the stream, whatever the filters', () => {
      const facade = createReplayFacade();

      facade.setFilters('workflow', { status: 'resolved' });

      expect(facade.visibleDivergences('workflow')).toEqual([]);
      expect(facade.counts('workflow')).toEqual({ total: 3, ongoing: 3, resolved: 0 });
    });

    it('should clear only the given stream filters and keep its sort', () => {
      const facade = createReplayFacade();
      facade.setFilters('workflow', { status: 'resolved', timeRange: 'last-7-days' });
      facade.setFilters('document', { status: 'resolved' });
      facade.setSort('workflow', 'dimension');

      facade.clearFilters('workflow');

      expect(facade.filters('workflow')).toEqual({ identitySliceId: null, timeRange: 'all', status: null });
      expect(facade.sortKey('workflow')).toBe('dimension');
      expect(facade.filters('document').status).toBe('resolved');
      expect(facade.visibleDivergences('workflow')!.length).toBe(3);
    });

    it('should sort the visible Divergences per stream', () => {
      const facade = createReplayFacade();

      facade.setSort('workflow', 'dimension');

      expect(summary(facade.visibleDivergences('workflow')!).map(([, dimension]) => dimension)).toEqual([
        'response-time',
        'task-duration',
        'workflow-runtime',
      ]);
      expect(facade.sortKey('document')).toBe('onset');
    });

    it('should keep replay Divergences observed in the last 7 days of each stream', () => {
      const facade = createReplayFacade();

      facade.setFilters('document', { timeRange: 'last-7-days' });
      facade.setFilters('workflow', { timeRange: 'last-7-days' });

      expect(facade.visibleDivergences('document')!.length).toBe(1);
      expect(facade.visibleDivergences('workflow')!.length).toBe(3);
    });
  });

  describe('selection under filters', () => {
    it('should report a chosen Divergence hidden by filters, not show another one', () => {
      const facade = createReplayFacade();
      const [approval, , runtime] = facade.divergences().workflow!;
      facade.select('workflow', runtime.id);

      facade.setFilters('workflow', { identitySliceId: approval.identitySlice.id });

      expect(facade.selection('workflow')).toEqual({ divergence: null, hiddenByFilters: true });
      expect(facade.selectedDivergence('workflow')).toBeNull();
    });

    it('should show the chosen Divergence again after clearing filters', () => {
      const facade = createReplayFacade();
      const runtime = facade.divergences().workflow![2];
      facade.select('workflow', runtime.id);
      facade.setFilters('workflow', { status: 'resolved' });

      facade.clearFilters('workflow');

      expect(facade.selection('workflow')).toEqual({ divergence: runtime, hiddenByFilters: false });
    });

    it('should keep the chosen Divergence when the sort changes', () => {
      const facade = createReplayFacade();
      const response = facade.divergences().workflow![1];
      facade.select('workflow', response.id);

      facade.setSort('workflow', 'identity-slice');

      expect(facade.selectedDivergence('workflow')).toBe(response);
    });

    it('should default to the first visible Divergence when none was chosen', () => {
      const facade = createReplayFacade();

      facade.setSort('workflow', 'dimension');

      expect(facade.selectedDivergence('workflow')?.dimension).toBe('response-time');
    });

    it('should select nothing, without a hidden choice, when filters leave no Divergences', () => {
      const facade = createReplayFacade();

      facade.setFilters('document', { status: 'resolved' });

      expect(facade.selection('document')).toEqual({ divergence: null, hiddenByFilters: false });
    });
  });

  describe('analysis options (STEP-06)', () => {
    const dimensions = (divergences: readonly Divergence[]) => divergences.map(d => d.dimension);

    it('should offer the dimensions that share the selected Identity Slice, in onset order', () => {
      const facade = createReplayFacade();

      expect(dimensions(facade.analysisOptions('workflow'))).toEqual(['task-duration', 'response-time']);
      expect(facade.analysisOptions('workflow')).toContain(facade.selectedDivergence('workflow'));
    });

    it('should offer only the selected Divergence when its Identity Slice has no other', () => {
      const facade = createReplayFacade();
      const runtime = facade.divergences().workflow!.find(d => d.dimension === 'workflow-runtime')!;
      facade.select('workflow', runtime.id);

      expect(facade.analysisOptions('workflow')).toEqual([runtime]);
      expect(dimensions(facade.analysisOptions('document'))).toEqual(['amount-value']);
    });

    it('should keep the option order when the list sort changes', () => {
      const facade = createReplayFacade();
      facade.setSort('workflow', 'dimension');

      expect(dimensions(facade.analysisOptions('workflow'))).toEqual(['task-duration', 'response-time']);
    });

    it('should offer nothing while the selection is hidden by filters or absent', () => {
      const facade = createReplayFacade();
      const runtime = facade.divergences().workflow!.find(d => d.dimension === 'workflow-runtime')!;
      facade.select('workflow', runtime.id);
      facade.setFilters('workflow', {
        identitySliceId: facade.divergences().workflow![0].identitySlice.id,
      });

      expect(facade.selection('workflow').hiddenByFilters).toBe(true);
      expect(facade.analysisOptions('workflow')).toEqual([]);

      facade.setFilters('document', { identitySliceId: 'document/none' });
      expect(facade.analysisOptions('document')).toEqual([]);
    });

    it('should offer nothing while a stream is loading', () => {
      const facade = createFacade({
        getIdentitySlices: () => new Subject<never>(),
        getObservations: () => new Subject<never>(),
      });

      expect(facade.streamState('document').status).toBe('loading');
      expect(facade.analysisOptions('document')).toEqual([]);
    });
  });
});
