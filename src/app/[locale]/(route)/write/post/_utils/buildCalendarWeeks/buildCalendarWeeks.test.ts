import { buildCalendarWeeks } from "./buildCalendarWeeks";

const toYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

describe("buildCalendarWeeks", () => {
  it("항상 6주 × 7일을 반환한다", () => {
    const weeks = buildCalendarWeeks(2026, 7);

    expect(weeks).toHaveLength(6);
    weeks.forEach((week) => expect(week).toHaveLength(7));
  });

  it("첫 칸은 그 달 1일이 속한 주의 일요일이다", () => {
    // 2026-07-01은 수요일이므로 그 주 일요일은 2026-06-28이다.
    const weeks = buildCalendarWeeks(2026, 7);

    expect(toYmd(weeks[0][0])).toBe("2026-06-28");
    expect(weeks[0][0].getDay()).toBe(0);
  });

  it("모든 날짜가 하루씩 이어진다", () => {
    const days = buildCalendarWeeks(2026, 7).flat();

    days.slice(1).forEach((date, index) => {
      const previous = days[index];
      const diff = (date.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
      expect(Math.round(diff)).toBe(1);
    });
  });

  it("1일이 일요일인 달은 앞달 날짜가 섞이지 않는다", () => {
    // 2026-02-01은 일요일이다.
    const weeks = buildCalendarWeeks(2026, 2);

    expect(toYmd(weeks[0][0])).toBe("2026-02-01");
  });

  it("해를 넘기는 달도 이어서 계산한다", () => {
    const weeks = buildCalendarWeeks(2025, 12);
    const days = weeks.flat();

    expect(days.some((date) => date.getFullYear() === 2026)).toBe(true);
  });
});
