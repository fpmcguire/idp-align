import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppShellComponent } from './app-shell.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with title', () => {
    const titleElement = fixture.nativeElement.querySelector('.app-title');
    expect(titleElement?.textContent).toContain('IDP-Align');
  });

  it('should give the navigation an accessible name', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Primary');
  });

  it('should not render a heading in the shell, leaving the h1 to each routed view', () => {
    expect(fixture.nativeElement.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull();
  });

  it('should have navigation links', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('.nav-link');
    expect(navLinks.length).toBe(2);
  });

  it('should have Dashboard link in navigation', () => {
    const dashboardLink = fixture.nativeElement.querySelector('[data-testid="nav-dashboard"]');
    expect(dashboardLink).toBeTruthy();
    expect(dashboardLink?.textContent).toContain('Dashboard');
  });

  it('should have About link in navigation', () => {
    const aboutLink = fixture.nativeElement.querySelector('[data-testid="nav-about"]');
    expect(aboutLink).toBeTruthy();
    expect(aboutLink?.textContent).toContain('About');
  });

  it('should render router outlet', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should not imply endorsement, private access, or production readiness in navigation', () => {
    const headerText = fixture.nativeElement.textContent;
    expect(headerText).not.toMatch(
      /endors|official|partner|affiliat|private|confidential|production[- ]?(ready|grade)|Level [2-6]\b|Attribution/i
    );
  });
});
