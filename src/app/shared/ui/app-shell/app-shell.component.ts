import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="app-header-content">
        <h1 class="app-title">IDP-Align</h1>
        <nav class="app-nav">
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            class="nav-link"
            data-testid="nav-dashboard"
          >
            Dashboard
          </a>
          <a
            routerLink="/about"
            routerLinkActive="active"
            class="nav-link"
            data-testid="nav-about"
          >
            About
          </a>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      background: var(--color-bg-surface);
      border-bottom: 1px solid var(--color-border);
      padding: var(--space-md);
    }

    .app-header-content {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-title {
      font-size: var(--font-size-heading);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    .app-nav {
      display: flex;
      gap: var(--space-md);
    }

    .nav-link {
      padding: var(--space-sm) var(--space-md);
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-text-primary);
      }

      &.active {
        color: var(--color-text-primary);
        border-bottom: 2px solid var(--color-divergence-ongoing);
      }
    }

    .app-main {
      max-width: 1440px;
      margin: 0 auto;
      padding: var(--space-lg);
      min-height: calc(100vh - 60px);
    }

    @media (max-width: 768px) {
      .app-header-content {
        flex-direction: column;
        gap: var(--space-md);
      }

      .app-main {
        padding: var(--space-md);
      }
    }
  `],
})
export class AppShellComponent {}
