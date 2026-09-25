import { Component, computed, input } from '@angular/core';
import { DivergenceDimension } from '../../../../domain/divergence-dimension';
import { Evidence } from '../../../../domain/evidence';
import {
  evidenceContextFields,
  formatDimensionValue,
  formatSignedDifference,
  formatUtc,
} from '../divergence-format';

/**
 * Evidence items for one Divergence in the order the record carries them, which is chronological.
 * Observed context fields such as workflow instance or decision agent are shown as context only.
 */
@Component({
  selector: 'app-evidence-trace',
  standalone: true,
  templateUrl: './evidence-trace.component.html',
  styleUrls: ['./evidence-trace.component.scss'],
})
export class EvidenceTraceComponent {
  readonly evidence = input.required<Evidence>();
  readonly dimension = input.required<DivergenceDimension>();

  readonly items = computed(() => {
    const dimension = this.dimension();
    return this.evidence().items.map(item => ({
      observationId: item.observationId,
      observedAt: item.observedAt,
      time: formatUtc(item.observedAt),
      value: formatDimensionValue(dimension, item.value),
      distance:
        item.distanceFromBaselineMean === null
          ? null
          : formatSignedDifference(dimension, item.distanceFromBaselineMean),
      withinBaseline: item.withinBaseline,
      sources: item.sources.map(s => `${s.system} / ${s.resource} / ${s.recordId}`),
      context: evidenceContextFields(item.context),
    }));
  });
}
