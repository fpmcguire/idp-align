import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <article class="about-content">
        <h1>About IDP-Align</h1>

        <section>
          <h2>Project Intent</h2>
          <p>
            IDP-Align is a research and reference implementation project that demonstrates
            Continuous Alignment Verification (CAV) Level 1 applied to enterprise document
            processing and workflow systems. It explores how observed behavioral divergence
            detection can provide transparency into system alignment without requiring formal
            declared intent or business rule enforcement.
          </p>
        </section>

        <section>
          <h2>Dashboard Overview</h2>
          <p>
            The IDP-Align dashboard presents two independent observation streams:
          </p>
          <ul>
            <li>
              <strong>Document Stream:</strong> Observes extracted index-field behavior from
              document processing systems, comparing vendor patterns, amount behavior, date
              representation, and other dimensions against historical baselines.
            </li>
            <li>
              <strong>Workflow Stream:</strong> Observes workflow execution behavior including
              task duration, routing patterns, decision agent responses, and error rates,
              comparing these against established behavioral baselines.
            </li>
          </ul>
          <p>
            Both streams follow the same Continuous Alignment Verification Level 1 model:
            establish Observed Truth, define Identity Slices, derive Observed Baselines from
            historical behavior, detect sustained Divergence, and present explainable Evidence.
          </p>
        </section>

        <section>
          <h2>Architecture</h2>
          <p>
            IDP-Align is built as a feature-sliced Angular application with a clear separation
            between business/domain logic and data sources:
          </p>
          <ul>
            <li>
              <strong>UI Components (src/app/shared/ui/):</strong> Reusable dashboard components
              (KPI cards, divergence cards, evidence traces) work with both streams using
              consistent terminology and interaction patterns.
            </li>
            <li>
              <strong>Features (src/app/features/):</strong> Dashboard and About routes, each
              encapsulated with its own domain logic and state management using Angular signals.
            </li>
            <li>
              <strong>Domain/Services (src/app/domain/):</strong> Pure functions for Observed
              Truth construction, Identity Slicing, Baseline calculation, and Divergence
              detection — independent of presentation or data source.
            </li>
            <li>
              <strong>Repository Pattern (src/app/data/):</strong> Repository interfaces define
              the contract for stream data. Initial implementation uses local replay fixtures.
              Future implementations can substitute a BFF/API adapter or database-backed adapter
              without changing dashboard or domain logic.
            </li>
          </ul>
          <p>
            This repository/adapter boundary ensures that mock data used for the reference
            implementation can be replaced with live enterprise platform API calls or
            database-backed sources without requiring dashboard rewrites.
          </p>
        </section>

        <section>
          <h2>CAV Level 1 Scope</h2>
          <p>
            IDP-Align implements <strong>Continuous Alignment Verification Level 1 — Observed-State
            Divergence</strong>. It demonstrates:
          </p>
          <ul>
            <li>Continuous or replayed observation of system behavior</li>
            <li>Observed Truth modeling from raw observations</li>
            <li>Identity Slicing to organize observations into meaningful cohorts</li>
            <li>Observed Baseline derivation from historical behavior</li>
            <li>Sustained Divergence detection (not one-off anomaly flagging)</li>
            <li>Evidence persistence and explainable findings</li>
          </ul>
          <p>
            IDP-Align does <strong>not</strong> implement Levels 2–6 (multi-source reconciliation,
            declared-intent registries, alignment deltas, drift velocity, or convergence enforcement).
            It does not provide root-cause attribution or claim that displaying multiple streams
            constitutes formal cross-stream alignment analysis.
          </p>
        </section>

        <section>
          <h2>MOD-W Workflow</h2>
          <p>
            IDP-Align is itself a MOD-W (Moderated AI Development Workflow) project. This
            implementation serves as a practical assessment of the current MOD-W version in a
            realistic, scoped build. The project follows MOD-W phases:
          </p>
          <ul>
            <li><strong>Product Definition:</strong> Product requirements and acceptance criteria</li>
            <li><strong>Design:</strong> Design specification, approved UI/UX patterns, and interactive prototype</li>
            <li><strong>Architecture Definition:</strong> Technical decisions, layer decomposition, and data flow</li>
            <li><strong>Implementation (STEP-01+):</strong> Incremental build with quality gates and Moderator approval</li>
            <li><strong>Testing & Review:</strong> Tech Lead review and QA acceptance gates</li>
          </ul>
          <p>
            The dashboard you are viewing represents the initial STEP-01 foundation, with
            placeholder regions for subsequent work. Future steps will add divergence logic,
            evidence traces, chart analysis, and workflow stream parity.
          </p>
        </section>

        <section>
          <h2>Scope Boundaries</h2>
          <p>
            IDP-Align is a reference implementation scoped to demonstrate CAV Level 1 in a
            specific domain. It is <strong>not</strong>:
          </p>
          <ul>
            <li>A general-purpose IDP or workflow-orchestration engine</li>
            <li>A reimplementation of document extraction or workflow systems</li>
            <li>A production-grade multi-tenant SaaS product</li>
            <li>A benchmark or market analysis</li>
            <li>A formal certification of MOD-W methodology</li>
          </ul>
          <p>
            All mock and replay data is derived from publicly documented system APIs and realistic
            enterprise scenarios, but is not real production data. Live enterprise platform
            integration is an opportunistic extension, not a dependency.
          </p>
        </section>

        <section>
          <h2>What's Next</h2>
          <p>
            This is the dashboard foundation. Upcoming implementation steps will add:
          </p>
          <ul>
            <li>CAV domain model types and repository implementations</li>
            <li>Observed Baseline and sustained Divergence logic</li>
            <li>Divergence list, detail, and evidence trace rendering</li>
            <li>Interactive filters, sorting, and state management</li>
            <li>Chart.js analysis view with metric switching</li>
            <li>Workflow stream parity and cross-stream consistency</li>
          </ul>
          <p>
            Each step is implemented, reviewed by a Tech Lead, tested, and approved by a
            Moderator before proceeding to the next phase.
          </p>
        </section>

        <section>
          <h2>Questions?</h2>
          <p>
            Refer to the project documentation in <code>mod-w/</code> for design specifications,
            architecture decisions, domain language, and roadmap details. The prototype files are
            in <code>mod-w/design/project/</code> for reference.
          </p>
        </section>
      </article>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-lg);
    }

    .about-content {
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
    }

    h1 {
      font-size: var(--font-size-display);
      margin-bottom: var(--space-lg);
      color: var(--color-text-primary);
    }

    h2 {
      font-size: var(--font-size-heading);
      margin-top: var(--space-lg);
      margin-bottom: var(--space-md);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--space-sm);
    }

    section {
      margin-bottom: var(--space-lg);
    }

    p {
      margin-bottom: var(--space-md);
      color: var(--color-text-primary);
    }

    ul {
      margin-left: var(--space-lg);
      margin-bottom: var(--space-md);
      list-style: none;
      padding: 0;
    }

    li {
      margin-bottom: var(--space-sm);
      padding-left: var(--space-md);
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--color-divergence-ongoing);
      }
    }

    strong {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }

    code {
      background: var(--color-bg-surface);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      font-family: 'Courier New', monospace;
      font-size: var(--font-size-caption);
      color: var(--color-baseline);
    }

    @media (max-width: 768px) {
      .about-container {
        padding: var(--space-md);
      }

      h1 {
        font-size: var(--font-size-heading);
      }

      h2 {
        font-size: var(--font-size-body);
      }
    }
  `],
})
export class AboutComponent {}
