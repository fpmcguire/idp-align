import { Component, computed, input } from '@angular/core';
import { DivergenceStatus } from '../../../../domain/divergence';
import { STATUS_LABELS } from '../divergence-format';

/** Lifecycle status of a Divergence finding. Shows the status only; it offers no action. */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
  readonly status = input.required<DivergenceStatus>();

  readonly label = computed(() => STATUS_LABELS[this.status()]);
}
