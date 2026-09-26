import { formatDate } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { ChartConfiguration } from 'chart.js';
import { dimensionLabel, formatDimensionValue, formatShare } from '../divergence-format';
import { CHART_FACTORY, ChartHandle, DivergenceChartConfig } from './chart-factory';
import {
  CategoricalShareComparison,
  DivergenceChartModel,
  MetricTimeSeries,
} from './divergence-chart.model';

const HOUR_MS = 3_600_000;

interface ChartColors {
  readonly observed: string;
  readonly baseline: string;
  readonly onset: string;
  readonly text: string;
  readonly grid: string;
}

/** Fallbacks match the global design tokens, for environments without computed styles. */
const TOKEN_FALLBACKS: Readonly<Record<keyof ChartColors, [string, string]>> = {
  observed: ['--color-divergence-ongoing', '#F97316'],
  baseline: ['--color-baseline', '#3B82F6'],
  onset: ['--color-dimension-highlight', '#A855F7'],
  text: ['--color-text-secondary', '#A8A5A0'],
  grid: ['--color-border', '#3A3A3A'],
};

interface LegendEntry {
  readonly key: string;
  readonly label: string;
  readonly swatch: 'observed' | 'baseline-mean' | 'baseline-range' | 'onset' | 'reference' | 'threshold';
}

/**
 * Chart.js view of one Divergence chart model. Presentational: it draws the values it is given and
 * computes no baselines or findings. The chart instance is updated in place when the model changes,
 * rebuilt only when the chart type changes, and destroyed with the component.
 */
@Component({
  selector: 'app-divergence-chart',
  standalone: true,
  templateUrl: './divergence-chart.component.html',
  styleUrls: ['./divergence-chart.component.scss'],
})
export class DivergenceChartComponent {
  readonly model = input.required<DivergenceChartModel>();
  /** Accessible name for the chart image. */
  readonly label = input.required<string>();
  /** ID of the text that summarizes the chart for non-visual review. */
  readonly describedBy = input<string | null>(null);

  private readonly createChart = inject(CHART_FACTORY);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private chart: ChartHandle | null = null;
  private chartKind: DivergenceChartModel['kind'] | null = null;

  readonly legend = computed((): LegendEntry[] => {
    const model = this.model();
    if (model.kind === 'numeric') {
      return [
        { key: 'observed', label: 'Observed values (Evidence)', swatch: 'observed' },
        { key: 'mean', label: 'Observed Baseline mean', swatch: 'baseline-mean' },
        { key: 'range', label: 'Observed Baseline range', swatch: 'baseline-range' },
        { key: 'onset', label: 'Onset', swatch: 'onset' },
      ];
    }
    return [
      { key: 'reference', label: 'Share of reference observations', swatch: 'reference' },
      { key: 'observed', label: 'Share of Evidence observations', swatch: 'observed' },
      {
        key: 'threshold',
        label: `Within-baseline minimum reference share (${formatShare(model.minValueShare)})`,
        swatch: 'threshold',
      },
    ];
  });

  constructor() {
    afterRenderEffect(() => {
      const model = this.model();
      const config = chartConfig(model, this.colors());
      if (this.chart && this.chartKind === model.kind) {
        this.chart.update(config);
        return;
      }
      this.chart?.destroy();
      this.chart = this.createChart(this.canvas().nativeElement, config);
      this.chartKind = model.kind;
    });

    inject(DestroyRef).onDestroy(() => {
      this.chart?.destroy();
      this.chart = null;
    });
  }

  private colors(): ChartColors {
    const style = getComputedStyle(this.host.nativeElement);
    const read = ([token, fallback]: [string, string]) =>
      style.getPropertyValue(token).trim() || fallback;
    return {
      observed: read(TOKEN_FALLBACKS.observed),
      baseline: read(TOKEN_FALLBACKS.baseline),
      onset: read(TOKEN_FALLBACKS.onset),
      text: read(TOKEN_FALLBACKS.text),
      grid: read(TOKEN_FALLBACKS.grid),
    };
  }
}

