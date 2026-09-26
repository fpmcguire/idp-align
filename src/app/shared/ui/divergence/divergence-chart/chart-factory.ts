import { InjectionToken } from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Chart.js and the annotation plugin are bundled from npm (architecture D7). Only the parts the
// analysis charts use are registered, so the rest of Chart.js stays out of the bundle.
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  BarController,
  BarElement,
  CategoryScale,
  annotationPlugin,
);

export type DivergenceChartConfig = ChartConfiguration<'line'> | ChartConfiguration<'bar'>;

/** The chart operations the analysis view needs: replace its configuration, or tear it down. */
export interface ChartHandle {
  update(config: DivergenceChartConfig): void;
  destroy(): void;
}

export type ChartFactory = (canvas: HTMLCanvasElement, config: DivergenceChartConfig) => ChartHandle;

function createChart(canvas: HTMLCanvasElement, config: DivergenceChartConfig): ChartHandle {
  const chart = new Chart(canvas, config as ChartConfiguration);
  return {
    update(next) {
      chart.data = next.data as ChartConfiguration['data'];
      chart.options = (next.options ?? {}) as Chart['options'];
      chart.update();
    },
    destroy: () => chart.destroy(),
  };
}

/** Creates Chart.js instances. Specs replace it, since jsdom has no canvas rendering. */
export const CHART_FACTORY = new InjectionToken<ChartFactory>('CHART_FACTORY', {
  providedIn: 'root',
  factory: () => createChart,
});
