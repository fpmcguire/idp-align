import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of, throwError } from 'rxjs';
import {
  CLAIM_GUARDRAIL_PATTERNS,
  REPLAY_SOURCE_AVOID_WORDS,
} from '../../../testing/claim-guardrail-patterns';
import { provideStreamObservationRepository } from '../../data/provide-stream-observation-repository';
import { StreamObservationRepository, StreamSourceInfo } from '../../data/stream-observation.repository';
import { StreamKind } from '../../domain/stream';
import { DashboardComponent } from './dashboard.component';

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let el: HTMLElement;

  const tab = (kind: string) =>
    el.querySelector<HTMLButtonElement>(`[data-testid="stream-tab-${kind}"]`)!;
  const pressKey = (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  };
  const replaySource = () => el.querySelector('[data-testid="stream-replay-source"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideStreamObservationRepository()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard header with CAV Level 1 framing', () => {
    expect(el.querySelector('.dashboard-header h1')?.textContent).toContain('IDP-Align Dashboard');
    expect(el.querySelector('.stream-subtitle')?.textContent).toContain('CAV Level 1');
  });

  describe('stream tabs', () => {
    it('should expose a tablist with two tabs', () => {
      expect(el.querySelector('[role="tablist"]')).toBeTruthy();
      expect(el.querySelectorAll('[role="tab"]').length).toBe(2);
    });

    it('should default to the document stream with semantic selected state', () => {
      expect(component.activeStream()).toBe('document');
      expect(tab('document').getAttribute('aria-selected')).toBe('true');
      expect(tab('workflow').getAttribute('aria-selected')).toBe('false');
      expect(tab('document').tabIndex).toBe(0);
      expect(tab('workflow').tabIndex).toBe(-1);
    });

    it('should link the selected tab to the tab panel', () => {
      const panel = el.querySelector('[role="tabpanel"]')!;
      expect(tab('document').getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(tab('document').id);
    });

    it('should make the tab panel keyboard-focusable while it has no focusable content', () => {
      const panel = el.querySelector<HTMLElement>('[role="tabpanel"]')!;
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'
      );
      expect(focusable.length).toBe(0);
      expect(panel.tabIndex).toBe(0);

      panel.focus();
      expect(document.activeElement).toBe(panel);
    });

    it('should keep heading hierarchy under the view heading', () => {
      expect(el.querySelectorAll('h1').length).toBe(1);
      expect(el.querySelector('[data-testid="stream-heading"]')?.tagName).toBe('H2');
    });

    it('should switch to workflow stream on click and update aria-selected', () => {
      tab('workflow').click();
      fixture.detectChanges();

      expect(component.activeStream()).toBe('workflow');
      expect(tab('workflow').getAttribute('aria-selected')).toBe('true');
      expect(tab('document').getAttribute('aria-selected')).toBe('false');
      expect(el.querySelector('[role="tabpanel"]')!.id).toBe('stream-panel-workflow');
    });

    it('should switch back to document stream on click', () => {
      component.selectStream('workflow');
      fixture.detectChanges();

      tab('document').click();
      fixture.detectChanges();

      expect(component.activeStream()).toBe('document');
    });

    it('should support arrow, Home, and End keys', () => {
      pressKey(tab('document'), 'ArrowRight');
      expect(component.activeStream()).toBe('workflow');
      expect(document.activeElement).toBe(tab('workflow'));

      pressKey(tab('workflow'), 'ArrowRight');
      expect(component.activeStream()).toBe('document');

      pressKey(tab('document'), 'ArrowLeft');
      expect(component.activeStream()).toBe('workflow');

      pressKey(tab('workflow'), 'Home');
      expect(component.activeStream()).toBe('document');

      pressKey(tab('document'), 'End');
      expect(component.activeStream()).toBe('workflow');
    });
  });

  describe('stream-specific shell content', () => {
    it('should show document stream context by default', () => {
      expect(el.querySelector('[data-testid="stream-heading"]')?.textContent).toContain('Document stream');
      expect(el.querySelector('[data-testid="stream-source-note"]')?.textContent).toContain(
        'DocuWare Platform REST API'
      );
      expect(el.querySelector('[data-testid="filter-bar"]')?.textContent).toContain('vendor / document type');
    });

    it('should show workflow stream context after switching', () => {
      component.selectStream('workflow');
      fixture.detectChanges();

      expect(el.querySelector('[data-testid="stream-heading"]')?.textContent).toContain('Workflow stream');
      expect(el.querySelector('[data-testid="stream-source-note"]')?.textContent).toContain(
        'DocuWare Workflow Analytics API'
      );
      expect(el.querySelector('[data-testid="filter-bar"]')?.textContent).toContain('workflow step / route');
    });
  });

  describe('placeholder regions', () => {
    it('should reserve total, ongoing, resolved, and trend summary regions', () => {
      const labels = Array.from(el.querySelectorAll('.kpi-label')).map(l => l.textContent?.trim());
      expect(labels).toEqual(['Total Divergences', 'Ongoing', 'Resolved', 'Trend']);
    });

    it('should not show computed-looking counts in either stream', () => {
      for (const stream of ['document', 'workflow'] as const) {
        component.selectStream(stream);
        fixture.detectChanges();
        const kpiText = el.querySelector('[data-testid="kpi-section"]')?.textContent ?? '';
        expect(kpiText).not.toMatch(/\d/);
        expect(kpiText).toContain('Pending replay data');
      }
    });

    it('should render disabled filters without invented identity slice values', () => {
      const selects = el.querySelectorAll<HTMLSelectElement>('.filter-select');
      expect(selects.length).toBe(3);
      selects.forEach(s => expect(s.disabled).toBe(true));

      const sliceOptions = el.querySelectorAll('[data-testid="filter-identity-slice"] option');
      expect(sliceOptions.length).toBe(1);
      expect(sliceOptions[0].textContent).toContain('All identity slices');
    });

    it('should render list, detail, and empty-state regions', () => {
      expect(el.querySelector('[data-testid="divergence-list"]')).toBeTruthy();
      expect(el.querySelector('[data-testid="detail-pane"]')).toBeTruthy();
      expect(el.querySelector('[data-testid="empty-state"]')?.textContent).toContain('No Divergences to show yet');
    });
  });

  describe('replay source line', () => {
    it('should state neutral document replay source facts', () => {
      expect(normalize(replaySource()?.textContent)).toBe(
        'Replay source: 38 synthetic document observations across 6 Identity Slices, ' +
          '3 Aug–11 Sep 2026 (UTC). Observed Baselines and sustained Divergence detection ' +
          'are added in later Steps.'
      );
    });

    it('should state neutral workflow replay source facts after switching', () => {
      component.selectStream('workflow');
      fixture.detectChanges();

      expect(normalize(replaySource()?.textContent)).toContain(
        'Replay source: 80 synthetic workflow observations across 4 Identity Slices, 3 Aug–12 Sep 2026 (UTC).'
      );
    });

    it('should avoid wording that reads as a finding in either stream', () => {
      for (const stream of ['document', 'workflow'] as const) {
        component.selectStream(stream);
        fixture.detectChanges();
        expect(replaySource()?.textContent).not.toMatch(REPLAY_SOURCE_AVOID_WORDS);
      }
    });

    it('should keep the KPI placeholders and disabled filters alongside replay data', () => {
      expect(el.querySelector('[data-testid="kpi-section"]')?.textContent).not.toMatch(/\d/);
      expect(el.querySelectorAll('.filter-select:disabled').length).toBe(3);
      expect(el.querySelector('[data-testid="empty-state"]')).toBeTruthy();
    });
  });

  describe('claim guardrails in rendered dashboard copy (QA-006)', () => {
    for (const stream of ['document', 'workflow'] as const) {
      describe(`${stream} stream`, () => {
        let text: string;

        beforeEach(() => {
          component.selectStream(stream);
          fixture.detectChanges();
          text = normalize(el.textContent);
        });

        it('should render the copy being checked, including the replay source line', () => {
          expect(text).toContain('DocuWare');
          expect(text).toContain('Replay source:');
        });

        for (const [name, pattern] of Object.entries(CLAIM_GUARDRAIL_PATTERNS)) {
          it(`should not contain ${name} claims`, () => {
            expect(text).not.toMatch(pattern);
          });
        }
      });
    }
  });
});

