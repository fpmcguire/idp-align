import { expect, test } from './support/fixtures';

// R10, R13: routed About view, PO-1 references, safe external links, current-state copy.
const REFERENCES = [
  ['DocuWare Platform REST API documentation', 'https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api'],
  ['DocuWare Workflow Analytics API documentation', 'https://knowledgecenter.docuware.com/docs/workflow-analytics-api'],
] as const;

test.describe('About', () => {
  test('is reachable from the navigation and returns to the Dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { level: 1, name: 'About IDP-Align' })).toBeVisible();
    await expect(page.getByTestId('nav-about')).toHaveAttribute('aria-current', 'page');

    await page.getByTestId('nav-dashboard').click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId('divergence-card').first()).toBeVisible();
  });

  test('links the public DocuWare API documentation with safe external-link attributes', async ({ page }) => {
    await page.goto('/about');
    const references = page.getByTestId('about-references');
    await expect(references.getByRole('heading', { name: 'References' })).toBeVisible();
    const links = references.getByRole('link');
    await expect(links).toHaveCount(REFERENCES.length);
    for (const [index, [name, href]] of REFERENCES.entries()) {
      const link = links.nth(index);
      await expect(link).toHaveText(name);
      await expect(link).toHaveAttribute('href', href);
    }

    // Every external link on the page: IDP-Align repository, CAV repository, MOD-W repository, the
    // two DocuWare references, and the author profile. Links are not followed.
    const external = page.locator('a[href^="http"]');
    await expect(external).toHaveCount(6);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /\bnoopener\b/);
      await expect(link).toHaveAttribute('rel', /\bnoreferrer\b/);
    }
    await expect(page.getByTestId('cav-repo-link')).toHaveAttribute(
      'href',
      'https://github.com/fpmcguire/continuous-alignment-verification'
    );
    await expect(page.getByTestId('mod-w-repo-link')).toHaveAttribute('href', 'https://github.com/fpmcguire/mod-w');
  });

  test('describes the current implementation without STEP-01-era wording', async ({ page }) => {
    await page.goto('/about');
    const article = page.locator('article');
    for (const stale of ['STEP-01', 'later Step', '(planned)', 'will be modeled', 'reserved regions']) {
      await expect(article).not.toContainText(stale);
    }
    await expect(page.getByTestId('about-dashboard')).toContainText('The dashboard observes two independent streams');
    await expect(page.getByTestId('detection-rules')).toBeVisible();
    await expect(page.getByTestId('about-architecture').getByTestId('architecture-page-link')).toHaveAttribute(
      'href',
      '/architecture'
    );
    await expect(page.getByTestId('independence-notice')).toContainText('not affiliated with, reviewed by, or endorsed by DocuWare');
  });
});
