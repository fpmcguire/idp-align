import { cardSummaries, expect, openStream, test } from './support/fixtures';

// DS-008, DS-011: filters, sorting, hidden selection, filtered-empty, clear filters, per-stream state.
const APPROVAL = 'workflow/invoice-approval-synthetic/approval';
const RUNTIME_CARD = 'Invoice approval (synthetic) · Workflow runtime / Workflow runtime';

test.describe('Filters and sorting', () => {
  test('Identity Slice and Status filters narrow the Workflow list without changing KPI counts', async ({ page }) => {
    await openStream(page, 'workflow');
    const clear = page.getByTestId('clear-filters');
    await expect(clear).toHaveAttribute('aria-disabled', 'true');

    await page.getByTestId('filter-identity-slice').selectOption(APPROVAL);
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 2 of 3 Divergences');
    expect(await cardSummaries(page)).toEqual([
      'Invoice approval (synthetic) · Approval / Task duration',
      'Invoice approval (synthetic) · Approval / Response time',
    ]);
    await expect(clear).not.toHaveAttribute('aria-disabled');
    await expect(page.getByTestId('kpi-card-workflow-total').getByTestId('kpi-value')).toHaveText('3');

    await page.getByTestId('filter-status').selectOption('ongoing');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 2 of 3 Divergences');

    await clear.click();
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 3 of 3 Divergences');
    await expect(page.getByTestId('filter-identity-slice')).toHaveValue('');
    await expect(page.getByTestId('filter-status')).toHaveValue('');
    await expect(clear).toHaveAttribute('aria-disabled', 'true');
    await expect(clear).toBeFocused();
  });

  test('Time range filter keeps the list and explains its scope', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('filter-timerange').selectOption('last-7-days');
    await expect(page.getByTestId('time-range-note')).toBeVisible();
    await expect(page.getByTestId('filter-timerange')).toHaveAttribute('aria-describedby', 'time-range-note');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 3 of 3 Divergences');
  });

  test('sorting reorders the Workflow list and restores the default order', async ({ page }) => {
    await openStream(page, 'workflow');
    const onsetOrder = await cardSummaries(page);

    await page.getByTestId('sort-select').selectOption('dimension');
    await expect(page.getByTestId('divergence-card').first().getByTestId('card-dimension')).toHaveText('Response time');
    expect(await cardSummaries(page)).toEqual([
      'Invoice approval (synthetic) · Approval / Response time',
      'Invoice approval (synthetic) · Approval / Task duration',
      RUNTIME_CARD,
    ]);

    await page.getByTestId('sort-select').selectOption('onset');
    await expect(page.getByTestId('divergence-card').first().getByTestId('card-dimension')).toHaveText('Task duration');
    expect(await cardSummaries(page)).toEqual(onsetOrder);
  });

  test('a selected Divergence hidden by filters is reported, then restored by Clear filters', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('divergence-card').nth(2).click();
    await page.getByTestId('filter-identity-slice').selectOption(APPROVAL);

    await expect(page.getByTestId('detail-hidden')).toBeVisible();
    await expect(page.getByTestId('divergence-card')).toHaveCount(2);
    await expect(page.locator('[data-testid="divergence-card"][aria-current="true"]')).toHaveCount(0);

    await page.getByTestId('clear-filters').click();
    await expect(page.getByTestId('detail-hidden')).toHaveCount(0);
    await expect(page.locator('[data-testid="divergence-card"][aria-current="true"]')).toContainText('Workflow runtime');
    await expect(page.getByTestId('detail-identity-slice')).toHaveText('Invoice approval (synthetic) · Workflow runtime');
  });

  test('a filter with no matches shows the filtered-empty state in the Document stream', async ({ page }) => {
    await openStream(page, 'document');
    await page.getByTestId('divergence-card').first().click();
    await page.getByTestId('filter-identity-slice').selectOption('document/beta-freight-services-synthetic/invoice');

    await expect(page.getByTestId('filtered-empty-state')).toBeVisible();
    await expect(page.getByTestId('filtered-empty-state')).toContainText('No matching Divergences');
    await expect(page.getByTestId('result-summary')).toHaveText(/0 of 1 Divergence/);
    await expect(page.getByTestId('detail-hidden')).toBeVisible();
    await expect(page.getByTestId('kpi-card-document-total').getByTestId('kpi-value')).toHaveText('1');

    await page.getByTestId('clear-filters').click();
    await expect(page.getByTestId('filtered-empty-state')).toHaveCount(0);
    await expect(page.getByTestId('divergence-card')).toHaveCount(1);
  });

  test('keeps filter and sort state per stream', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('sort-select').selectOption('dimension');
    await page.getByTestId('filter-identity-slice').selectOption(APPROVAL);

    await page.getByTestId('stream-tab-document').click();
    await expect(page.getByTestId('filter-identity-slice')).toHaveValue('');
    await expect(page.getByTestId('sort-select')).toHaveValue('onset');
    await page.getByTestId('filter-identity-slice').selectOption('document/beta-freight-services-synthetic/invoice');
    await expect(page.getByTestId('filtered-empty-state')).toBeVisible();

    await page.getByTestId('stream-tab-workflow').click();
    await expect(page.getByTestId('filter-identity-slice')).toHaveValue(APPROVAL);
    await expect(page.getByTestId('sort-select')).toHaveValue('dimension');
    await expect(page.getByTestId('result-summary')).toHaveText('Showing 2 of 3 Divergences');

    await page.getByTestId('stream-tab-document').click();
    await expect(page.getByTestId('filter-identity-slice')).toHaveValue('document/beta-freight-services-synthetic/invoice');
    await expect(page.getByTestId('filtered-empty-state')).toBeVisible();
  });
});
