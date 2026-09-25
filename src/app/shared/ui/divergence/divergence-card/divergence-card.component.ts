import { Component, computed, input, output } from '@angular/core';
import { Divergence } from '../../../../domain/divergence';
import {
  baselineSummaryText,
  dimensionLabel,
  formatDuration,
  formatUtcDate,
  magnitudeText,
  observedSummaryText,
} from '../divergence-format';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

/** Selectable summary of one Divergence. Renders the record it is given; computes no findings. */
@Component({
  selector: 'app-divergence-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './divergence-card.component.html',
  styleUrls: ['./divergence-card.component.scss'],
})
export class DivergenceCardComponent {
  readonly divergence = input.required<Divergence>();
  readonly selected = input(false);
  /** Id of the element that shows the selected Divergence's detail. */
  readonly detailId = input<string | null>(null);

  readonly cardSelect = output<string>();

  readonly view = computed(() => {
    const divergence = this.divergence();
    return {
      identitySlice: divergence.identitySlice.label,
      dimension: dimensionLabel(divergence.dimension),
      observed: observedSummaryText(divergence),
      baseline: baselineSummaryText(divergence.baseline),
      magnitude: magnitudeText(divergence),
      onset: formatUtcDate(divergence.onset),
      duration: formatDuration(divergence.durationMs),
    };
  });

  select() {
    this.cardSelect.emit(this.divergence().id);
  }
}
