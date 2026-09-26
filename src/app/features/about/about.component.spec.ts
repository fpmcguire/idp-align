import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

// Boundary statements (non-goals, disclaimers) are marked with [data-boundary]. Overclaim checks
// scan only the remaining claim copy, so legitimate "does not implement X" language is allowed.
const OVERCLAIM_PATTERNS: Record<string, RegExp> = {
  endorsement: /endors|sponsor|partner|affiliat|official|on behalf of|(approved|reviewed|requested) by DocuWare/i,
  privateAccess: /private|internal DocuWare|customer data|confidential|proprietary|insider/i,
  productionReadiness: /production[- ]?(ready|grade)|ready for production|in production|enterprise[- ]grade/i,
  defectOrGap: /\bdefect|\bflaw|shortcoming|product gap|fills? (a|the) gap|fix(es)? DocuWare/i,
  higherCavLevels: /Levels? [2-6]\b|Levels? 2[–-]6/i,
  attribution: /Attribution|root[- ]cause/i,
  certification: /certif|benchmark/i,
  businessJudgment: /bad data|failure|defect|non[- ]conform|violation of business intent/i,
  reservedTerms: /Declared Intention|Alignment Delta|Envelope|Breach|Drift Velocity|Convergence/i,
  nonCanonicalFindingNames: /\balert|\banomal/i,
};

