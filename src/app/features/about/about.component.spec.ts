import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render About page title', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent).toContain('About IDP-Align');
  });

  it('should have multiple sections', () => {
    const sections = fixture.nativeElement.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(3);
  });

  it('should explain project intent', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Continuous Alignment Verification');
    expect(content).toContain('CAV');
  });

  it('should describe dashboard overview', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Document Stream');
    expect(content).toContain('Workflow Stream');
  });

  it('should explain architecture with repository/adapter boundary', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('repository');
    expect(content).toContain('adapter');
    expect(content).toContain('Angular');
  });

  it('should mention MOD-W workflow', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('MOD-W');
    expect(content).toContain('Moderated AI Development Workflow');
  });

  it('should explain CAV Level 1 scope', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Level 1');
    expect(content).toContain('Observed-State Divergence');
  });

  it('should state this is not a production implementation', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toMatch(/reference implementation|research|scoped/i);
  });

  it('should not mention target organization in visible copy', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).not.toMatch(
      /\b(AcmeCorp|Global\s*Supplies|TechParts|Purchase-to-Pay|DocuWare|Interview)\b/i
    );
  });

  it('should not mention company-specific product names in visible copy', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).not.toMatch(
      /\b(DocuWare|Platform REST API|Workflow Analytics|Enterprise|SAP|Workiva)\b/i
    );
  });

  it('should use canonical CAV terminology', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Observed Truth');
    expect(content).toContain('Observed Baseline');
    expect(content).toContain('Divergence');
    expect(content).toContain('Evidence');
    expect(content).toContain('Identity Slice');
  });

  it('should not claim Levels 2-6 or Attribution', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).not.toContain('Level 2');
    expect(content).not.toContain('Level 3');
    expect(content).not.toContain('Attribution');
    expect(content).not.toContain('root-cause');
  });
});
