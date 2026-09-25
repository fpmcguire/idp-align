import {
  frequencyDistribution,
  mean,
  median,
  sampleStandardDeviation,
} from './baseline-statistics';

describe('baseline statistics', () => {
  it('should compute the mean', () => {
    expect(mean([2, 4, 9])).toBe(5);
    expect(mean([7])).toBe(7);
  });

  it('should compute the sample standard deviation with an n - 1 denominator', () => {
    expect(sampleStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.138, 3);
  });

  it('should return zero spread for a single value or identical values', () => {
    expect(sampleStandardDeviation([5])).toBe(0);
    expect(sampleStandardDeviation([3, 3, 3])).toBe(0);
  });

  it('should compute the median for odd and even counts without reordering the input', () => {
    const values = [9, 1, 5];

    expect(median(values)).toBe(5);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(values).toEqual([9, 1, 5]);
  });

  it('should list value frequencies most frequent first, breaking ties by value', () => {
    expect(frequencyDistribution(['EUR', 'USD', 'EUR', 'CHF'])).toEqual([
      { value: 'EUR', count: 2, share: 0.5 },
      { value: 'CHF', count: 1, share: 0.25 },
      { value: 'USD', count: 1, share: 0.25 },
    ]);
  });
});
