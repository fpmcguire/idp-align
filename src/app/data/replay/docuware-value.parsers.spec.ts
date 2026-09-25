import { parseDocuWareDate, parseTimeSpan } from './docuware-value.parsers';

describe('DocuWare value parsers', () => {
  describe('parseDocuWareDate', () => {
    it('should convert the documented /Date(ms)/ form to an ISO timestamp', () => {
      expect(parseDocuWareDate('/Date(1726493198284)/')).toBe('2024-09-16T13:26:38.284Z');
    });

    it('should return null for other formats and non-strings', () => {
      expect(parseDocuWareDate('2026-09-01')).toBeNull();
      expect(parseDocuWareDate(null)).toBeNull();
      expect(parseDocuWareDate(1726493198284)).toBeNull();
    });
  });

  describe('parseTimeSpan', () => {
    it('should convert the documented runtime example to milliseconds', () => {
      expect(parseTimeSpan('00:00:34.6158214')).toBe(34_615);
    });

    it('should accept a day prefix and a missing fraction', () => {
      expect(parseTimeSpan('1.02:03:04')).toBe(((24 + 2) * 3_600 + 3 * 60 + 4) * 1_000);
    });

    it('should return null for unreadable values', () => {
      expect(parseTimeSpan('34 seconds')).toBeNull();
      expect(parseTimeSpan(undefined)).toBeNull();
    });
  });
});
