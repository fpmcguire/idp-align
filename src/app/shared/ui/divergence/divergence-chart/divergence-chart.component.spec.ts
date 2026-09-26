import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  amountDivergence,
  vendorRepresentationDivergence,
  workflowDivergences,
} from '../../../../../testing/divergence-builders';
import { FakeChartFactory, fakeChartFactory } from '../../../../../testing/fake-chart-factory';
import { toDivergenceChartModel } from '../divergence-analysis-view';
import { DivergenceChartComponent } from './divergence-chart.component';
import { DivergenceChartModel } from './divergence-chart.model';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

describe('DivergenceChartComponent', () => {
  let charts: FakeChartFactory;
  let fixture: ComponentFixture<DivergenceChartComponent>;
  let el: HTMLElement;

  const render = (model: DivergenceChartModel) => {
    fixture.componentRef.setInput('model', model);
    fixture.detectChanges();
  };
  const canvases = () => el.querySelectorAll('canvas');
  const legend = () =>
    Array.from(el.querySelectorAll('[data-testid="chart-legend"] li')).map(li => normalize(li.textContent));

  beforeEach(() => {
    charts = fakeChartFactory();
    TestBed.configureTestingModule({
      imports: [DivergenceChartComponent],
      providers: [charts.provider()],
    });
    fixture = TestBed.createComponent(DivergenceChartComponent);
    fixture.componentRef.setInput('label', 'Chart of Amount');
    fixture.componentRef.setInput('describedBy', 'chart-summary');
    el = fixture.nativeElement;
  });

  describe('accessibility', () => {
    it('should give the canvas an image role, accessible name, and description', () => {
      render(toDivergenceChartModel(amountDivergence()));
      const canvas = el.querySelector('canvas')!;

      expect(canvas.getAttribute('role')).toBe('img');
      expect(canvas.getAttribute('aria-label')).toBe('Chart of Amount');
      expect(canvas.getAttribute('aria-describedby')).toBe('chart-summary');
    });

    it('should render a text legend for the numeric chart', () => {
      render(toDivergenceChartModel(amountDivergence()));

      expect(legend()).toEqual([
        'Observed values (Evidence)',
        'Observed Baseline mean',
        'Observed Baseline range',
        'Onset',
      ]);
    });

    it('should render a categorical legend without a range or band', () => {
      render(toDivergenceChartModel(vendorRepresentationDivergence()));

      expect(legend()).toEqual([
        'Share of reference observations',
        'Share of Evidence observations',
        'Within-baseline minimum reference share (10%)',
      ]);
      expect(legend().join(' ')).not.toMatch(/range|band|confidence/i);
    });
  });

  describe('numeric configuration', () => {
    it('should draw Evidence as a line with markers and the Observed Baseline as annotations', () => {
      const model = toDivergenceChartModel(amountDivergence());
      render(model);
      const config = charts.charts[0].configs[0];

      expect(config.type).toBe('line');
      const dataset = config.data.datasets[0];
      expect(dataset.data).toEqual(
        model.kind === 'numeric' ? model.points.map(({ x, y }) => ({ x, y })) : [],
      );
      expect((dataset as { pointRadius?: number }).pointRadius).toBeGreaterThan(0);

      const annotations = config.options?.plugins?.annotation?.annotations as Record<
        string,
        Record<string, unknown>
      >;
      expect(annotations['baselineRange']).toMatchObject({ type: 'box', yMin: 950, yMax: 1050 });
      expect(annotations['baselineMean']).toMatchObject({ type: 'line', yMin: 1000, yMax: 1000 });
      expect(annotations['onset']).toMatchObject({
        type: 'line',
        xMin: model.kind === 'numeric' ? model.onset : NaN,
      });
    });

    it('should label axes and keep the chart static', () => {
      render(toDivergenceChartModel(amountDivergence()));
      const options = charts.charts[0].configs[0].options!;
      const scales = options.scales as Record<string, { title?: { text?: string } }>;

      expect(scales['x'].title?.text).toBe('Observed at (UTC)');
      expect(scales['y'].title?.text).toBe('Amount');
      expect(options.animation).toBe(false);
      expect(options.events).toEqual([]);
    });
  });

  describe('categorical configuration', () => {
    it('should draw grouped share bars and the minimum share line, with no box annotation', () => {
      render(toDivergenceChartModel(vendorRepresentationDivergence()));
      const config = charts.charts[0].configs[0];

      expect(config.type).toBe('bar');
      expect(config.data.labels).toEqual(['Kappa Paper (synthetic)', 'KAPPA PAPER (SYNTHETIC)']);
      expect(config.data.datasets.map(d => [d.label, d.data])).toEqual([
        ['Share of reference observations', [100, 0]],
        ['Share of Evidence observations', [0, 100]],
      ]);
      const annotations = Object.values(
        config.options?.plugins?.annotation?.annotations as Record<string, { type: string }>,
      );
      expect(annotations).toEqual([expect.objectContaining({ type: 'line', xMin: 10, xMax: 10 })]);
    });
  });

  describe('lifecycle', () => {
    it('should create one chart on the rendered canvas', () => {
      render(toDivergenceChartModel(amountDivergence()));

      expect(charts.charts.length).toBe(1);
      expect(charts.charts[0].canvas).toBe(el.querySelector('canvas'));
      expect(canvases().length).toBe(1);
    });

    it('should update the same chart when a model of the same kind replaces it', () => {
      const [taskDuration, runtime] = workflowDivergences();
      render(toDivergenceChartModel(taskDuration));
      render(toDivergenceChartModel(runtime));

      expect(charts.charts.length).toBe(1);
      expect(charts.charts[0].configs.length).toBe(2);
      expect(charts.charts[0].destroyed).toBe(false);
      expect(canvases().length).toBe(1);
    });

    it('should replace the chart when the chart kind changes', () => {
      render(toDivergenceChartModel(amountDivergence()));
      render(toDivergenceChartModel(vendorRepresentationDivergence()));

      expect(charts.charts.length).toBe(2);
      expect(charts.charts[0].destroyed).toBe(true);
      expect(charts.live().length).toBe(1);
      expect(charts.live()[0].configs[0].type).toBe('bar');
      expect(canvases().length).toBe(1);
    });

    it('should destroy the chart when the component is destroyed', () => {
      render(toDivergenceChartModel(amountDivergence()));
      fixture.destroy();

      expect(charts.live().length).toBe(0);
    });
  });
});
