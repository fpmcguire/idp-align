import { expect, openStream, test } from './support/fixtures';

// DS-015: Divergence Analysis open/back, focus, Workflow Approval metric switching, chart, stream switch.
test.describe('Divergence Analysis', () => {
  test('opens from the selected Divergence with focus on its heading and a rendered chart', async ({ page }) => {
    await openStream(page, 'document');
    await page.getByTestId('divergence-card').first().click();
    await page.getByTestId('open-analysis').click();

    const heading = page.getByRole('heading', { name: 'Divergence Analysis' });
    await expect(heading).toBeFocused();
    await expect(page.getByTestId('divergence-list')).toHaveCount(0);

    const analysis = page.getByTestId('divergence-analysis');
    await expect(analysis.getByTestId('analysis-identity-slice')).toHaveText('Alpha Office Supplies (synthetic) · Invoice');
    await expect(analysis.getByTestId('analysis-dimension')).toContainText('Amount');

    const canvas = page.getByTestId('divergence-chart-canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
    await expect(analysis.getByTestId('analysis-chart-summary')).not.toBeEmpty();
    await expect(analysis.getByTestId('analysis-table-row')).toHaveCount(4);
    await expect(analysis.getByTestId('analysis-context')).toContainText('Observed Baseline');
  });

  test('switches Workflow Approval metrics and returns focus on Back', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('divergence-card').first().click();
    await page.getByTestId('open-analysis').click();
    await expect(page.getByRole('heading', { name: 'Divergence Analysis' })).toBeFocused();

    const toggle = page.getByRole('group', { name: 'Dimension' });
    const taskDuration = toggle.getByRole('button', { name: 'Task duration' });
    const responseTime = toggle.getByRole('button', { name: 'Response time' });
    const caption = page.getByTestId('analysis-table').locator('caption');
    await expect(taskDuration).toHaveAttribute('aria-pressed', 'true');
    await expect(responseTime).toHaveAttribute('aria-pressed', 'false');
    await expect(caption).toHaveText('Chart data: Evidence observations for Task duration');

    await responseTime.click();
    await expect(responseTime).toHaveAttribute('aria-pressed', 'true');
    await expect(taskDuration).toHaveAttribute('aria-pressed', 'false');
    await expect(caption).toHaveText('Chart data: Evidence observations for Response time');
    await expect(page.getByTestId('divergence-analysis')).toHaveAttribute('data-divergence-id', /:response-time:/);
    await expect(page.getByTestId('analysis-table-row')).toHaveCount(6);
    await expect(page.getByTestId('divergence-chart-canvas')).toBeVisible();

    await page.getByTestId('analysis-back').click();
    await expect(page.getByTestId('analysis-view')).toHaveCount(0);
    await expect(page.getByTestId('open-analysis')).toBeFocused();
    // The metric chosen in the analysis stays selected in the list and detail view.
    await expect(page.locator('[data-testid="divergence-card"][aria-current="true"]')).toContainText('Response time');
    await expect(page.getByTestId('detail-dimension')).toContainText('Response time');
  });

  test('closes coherently when the stream changes', async ({ page }) => {
    await openStream(page, 'workflow');
    await page.getByTestId('divergence-card').first().click();
    await page.getByTestId('open-analysis').click();
    await expect(page.getByTestId('analysis-view')).toBeVisible();

    await page.getByTestId('stream-tab-document').click();
    await expect(page.getByTestId('analysis-view')).toHaveCount(0);
    await expect(page.getByTestId('divergence-list')).toBeVisible();
    await expect(page.getByTestId('stream-tab-document')).toBeFocused();

    await page.getByTestId('stream-tab-workflow').click();
    await expect(page.getByTestId('analysis-view')).toHaveCount(0);
    await expect(page.getByTestId('divergence-list')).toBeVisible();
    await expect(page.getByTestId('detail-dimension')).toContainText('Task duration');
  });
});
