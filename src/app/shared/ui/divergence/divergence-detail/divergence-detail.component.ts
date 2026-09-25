import { Component, computed, input } from '@angular/core';
import { Divergence } from '../../../../domain/divergence';
import { BaselineReferencePanelComponent } from '../baseline-reference-panel/baseline-reference-panel.component';
import {
  DisplayField,
  STATUS_DESCRIPTIONS,
  baselineSummaryText,
  dimensionLabel,
  formatDuration,
  formatUtc,
  magnitudeText,
  observedDetailText,
  observedSummaryText,
} from '../divergence-format';
import { EvidenceTraceComponent } from '../evidence-trace/evidence-trace.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

/** Full context for one selected Divergence: summary, Observed Baseline, and Evidence trace. */
@Component({
  selector: 'app-divergence-detail',
  standalone: true,
  imports: [StatusBadgeComponent, BaselineReferencePanelComponent, EvidenceTraceComponent],
  templateUrl: './divergence-detail.component.html',
  styleUrls: ['./divergence-detail.component.scss'],
})
export class DivergenceDetailComponent {
  readonly divergence = input.required<Divergence>();

  readonly view = computed(() => {
    const divergence = this.divergence();
    const { minConsecutiveObservations } = divergence.sustainedCriteria;
    const quickStats: DisplayField[] = [
      { label: 'Onset', value: formatUtc(divergence.onset) },
      { label: 'Latest observed', value: formatUtc(divergence.latestObservedAt) },
      { label: 'Duration', value: formatDuration(divergence.durationMs) },
      { label: 'Observed', value: observedSummaryText(divergence) },
      { label: 'Observed values', value: observedDetailText(divergence) },
      { label: 'Observed Baseline', value: baselineSummaryText(divergence.baseline) },
      { label: 'Magnitude', value: magnitudeText(divergence) },
      {
        label: 'Sustained criterion',
        value: `At least ${minConsecutiveObservations} consecutive observations outside the Observed Baseline`,
      },
    ];
    return {
      identitySlice: divergence.identitySlice.label,
      dimension: dimensionLabel(divergence.dimension),
      statusDescription: STATUS_DESCRIPTIONS[divergence.status],
      quickStats,
    };
  });
}
