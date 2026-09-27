import { Component, input } from '@angular/core';
import { IdentitySliceStateKind, IdentitySliceStateView } from './identity-slice-states.model';

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

/**
 * Detector output for each Identity Slice in a stream. Shows the counts it is given; it reads no
 * repository, detector, or replay data and offers no action.
 */
@Component({
  selector: 'app-identity-slice-states',
  standalone: true,
  templateUrl: './identity-slice-states.component.html',
  styleUrls: ['./identity-slice-states.component.scss'],
})
export class IdentitySliceStatesComponent {
  readonly states = input.required<readonly IdentitySliceStateView[]>();

  stateLabel(state: IdentitySliceStateView): string {
    const labels: Record<IdentitySliceStateKind, string> = {
      'surfaced-divergence': `${state.divergenceCount} surfaced ${plural(state.divergenceCount, 'Divergence', 'Divergences')}`,
      'no-surfaced-divergence': 'No surfaced Divergence',
      'no-observed-baseline': 'No Observed Baseline',
    };
    return labels[state.state];
  }

  baselineLabel(state: IdentitySliceStateView): string {
    return `${state.observedBaselineCount} of ${state.dimensionCount} ${plural(state.dimensionCount, 'dimension', 'dimensions')}`;
  }
}
