// Test-only stand-in for Chart.js. jsdom cannot render a canvas, so specs record what the chart
// component asks for instead. Production code must not import this.

import { Provider } from '@angular/core';
import {
  CHART_FACTORY,
  ChartFactory,
  DivergenceChartConfig,
} from '../app/shared/ui/divergence/divergence-chart/chart-factory';

export interface FakeChart {
  readonly canvas: HTMLCanvasElement;
  /** The creation config, then each update, in order. */
  readonly configs: DivergenceChartConfig[];
  destroyed: boolean;
}

export interface FakeChartFactory {
  readonly charts: FakeChart[];
  readonly factory: ChartFactory;
  /** Charts created and not yet destroyed. */
  live(): FakeChart[];
  provider(): Provider;
}

export function fakeChartFactory(): FakeChartFactory {
  const charts: FakeChart[] = [];
  const factory: ChartFactory = (canvas, config) => {
    const chart: FakeChart = { canvas, configs: [config], destroyed: false };
    charts.push(chart);
    return {
      update: next => chart.configs.push(next),
      destroy: () => {
        chart.destroyed = true;
      },
    };
  };
  return {
    charts,
    factory,
    live: () => charts.filter(c => !c.destroyed),
    provider: () => ({ provide: CHART_FACTORY, useValue: factory }),
  };
}
