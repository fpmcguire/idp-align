import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { CLAIM_GUARDRAIL_PATTERNS, FIXTURE_SECRET_PATTERNS } from '../src/testing/claim-guardrail-patterns';

// R10, D10: the durable research/reference artifact. Node-only checks; no browser is launched.
const DOC_PATH = 'mod-w/docs/research-references.md';
const doc = readFileSync(DOC_PATH, 'utf-8').replace(/\r\n/g, '\n');

const TOPICS = [
  'DocuWare AI Hub',
  'DocuWare Platform REST API',
  'DocuWare Workflow Analytics API',
  'Purchase-to-Pay / Invoice Processing',
  'Adjacent ML Drift Monitoring, Data Observability, And Streaming Drift Detection',
  'Canonical CAV Manifesto v1.0',
  'MOD-W Methodology',
];

/** Text of a "## " section, up to the next "## " heading. */
function section(heading: string) {
  const start = doc.indexOf(`\n## ${heading}\n`);
  expect(start, `section "${heading}" exists`).toBeGreaterThan(-1);
  const end = doc.indexOf('\n## ', start + 1);
  return doc.slice(start, end === -1 ? undefined : end);
}

interface SourceRow {
  topic: string;
  source: string;
  url: string;
  publisher: string;
  accessed: string;
  relevance: string;
  limits: string;
}

/** Source table rows under each "### N. Topic" heading in "Sources By Topic". */
function sourceRows(): SourceRow[] {
  const rows: SourceRow[] = [];
  let topic = '';
  for (const line of section('Sources By Topic').split('\n')) {
    const heading = /^### \d+\. (.+)$/.exec(line);
    if (heading) topic = heading[1].trim();
    if (!line.startsWith('|') || line.startsWith('| Source |') || line.startsWith('| ---')) continue;
    const [source, url, publisher, accessed, relevance, limits] = line.split('|').slice(1, -1).map(cell => cell.trim());
    rows.push({ topic, source, url, publisher, accessed, relevance, limits });
  }
  return rows;
}

test.describe('Research and references documentation', () => {
  test('covers every Product References topic with at least one consulted source', () => {
    const rows = sourceRows();
    expect([...new Set(rows.map(row => row.topic))]).toEqual(TOPICS);
  });

  test('records a public URL, publisher, access date, relevance, and limit for every source', () => {
    for (const row of sourceRows()) {
      expect(row.url, row.source).toMatch(/^https:\/\/[^\s]+$/);
      expect(row.publisher, row.source).not.toBe('');
      expect(row.accessed, row.source).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(row.relevance.length, row.source).toBeGreaterThan(40);
      expect(row.limits.length, row.source).toBeGreaterThan(20);
    }
  });

  test('cites both DocuWare API documentation pages linked from About', () => {
    const urls = sourceRows().map(row => row.url);
    expect(urls).toContain('https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api');
    expect(urls).toContain('https://knowledgecenter.docuware.com/docs/workflow-analytics-api');
  });

  test('contains no credentials or tenant hosts', () => {
    expect(doc).not.toMatch(FIXTURE_SECRET_PATTERNS.credentials);
    expect(doc).not.toMatch(FIXTURE_SECRET_PATTERNS.emailAddress);
    expect(doc).not.toMatch(/docuware\.cloud/i);
  });

  test('phrases every boundary statement as a negation', () => {
    const boundaries = section('Purpose And Boundaries')
      .split('\n')
      .filter(line => line.startsWith('- '));
    expect(boundaries.length).toBeGreaterThanOrEqual(6);
    for (const statement of boundaries) {
      expect(statement).toMatch(/\b(not|no|never|nothing|does not)\b/i);
    }
  });

  test('keeps IDP-Align relevance claims within CAV Level 1 and public-research framing', () => {
    // Relevance cells are IDP-Align claim copy. "Limits" cells may quote other tools' terms
    // (for example "anomaly detection") to contrast them, so they are not scanned here.
    const patterns = {
      ...CLAIM_GUARDRAIL_PATTERNS,
      crossStream: /cross[- ]stream|reconcil(?!iation of purchase)|correlat/i,
    };
    for (const row of sourceRows()) {
      for (const [name, pattern] of Object.entries(patterns)) {
        expect(row.relevance, `${row.source}: ${name}`).not.toMatch(pattern);
      }
    }
  });

  test('reports candidates not cited and the unrecorded pre-build research', () => {
    expect(section('Candidates Not Cited')).toMatch(/A Survey on Concept Drift Adaptation[^\n]*\|[^\n]*403/);
    expect(section('Unrecorded Pre-Build Research')).toMatch(/does not reconstruct them/);
  });
});
