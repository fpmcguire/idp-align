import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
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
    expect(el.querySelector('.dashboard-header h2')?.textContent).toContain('IDP-Align Dashboard');
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

  it('should not use reserved or non-canonical terms for current behavior', () => {
    const text = el.textContent ?? '';
    expect(text).not.toMatch(
      /Declared Intention|Alignment Delta|Envelope|Breach|Drift Velocity|Convergence|Attribution|\balert|\banomal/i
    );
  });
});
