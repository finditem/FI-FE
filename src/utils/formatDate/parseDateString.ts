const ISO_WITH_TIMEZONE_REGEX = /(Z|[+-]\d{2}:?\d{2})$/i;
const LOCAL_DATE_TIME_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2})(?::(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?)?)?$/;

const parseMilliseconds = (fractionalSeconds?: string) => {
  if (!fractionalSeconds) return 0;
  return Number(fractionalSeconds.slice(0, 3).padEnd(3, "0"));
};

const isSameLocalDateTime = (
  parsed: Date,
  expected: {
    year: number;
    month: number;
    date: number;
    hours: number;
    minutes: number;
    seconds: number;
  }
) =>
  parsed.getFullYear() === expected.year &&
  parsed.getMonth() === expected.month &&
  parsed.getDate() === expected.date &&
  parsed.getHours() === expected.hours &&
  parsed.getMinutes() === expected.minutes &&
  parsed.getSeconds() === expected.seconds;

/**
 * @author hyungjun
 *
 * @description
 * 날짜 문자열을 안전하게 `Date` 객체로 파싱합니다.
 * 타임존 정보가 포함된 문자열은 해당 타임존 기준으로 해석하고,
 * 타임존 정보가 없는 문자열은 로컬 시간으로 해석합니다.
 * `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm:ss(.fraction)` 형태는 수동 파싱 후
 * 검증(`isSameLocalDateTime`)을 거쳐 유효한 날짜만 반환합니다.
 *
 * @param input - ISO 8601 형식 또는 파싱 가능한 날짜 문자열
 * @returns 파싱 성공 시 `Date`, 실패 시 `null`
 *
 * @example
 * parseDateString("2026-04-02T13:50:05.488423"); // 로컬 시간 기준 Date
 * parseDateString("2026-04-02T13:50:05Z"); // UTC 기준 Date
 * parseDateString("invalid-date"); // null
 */
export const parseDateString = (input: string): Date | null => {
  if (!input) return null;

  if (ISO_WITH_TIMEZONE_REGEX.test(input)) {
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const matched = input.match(LOCAL_DATE_TIME_REGEX);
  if (!matched) {
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const [, year, month, date, hours = "00", minutes = "00", seconds = "00", fractionalSeconds] =
    matched;

  const next = {
    year: Number(year),
    month: Number(month) - 1,
    date: Number(date),
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds),
  };

  const parsed = new Date(
    next.year,
    next.month,
    next.date,
    next.hours,
    next.minutes,
    next.seconds,
    parseMilliseconds(fractionalSeconds)
  );

  if (!isSameLocalDateTime(parsed, next)) {
    return null;
  }

  return parsed;
};
