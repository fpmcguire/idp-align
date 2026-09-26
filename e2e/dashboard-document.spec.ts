import { expect, openStream, test } from './support/fixtures';

// DS-001, DS-003, DS-004, DS-005, DS-006, DS-007, DS-009, DS-013, DS-014: Document stream path.
test.describe('Document stream', () => {
  test('redirects to the dashboard and opens on the Document stream', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1, name: 'IDP-Align Dashboard' })).toBeVisible();
    await expect(page.getByText('CAV Level 1 — Observed-State Divergence')).toBeVisible();
    await expect(page.getByTestId('stream-tab-document')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('stream-heading')).toHaveText('Document stream');
    await expect(page.getByTestId('stream-replay-source')).toContainText('synthetic document observations');
  });

  test('shows Document KPI cards with values', async ({ page }) => {
    await openStream(page, 'document');
    const kpis = page.getByTestId('kpi-section');
    const value = (metric: string) => page.getByTestId(`kpi-card-document-${metric}`).getByTestId('kpi-value');
    await expect(value('total')).toHaveText('1');
    await expect(value('ongoing')).toHaveText('1');
    await expect(value('resolved')).toHaveText('0');
    await expect(value('identity-slices')).toHaveText('1 of 6');
    await expect(value('trend')).toHaveText('—');
    await expect(page.getByTestId('kpi-card-document-trend')).toContainText('Not charted here');
    await expect(kpis.locator('[data-testid^="kpi-card-document-"]')).toHaveCount(5);
    await expect(page.getByTestId('kpi-scope-note')).toBeVisible();
  });

  test('selects a Divergence card and shows detail, Observed Baseline, and Evidence', async ({ page }) => {
    await openStream(page, 'document');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 1 of 1 Divergence');

    const card = page.getByTestId('divergence-card').first();
    await card.click();
    await expect(card).toHaveAttribute('aria-current', 'true');
    await expect(card.getByTestId('card-identity-slice')).toHaveText('Alpha Office Supplies (synthetic) · Invoice');
    await expect(card.getByTestId('status-badge')).toHaveText('Ongoing');

    const detail = page.getByTestId('detail-pane');
    await expect(detail.getByTestId('detail-identity-slice')).toHaveText('Alpha Office Supplies (synthetic) · Invoice');
    await expect(detail.getByTestId('detail-dimension')).toContainText('Amount');

    const baseline = detail.getByTestId('baseline-panel');
    await expect(baseline).toContainText('Observed Baseline');
    await expect(baseline.getByTestId('baseline-method')).toContainText('Mean ±');
    await expect(baseline.getByTestId('baseline-reference-window')).toContainText('3 Aug 2026');
    await expect(baseline.getByTestId('baseline-sample-size')).toContainText('8 reference observations');

    const trace = detail.getByTestId('evidence-trace');
    await expect(trace.getByTestId('evidence-trace-note')).toHaveText('4 supporting observations, oldest first.');
    await expect(trace.getByTestId('evidence-item')).toHaveCount(4);
    const first = trace.getByTestId('evidence-item').first();
    await expect(first.getByTestId('evidence-time')).not.toBeEmpty();
    await expect(first.getByTestId('evidence-value')).not.toBeEmpty();
    await expect(first.getByTestId('evidence-source')).not.toBeEmpty();
    await expect(first.getByTestId('evidence-baseline-indicator')).toHaveText(/Observed Baseline$/);
    await expect(first.getByTestId('evidence-context-field').filter({ hasText: 'Currency' })).toContainText('EUR');
  });
});
