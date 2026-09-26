import { expect, openStream, test } from './support/fixtures';

// DS-002: accessible stream selector tabs (APG tabs pattern with roving tabindex).
test.describe('Stream tabs', () => {
  test('expose tab roles and wire the active tab to the rendered panel', async ({ page }) => {
    await openStream(page, 'document');
    const tablist = page.getByRole('tablist', { name: 'Streams' });
    await expect(tablist.getByRole('tab')).toHaveCount(2);

    const documentTab = page.getByRole('tab', { name: 'Document stream' });
    const workflowTab = page.getByRole('tab', { name: 'Workflow stream' });
    await expect(documentTab).toHaveAttribute('aria-selected', 'true');
    await expect(documentTab).toHaveAttribute('tabindex', '0');
    await expect(documentTab).toHaveAttribute('aria-controls', 'stream-panel-document');
    await expect(workflowTab).toHaveAttribute('aria-selected', 'false');
    await expect(workflowTab).toHaveAttribute('tabindex', '-1');
    await expect(workflowTab).not.toHaveAttribute('aria-controls');

    const panel = page.getByRole('tabpanel');
    await expect(panel).toHaveAttribute('id', 'stream-panel-document');
    await expect(panel).toHaveAttribute('aria-labelledby', 'stream-tab-document');
  });

  test('support arrow, Home, and End keys with focus kept on the active tab', async ({ page }) => {
    await openStream(page, 'document');
    const documentTab = page.getByRole('tab', { name: 'Document stream' });
    const workflowTab = page.getByRole('tab', { name: 'Workflow stream' });
    await documentTab.focus();

    await page.keyboard.press('ArrowRight');
    await expect(workflowTab).toBeFocused();
    await expect(workflowTab).toHaveAttribute('aria-selected', 'true');
    await expect(workflowTab).toHaveAttribute('tabindex', '0');
    await expect(documentTab).toHaveAttribute('tabindex', '-1');
    await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'stream-tab-workflow');
    await expect(page.getByTestId('stream-heading')).toHaveText('Workflow stream');

    await page.keyboard.press('ArrowRight'); // wraps to the first tab
    await expect(documentTab).toBeFocused();
    await expect(documentTab).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowLeft'); // wraps to the last tab
    await expect(workflowTab).toBeFocused();

    await page.keyboard.press('Home');
    await expect(documentTab).toBeFocused();
    await expect(documentTab).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('End');
    await expect(workflowTab).toBeFocused();
    await expect(workflowTab).toHaveAttribute('aria-selected', 'true');
  });

  test('keep focus on the tab after a pointer switch', async ({ page }) => {
    await openStream(page, 'document');
    const workflowTab = page.getByRole('tab', { name: 'Workflow stream' });
    await workflowTab.click();
    await expect(workflowTab).toBeFocused();
    await expect(page.getByTestId('stream-heading')).toHaveText('Workflow stream');
  });
});
