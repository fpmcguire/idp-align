import { amountDivergence } from '../../../testing/divergence-builders';
import { Divergence } from '../../domain/divergence';
import { documentIdentitySlice } from '../../domain/identity-slice';
import {
  DEFAULT_FILTERS,
  DivergenceSortKey,
  applyDivergenceFilters,
  hasActiveFilters,
  sortDivergences,
  statusesPresent,
  timeRangeStart,
} from './dashboard-filters';
import { orderByOnset } from './dashboard.facade';

const base = amountDivergence();
const kappa = documentIdentitySlice('Kappa Paper (synthetic)', 'Invoice');
const alpha = documentIdentitySlice('Alpha Office Supplies (synthetic)', 'Invoice');

const divergence = (id: string, overrides: Partial<Divergence> = {}): Divergence => ({
  ...base,
  id,
  ...overrides,
});

const LATEST = '2026-09-11T12:00:00.000Z';
const ids = (divergences: readonly Divergence[]) => divergences.map(d => d.id);

describe('dashboard filters', () => {
  const records = [
    divergence('kappa-amount', { identitySlice: kappa, latestObservedAt: '2026-09-10T12:00:00.000Z' }),
    divergence('alpha-amount', {
      identitySlice: alpha,
      status: 'resolved',
      latestObservedAt: '2026-08-20T12:00:00.000Z',
    }),
    divergence('alpha-currency', {
      identitySlice: alpha,
      dimension: 'amount-currency',
      latestObservedAt: '2026-09-04T12:00:00.000Z',
    }),
  ];

  describe('hasActiveFilters', () => {
    it('should report no active filters for the defaults', () => {
      expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    });

    it('should report each filter as active', () => {
      expect(hasActiveFilters({ ...DEFAULT_FILTERS, identitySliceId: kappa.id })).toBe(true);
      expect(hasActiveFilters({ ...DEFAULT_FILTERS, timeRange: 'last-7-days' })).toBe(true);
      expect(hasActiveFilters({ ...DEFAULT_FILTERS, status: 'ongoing' })).toBe(true);
    });
  });

  describe('timeRangeStart', () => {
    it('should measure back from the latest observation, not from today', () => {
      expect(timeRangeStart('last-7-days', LATEST)).toBe(Date.parse('2026-09-04T12:00:00.000Z'));
      expect(timeRangeStart('last-30-days', LATEST)).toBe(Date.parse('2026-08-12T12:00:00.000Z'));
    });

    it('should be unbounded for all observations or a stream without observations', () => {
      expect(timeRangeStart('all', LATEST)).toBeNull();
      expect(timeRangeStart('last-7-days', null)).toBeNull();
    });
  });

  describe('applyDivergenceFilters', () => {
    it('should keep every Divergence with the default filters', () => {
      expect(ids(applyDivergenceFilters(records, DEFAULT_FILTERS, LATEST))).toEqual(ids(records));
    });

    it('should filter by Identity Slice', () => {
      const filters = { ...DEFAULT_FILTERS, identitySliceId: alpha.id };

      expect(ids(applyDivergenceFilters(records, filters, LATEST))).toEqual([
        'alpha-amount',
        'alpha-currency',
      ]);
    });

    it('should filter by lifecycle status', () => {
      const filters = { ...DEFAULT_FILTERS, status: 'resolved' as const };

      expect(ids(applyDivergenceFilters(records, filters, LATEST))).toEqual(['alpha-amount']);
    });

    it('should keep Divergences whose latest observation falls in the time range', () => {
      const filters = { ...DEFAULT_FILTERS, timeRange: 'last-7-days' as const };

      // alpha-currency's latest observation is exactly at the range start, so it is included.
      expect(ids(applyDivergenceFilters(records, filters, LATEST))).toEqual([
        'kappa-amount',
        'alpha-currency',
      ]);
    });

    it('should keep a Divergence with an early onset when it was observed in the range', () => {
      const early = divergence('early-onset', {
        onset: '2026-07-01T00:00:00.000Z',
        latestObservedAt: '2026-09-11T00:00:00.000Z',
      });
      const filters = { ...DEFAULT_FILTERS, timeRange: 'last-7-days' as const };

      expect(ids(applyDivergenceFilters([early], filters, LATEST))).toEqual(['early-onset']);
    });

    it('should combine filters', () => {
      const filters = {
        identitySliceId: alpha.id,
        timeRange: 'last-30-days' as const,
        status: 'ongoing' as const,
      };

      expect(ids(applyDivergenceFilters(records, filters, LATEST))).toEqual(['alpha-currency']);
    });

    it('should return nothing when no Divergence matches', () => {
      const filters = { ...DEFAULT_FILTERS, identitySliceId: kappa.id, status: 'resolved' as const };

      expect(applyDivergenceFilters(records, filters, LATEST)).toEqual([]);
    });

    it('should not change the records it filters', () => {
      const before = [...records];
      applyDivergenceFilters(records, { ...DEFAULT_FILTERS, status: 'ongoing' }, LATEST);

      expect(records).toEqual(before);
    });
  });

  describe('sortDivergences', () => {
    // Already in onset order, as the facade provides them.
    const ordered = orderByOnset([
      divergence('1', { identitySlice: kappa, dimension: 'amount-value', status: 'ongoing', onset: '2026-09-01T00:00:00.000Z' }),
      divergence('2', { identitySlice: alpha, dimension: 'amount-value', status: 'resolved', onset: '2026-09-02T00:00:00.000Z' }),
      divergence('3', { identitySlice: kappa, dimension: 'amount-currency', status: 'ongoing', onset: '2026-09-03T00:00:00.000Z' }),
      divergence('4', { identitySlice: alpha, dimension: 'amount-currency', status: 'ongoing', onset: '2026-09-04T00:00:00.000Z' }),
    ]);

    const sorted = (key: DivergenceSortKey) => ids(sortDivergences(ordered, key));

    it('should keep onset order by default', () => {
      expect(sorted('onset')).toEqual(['1', '2', '3', '4']);
    });

    it('should sort by Identity Slice label, keeping onset order for equal labels', () => {
      expect(sorted('identity-slice')).toEqual(['2', '4', '1', '3']);
    });

    it('should sort by dimension label, keeping onset order for equal labels', () => {
      // "Amount" sorts before "Currency".
      expect(sorted('dimension')).toEqual(['1', '2', '3', '4']);
      const reversed = sortDivergences([...ordered].reverse(), 'dimension');
      expect(ids(reversed)).toEqual(['2', '1', '4', '3']);
    });

    it('should sort by lifecycle status order, keeping onset order for equal statuses', () => {
      expect(sorted('status')).toEqual(['1', '3', '4', '2']);
    });

    it('should not change the records it sorts', () => {
      sortDivergences(ordered, 'identity-slice');

      expect(ids(ordered)).toEqual(['1', '2', '3', '4']);
    });
  });

  describe('statusesPresent', () => {
    it('should list the statuses present, in lifecycle order', () => {
      expect(statusesPresent(records)).toEqual(['ongoing', 'resolved']);
      expect(statusesPresent([])).toEqual([]);
    });
  });
});
