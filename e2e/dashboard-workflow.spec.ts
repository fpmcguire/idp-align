import { cardSummaries, expect, openStream, test } from './support/fixtures';

// DS-001, DS-003, DS-004, DS-005, DS-007, DS-010, DS-014: Workflow stream path and stream independence.
test.describe('Workflow stream', () => {
  test('shows Workflow KPI cards with values', async ({ page }) => {
    await openStream(page, 'workflow');
    await expect(page.getByTestId('stream-heading')).toHaveText('Workflow stream');
    const value = (metric: string) => page.getByTestId(`kpi-card-workflow-${metric}`).getByTestId('kpi-value');
    await expect(value('total')).toHaveText('3');
    await expect(value('ongoing')).toHaveText('3');
    await expect(value('resolved')).toHaveText('0');
    await expect(value('identity-slices')).toHaveText('2 of 4');
    await expect(value('trend')).toHaveText('—');
    await expect(page.locator('[data-testid^="kpi-card-document-"]')).toHaveCount(0);
  });

  test('selects a Workflow Divergence and shows detail, Observed Baseline, and Evidence context', async ({ page }) => {
    await openStream(page, 'workflow');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 3 of 3 Divergences');
    expect(await cardSummaries(page)).toEqual([
      'Invoice approval (synthetic) · Approval / Task duration',
      'Invoice approval (synthetic) · Approval / Response time',
      'Invoice approval (synthetic) · Workflow runtime / Workflow runtime',
    ]);

    const card = page.getByTestId('divergence-card').nth(1);
    await card.click();
    await expect(card).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('[data-testid="divergence-card"][aria-current="true"]')).toHaveCount(1);

    const detail = page.getByTestId('detail-pane');
    await expect(detail.getByTestId('detail-dimension')).toContainText('Response time');
    await expect(detail.getByTestId('baseline-panel')).toContainText('Observed Baseline');
    await expect(detail.getByTestId('baseline-sample-size')).toContainText('reference observations');

    const items = detail.getByTestId('evidence-item');
    await expect(items).toHaveCount(6);
    const fields = items.first().getByTestId('evidence-context-field');
    await expect(fields.filter({ hasText: 'Step' })).toContainText('Approval');
    await expect(fields.filter({ hasText: 'Decision agent' })).toContainText('Finance approver role (synthetic)');
  });

  test('shows the runtime Instance state as factual Evidence context', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('divergence-card').nth(2).click();
    // Current replay data renders only "Completed" here (STEP-07 QA-031); "Failed" is not required.
    const state = page.getByTestId('evidence-context-field').filter({ hasText: 'Instance state' });
    await expect(state.first()).toBeVisible();
    await expect(state.first().locator('dd')).toHaveText('Completed');
  });

  test('keeps each stream’s selection and filters out of the other stream', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('divergence-card').nth(2).click();
    await page.getByTestId('filter-identity-slice').selectOption('workflow/invoice-approval-synthetic/runtime');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 1 of 3 Divergences');

    await page.getByTestId('stream-tab-document').click();
    await expect(page.getByTestId('stream-heading')).toHaveText('Document stream');
    await expect(page.getByTestId('filter-identity-slice')).toHaveValue('');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 1 of 1 Divergence');
    await expect(page.getByTestId('detail-identity-slice')).toHaveText('Alpha Office Supplies (synthetic) · Invoice');
    await expect(page.getByTestId('stream-panel')).not.toContainText('Invoice approval');
    await expect(page.locator('[data-testid^="kpi-card-workflow-"]')).toHaveCount(0);

    await page.getByTestId('stream-tab-workflow').click();
    await expect(page.getByTestId('filter-identity-slice')).toHaveValue('workflow/invoice-approval-synthetic/runtime');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 1 of 3 Divergences');
    await expect(page.getByTestId('detail-identity-slice')).toHaveText('Invoice approval (synthetic) · Workflow runtime');
    await expect(page.getByTestId('stream-panel')).not.toContainText('Alpha Office Supplies');
  });
});