/** Adds transparency to a #RRGGBB color; other formats are returned unchanged. */
function translucent(color: string, alpha: string): string {
  return /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alpha}` : color;
}

function chartConfig(model: DivergenceChartModel, colors: ChartColors): DivergenceChartConfig {
  return model.kind === 'numeric' ? numericConfig(model, colors) : categoricalConfig(model, colors);
}

function numericConfig(model: MetricTimeSeries, colors: ChartColors): ChartConfiguration<'line'> {
  const xs = model.points.map(p => p.x);
  const ys = model.points.map(p => p.y);
  const first = Math.min(...xs, model.onset);
  const last = Math.max(...xs, model.onset);
  const padding = Math.max((last - first) * 0.05, 12 * HOUR_MS);
  const value = (v: number) => formatDimensionValue(model.dimension, v);

  return {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Observed values (Evidence)',
          data: model.points.map(({ x, y }) => ({ x, y })),
          borderColor: colors.observed,
          backgroundColor: colors.observed,
          pointRadius: 4,
          pointHoverRadius: 4,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      events: [],
      scales: {
        x: {
          type: 'linear',
          min: first - padding,
          max: last + padding,
          title: { display: true, text: 'Observed at (UTC)', color: colors.text },
          ticks: {
            color: colors.text,
            maxTicksLimit: 6,
            callback: v => formatDate(Number(v), 'd MMM', 'en-US', 'UTC'),
          },
          grid: { color: colors.grid },
        },
        y: {
          suggestedMin: Math.min(...ys, model.baselineRange.lower),
          suggestedMax: Math.max(...ys, model.baselineRange.upper),
          title: { display: true, text: dimensionLabel(model.dimension), color: colors.text },
          ticks: { color: colors.text, callback: v => value(Number(v)) },
          grid: { color: colors.grid },
        },
      },
      plugins: {
        annotation: {
          annotations: {
            baselineRange: {
              type: 'box',
              yMin: model.baselineRange.lower,
              yMax: model.baselineRange.upper,
              backgroundColor: translucent(colors.baseline, '33'),
              borderWidth: 0,
            },
            baselineMean: {
              type: 'line',
              yMin: model.baselineMean,
              yMax: model.baselineMean,
              borderColor: colors.baseline,
              borderDash: [6, 4],
              borderWidth: 2,
            },
            onset: {
              type: 'line',
              xMin: model.onset,
              xMax: model.onset,
              borderColor: colors.onset,
              borderWidth: 2,
            },
          },
        },
      },
    },
  };
}

function categoricalConfig(
  model: CategoricalShareComparison,
  colors: ChartColors,
): ChartConfiguration<'bar'> {
  const percent = (share: number) => share * 100;
  return {
    type: 'bar',
    data: {
      labels: model.categories.map(c => c.label),
      datasets: [
        {
          label: 'Share of reference observations',
          data: model.categories.map(c => percent(c.referenceShare)),
          backgroundColor: colors.baseline,
        },
        {
          label: 'Share of Evidence observations',
          data: model.categories.map(c => percent(c.observedShare)),
          backgroundColor: colors.observed,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      events: [],
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 100,
          title: { display: true, text: 'Share of observations (%)', color: colors.text },
          ticks: { color: colors.text, callback: v => `${v}%` },
          grid: { color: colors.grid },
        },
        y: {
          type: 'category',
          ticks: { color: colors.text },
          grid: { color: colors.grid },
        },
      },
      plugins: {
        annotation: {
          annotations: {
            minValueShare: {
              type: 'line',
              xMin: percent(model.minValueShare),
              xMax: percent(model.minValueShare),
              borderColor: colors.text,
              borderDash: [6, 4],
              borderWidth: 2,
            },
          },
        },
      },
    },
  };
}
