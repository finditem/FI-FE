import { formatPostDate } from "./formatPostDate";

const NOW = new Date("2026-09-27T12:00:00");

const pad = (value: number) => String(value).padStart(2, "0");

const toLocalString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** 화면에서는 useFormatPostDate가 번역을 넘기므로, 테스트는 한국어 라벨을 직접 만들어 넘긴다. */
const koLabels = {
  minutesAgo: (minutes: number) => `${minutes}분 전`,
  hoursAgo: (hours: number) => `${hours}시간 전`,
  daysAgo: (days: number) => `${days}일 전`,
  weeksAgo: (weeks: number) => `${weeks}주 전`,
  monthsAgo: (months: number) => `${months}개월 전`,
  yearsAgo: (years: number) => `${years}년 전`,
};

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

/** NOW보다 `ms`만큼 과거인 날짜 문자열 (음수를 주면 미래) */
const ago = (ms: number) => toLocalString(new Date(NOW.getTime() - ms));

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("formatPostDate", () => {
  it("1시간 미만은 N분 전으로 표기한다", () => {
    expect(formatPostDate(ago(MS_IN_MINUTE), koLabels)).toBe("1분 전");
    expect(formatPostDate(ago(30 * MS_IN_MINUTE), koLabels)).toBe("30분 전");
    expect(formatPostDate(ago(59 * MS_IN_MINUTE), koLabels)).toBe("59분 전");
  });

  it("1분 미만도 1분 전으로 표기한다", () => {
    expect(formatPostDate(ago(0), koLabels)).toBe("1분 전");
    expect(formatPostDate(ago(30 * 1000), koLabels)).toBe("1분 전");
  });

  it("1시간 이상 1일 미만은 N시간 전으로 표기한다", () => {
    expect(formatPostDate(ago(MS_IN_HOUR), koLabels)).toBe("1시간 전");
    expect(formatPostDate(ago(23 * MS_IN_HOUR), koLabels)).toBe("23시간 전");
  });

  it("1일 이상 7일 미만은 N일 전으로 표기한다", () => {
    expect(formatPostDate(ago(MS_IN_DAY), koLabels)).toBe("1일 전");
    expect(formatPostDate(ago(6 * MS_IN_DAY), koLabels)).toBe("6일 전");
  });

  it("7일 이상 30일 미만은 N주 전으로 표기한다", () => {
    expect(formatPostDate(ago(7 * MS_IN_DAY), koLabels)).toBe("1주 전");
    expect(formatPostDate(ago(13 * MS_IN_DAY), koLabels)).toBe("1주 전");
    expect(formatPostDate(ago(14 * MS_IN_DAY), koLabels)).toBe("2주 전");
    expect(formatPostDate(ago(29 * MS_IN_DAY), koLabels)).toBe("4주 전");
  });

  it("30일 이상 365일 미만은 N개월 전으로 표기한다", () => {
    expect(formatPostDate(ago(30 * MS_IN_DAY), koLabels)).toBe("1개월 전");
    expect(formatPostDate(ago(59 * MS_IN_DAY), koLabels)).toBe("1개월 전");
    expect(formatPostDate(ago(60 * MS_IN_DAY), koLabels)).toBe("2개월 전");
    expect(formatPostDate(ago(364 * MS_IN_DAY), koLabels)).toBe("12개월 전");
  });

  it("365일 이상은 N년 전으로 표기한다", () => {
    expect(formatPostDate(ago(365 * MS_IN_DAY), koLabels)).toBe("1년 전");
    expect(formatPostDate(ago(729 * MS_IN_DAY), koLabels)).toBe("1년 전");
    expect(formatPostDate(ago(730 * MS_IN_DAY), koLabels)).toBe("2년 전");
  });

  it("미래 시각은 시계 차이로 보고 1분 전으로 표기한다", () => {
    expect(formatPostDate(ago(-MS_IN_HOUR), koLabels)).toBe("1분 전");
  });

  it("읽을 수 없는 값은 빈 문자열을 반환한다", () => {
    expect(formatPostDate("", koLabels)).toBe("");
    expect(formatPostDate("날짜 아님", koLabels)).toBe("");
  });

  it("넘긴 라벨로 문구를 만든다", () => {
    const labels = {
      minutesAgo: (minutes: number) => `${minutes} minutes ago`,
      hoursAgo: (hours: number) => `${hours} hours ago`,
      daysAgo: (days: number) => `${days} days ago`,
      weeksAgo: (weeks: number) => `${weeks} weeks ago`,
      monthsAgo: (months: number) => `${months} months ago`,
      yearsAgo: (years: number) => `${years} years ago`,
    };

    expect(formatPostDate(ago(30 * MS_IN_MINUTE), labels)).toBe("30 minutes ago");
    expect(formatPostDate(ago(3 * MS_IN_DAY), labels)).toBe("3 days ago");
    expect(formatPostDate(ago(400 * MS_IN_DAY), labels)).toBe("1 years ago");
  });
});
