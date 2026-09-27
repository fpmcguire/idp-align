import { Component, computed, input } from '@angular/core';
import { PopulationSummaryView } from './identity-slice-states.model';

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

/**
 * One factual line per population, such as "Invoice: 5 Identity Slices observed / 1 with surfaced
 * Divergence". The counts describe Identity Slices only, never the stream as a whole.
 */
@Component({
  selector: 'app-population-summary',
  standalone: true,
  templateUrl: './population-summary.component.html',
  styleUrls: ['./population-summary.component.scss'],
})
export class PopulationSummaryComponent {
  readonly summaries = input.required<readonly PopulationSummaryView[]>();

  readonly lines = computed(() =>
    this.summaries().map(p => ({
      population: p.population,
      text:
        `${p.population}: ${p.identitySliceCount} ` +
        `${plural(p.identitySliceCount, 'Identity Slice', 'Identity Slices')} observed / ` +
        `${p.withSurfacedDivergence} with surfaced Divergence`,
    })),
  );
}
