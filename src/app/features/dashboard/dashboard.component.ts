import { Component, ElementRef, computed, signal, viewChildren } from '@angular/core';

type StreamKind = 'document' | 'workflow';

interface StreamConfig {
  kind: StreamKind;
  label: string;
  sourceNote: string;
  identitySliceLabel: string;
}

const STREAMS: readonly StreamConfig[] = [
  {
    kind: 'document',
    label: 'Document stream',
    sourceNote:
      'Observes document index-field behavior. Replay data will be modeled on public DocuWare Platform REST API documentation.',
    identitySliceLabel: 'Identity Slice (vendor / document type)',
  },
  {
    kind: 'workflow',
    label: 'Workflow stream',
    sourceNote:
      'Observes workflow execution behavior. Replay data will be modeled on public DocuWare Workflow Analytics API documentation.',
    identitySliceLabel: 'Identity Slice (workflow step / route)',
  },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  readonly streams = STREAMS;
  readonly kpiLabels = ['Total Divergences', 'Ongoing', 'Resolved', 'Trend'];

  activeStream = signal<StreamKind>('document');
  activeConfig = computed(() => STREAMS.find(s => s.kind === this.activeStream())!);

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
