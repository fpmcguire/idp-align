import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CLAIM_GUARDRAIL_PATTERNS } from '../../../testing/claim-guardrail-patterns';
import { mapDocumentReplay } from '../../data/replay/document-replay.mapper';
import { DOCUMENT_REPLAY_FIXTURE } from '../../data/replay/fixtures/document-replay.fixture';
import { detectStreamDivergences } from '../../domain/divergence-detection';
import { toIdentitySliceStates } from '../dashboard/identity-slice-states';
import { ArchitectureComponent } from './architecture.component';

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

// Boundary statements are marked with [data-boundary], as on About. Overclaim checks scan the
// remaining claim copy, so "does not establish failure" and "not currently implemented" are allowed.
const OVERCLAIM_PATTERNS: Record<string, RegExp> = {
  ...CLAIM_GUARDRAIL_PATTERNS,
  interviewFraming: /interview|interviewer|employer|hiring|September 28/i,
  nonCanonicalCurrentTerms: /\balert|\banomal|violation|\bbreach|\bintent\b|\bintention|Alignment Delta|\b(an?|the) delta\b/i,
  liveIntegrationClaim: /connects? to DocuWare|live (DocuWare )?integration (is )?(available|implemented)|Production DocuWare integration/i,
  customersFraming: /customer case stud|DocuWare customers?\b/i,
};

// Wording that must never describe the No surfaced Divergence state.
const NO_DIVERGENCE_JUDGMENT = /\b(normal|stable|healthy|correct|aligned)\b/i;

/** Invoice Identity Slices derived from the replay fixture through the Dashboard's detection path. */
function fixtureInvoiceSliceStates() {
  const { slices, observations } = mapDocumentReplay(DOCUMENT_REPLAY_FIXTURE.records);
  return toIdentitySliceStates(slices, observations, detectStreamDivergences(slices, observations)).filter(
    state => state.population === 'Invoice',
  );
}

const STATE_WORDING = {
  'surfaced-divergence': 'Surfaced Divergence',
  'no-surfaced-divergence': 'No surfaced Divergence',
  'no-observed-baseline': 'No Observed Baseline',
} as const;

