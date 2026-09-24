import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the IDP-Align shell instead of the Angular starter', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-shell')).toBeTruthy();
    expect(compiled.querySelector('.app-title')?.textContent).toContain('IDP-Align');
    expect(compiled.textContent).not.toContain('Hello, idp-align');
  });

  it('should render exactly one router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const outlets = (fixture.nativeElement as HTMLElement).querySelectorAll('router-outlet');
    expect(outlets.length).toBe(1);
  });

  it('should open the dashboard as the first screen', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.querySelector('.dashboard-container')).toBeTruthy();
  });

  it('should route to the About view', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/about');
    expect(harness.routeNativeElement?.textContent).toContain('About IDP-Align');
  });
});
