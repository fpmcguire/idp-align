import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
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

  describe('shell accessibility per route', () => {
    const renderAt = async (url: string) => {
      const fixture = TestBed.createComponent(App);
      await TestBed.inject(Router).navigateByUrl(url);
      await fixture.whenStable();
      return fixture.nativeElement as HTMLElement;
    };

    for (const { url, current, other, title } of [
      { url: '/dashboard', current: 'nav-dashboard', other: 'nav-about', title: 'IDP-Align Dashboard' },
      { url: '/about', current: 'nav-about', other: 'nav-dashboard', title: 'About IDP-Align' },
    ]) {
      it(`should mark only the active nav link with aria-current on ${url}`, async () => {
        const root = await renderAt(url);
        const marked = root.querySelectorAll('nav [aria-current]');
        expect(marked.length).toBe(1);
        expect(root.querySelector(`[data-testid="${current}"]`)?.getAttribute('aria-current')).toBe('page');
        expect(root.querySelector(`[data-testid="${other}"]`)?.hasAttribute('aria-current')).toBe(false);
      });

      it(`should render exactly one h1 on ${url}`, async () => {
        const root = await renderAt(url);
        const headings = root.querySelectorAll('h1');
        expect(headings.length).toBe(1);
        expect(headings[0].textContent).toContain(title);
      });
    }
  });
});
