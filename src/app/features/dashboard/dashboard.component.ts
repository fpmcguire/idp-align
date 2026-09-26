import { formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DivergenceStatus } from '../../domain/divergence';
import { ObservationWindow } from '../../domain/observation';
import { StreamKind } from '../../domain/stream';
import { toAnalysisDimensionOptions } from '../../shared/ui/divergence/divergence-analysis-view';
import { DivergenceAnalysisComponent } from '../../shared/ui/divergence/divergence-analysis/divergence-analysis.component';
import { DivergenceCardComponent } from '../../shared/ui/divergence/divergence-card/divergence-card.component';
import { DivergenceDetailComponent } from '../../shared/ui/divergence/divergence-detail/divergence-detail.component';
import { STATUS_LABELS, formatUtcDate } from '../../shared/ui/divergence/divergence-format';
import {
  DivergenceSortKey,
  TimeRangePreset,
  hasActiveFilters,
  statusesPresent,
} from './dashboard-filters';
import { DashboardFacade } from './dashboard.facade';

interface StreamConfig {
  kind: StreamKind;
  label: string;
  sourceNote: string;
  identitySliceLabel: string;
  kpiScopeNote: string;
}

interface KpiView {
  metric: 'total' | 'ongoing' | 'resolved' | 'trend';
  label: string;
  value: string;
  note: string;
}

interface OptionView<T> {
  value: T;
  label: string;
}

/** What the Divergence list shows for the active stream. */
export type ListState = 'loading' | 'unavailable' | 'empty' | 'filtered-empty' | 'ready';

function formatUtcRange({ from, to }: ObservationWindow): string {
  const format = (value: string, pattern: string) => formatDate(value, pattern, 'en-US', 'UTC');
  const sameYear = format(from, 'y') === format(to, 'y');
  return `${format(from, sameYear ? 'd MMM' : 'd MMM y')}–${format(to, 'd MMM y')}`;
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

const STREAMS: readonly StreamConfig[] = [
  {
    kind: 'document',
    label: 'Document stream',
    sourceNote:
      'Observes document index-field behavior. Replay data is synthetic and modeled on public DocuWare Platform REST API documentation.',
    identitySliceLabel: 'Identity Slice (vendor / document type)',
    kpiScopeNote: 'Across vendor / document type Identity Slices',
  },
  {
    kind: 'workflow',
    label: 'Workflow stream',
    sourceNote:
      'Observes workflow execution behavior. Replay data is synthetic and modeled on public DocuWare Workflow Analytics API documentation.',
    identitySliceLabel: 'Identity Slice (workflow step / route)',
    kpiScopeNote: 'Across workflow step and runtime Identity Slices',
  },
];

const TIME_RANGE_OPTIONS: readonly OptionView<TimeRangePreset>[] = [
  { value: 'all', label: 'All observations' },
  { value: 'last-30-days', label: 'Last 30 days of observations' },
  { value: 'last-7-days', label: 'Last 7 days of observations' },
];

const SORT_OPTIONS: readonly OptionView<DivergenceSortKey>[] = [
  { value: 'onset', label: 'Onset (earliest first)' },
  { value: 'identity-slice', label: 'Identity Slice (A–Z)' },
  { value: 'dimension', label: 'Dimension (A–Z)' },
  { value: 'status', label: 'Status (lifecycle order)' },
];

const selectValue = (event: Event) => (event.target as HTMLSelectElement).value;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DivergenceCardComponent, DivergenceDetailComponent, DivergenceAnalysisComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard-analysis.scss'],
  providers: [DashboardFacade],
})
export class DashboardComponent {
  private readonly facade = inject(DashboardFacade);
  private readonly injector = inject(Injector);

  readonly streams = STREAMS;
  readonly detailId = 'divergence-detail';
  readonly timeRangeOptions = TIME_RANGE_OPTIONS;
  readonly sortOptions = SORT_OPTIONS;
  readonly skeletons = [0, 1, 2];

