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
 * 날짜 문자열을 `Date`로 파싱합니다. 타임존 유무에 따라 해석 기준이 달라집니다.
 *
 * @remarks
 * - 끝이 `Z` 또는 `±HH:MM`이면 `new Date`에 그대로 넘겨(브라우저·런타임) 해당 오프셋/UTC로 해석합니다.
 * - 타임존 표기가 없는 `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm:ss(.fraction)` 는 로컬 구성요소로 `Date`를 만든 뒤, `isSameLocalDateTime`로 역검증해 달력과 시각이 일치할 때만 반환합니다. (존재하지 않는 날짜·시간은 `null`)
 * - 위 패턴에 맞지 않으면 `new Date(input)`에 맡깁니다.
 * - 빈 문자열이면 `null`입니다.
 *
 * @param input - ISO 8601에 가까운 형태 또는 `Date` 생성자에 넘길 수 있는 문자열
 *
 * @returns 파싱·검증 성공 시 `Date`, 그렇지 않으면 `null`
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * parseDateString("2026-04-02T13:50:05.488423");
 * // 로컬 2026-04-02 13:50:05.xxx
 *
 * parseDateString("2026-04-02T13:50:05Z");
 * // UTC 기준
 *
 * parseDateString("invalid");
 * // null
 * ```
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
