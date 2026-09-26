import {
  CLAIM_GUARDRAIL_PATTERNS,
  SEVERITY_RISK_PATTERN,
} from '../../../../testing/claim-guardrail-patterns';
import {
  amountDivergence,
  vendorRepresentationDivergence,
  workflowDivergences,
} from '../../../../testing/divergence-builders';
import { Divergence } from '../../../domain/divergence';
import {
  analysisChartLabel,
  analysisChartSummary,
  analysisContextFields,
  analysisTable,
  evidenceCountText,
  toAnalysisDimensionOptions,
  toDivergenceChartModel,
} from './divergence-analysis-view';

/** Freezes a record and everything inside it, so any mutation throws. */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const inner of Object.values(value)) deepFreeze(inner);
  }
  return value;
}

const allCopy = (divergence: Divergence) =>
  [
    analysisChartLabel(divergence),
    analysisChartSummary(divergence),
    ...analysisContextFields(divergence).flatMap(f => [f.label, f.value]),
    analysisTable(divergence).comparisonHeading,
    ...analysisTable(divergence).rows.flatMap(r => [r.comparison, r.position]),
  ].join(' ');

describe('Divergence analysis view', () => {
  describe('numeric chart model', () => {
    it('should plot each Evidence value at its observation time', () => {
      const divergence = amountDivergence();
      const model = toDivergenceChartModel(divergence);

      expect(model.kind).toBe('numeric');
      if (model.kind !== 'numeric') return;
      expect(model.dimension).toBe('amount-value');
      expect(model.points).toEqual(
        divergence.evidence.items.map(item => ({
          x: Date.parse(item.observedAt),
          y: 1500,
          withinBaseline: false,
        })),
      );
      expect(model.onset).toBe(Date.parse(divergence.onset));
    });

    it('should carry the Observed Baseline mean and range from the baseline snapshot', () => {
      const divergence = amountDivergence();
      const model = toDivergenceChartModel(divergence);

      if (divergence.baseline.valueKind !== 'numeric' || model.kind !== 'numeric') {
        throw new Error('expected a numeric Divergence');
      }
      expect(model.baselineMean).toBe(divergence.baseline.summary.mean);
      expect(model.baselineRange).toEqual(divergence.baseline.range);
      expect(model.baselineRange).toEqual({ lower: 950, upper: 1050 });
    });

    it('should not change the Divergence it maps', () => {
      const divergence = deepFreeze(amountDivergence());
      const before = JSON.stringify(divergence);

      toDivergenceChartModel(divergence);
      allCopy(divergence);

      expect(JSON.stringify(divergence)).toBe(before);
    });
  });

  describe('categorical chart model', () => {
    it('should compare reference and Evidence shares for every value', () => {
      const model = toDivergenceChartModel(vendorRepresentationDivergence());

      expect(model).toEqual({
        kind: 'categorical',
        dimension: 'vendor-representation',
        categories: [
          {
            value: 'Kappa Paper (synthetic)',
            label: 'Kappa Paper (synthetic)',
            referenceShare: 1,
            observedShare: 0,
          },
          {
            value: 'KAPPA PAPER (SYNTHETIC)',
            label: 'KAPPA PAPER (SYNTHETIC)',
            referenceShare: 0,
            observedShare: 1,
          },
        ],
        minValueShare: 0.1,
      });
    });

    it('should carry no numeric band, mean, or range for a categorical baseline', () => {
      const model = toDivergenceChartModel(vendorRepresentationDivergence());

      expect(Object.keys(model).sort()).toEqual(
        ['categories', 'dimension', 'kind', 'minValueShare'].sort(),
      );
    });

    it('should say that no numeric range is drawn for a categorical baseline', () => {
      expect(analysisChartSummary(vendorRepresentationDivergence())).toContain(
        'A categorical Observed Baseline has no numeric range, so none is drawn.',
      );
    });
  });

  describe('dimension options', () => {
    it('should label each option with its dimension', () => {
      const [taskDuration, runtime] = workflowDivergences();

      expect(toAnalysisDimensionOptions([taskDuration, runtime])).toEqual([
        { divergenceId: taskDuration.id, label: 'Task duration' },
        { divergenceId: runtime.id, label: 'Workflow runtime' },
      ]);
    });

    it('should tell repeated dimensions apart by onset date', () => {
      const first = amountDivergence();
      const second = { ...amountDivergence(), id: 'second', onset: '2026-09-20T12:00:00.000Z' };

      expect(toAnalysisDimensionOptions([first, second]).map(o => o.label)).toEqual([
        'Amount (onset 2 Sep 2026)',
        'Amount (onset 20 Sep 2026)',
      ]);
    });

    it('should return no options without Divergences', () => {
      expect(toAnalysisDimensionOptions([])).toEqual([]);
    });
  });

  describe('side context and summaries', () => {
    it('should show counts, summaries, magnitude, and timing for a numeric Divergence', () => {
      expect(analysisContextFields(amountDivergence())).toEqual([
        {
          label: 'Evidence observations',
          value: '4 of 4 Evidence observations outside the Observed Baseline',
        },
        { label: 'Observed Baseline', value: 'Mean 1,000.00, range 950.00 to 1,050.00' },
        { label: 'Observed', value: 'Mean 1,500.00 across 4 observations' },
        { label: 'Magnitude', value: '+500.00 from baseline mean (+50%, +70.7 SD)' },
        { label: 'Onset', value: '2 Sep 2026, 12:00 UTC' },
        { label: 'Duration', value: '3 d 0 h' },
        { label: 'Latest observed', value: '5 Sep 2026, 12:00 UTC' },
      ]);
    });

    it('should count Evidence observations from their within-baseline flags', () => {
      expect(evidenceCountText(vendorRepresentationDivergence())).toBe(
        '3 of 3 Evidence observations outside the Observed Baseline',
      );
    });

    it('should name the chart by dimension and Identity Slice', () => {
      expect(analysisChartLabel(amountDivergence())).toBe(
        'Chart of Amount for Kappa Paper (synthetic) · Invoice: observed Evidence values over ' +
          'time against the Observed Baseline mean and range',
      );
      expect(analysisChartLabel(vendorRepresentationDivergence())).toBe(
        'Chart of Vendor representation for Kappa Paper (synthetic) · Invoice: share of each ' +
          'value in reference observations and in Evidence observations',
      );
    });

    it('should summarize the numeric chart in text', () => {
      expect(analysisChartSummary(amountDivergence())).toBe(
        'The chart plots 4 Evidence observations from 2 Sep 2026, 12:00 UTC to 5 Sep 2026, ' +
          '12:00 UTC. 4 are outside the Observed Baseline range of 950.00 to 1,050.00. Mean ' +
          '1,500.00 across 4 observations; Observed Baseline mean 1,000.00.',
      );
    });
  });

  describe('chart data table', () => {
    it('should list numeric Evidence with distance from the baseline mean', () => {
      const table = analysisTable(amountDivergence());

      expect(table.comparisonHeading).toBe('Distance from Observed Baseline mean');
      expect(table.rows[0]).toEqual({
        observationId: 'doc-c0',
        observedAt: '2 Sep 2026, 12:00 UTC',
        value: '1,500.00',
        comparison: '+500.00',
        position: 'Outside the Observed Baseline',
      });
      expect(table.rows.length).toBe(4);
    });

    it('should list categorical Evidence with the reference share of each value', () => {
      const table = analysisTable(vendorRepresentationDivergence());

      expect(table.comparisonHeading).toBe('Share of reference observations with this value');
      expect(table.rows.map(r => [r.value, r.comparison, r.position])).toEqual([
        ['KAPPA PAPER (SYNTHETIC)', '0%', 'Outside the Observed Baseline'],
        ['KAPPA PAPER (SYNTHETIC)', '0%', 'Outside the Observed Baseline'],
        ['KAPPA PAPER (SYNTHETIC)', '0%', 'Outside the Observed Baseline'],
      ]);
    });
  });

  it('should keep all analysis copy within CAV Level 1 wording', () => {
    const divergences = [amountDivergence(), vendorRepresentationDivergence(), ...workflowDivergences()];
    for (const divergence of divergences) {
      const copy = allCopy(divergence);
      for (const pattern of [...Object.values(CLAIM_GUARDRAIL_PATTERNS), SEVERITY_RISK_PATTERN]) {
        expect(copy).not.toMatch(pattern);
      }
    }
  });
});