  activeStream = signal<StreamKind>('document');
  activeConfig = computed(() => STREAMS.find(s => s.kind === this.activeStream())!);

  /** Neutral replay source facts for the active stream; null until they are available. */
  replaySource = computed(() => {
    const info = this.facade.sourceInfo()[this.activeStream()];
    if (!info?.observationWindow) return null;
    return {
      streamKind: info.streamKind,
      observationCount: info.observationCount,
      identitySliceCount: info.identitySliceCount,
      range: formatUtcRange(info.observationWindow),
    };
  });

  private streamState = computed(() => this.facade.streamState(this.activeStream()));

  /** All of the active stream's Divergences; null while they are unavailable. */
  divergences = computed(() => this.facade.divergences()[this.activeStream()] ?? null);
  /** The active stream's Divergences after its filters and sort. */
  visibleDivergences = computed(() => this.facade.visibleDivergences(this.activeStream()) ?? []);
  selection = computed(() => this.facade.selection(this.activeStream()));
  selectedDivergence = computed(() => this.selection().divergence);

  filters = computed(() => this.facade.filters(this.activeStream()));
  sortKey = computed(() => this.facade.sortKey(this.activeStream()));
  filtersActive = computed(() => hasActiveFilters(this.filters()));

  listState = computed((): ListState => {
    const state = this.streamState();
    if (state.status !== 'ready') return state.status;
    if (state.divergences.length === 0) return 'empty';
    return this.visibleDivergences().length === 0 ? 'filtered-empty' : 'ready';
  });

  /** Filters and sort apply only when the stream has Divergences to narrow or order. */
  controlsEnabled = computed(() => {
    const state = this.listState();
    return state === 'ready' || state === 'filtered-empty';
  });

  /** Without focusable content, the tab panel itself takes focus (APG tabs pattern). */
  panelFocusable = computed(() => !this.controlsEnabled() && this.listState() !== 'unavailable');

  identitySliceOptions = computed((): OptionView<string>[] => {
    const state = this.streamState();
    if (state.status !== 'ready') return [];
    return [...state.identitySlices]
      .sort((a, b) => a.label.localeCompare(b.label, 'en-US'))
      .map(slice => ({ value: slice.id, label: slice.label }));
  });

  /** Statuses present in the stream, plus the current choice so the control never goes blank. */
  statusOptions = computed((): OptionView<DivergenceStatus>[] => {
    const present = statusesPresent(this.divergences() ?? []);
    const current = this.filters().status;
    const statuses = current && !present.includes(current) ? [...present, current] : present;
    return statuses.map(status => ({ value: status, label: STATUS_LABELS[status] }));
  });

  timeRangeNote = computed(() => {
    const state = this.streamState();
    if (state.status !== 'ready' || !state.latestObservedAt) return null;
    return `Measured back from the latest observation in this stream, ${formatUtcDate(state.latestObservedAt)} (UTC).`;
  });

  controlsNote = computed(() => {
    switch (this.listState()) {
      case 'loading':
        return 'Filters and sorting are available once Divergence data has loaded.';
      case 'unavailable':
        return 'Filters and sorting are unavailable while Divergence data cannot be read.';
      case 'empty':
        return 'There are no Divergences in this stream to filter or sort.';
      default:
        return null;
    }
  });

  /** The time range note, only while no controls note replaces it. */
  shownTimeRangeNote = computed(() => (this.controlsNote() ? null : this.timeRangeNote()));

  resultSummary = computed(() => {
    const total = this.divergences()?.length ?? 0;
    if (!this.controlsEnabled()) return null;
    const shown = this.visibleDivergences().length;
    return `Showing ${shown} of ${total} ${plural(total, 'Divergence', 'Divergences')}`;
  });

  hiddenSummary = computed(() => {
    const hidden = (this.divergences()?.length ?? 0) - this.visibleDivergences().length;
    return `${hidden} ${plural(hidden, 'Divergence is', 'Divergences are')} hidden`;
  });

