import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard header', () => {
    const header = fixture.nativeElement.querySelector('.dashboard-header h2');
    expect(header?.textContent).toContain('IDP-Align Dashboard');
  });

  it('should have stream tabs', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.stream-tab');
    expect(tabs.length).toBe(2);
  });

  it('should default to document stream', () => {
    expect(component.activeStream()).toBe('document');
  });

  it('should switch to workflow stream when tab clicked', () => {
    const workflowTab = fixture.nativeElement.querySelector('[data-testid="stream-tab-workflow"]');
    workflowTab.click();
    fixture.detectChanges();

    expect(component.activeStream()).toBe('workflow');
  });

  it('should switch back to document stream', () => {
    component.selectStream('workflow');
    fixture.detectChanges();

    const documentTab = fixture.nativeElement.querySelector('[data-testid="stream-tab-document"]');
    documentTab.click();
    fixture.detectChanges();

    expect(component.activeStream()).toBe('document');
  });

  it('should display document KPI values for document stream', () => {
    component.selectStream('document');
    fixture.detectChanges();

    const kpiValues = fixture.nativeElement.querySelectorAll('.kpi-value');
    expect(kpiValues[0].textContent).toContain('8'); // total divergences
    expect(kpiValues[1].textContent).toContain('5'); // ongoing
    expect(kpiValues[2].textContent).toContain('3'); // resolved
  });

  it('should display workflow KPI values for workflow stream', () => {
    component.selectStream('workflow');
    fixture.detectChanges();

    const kpiValues = fixture.nativeElement.querySelectorAll('.kpi-value');
    expect(kpiValues[0].textContent).toContain('4'); // total divergences
    expect(kpiValues[1].textContent).toContain('2'); // ongoing
    expect(kpiValues[2].textContent).toContain('2'); // resolved
  });

  it('should have filter selects', () => {
    const filters = fixture.nativeElement.querySelectorAll('.filter-select');
    expect(filters.length).toBeGreaterThan(0);
  });

  it('should have list and detail regions', () => {
    const listRegion = fixture.nativeElement.querySelector('.divergence-list');
    const detailRegion = fixture.nativeElement.querySelector('.detail-pane');
    expect(listRegion).toBeTruthy();
    expect(detailRegion).toBeTruthy();
  });
});
