import { Component, computed, input, output } from '@angular/core';
import { Divergence } from '../../../../domain/divergence';
import { BaselineReferencePanelComponent } from '../baseline-reference-panel/baseline-reference-panel.component';
import {
  AnalysisDimensionOption,
  analysisChartLabel,
  analysisChartSummary,
  analysisContextFields,
  analysisTable,
  toDivergenceChartModel,
} from '../divergence-analysis-view';
import { DivergenceChartComponent } from '../divergence-chart/divergence-chart.component';
import { STATUS_DESCRIPTIONS, dimensionLabel } from '../divergence-format';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

/**
 * Divergence Analysis for one selected Divergence: its Evidence charted against the Observed
 * Baseline, with side context and the chart data as a table. Presentational: switching dimension
 * is reported to the parent, which owns selection.
 */
@Component({
  selector: 'app-divergence-analysis',
  standalone: true,
  imports: [DivergenceChartComponent, StatusBadgeComponent, BaselineReferencePanelComponent],
  templateUrl: './divergence-analysis.component.html',
  styleUrls: ['./divergence-analysis.component.scss'],
})
export class DivergenceAnalysisComponent {
  readonly divergence = input.required<Divergence>();
  /** Divergences in the same Identity Slice the analysis can switch to, including this one. */
  readonly dimensionOptions = input<readonly AnalysisDimensionOption[]>([]);

  readonly dimensionSelect = output<string>();

  readonly summaryId = 'analysis-chart-summary';

  readonly view = computed(() => {
    const divergence = this.divergence();
    return {
      identitySlice: divergence.identitySlice.label,
      dimension: dimensionLabel(divergence.dimension),
      statusDescription: STATUS_DESCRIPTIONS[divergence.status],
      chartModel: toDivergenceChartModel(divergence),
      chartLabel: analysisChartLabel(divergence),
      chartSummary: analysisChartSummary(divergence),
      contextFields: analysisContextFields(divergence),
      table: analysisTable(divergence),
    };
  });

  selectDimension(divergenceId: string) {
    if (divergenceId !== this.divergence().id) this.dimensionSelect.emit(divergenceId);
  }
}
