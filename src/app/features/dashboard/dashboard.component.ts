import { formatDate } from '@angular/common';
import { Component, ElementRef, computed, inject, signal, viewChildren } from '@angular/core';
import { ObservationWindow } from '../../domain/observation';
import { StreamKind } from '../../domain/stream';
import { DashboardFacade } from './dashboard.facade';

interface StreamConfig {
  kind: StreamKind;
  label: string;
  sourceNote: string;
  identitySliceLabel: string;
}

function formatUtcRange({ from, to }: ObservationWindow): string {
  const format = (value: string, pattern: string) => formatDate(value, pattern, 'en-US', 'UTC');
  const sameYear = format(from, 'y') === format(to, 'y');
  return `${format(from, sameYear ? 'd MMM' : 'd MMM y')}–${format(to, 'd MMM y')}`;
}

const STREAMS: readonly StreamConfig[] = [
  {
    kind: 'document',
    label: 'Document stream',
    sourceNote:
      'Observes document index-field behavior. Replay data is synthetic and modeled on public DocuWare Platform REST API documentation.',
    identitySliceLabel: 'Identity Slice (vendor / document type)',
  },
  {
    kind: 'workflow',
    label: 'Workflow stream',
    sourceNote:
      'Observes workflow execution behavior. Replay data is synthetic and modeled on public DocuWare Workflow Analytics API documentation.',
    identitySliceLabel: 'Identity Slice (workflow step / route)',
  },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardFacade],
})
export class DashboardComponent {
  private readonly facade = inject(DashboardFacade);

  readonly streams = STREAMS;
  readonly kpiLabels = ['Total Divergences', 'Ongoing', 'Resolved', 'Trend'];

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

  private tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('streamTab');

  selectStream(stream: StreamKind) {
    this.activeStream.set(stream);
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
