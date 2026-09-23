import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type StreamKind = 'document' | 'workflow';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>IDP-Align Dashboard</h2>
        <div class="stream-subtitle">Continuous Alignment Verification</div>
      </div>

      <div class="stream-tabs">
        <button
          (click)="selectStream('document')"
          [class.active]="activeStream() === 'document'"
          class="stream-tab"
          data-testid="stream-tab-document"
        >
          Document Stream
        </button>
        <button
          (click)="selectStream('workflow')"
          [class.active]="activeStream() === 'workflow'"
          class="stream-tab"
          data-testid="stream-tab-workflow"
        >
          Workflow Stream
        </button>
      </div>

      <div class="dashboard-content">
        <!-- Summary KPI Section -->
        <div class="kpi-section">
          <div class="kpi-card">
            <div class="kpi-label">Total Divergences</div>
            <div class="kpi-value">{{ activeStream() === 'document' ? 8 : 4 }}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Ongoing</div>
            <div class="kpi-value">{{ activeStream() === 'document' ? 5 : 2 }}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Resolved</div>
            <div class="kpi-value">{{ activeStream() === 'document' ? 3 : 2 }}</div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <select class="filter-select" data-testid="filter-vendor">
            <option>All vendors</option>
            <option>Acme Corp</option>
            <option>Global Supplies</option>
          </select>
          <select class="filter-select" data-testid="filter-timerange">
            <option selected>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom</option>
          </select>
          <select class="filter-select" data-testid="filter-status">
            <option selected>All divergences</option>
            <option>Ongoing only</option>
            <option>Resolved only</option>
          </select>
        </div>

        <!-- List and Detail Section -->
        <div class="list-detail-container">
          <div class="divergence-list">
            <p class="placeholder-text">
              Divergence list and detail pane will be populated in STEP-04
            </p>
          </div>
          <div class="detail-pane">
            <p class="placeholder-text">Select a divergence to view details</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .dashboard-header {
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--space-md);
    }

    .dashboard-header h2 {
      margin: 0 0 var(--space-sm) 0;
    }

    .stream-subtitle {
      font-size: var(--font-size-caption);
      color: var(--color-text-secondary);
    }

    .stream-tabs {
      display: flex;
      gap: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .stream-tab {
      padding: var(--space-sm) var(--space-md);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--color-text-primary);
      }

      &.active {
        color: var(--color-text-primary);
        border-bottom-color: var(--color-divergence-ongoing);
      }
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .kpi-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .kpi-card {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-md);
    }

    .kpi-label {
      font-size: var(--font-size-caption);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-sm);
    }

    .kpi-value {
      font-size: var(--font-size-display);
      font-weight: var(--font-weight-medium);
      color: var(--color-divergence-ongoing);
    }

    .filter-bar {
      display: flex;
      gap: var(--space-md);
      background: var(--color-bg-dark);
      padding: var(--space-md);
      border-radius: var(--radius-md);
    }

    .filter-select {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: var(--font-size-caption);
    }

    .list-detail-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-md);
      min-height: 400px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .divergence-list,
    .detail-pane {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-md);
    }

    .placeholder-text {
      color: var(--color-text-secondary);
      text-align: center;
      padding: var(--space-lg);
    }
  `],
})
export class DashboardComponent {
  activeStream = signal<StreamKind>('document');

  selectStream(stream: StreamKind) {
    this.activeStream.set(stream);
  }
}
