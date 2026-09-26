import { Locator, Page } from '@playwright/test';
import { CLAIM_GUARDRAIL_PATTERNS, SEVERITY_RISK_PATTERN } from '../src/testing/claim-guardrail-patterns';
import { claimText, FAIL_WORDING } from './support/claim-text';
import { expect, openStream, test } from './support/fixtures';

// R5, R9: CAV Level 1 claim guardrails on rendered copy. Patterns are imported from src/testing
// (test-only helpers); production code never imports them.
const GUARDRAILS: Record<string, RegExp> = {
  ...CLAIM_GUARDRAIL_PATTERNS,
  severityOrRisk: SEVERITY_RISK_PATTERN,
  crossStream: /cross[- ]stream|reconcil|correlat/i,
  baselineAsTarget: /Observed Baseline (is|as) (the |a )?(target|intended|policy|requirement|expected value)/i,
};

async function expectNoOverclaims(root: Locator, where: string) {
  const { text } = await claimText(root);
  expect(text.length, `${where} has claim copy to check`).toBeGreaterThan(100);
  for (const [name, pattern] of Object.entries(GUARDRAILS)) {
    expect(text, `${where}: ${name}`).not.toMatch(pattern);
  }
  expect(text, `${where}: fail wording outside Instance state`).not.toMatch(FAIL_WORDING);
}

/** Selects each Divergence in turn and checks the list, detail, and Evidence copy for it. */
async function checkEveryDivergence(page: Page, where: string) {
  const cards = page.getByTestId('divergence-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index++) {
    await cards.nth(index).click();
    await expect(cards.nth(index)).toHaveAttribute('aria-current', 'true');
    await expectNoOverclaims(page.locator('main'), `${where} Divergence ${index + 1}, list and detail`);
    await page.getByTestId('open-analysis').click();
    await expect(page.getByTestId('divergence-analysis')).toBeVisible();
    await expectNoOverclaims(page.locator('main'), `${where} Divergence ${index + 1}, analysis`);
    await page.getByTestId('analysis-back').click();
    await expect(page.getByTestId('divergence-list')).toBeVisible();
  }
}

test.describe('CAV Level 1 claim guardrails', () => {
  test('About claim copy stays within CAV Level 1 and the public-research framing', async ({ page }) => {
    await page.goto('/about');
    await expectNoOverclaims(page.locator('main'), 'About');
  });

  test('Document stream copy makes no overclaims', async ({ page }) => {
    await openStream(page, 'document');
    await checkEveryDivergence(page, 'Document');
  });

  test('Workflow stream copy makes no overclaims; Instance state is factual source context', async ({ page }) => {
    await openStream(page, 'workflow');
    await checkEveryDivergence(page, 'Workflow');

    // Prove the context rule is exercised on real replay data: the runtime Divergence renders an
    // "Instance state" field (currently "Completed", STEP-07 QA-031), and the helper removes it
    // only through the exact source-state rule. "Failed" is not required to render.
    await page.getByTestId('divergence-card').nth(2).click();
    const { sourceStateFields } = await claimText(page.locator('main'));
    expect(sourceStateFields.length).toBeGreaterThan(0);
    expect(new Set(sourceStateFields)).toEqual(new Set(['Instance state: Completed']));
  });

  test.describe('contextual fail-wording controls (synthetic, no replay data)', () => {
    const field = (label: string, value: string) =>
      `<div data-testid="evidence-context-field"><dt>${label}</dt><dd>${value}</dd></div>`;

    async function controlText(page: Page, html: string) {
      await page.setContent(`<main><p>Evidence for one Identity Slice and Dimension.</p><dl>${html}</dl></main>`);
      return claimText(page.locator('main'));
    }

    test('accepts "Failed" as a factual source-state value under Instance state', async ({ page }) => {
      const result = await controlText(page, field('Instance state', 'Failed'));
      expect(result.sourceStateFields).toEqual(['Instance state: Failed']);
      expect(result.text).not.toMatch(FAIL_WORDING);
    });

    test('rejects failure wording in Divergence copy', async ({ page }) => {
      await page.setContent('<main><p>Divergence failure</p></main>');
      const result = await claimText(page.locator('main'));
      expect(result.text).toMatch(FAIL_WORDING);
      expect(result.text).toMatch(CLAIM_GUARDRAIL_PATTERNS.businessJudgment);
    });

    test('rejects judgment wording even under the Instance state label', async ({ page }) => {
      const result = await controlText(page, field('Instance state', 'failure of approval'));
      expect(result.sourceStateFields).toEqual([]);
      expect(result.text).toMatch(FAIL_WORDING);
    });

    test('rejects "Failed" outside the exact Instance state context', async ({ page }) => {
      const result = await controlText(page, field('Approval outcome', 'Failed'));
      expect(result.sourceStateFields).toEqual([]);
      expect(result.text).toMatch(FAIL_WORDING);
    });
  });
});
