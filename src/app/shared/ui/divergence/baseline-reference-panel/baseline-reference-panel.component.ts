import { Component, computed, input } from '@angular/core';
import { ObservedBaseline } from '../../../../domain/observed-baseline';
import {
  DisplayField,
  baselineMethodText,
  formatCategoricalValue,
  formatDimensionValue,
  formatShare,
  formatUtc,
} from '../divergence-format';

/** Observed Baseline snapshot a Divergence is compared with. Read-only; it offers no editing. */
@Component({
  selector: 'app-baseline-reference-panel',
  standalone: true,
  templateUrl: './baseline-reference-panel.component.html',
  styleUrls: ['./baseline-reference-panel.component.scss'],
})
export class BaselineReferencePanelComponent {
  readonly baseline = input.required<ObservedBaseline>();

  readonly view = computed(() => {
    const baseline = this.baseline();
    const { from, to } = baseline.referenceWindow;
    return {
      method: baselineMethodText(baseline),
      referenceWindow: `${formatUtc(from)} to ${formatUtc(to)} (end exclusive)`,
      sampleSize: `${baseline.sampleSize} reference observations`,
      numericFields: numericFields(baseline),
      distribution:
        baseline.valueKind === 'categorical'
          ? baseline.summary.distribution.map(f => ({
              value: formatCategoricalValue(f.value),
              count: f.count,
              share: formatShare(f.share),
            }))
          : [],
    };
  });
}

function numericFields(baseline: ObservedBaseline): DisplayField[] {
  if (baseline.valueKind !== 'numeric') return [];
  const value = (v: number) => formatDimensionValue(baseline.dimension, v);
  const { summary, range } = baseline;
  return [
    { label: 'Mean', value: value(summary.mean) },
    { label: 'Standard deviation', value: value(summary.standardDeviation) },
    { label: 'Median', value: value(summary.median) },
    { label: 'Reference min to max', value: `${value(summary.min)} to ${value(summary.max)}` },
    { label: 'Within-baseline range', value: `${value(range.lower)} to ${value(range.upper)}` },
  ];
}
