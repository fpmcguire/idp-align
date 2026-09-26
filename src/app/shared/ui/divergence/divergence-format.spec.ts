import { CLAIM_GUARDRAIL_PATTERNS } from '../../../../testing/claim-guardrail-patterns';
import {
  amountDivergence,
  taskOutcomeDivergence,
  vendorRepresentationDivergence,
  workflowDivergences,
} from '../../../../testing/divergence-builders';
import { DIVERGENCE_STATUSES } from '../../../domain/divergence';
import {
  INSTANCE_STATE_LABELS,
  STATUS_DESCRIPTIONS,
  STATUS_LABELS,
  baselineMethodText,
  baselineSummaryText,
  comparedValueLabel,
  evidenceContextFields,
  formatCategoricalValue,
  formatDimensionValue,
  formatDuration,
  formatSignedDifference,
  formatUtc,
  magnitudeText,
  observedDetailText,
  observedSummaryText,
} from './divergence-format';

const MINUTE = 60_000;

describe('Divergence display formatting', () => {
  it('should format durations in whole minutes, hours, and days', () => {
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(12 * MINUTE)).toBe('12 min');
    expect(formatDuration((22 * 60 + 49) * MINUTE)).toBe('22 h 49 min');
    expect(formatDuration((2 * 24 * 60 + 3 * 60 + 20) * MINUTE)).toBe('2 d 3 h');
  });

  it('should format values by dimension unit', () => {
    expect(formatDimensionValue('amount-value', 1540)).toBe('1,540.00');
    expect(formatDimensionValue('task-duration', 90 * MINUTE)).toBe('1 h 30 min');
    expect(formatDimensionValue('amount-currency', 'EUR')).toBe('EUR');
  });

  it('should spell out task outcome values', () => {
    expect(formatCategoricalValue('decision:Release')).toBe('Decision: Release');
    expect(formatCategoricalValue('error-exit:Payment export error exit')).toBe(
      'Error exit: Payment export error exit',
    );
  });

  it('should sign differences explicitly', () => {
    expect(formatSignedDifference('amount-value', 500)).toBe('+500.00');
    expect(formatSignedDifference('task-duration', -30 * MINUTE)).toBe('−30 min');
  });

  it('should format timestamps in UTC', () => {
    expect(formatUtc('2026-08-31T15:00:00.000Z')).toBe('31 Aug 2026, 15:00 UTC');
  });

  describe('numeric Divergence text', () => {
    const divergence = amountDivergence();

    it('should summarize observed, baseline, and magnitude values from the record', () => {
      expect(observedSummaryText(divergence)).toBe('Mean 1,500.00 across 4 observations');
      expect(observedDetailText(divergence)).toBe('Min 1,500.00, max 1,500.00, latest 1,500.00');
      expect(baselineSummaryText(divergence.baseline)).toBe(
        'Mean 1,000.00, range 950.00 to 1,050.00',
      );
      expect(magnitudeText(divergence)).toBe('+500.00 from baseline mean (+50%, +70.7 SD)');
    });

    it('should describe the numeric baseline method from its recorded rule', () => {
      expect(baselineMethodText(divergence.baseline)).toBe(
        'Mean ± the larger of 3 standard deviations or 5% of the mean',
      );
    });
  });

  describe('categorical Divergence text', () => {
    const divergence = vendorRepresentationDivergence();

    it('should summarize observed and baseline representations without matching claims', () => {
      expect(observedSummaryText(divergence)).toBe(
        'KAPPA PAPER (SYNTHETIC) in 100% of 3 observations',
      );
      expect(baselineSummaryText(divergence.baseline)).toBe(
        'Kappa Paper (synthetic) in 100% of reference observations',
      );
      expect(magnitudeText(divergence)).toBe(
        'KAPPA PAPER (SYNTHETIC) seen in 0% of reference observations',
      );
    });

    it('should describe the categorical baseline method from its recorded rule', () => {
      expect(baselineMethodText(divergence.baseline)).toBe(
        'Reference frequency distribution; values seen in less than 10% of reference ' +
          'observations are outside the Observed Baseline',
      );
    });
  });

  describe('Evidence context fields', () => {
    it('should list document context', () => {
      const [item] = amountDivergence().evidence.items;

      expect(evidenceContextFields(item.context).map(f => f.label)).toEqual([
        'Vendor',
        'Document type',
        'Currency',
        'Document date',
      ]);
    });

    it('should list workflow task and runtime context as observed fields only', () => {
      const [task, runtime] = workflowDivergences();

      expect(evidenceContextFields(task.evidence.items[0].context)).toEqual([
        { label: 'Workflow instance', value: 'wf-c0' },
        { label: 'Step', value: 'Approval' },
        { label: 'Decision', value: 'Approve' },
        { label: 'Decision agent', value: 'Test approver role (synthetic)' },
      ]);
      expect(evidenceContextFields(runtime.evidence.items[0].context)).toEqual([
        { label: 'Workflow instance', value: 'wf-c0' },
        { label: 'Instance state', value: 'Completed' },
      ]);
    });

    it('should show workflow instance states as the source names them', () => {
      expect(INSTANCE_STATE_LABELS).toEqual({
        completed: 'Completed',
        running: 'Running',
        failed: 'Failed',
        stopped: 'Stopped',
      });
    });

    it('should list a workflow error exit as observed context without a decision agent', () => {
      const [item] = taskOutcomeDivergence().evidence.items;

      expect(evidenceContextFields(item.context)).toEqual([
        { label: 'Workflow instance', value: 'task-c0' },
        { label: 'Step', value: 'Approval' },
        { label: 'Error exit', value: 'Test error exit (synthetic)' },
      ]);
    });
  });

  describe('compared value label', () => {
    it('should name the dimension each Evidence value was compared on, in both streams', () => {
      expect(comparedValueLabel('amount-value')).toBe('Amount (compared value)');
      expect(comparedValueLabel('vendor-representation')).toBe(
        'Vendor representation (compared value)',
      );
      expect(comparedValueLabel('task-duration')).toBe('Task duration (compared value)');
      expect(comparedValueLabel('response-time')).toBe('Response time (compared value)');
      expect(comparedValueLabel('task-outcome')).toBe('Decision or route outcome (compared value)');
      expect(comparedValueLabel('workflow-runtime')).toBe('Workflow runtime (compared value)');
    });

    it('should not present the compared value as a target', () => {
      for (const dimension of [
        'amount-value',
        'vendor-representation',
        'task-duration',
        'response-time',
        'task-outcome',
        'workflow-runtime',
      ] as const) {
        expect(comparedValueLabel(dimension)).not.toMatch(/target|expected|intended|required/i);
      }
    });
  });

  describe('workflow categorical Divergence text (spec-only; replay data has none)', () => {
    const divergence = taskOutcomeDivergence();

    it('should summarize the observed error exit and the reference decision', () => {
      expect(observedSummaryText(divergence)).toBe(
        'Error exit: Test error exit (synthetic) in 100% of 3 observations',
      );
      expect(baselineSummaryText(divergence.baseline)).toBe(
        'Decision: Approve in 100% of reference observations',
      );
      expect(magnitudeText(divergence)).toBe(
        'Error exit: Test error exit (synthetic) seen in 0% of reference observations',
      );
    });

    it('should keep workflow categorical text within the claim guardrails', () => {
      const text = [
        observedSummaryText(divergence),
        observedDetailText(divergence),
        baselineSummaryText(divergence.baseline),
        magnitudeText(divergence),
        baselineMethodText(divergence.baseline),
      ].join(' ');

      for (const pattern of Object.values(CLAIM_GUARDRAIL_PATTERNS)) {
        expect(text).not.toMatch(pattern);
      }
      expect(text).not.toMatch(/caus|because|due to|attribut|root/i);
    });
  });

  describe('status wording', () => {
    it('should label all statuses', () => {
      expect(DIVERGENCE_STATUSES.map(s => STATUS_LABELS[s])).toEqual([
        'Ongoing',
        'Reviewed',
        'Resolved',
        'Muted',
      ]);
    });

    // QA-019: resolved is a lifecycle status; the resolving observation is not in the Evidence.
    it('should present resolved only as a finding lifecycle status', () => {
      const text = STATUS_DESCRIPTIONS.resolved;

      expect(text).toContain('finding lifecycle status');
      expect(text).toContain('That observation is not listed in the Evidence trace.');
      expect(text).not.toMatch(/remediat|fix|correct|converg|success|business/i);
    });

    it('should keep all status wording within the claim guardrails', () => {
      const text = Object.values(STATUS_DESCRIPTIONS).join(' ');

      for (const pattern of Object.values(CLAIM_GUARDRAIL_PATTERNS)) {
        expect(text).not.toMatch(pattern);
      }
    });
  });
});
