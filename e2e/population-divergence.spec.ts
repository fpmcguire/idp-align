import { CLAIM_GUARDRAIL_PATTERNS, SEVERITY_RISK_PATTERN } from '../src/testing/claim-guardrail-patterns';
import { claimText } from './support/claim-text';
import { expect, openStream, test } from './support/fixtures';

// STEP-09 demo path, Supplier Invoice Population Divergence. DS-003, DS-004, DS-005, DS-006, DS-007,
// DS-008, DS-009, DS-015: five fictional Supplier x Invoice Identity Slices, one surfaced Divergence.
const ALPHA = 'Alpha Office Supplies (synthetic) · Invoice';
const PEERS = [
  'Beta Freight Services (synthetic) · Invoice',
  'Delta Packaging Supplies (synthetic) · Invoice',
  'Epsilon Print Services (synthetic) · Invoice',
  'Gamma Facilities Care (synthetic) · Invoice',
];
const UNSUPPORTED_POPULATION_CLAIMS = /\bstab(le|ility)|\bnormal\b|healthy|\bcorrect|incorrect/i;

test.describe('Supplier Invoice Population Divergence', () => {
  test('summarizes the invoice population and lists each Identity Slice state', async ({ page }) => {
    await openStream(page, 'document');

    await expect(page.getByTestId('population-summary')).toHaveText([
      'Invoice: 5 Identity Slices observed / 1 with surfaced Divergence',
      'Credit note: 3 Identity Slices observed / 0 with surfaced Divergence',
    ]);

    const states = page.getByTestId('identity-slice-states');
    await expect(states.getByRole('heading', { name: 'Identity Slice states' })).toBeVisible();
    const rows = states.getByTestId('slice-state-row');
    await expect(rows).toHaveCount(8);
    await expect(rows.getByTestId('slice-state-label').first()).toHaveText(ALPHA);
    await expect(rows.first().getByTestId('slice-state-value')).toHaveText('1 surfaced Divergence');
    for (const peer of PEERS) {
      const row = rows.filter({ has: page.getByRole('rowheader', { name: peer }) });
      await expect(row.getByTestId('slice-state-value')).toHaveText('No surfaced Divergence');
    }
  });

  test('surfaces the Alpha invoice Divergence with Evidence and analysis', async ({ page }) => {
    await openStream(page, 'document');
    await page.getByTestId('filter-identity-slice').selectOption({ label: ALPHA });
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 1 of 1 Divergence');

    const detail = page.getByTestId('detail-pane');
    await expect(detail.getByTestId('detail-identity-slice')).toHaveText(ALPHA);
    await expect(detail.getByTestId('baseline-sample-size')).toContainText('8 reference observations');
    await expect(detail.getByTestId('evidence-item')).toHaveCount(4);

    await page.getByTestId('open-analysis').click();
    const analysis = page.getByTestId('divergence-analysis');
    await expect(analysis.getByTestId('analysis-identity-slice')).toHaveText(ALPHA);
    await expect(page.getByTestId('divergence-chart-canvas')).toBeVisible();
    await expect(analysis.getByTestId('analysis-table-row')).toHaveCount(4);
  });

  test('shows no Divergence when filtered to each peer supplier population', async ({ page }) => {
    await openStream(page, 'document');
    for (const peer of PEERS) {
      await page.getByTestId('filter-identity-slice').selectOption({ label: peer });
      await expect(page.getByTestId('filtered-empty-state')).toBeVisible();
      await expect(page.getByTestId('divergence-card')).toHaveCount(0);
      await expect(page.getByTestId('detail-empty')).toBeVisible();
    }
    await expect(page.getByTestId('population-summary').first()).toHaveText(
      'Invoice: 5 Identity Slices observed / 1 with surfaced Divergence',
    );
  });

  test('keeps population copy factual in both streams', async ({ page }) => {
    for (const stream of ['document', 'workflow'] as const) {
      await openStream(page, stream);
      for (const testId of ['population-summaries', 'identity-slice-states']) {
        const { text } = await claimText(page.getByTestId(testId));
        expect(text.length, `${stream} ${testId} has copy`).toBeGreaterThan(20);
        expect(text).not.toMatch(UNSUPPORTED_POPULATION_CLAIMS);
        expect(text).not.toMatch(SEVERITY_RISK_PATTERN);
        for (const pattern of Object.values(CLAIM_GUARDRAIL_PATTERNS)) {
          expect(text).not.toMatch(pattern);
        }
      }
    }
    await expect(page.getByTestId('population-summary')).toHaveText([
      'Invoice approval (synthetic): 4 Identity Slices observed / 2 with surfaced Divergence',
    ]);
  });
});
