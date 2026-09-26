import { defineConfig, devices } from '@playwright/test';

const port = 4300;
const baseURL = `http://127.0.0.1:${port}`;

/**
 * IDP-Align E2E runs against the production build, served locally by a zero-dependency static
 * server (e2e/support/serve-dist.mjs). Chromium is the gate browser.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* No retries: a flaky test must fail rather than pass on a second attempt. */
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && node e2e/support/serve-dist.mjs`,
    url: baseURL,
    env: { E2E_PORT: String(port) },
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
