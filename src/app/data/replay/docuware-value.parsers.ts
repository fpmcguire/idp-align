const DOCUWARE_DATE = /^\/Date\((-?\d+)\)\/$/;
const TIME_SPAN = /^(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?$/;

/** Converts a "/Date(ms)/" value to an ISO 8601 timestamp, or null if the format is not matched. */
export function parseDocuWareDate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = DOCUWARE_DATE.exec(value);
  return match ? new Date(Number(match[1])).toISOString() : null;
}

/** Converts a "[d.]hh:mm:ss[.fffffff]" duration to whole milliseconds, or null if not matched. */
export function parseTimeSpan(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = TIME_SPAN.exec(value);
  if (!match) return null;
  const [, days = '0', hours, minutes, seconds, fraction = '0'] = match;
  const totalSeconds =
    Number(days) * 86_400 + Number(hours) * 3_600 + Number(minutes) * 60 + Number(seconds);
  return totalSeconds * 1_000 + Math.floor(Number(`0.${fraction}`) * 1_000);
}
