import { formatDateToYmd } from "./formatDateToYmd";

describe("formatDateToYmd", () => {
  it("Date를 YYYY-MM-DD로 만든다", () => {
    expect(formatDateToYmd(new Date(2026, 7, 22))).toBe("2026-08-22");
  });

  it("한 자리 월과 일도 두 자리로 채운다", () => {
    expect(formatDateToYmd(new Date(2026, 0, 2))).toBe("2026-01-02");
  });

  it("로컬 기준이라 늦은 시각에도 날짜가 밀리지 않는다", () => {
    // toISOString()으로 만들면 KST 기준 23시대는 다음 날 UTC로 밀린다.
    expect(formatDateToYmd(new Date(2026, 7, 22, 23, 59, 59))).toBe("2026-08-22");
  });
});