describe('DashboardComponent with a non-replay repository', () => {
  const info = (streamKind: StreamKind): StreamSourceInfo => ({
    streamKind,
    sourceKind: 'replay',
    synthetic: true,
    observationCount: 3,
    identitySliceCount: 2,
    observationWindow: { from: '2025-12-30T10:00:00.000Z', to: '2026-01-02T10:00:00.000Z' },
  });

  const render = (repository: Partial<StreamObservationRepository>) => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: StreamObservationRepository,
          useValue: {
            getIdentitySlices: () => EMPTY,
            getObservations: () => EMPTY,
            getObservedTruth: () => EMPTY,
            ...repository,
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render whatever the repository interface provides', () => {
    const el = render({ getSourceInfo: stream => of(info(stream)) });

    expect(normalize(el.querySelector('[data-testid="stream-replay-source"]')?.textContent)).toContain(
      'Replay source: 3 synthetic document observations across 2 Identity Slices, 30 Dec 2025–2 Jan 2026 (UTC).'
    );
  });

  it('should omit the replay source line when the repository cannot be read', () => {
    const el = render({ getSourceInfo: () => throwError(() => new Error('unavailable')) });

    expect(el.querySelector('[data-testid="stream-replay-source"]')).toBeNull();
    expect(el.querySelector('[data-testid="kpi-section"]')).toBeTruthy();
  });
});