describe('ArchitectureComponent', () => {
  let fixture: ComponentFixture<ArchitectureComponent>;
  let el: HTMLElement;
  let content: string;

  const text = (node: Element | null | undefined) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const section = (id: string) => text(el.querySelector(`[data-testid="${id}"]`));
  const claimText = () => {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-boundary]').forEach(b => b.remove());
    return text(clone);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ArchitectureComponent] }).compileComponents();
    fixture = TestBed.createComponent(ArchitectureComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    content = text(el);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('structure and semantic diagrams', () => {
    it('should render one h1 and one h2 per required content area, in order', () => {
      const h1s = el.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
      expect(text(h1s[0])).toBe('Architecture');
      expect(Array.from(el.querySelectorAll('h2')).map(text)).toEqual(SECTION_HEADINGS);
    });

    it('should render every flow as an ordered list with an accessible label', () => {
      const flows = Array.from(el.querySelectorAll('ol'));
      expect(flows.length).toBe(3);
      for (const flow of flows) {
        expect(flow.getAttribute('aria-label')).toBeTruthy();
      }
      expect(Array.from(el.querySelectorAll('[data-testid="principal-flow"] li')).map(text)).toEqual([
        'Synthetic IDP-shaped replay',
        'StreamObservationRepository',
        'Domain mapping',
        'Identity Slices + Observations',
        'CAV Level 1 detection against per-slice Observed Baselines',
        'Divergences + Evidence',
        'Dashboard + Divergence Analysis',
      ]);
    });

    it('should render the Identity Slice states as a captioned table with header cells', () => {
      const table = el.querySelector('[data-testid="supplier-slice-states"]')!;
      expect(table.tagName).toBe('TABLE');
      expect(text(table.querySelector('caption'))).toBe('Synthetic Supplier x Invoice Identity Slices');
      expect(Array.from(table.querySelectorAll('thead th')).map(text)).toEqual(['Identity Slice', 'State']);
      expect(table.querySelectorAll('tbody th[scope="row"]').length).toBe(5);
    });

    it('should render research cases as a definition list', () => {
      const cases = el.querySelector('[data-testid="research-cases"]')!;
      expect(cases.tagName).toBe('DL');
      expect(cases.querySelectorAll('dt').length).toBe(3);
      expect(cases.querySelectorAll('dd').length).toBe(3);
    });

    it('should use no image, SVG, canvas, or diagram markup', () => {
      expect(el.querySelector('img, svg, canvas, iframe, object, embed, script')).toBeNull();
      expect(content).not.toMatch(/mermaid|graph TD|flowchart/i);
    });
  });

  describe('Identity Slice states', () => {
    it('should render the summary through a computed signal', () => {
      expect(fixture.componentInstance.summary()).toBe('5 Identity Slices observed / 1 with surfaced Divergence');
      expect(section('supplier-slice-summary')).toBe('5 Identity Slices observed / 1 with surfaced Divergence');
    });

    it('should match the Invoice Identity Slices the replay fixture produces (drift guard)', () => {
      const expected = fixtureInvoiceSliceStates().map(state => [state.label, STATE_WORDING[state.state]]);
      const rendered = Array.from(el.querySelectorAll('[data-testid="supplier-slice-row"]')).map(row => [
        text(row.querySelector('[data-testid="supplier-slice-name"]')),
        text(row.querySelector('[data-testid="supplier-slice-state"]')),
      ]);
      expect(expected.length).toBe(5);
      expect(rendered).toEqual(expected);
    });

    it('should explain independent Observed Baselines per Identity Slice', () => {
      const population = section('architecture-population');
      expect(population).toContain('evaluated against its own Observed Baseline');
      expect(population).toContain("diverge from Alpha's own historical observed behavior");
    });

    it('should distinguish No surfaced Divergence from No Observed Baseline', () => {
      expect(section('no-baseline-distinction')).toBe(
        'IDP-Align also distinguishes No surfaced Divergence from No Observed Baseline. Insufficient ' +
          'observations to establish a baseline are not treated as evidence that an Identity Slice has no Divergence.',
      );
      for (const state of el.querySelectorAll('[data-testid="supplier-slice-state"]')) {
        expect(text(state)).not.toBe('No Observed Baseline');
      }
    });

    it('should never describe No surfaced Divergence with judgment wording', () => {
      const sentences = content.split(/(?<=[.:])\s+/).filter(s => s.includes('No surfaced Divergence'));
      expect(sentences.length).toBeGreaterThan(0);
      for (const sentence of sentences) {
        expect(sentence).not.toMatch(NO_DIVERGENCE_JUDGMENT);
      }
    });
  });

  describe('boundary copy', () => {
    it('should state CAV Level 1 only, with the not-established list', () => {
      expect(content).toContain('CAV Level 1');
      expect(content).not.toMatch(/Levels? [2-6]\b/);
      const boundary = section('cav-boundary');
      for (const item of [
        'root cause or Attribution',
        'correctness or incorrectness',
        'failure;',
        'risk or business significance',
        'producer blame',
        'required remediation',
        'cross-stream causality',
      ]) {
        expect(boundary).toContain(item);
      }
      expect(boundary).not.toMatch(/violation/i);
    });

    it('should describe the live-source extension point without a live-integration claim', () => {
      expect(section('live-integration-boundary')).toBe(
        'This is an architectural extension point, not a claim that live integration currently exists.',
      );
      expect(section('architecture-source-independent')).toContain('does not depend directly on replay fixtures');
      expect(content).not.toMatch(/Production DocuWare integration/i);
    });

    it('should label implemented, synthetic, and future capability', () => {
      expect(Array.from(el.querySelectorAll('h3')).map(text)).toEqual(
        expect.arrayContaining(['Implemented', 'Synthetic or not currently implemented']),
      );
      const synthetic = Array.from(el.querySelectorAll('[data-testid="synthetic-list"] li')).map(text);
      expect(synthetic).toContain('Live IDP connections');
      expect(synthetic.join(' ')).not.toMatch(/DocuWare/);
      expect(section('future-boundary')).toBe(
        'These capabilities are research directions and are not currently implemented in IDP-Align.',
      );
    });

    it('should present Producer x Document Type as an IDP Identity Slice pattern, not a CAV primitive', () => {
      const research = section('architecture-research');
      expect(section('producer-pattern')).toBe('Producer x Document Type');
      expect(research).toContain('generalized IDP Identity Slice pattern');
      expect(content).not.toMatch(/Producer x Document Type[^.]*CAV primitive/i);
    });

    it('should keep the exact Sport Auto Plus provenance wording', () => {
      expect(section('research-sport-auto-plus-text')).toBe(
        'Variation in authority-specific traffic-notice document structures motivates Authority x Traffic Notice populations.',
      );
    });

    it('should present case studies as research provenance only', () => {
      expect(section('architecture-research')).toContain('published DocuWare case studies');
      expect(section('research-boundary')).toContain('does not claim that these organizations experienced the Divergences');
    });
  });

  describe('external links', () => {
    it('should link the three section 4a case studies', () => {
      const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('[data-testid="research-cases"] a'));
      expect(links.map(link => [text(link), link.href])).toEqual([
        ['Giebeler-Feuerschutz', 'https://start.docuware.com/case-studies/Giebeler-Feuerschutz'],
        ['Piening Personal', 'https://start.docuware.com/case-studies/piening'],
        ['Sport Auto Plus', 'https://start.docuware.com/case-studies/sport-auto-plus'],
      ]);
    });

    it('should expand and link the first CAV mention to the CAV repository', () => {
      const link = el.querySelector<HTMLAnchorElement>('[data-testid="cav-repo-link"]');
      expect(link).toBeTruthy();
      expect(text(link!)).toBe('CAV (Continuous Alignment Verification)');
      expect(link!.href).toBe('https://github.com/fpmcguire/continuous-alignment-verification');
      const firstCav = el.textContent!.indexOf('CAV');
      expect(el.textContent!.indexOf('CAV (Continuous Alignment Verification)')).toBe(firstCav);
    });

    it('should open every external link safely', () => {
      const external = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href^="http"]'));
      expect(external.length).toBe(4);
      for (const link of external) {
        expect(link.href).toMatch(/^https:\/\//);
        expect(link.target).toBe('_blank');
        expect(link.rel).toContain('noopener');
        expect(link.rel).toContain('noreferrer');
      }
    });
  });

  describe('prohibited overclaims in claim copy', () => {
    for (const [name, pattern] of Object.entries(OVERCLAIM_PATTERNS)) {
      it(`should not contain ${name}`, () => {
        expect(claimText()).not.toMatch(pattern);
      });
    }

    it('should still contain the claim copy being checked', () => {
      expect(claimText()).toContain('Identity Slice');
      expect(claimText().length).toBeGreaterThan(content.length / 2);
    });

    it('should keep interview framing out of the whole page, boundaries included', () => {
      expect(content).not.toMatch(OVERCLAIM_PATTERNS['interviewFraming']);
    });
  });
});
