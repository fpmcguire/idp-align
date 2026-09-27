import { CLAIM_GUARDRAIL_PATTERNS } from '../src/testing/claim-guardrail-patterns';
import { claimText } from './support/claim-text';
import { expect, test } from './support/fixtures';

// R14: permanent routed Architecture view, top navigation, safe research links, accessibility.
const SECTION_HEADINGS = [
  'How IDP-Align works',
  'From observations to Evidence',
  'Population-specific Divergence',
  'What CAV Level 1 establishes',
  'Implemented and synthetic',
  'Source-independent by design',
  'Research provenance',
  'Future research',
  'Architectural principle',
];

const RESEARCH_LINKS = [
  ['Giebeler-Feuerschutz', 'https://start.docuware.com/case-studies/Giebeler-Feuerschutz'],
  ['Piening Personal', 'https://start.docuware.com/case-studies/piening'],
  ['Sport Auto Plus', 'https://start.docuware.com/case-studies/sport-auto-plus'],
] as const;

test.describe('Architecture', () => {
  test('loads directly at /architecture with landmarks and heading hierarchy', async ({ page }) => {
    await page.goto('/architecture');
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: 'Architecture' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(SECTION_HEADINGS);
    await expect(page.getByTestId('nav-architecture')).toHaveAttribute('aria-current', 'page');
  });

  test('is reachable from the top navigation with the correct active state', async ({ page }) => {
    await page.goto('/dashboard');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link')).toHaveText(['Dashboard', 'About', 'Architecture']);

    await nav.getByRole('link', { name: 'Architecture' }).click();
    await expect(page).toHaveURL(/\/architecture$/);
    await expect(page.getByTestId('nav-architecture')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('nav-about')).not.toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('nav-dashboard')).not.toHaveAttribute('aria-current', 'page');

    await nav.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByTestId('nav-architecture')).not.toHaveAttribute('aria-current', 'page');
  });

  test('shows the key sections, slice states, and boundary copy', async ({ page }) => {
    await page.goto('/architecture');
    await expect(page.getByRole('list', { name: 'Principal data flow' })).toBeVisible();
    const table = page.getByRole('table', { name: 'Synthetic Supplier x Invoice Identity Slices' });
    await expect(table).toBeVisible();
    await expect(page.getByTestId('supplier-slice-state')).toHaveText([
      'Surfaced Divergence',
      'No surfaced Divergence',
      'No surfaced Divergence',
      'No surfaced Divergence',
      'No surfaced Divergence',
    ]);
    await expect(page.getByTestId('supplier-slice-summary')).toHaveText(
      '5 Identity Slices observed / 1 with surfaced Divergence'
    );
    await expect(page.getByTestId('no-baseline-distinction')).toContainText(
      'distinguishes No surfaced Divergence from No Observed Baseline'
    );
    await expect(page.getByTestId('live-integration-boundary')).toContainText(
      'not a claim that live integration currently exists'
    );
    await expect(page.getByTestId('future-boundary')).toContainText('not currently implemented');
    await expect(page.locator('main')).not.toContainText(/interview|Production DocuWare integration/i);
  });

  test('claim copy stays within CAV Level 1', async ({ page }) => {
    await page.goto('/architecture');
    const { text } = await claimText(page.locator('main'));
    expect(text.length).toBeGreaterThan(100);
    for (const [name, pattern] of Object.entries(CLAIM_GUARDRAIL_PATTERNS)) {
      expect(text, name).not.toMatch(pattern);
    }
  });

  test('links the public research cases with safe external-link attributes', async ({ page }) => {
    await page.goto('/architecture');
    const links = page.getByTestId('research-cases').getByRole('link');
    await expect(links).toHaveCount(RESEARCH_LINKS.length);
    for (const [index, [name, href]] of RESEARCH_LINKS.entries()) {
      await expect(links.nth(index)).toHaveText(name);
      await expect(links.nth(index)).toHaveAttribute('href', href);
    }

    // Links are not followed; the guarded page aborts any external request.
    const external = page.locator('a[href^="http"]');
    await expect(page.getByTestId('cav-repo-link')).toHaveAttribute(
      'href',
      'https://github.com/fpmcguire/continuous-alignment-verification',
    );
    await expect(external).toHaveCount(RESEARCH_LINKS.length + 1);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /\bnoopener\b/);
      await expect(link).toHaveAttribute('rel', /\bnoreferrer\b/);
    }
  });

  test('keyboard Tab reaches the Architecture nav link and every page link without a trap', async ({ page }) => {
    await page.goto('/architecture');
    const reached: string[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      reached.push(await page.evaluate(() => document.activeElement?.textContent?.trim() ?? ''));
    }
    expect(reached).toContain('Architecture');
    for (const [name] of RESEARCH_LINKS) {
      expect(reached).toContain(name);
    }
    // Focus moved past the last page link, so it is not trapped on any one element.
    expect(new Set(reached).size).toBeGreaterThan(RESEARCH_LINKS.length + 1);
  });

  test('About links to the Architecture page', async ({ page }) => {
    await page.goto('/about');
    await page.getByTestId('architecture-page-link').click();
    await expect(page).toHaveURL(/\/architecture$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Architecture' })).toBeVisible();
  });
  for (const viewport of [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 800 },
  ]) {
    test(`flow diagrams keep step order without overlap or page overflow on ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/architecture');
      for (const [name, count] of [
        ['Principal data flow', 7],
        ["Today's observation source flow", 4],
        ['A possible future source flow', 4],
      ] as const) {
        const steps = page.getByRole('list', { name }).getByRole('listitem');
        await expect(steps).toHaveCount(count);
        const boxes = [];
        for (let i = 0; i < count; i++) {
          const box = await steps.nth(i).boundingBox();
          expect(box).not.toBeNull();
          boxes.push(box!);
        }
        // Consecutive steps advance down or to the right and never overlap.
        for (let i = 1; i < boxes.length; i++) {
          const [prev, next] = [boxes[i - 1], boxes[i]];
          const below = next.y >= prev.y + prev.height;
          const right = next.x >= prev.x + prev.width;
          expect(below || right).toBe(true);
        }
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
