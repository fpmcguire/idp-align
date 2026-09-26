import { test as base, expect, Page } from '@playwright/test';

/**
 * Every browser spec uses this guarded page. Requests to any origin other than the local app are
 * aborted and recorded, and console errors and uncaught page errors are recorded. Each test fails
 * if either list is non-empty, so no flow can depend on external sites or pass with runtime errors.
 */
export const test = base.extend<{ page: Page }>({
  page: async ({ page, baseURL }, use) => {
    const appOrigin = new URL(baseURL!).origin;
    const externalRequests: string[] = [];
    const errors: string[] = [];

    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith('data:') || url.startsWith('blob:') || new URL(url).origin === appOrigin) {
        return route.continue();
      }
      externalRequests.push(url);
      return route.abort('blockedbyclient');
    });
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));

    await use(page);

    expect(externalRequests, 'no external network requests').toEqual([]);
    expect(errors, 'no console or page errors').toEqual([]);
  },
});

export { expect };

export const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  belowDesktop: { width: 1279, height: 800 },
  mobile: { width: 375, height: 812 },
} as const;

/** Opens the dashboard on the given stream and waits for its Divergence cards. */
export async function openStream(page: Page, stream: 'document' | 'workflow') {
  await page.goto('/dashboard');
  if (stream === 'workflow') await page.getByTestId('stream-tab-workflow').click();
  await expect(page.getByTestId('stream-tab-' + stream)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('divergence-card').first()).toBeVisible();
}

/** Visible Divergence cards as "Identity Slice / Dimension" strings, in list order. */
export function cardSummaries(page: Page) {
  return page
    .getByTestId('divergence-card')
    .evaluateAll(cards =>
      cards.map(
        card =>
          `${card.querySelector('[data-testid="card-identity-slice"]')?.textContent?.trim()} / ` +
          `${card.querySelector('[data-testid="card-dimension"]')?.textContent?.trim()}`
      )
    );
}