  kpis = computed((): KpiView[] => {
    const counts = this.facade.counts(this.activeStream());
    const pending =
      this.listState() === 'loading'
        ? 'Divergence data is loading'
        : 'Divergence data is not available';
    const count = (value: number | undefined) => (value === undefined ? '—' : String(value));
    return [
      {
        metric: 'total',
        label: 'Total Divergences',
        value: count(counts?.total),
        note: counts ? this.activeConfig().kpiScopeNote : pending,
      },
      {
        metric: 'ongoing',
        label: 'Ongoing',
        value: count(counts?.ongoing),
        note: counts ? 'Latest observation outside the Observed Baseline' : pending,
      },
      {
        metric: 'resolved',
        label: 'Resolved',
        value: count(counts?.resolved),
        note: counts ? 'Finding lifecycle status' : pending,
      },
      { metric: 'trend', label: 'Trend', value: '—', note: 'Trend analysis is added in a later Step' },
    ];
  });

  /**
   * Whether the Divergence Analysis replaces the list and detail in the stream panel. It follows
   * the stream's selection, so filters and dimension switching keep it coherent.
   */
  analysisOpen = signal(false);

  /** Dimensions the analysis can switch between, within the selected Identity Slice. */
  analysisDimensionOptions = computed(() =>
    toAnalysisDimensionOptions(this.facade.analysisOptions(this.activeStream())),
  );

  private tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('streamTab');
  private listRegion = viewChild<ElementRef<HTMLElement>>('listRegion');
  private analysisHeading = viewChild<ElementRef<HTMLElement>>('analysisHeading');
  private analysisTrigger = viewChild<ElementRef<HTMLButtonElement>>('analysisTrigger');

  /** Switching stream returns to the list and detail view; focus stays on the stream tab. */
  selectStream(stream: StreamKind) {
    this.activeStream.set(stream);
    this.analysisOpen.set(false);
  }

  /** Opens the analysis for the selected Divergence and moves focus to its heading. */
  openAnalysis() {
    this.analysisOpen.set(true);
    afterNextRender(() => this.analysisHeading()?.nativeElement.focus(), { injector: this.injector });
  }

  /** Returns to the list and detail view, with focus back on the control that opened the analysis. */
  closeAnalysis() {
    this.analysisOpen.set(false);
    afterNextRender(
      () => (this.analysisTrigger() ?? this.listRegion())?.nativeElement.focus(),
      { injector: this.injector },
    );
  }

  selectDivergence(divergenceId: string) {
    this.facade.select(this.activeStream(), divergenceId);
  }

  onIdentitySliceChange(event: Event) {
    this.facade.setFilters(this.activeStream(), { identitySliceId: selectValue(event) || null });
  }

  onTimeRangeChange(event: Event) {
    this.facade.setFilters(this.activeStream(), { timeRange: selectValue(event) as TimeRangePreset });
  }

  onStatusChange(event: Event) {
    const status = selectValue(event) as DivergenceStatus | '';
    this.facade.setFilters(this.activeStream(), { status: status || null });
  }

  onSortChange(event: Event) {
    this.facade.setSort(this.activeStream(), selectValue(event) as DivergenceSortKey);
  }

  /** The button stays rendered and focusable, so clearing never strands keyboard focus. */
  clearFilters() {
    if (!this.filtersActive()) return;
    this.facade.clearFilters(this.activeStream());
  }

  /** Reads the stream again, then moves focus to the list so it does not stay on a removed button. */
  retry() {
    this.facade.retry(this.activeStream());
    afterNextRender(() => this.listRegion()?.nativeElement.focus(), { injector: this.injector });
  }

  onTabKeydown(event: KeyboardEvent, index: number) {
    const last = STREAMS.length - 1;
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    this.selectStream(STREAMS[next].kind);
    this.tabButtons()[next]?.nativeElement.focus();
  }
}
