import { Component, computed, signal } from '@angular/core';

/** Identity Slice state wording shared with the Dashboard's Identity Slice states. */
export type ArchitectureSliceState = 'Surfaced Divergence' | 'No surfaced Divergence';

export interface ArchitectureSupplierRow {
  readonly supplier: string;
  readonly state: ArchitectureSliceState;
}

/**
 * The synthetic Supplier x Invoice scenario, as explanatory copy. It is static on purpose: this page
 * does not run detection. The component spec derives the same rows from the replay fixture through
 * the Dashboard's detection path, so drift from the fixture fails a test.
 */
export const ARCHITECTURE_INVOICE_POPULATION = 'Invoice';

export const ARCHITECTURE_SUPPLIER_ROWS: readonly ArchitectureSupplierRow[] = [
  { supplier: 'Alpha Office Supplies (synthetic)', state: 'Surfaced Divergence' },
  { supplier: 'Beta Freight Services (synthetic)', state: 'No surfaced Divergence' },
  { supplier: 'Delta Packaging Supplies (synthetic)', state: 'No surfaced Divergence' },
  { supplier: 'Epsilon Print Services (synthetic)', state: 'No surfaced Divergence' },
  { supplier: 'Gamma Facilities Care (synthetic)', state: 'No surfaced Divergence' },
];

@Component({
  selector: 'app-architecture',
  standalone: true,
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss'],
})
export class ArchitectureComponent {
  readonly population = ARCHITECTURE_INVOICE_POPULATION;
  readonly supplierRows = signal(ARCHITECTURE_SUPPLIER_ROWS);

  readonly summary = computed(() => {
    const rows = this.supplierRows();
    const surfaced = rows.filter(row => row.state === 'Surfaced Divergence').length;
    return `${rows.length} Identity Slices observed / ${surfaced} with surfaced Divergence`;
  });
}