describe('AboutComponent', () => {
  let fixture: ComponentFixture<AboutComponent>;
  let el: HTMLElement;
  let content: string;

  const text = (node: Element | null | undefined) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const claimText = () => {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-boundary]').forEach(b => b.remove());
    return text(clone);
  };
  const boundaryElements = () => Array.from(el.querySelectorAll<HTMLElement>('[data-boundary]'));
  const section = (id: string) => text(el.querySelector(`[data-testid="${id}"]`));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    content = text(el);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render About page title as a one-page brief', () => {
    expect(el.querySelector('h1')?.textContent).toContain('About IDP-Align');
    expect(el.querySelectorAll('article section').length).toBeGreaterThanOrEqual(7);
  });

  describe('required DocuWare research/demo framing', () => {
    it('should identify the project as a personal DocuWare interview research/demo project', () => {
      const context = section('about-project-context');
      expect(context).toContain('DocuWare');
      expect(context).toContain('September 28, 2026');
      expect(context).toMatch(/interview/i);
      expect(context).toMatch(/personal research and demo project/i);
      expect(context).toContain('Frank McGuire');
    });

    it('should explain why DocuWare is the research domain', () => {
      const why = section('about-why-docuware');
      expect(why).toMatch(/document processing/i);
      expect(why).toMatch(/workflow automation/i);
      expect(why).toContain('AI Hub');
    });

    it('should explain DocuWare API research intent', () => {
      const api = section('about-api-research');
      expect(api).toContain('DocuWare Platform REST API');
      expect(api).toContain('Workflow Analytics API');
      expect(api).toMatch(/publicly documented/i);
      expect(api).toMatch(/credentials never reside in the browser/i);
    });

    it('should show an independence notice covering endorsement, private access, and confidentiality', () => {
      const notice = section('independence-notice');
      expect(notice).toContain('not affiliated with, reviewed by, or endorsed by DocuWare');
      expect(notice).toContain('does not use private DocuWare systems');
      expect(notice).toMatch(/confidential interview information/);
    });
  });

  describe('required project content', () => {
    it('should describe the dashboard and both streams', () => {
      const dashboard = section('about-dashboard');
      expect(dashboard).toContain('Document stream');
      expect(dashboard).toContain('Workflow stream');
      expect(dashboard).toMatch(/sustained Divergence detection over synthetic replay data/);
      for (const feature of ['Observed Baselines', 'filters and sorting', 'Evidence Trace', 'Divergence Analysis chart']) {
        expect(dashboard).toContain(feature);
      }
      expect(dashboard).toContain('Both streams share the same presentational components and are observed independently.');
    });

    it('should describe the current state without STEP-01-era planned or later-Step wording', () => {
      for (const stale of [/STEP-01/, /later Steps?/i, /\(planned\)/i, /will be modeled/i, /reserved regions/i]) {
        expect(content).not.toMatch(stale);
      }
      const arch = section('about-architecture');
      expect(arch).toContain('Domain: pure functions for Observed Truth, Identity Slices, Observed Baselines, and sustained Divergence detection.');
      expect(arch).toContain('Data: repository interfaces with a local replay adapter, the only adapter implemented.');
      expect(section('about-api-research')).toContain('Replay data is modeled on these publicly documented API shapes.');
    });

    it('should explain CAV Level 1 with canonical terminology', () => {
      const cav = section('about-cav');
      expect(cav).toContain('Continuous Alignment Verification');
      expect(cav).toContain('Level 1');
      expect(cav).toContain('Observed-State');
      for (const term of ['Observed Truth', 'Identity Slice', 'Observed Baseline', 'Divergence', 'Evidence']) {
        expect(cav).toContain(term);
      }
    });

    it('should link to the canonical CAV manifesto repository reference', () => {
      const link = el.querySelector<HTMLAnchorElement>('[data-testid="cav-repo-link"]');
      expect(link?.textContent).toContain('Continuous Alignment Verification repository');
      expect(link?.href).toBe('https://github.com/fpmcguire/continuous-alignment-verification');
      expect(link?.target).toBe('_blank');
      expect(link?.rel).toContain('noopener');
      expect(link?.rel).toContain('noreferrer');
    });

    it('should link to the IDP-Align project repository from a project note', () => {
      const note = section('project-repository-note');
      const link = el.querySelector<HTMLAnchorElement>('[data-testid="idp-align-repo-link"]');
      expect(note).toContain('Project source');
      expect(link?.textContent).toContain('idp-align repository');
      expect(link?.href).toBe('https://github.com/fpmcguire/idp-align.git');
      expect(link?.target).toBe('_blank');
      expect(link?.rel).toContain('noopener');
      expect(link?.rel).toContain('noreferrer');
    });

    it('should link the public DocuWare API documentation in a References section (PO-1)', () => {
      const references = el.querySelector('[data-testid="about-references"]')!;
      expect(text(references.querySelector('h2'))).toBe('References');
      const links = Array.from(references.querySelectorAll<HTMLAnchorElement>('a'));
      expect(links.map(link => [text(link), link.href])).toEqual([
        [
          'DocuWare Platform REST API documentation',
          'https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api',
        ],
        [
          'DocuWare Workflow Analytics API documentation',
          'https://knowledgecenter.docuware.com/docs/workflow-analytics-api',
        ],
      ]);
    });

    it('should open every external link safely', () => {
      const external = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href^="http"]'));
      expect(external.length).toBe(5);
      for (const link of external) {
        expect(link.href).toMatch(/^https:\/\//);
        expect(link.target).toBe('_blank');
        expect(link.rel).toContain('noopener');
        expect(link.rel).toContain('noreferrer');
      }
    });

    it('should render the author footer', () => {
      const link = el.querySelector<HTMLAnchorElement>('[data-testid="author-link"]');
      expect(section('author-footer')).toBe('Author: Frank McGuire');
      expect(link?.textContent).toContain('Frank McGuire');
      expect(link?.href).toBe('https://github.com/fpmcguire');
      expect(link?.target).toBe('_blank');
      expect(link?.rel).toContain('noopener');
      expect(link?.rel).toContain('noreferrer');
    });

    it('should state that reference links imply no DocuWare review or endorsement', () => {
      const boundary = el.querySelector('[data-testid="about-references"] [data-boundary]');
      expect(text(boundary)).toBe(
        'These are public documentation pages; linking to them does not imply DocuWare review or endorsement.'
      );
    });

    it('should render the CAV reference as one sentence without a space before the period', () => {
      expect(section('cav-reference')).toBe(
        'Canonical CAV terminology comes from the Continuous Alignment Verification repository.'
      );
    });

    it('should place the CAV reference in the CAV Level 1 section, before the model list', () => {
      const cav = el.querySelector('[data-testid="about-cav"]')!;
      const reference = cav.querySelector('[data-testid="cav-reference"]');
      const modelList = cav.querySelector('ul')!;
      expect(reference?.querySelector('[data-testid="cav-repo-link"]')).toBeTruthy();
      expect(reference!.compareDocumentPosition(modelList) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(el.querySelector('[data-testid="about-api-research"] [data-testid="cav-repo-link"]')).toBeNull();
    });

    it('should explain the CAV surfacing boundary', () => {
      const boundary = section('surfacing-boundary');
      expect(boundary).toContain('Divergence is evidence of change');
      expect(boundary).toContain('not a judgment of failure, defect, or non-conformance');
      expect(boundary).toContain('surfaces Evidence for interpretation');
      expect(boundary).toContain(
        'does not decide what the behavior should have been, or whether it violates business intent.'
      );
    });

    it('should explain the architecture and repository/adapter boundary', () => {
      const arch = section('about-architecture');
      expect(arch).toContain('feature-sliced');
      expect(arch).toContain('repository/adapter boundary');
      expect(section('architecture-flow')).toMatch(/repository interface.*replay adapter.*BFF\/API/s);
      expect(arch).toMatch(/without rewriting the dashboard/);
    });

    it('should describe MOD-W and the current-version assessment', () => {
      const modW = section('about-mod-w');
      expect(modW).toContain('Moderated AI Development Workflow');
      expect(modW).toMatch(/assessment of the current MOD-W version/);
    });
  });

  describe('scope boundaries', () => {
    it('should phrase every boundary statement as a negation', () => {
      const statements = boundaryElements().flatMap(b =>
        b.tagName === 'UL' ? Array.from(b.querySelectorAll('li')) : [b]
      );
      expect(statements.length).toBeGreaterThan(0);
      for (const s of statements) {
        expect(text(s)).toMatch(/\b(not|no|never)\b/i);
      }
    });

    it('should state the required non-goals', () => {
      const boundaries = boundaryElements().map(text).join(' ');
      expect(boundaries).toMatch(/endorsed by DocuWare/);
      expect(boundaries).toMatch(/private DocuWare/);
      expect(boundaries).toMatch(/confidential interview/);
      expect(boundaries).toMatch(/Not production software/);
      expect(boundaries).toMatch(/product defect or gap/);
      expect(boundaries).toMatch(/does not implement CAV Levels 2–6/);
      expect(boundaries).toMatch(/does not implement Attribution/);
      expect(boundaries).toMatch(/not a judgment of failure, defect, or non-conformance/);
      expect(boundaries).toMatch(/not a formal certification/);
    });
  });

  describe('prohibited overclaims in claim copy', () => {
    for (const [name, pattern] of Object.entries(OVERCLAIM_PATTERNS)) {
      it(`should not contain ${name} claims`, () => {
        expect(claimText()).not.toMatch(pattern);
      });
    }

    it('should still contain the claim copy being checked', () => {
      expect(claimText()).toContain('DocuWare');
      expect(claimText().length).toBeGreaterThan(content.length / 2);
    });
  });
});
