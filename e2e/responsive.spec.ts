import { Page } from '@playwright/test';
import { expect, openStream, test, VIEWPORTS } from './support/fixtures';

// DS-001, DS-003, DS-015: 1280px side-by-side, 1279px stacked, 375px mobile, no page-level overflow.
// QA-028/QA-029 remain accepted carry-forward notes: this spec observes page overflow only.
async function expectNoHorizontalPageScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'page does not scroll horizontally').toBeLessThanOrEqual(0);
}

async function listAndDetailBoxes(page: Page) {
  const list = await page.getByTestId('divergence-list').boundingBox();
  const detail = await page.getByTestId('detail-pane').boundingBox();
  if (!list || !detail) throw new Error('list and detail must be rendered');
  return { list, detail };
}

test.describe('Responsive layout', () => {
  test('1280px places list and detail side by side', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    for (const stream of ['document', 'workflow'] as const) {
      await openStream(page, stream);
      const { list, detail } = await listAndDetailBoxes(page);
      expect(detail.x).toBeGreaterThanOrEqual(list.x + list.width);
      expect(Math.abs(detail.y - list.y)).toBeLessThan(2);
      await expectNoHorizontalPageScroll(page);
    }
  });

  test('1279px stacks detail below the list', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.belowDesktop);
    for (const stream of ['document', 'workflow'] as const) {
      await openStream(page, stream);
      const { list, detail } = await listAndDetailBoxes(page);
      expect(detail.y).toBeGreaterThanOrEqual(list.y + list.height);
      expect(Math.abs(detail.x - list.x)).toBeLessThan(2);
      await expectNoHorizontalPageScroll(page);
    }
  });

  test('375px renders tabs, KPIs, filters, cards, detail, and analysis without page overflow', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await openStream(page, 'workflow');
    for (const id of ['stream-tab-document', 'stream-tab-workflow', 'kpi-section', 'filter-bar', 'detail-pane']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
    await expect(page.getByTestId('divergence-card')).toHaveCount(3);
    await expectNoHorizontalPageScroll(page);

    await page.getByTestId('open-analysis').click();
    await expect(page.getByTestId('divergence-chart-canvas')).toBeVisible();
    await expect(page.getByTestId('analysis-table')).toBeVisible();
    await expectNoHorizontalPageScroll(page);

    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1, name: 'About IDP-Align' })).toBeVisible();
    await expectNoHorizontalPageScroll(page);
  });

  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`${name} (${viewport.width}px) Divergence Analysis has no page overflow`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openStream(page, 'workflow');
      await page.getByTestId('open-analysis').click();
      await expect(page.getByTestId('divergence-chart-canvas')).toBeVisible();
      await expectNoHorizontalPageScroll(page);
    });
  }
});
