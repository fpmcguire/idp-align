import { Locator } from '@playwright/test';

/** Source-state labels an "Instance state" Evidence context field may show (divergence-format.ts). */
export const SOURCE_STATE_LABELS = ['Completed', 'Running', 'Failed', 'Stopped'] as const;

/** Any "fail" wording. Allowed only as a source-state value in the exact Instance state context. */
export const FAIL_WORDING = /\bfail(ed|ure|ures|s|ing)?\b/i;

export interface ClaimText {
  /** Rendered text with boundary statements and allowed source-state fields removed. */
  text: string;
  /** "Instance state" source-state fields removed from the text, as "label: value". */
  sourceStateFields: string[];
}

/**
 * Collects claim copy from a rendered subtree. Boundary statements ([data-boundary], negations such
 * as "does not implement Attribution") are removed, as in the About spec. An Evidence context field
 * is removed only when its label is exactly "Instance state" and its value is exactly one of the
 * source-state labels, so a factual "Failed" source state is allowed while judgment wording such
 * as "failure" anywhere, or "Failed" in any other context, stays in the checked text.
 */
export async function claimText(root: Locator): Promise<ClaimText> {
  return root.evaluate(
    (element, sourceStates) => {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[data-boundary]').forEach(node => node.remove());

      const sourceStateFields: string[] = [];
      clone.querySelectorAll('[data-testid="evidence-context-field"]').forEach(field => {
        const label = field.querySelector('dt')?.textContent?.trim();
        const value = field.querySelector('dd')?.textContent?.trim() ?? '';
        if (label === 'Instance state' && sourceStates.includes(value)) {
          sourceStateFields.push(`${label}: ${value}`);
          field.remove();
        }
      });

      // Separate every text node so word-boundary patterns apply across adjacent elements.
      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      const parts: string[] = [];
      while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? '');
      return { text: parts.join(' ').replace(/\s+/g, ' ').trim(), sourceStateFields };
    },
    [...SOURCE_STATE_LABELS] as string[]
  );
}
