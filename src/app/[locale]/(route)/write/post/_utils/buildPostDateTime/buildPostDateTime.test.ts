import { buildPostDateTime } from "./buildPostDateTime";

const NOW = new Date(2026, 7, 23, 14, 30, 5);

describe("buildPostDateTime", () => {
  it("고른 날짜에 제출 시각의 시·분·초를 붙인다", () => {
    expect(buildPostDateTime("2026-08-22", NOW)).toBe("2026-08-22T14:30:05");
  });

  it("타임존 표기 없이 YYYY-MM-DDTHH:mm:ss 형식으로 만든다", () => {
    expect(buildPostDateTime("2026-08-22", NOW)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  });

  it("한 자리 값도 두 자리로 채운다", () => {
    expect(buildPostDateTime("2026-01-02", new Date(2026, 0, 2, 3, 4, 5))).toBe(
      "2026-01-02T03:04:05"
    );
  });

  it("수정 화면에서 들어오는 ISO 문자열도 읽는다", () => {
    expect(buildPostDateTime("2026-03-05T09:10:11", NOW)).toBe("2026-03-05T14:30:05");
  });

  it("날짜를 읽을 수 없으면 기준 시각의 날짜를 쓴다", () => {
    expect(buildPostDateTime("", NOW)).toBe("2026-08-23T14:30:05");
    expect(buildPostDateTime("올바르지 않은 값", NOW)).toBe("2026-08-23T14:30:05");
  });

  it("고른 날짜는 로컬 기준 그대로 유지한다", () => {
    // toISOString()으로 만들면 UTC로 밀려 하루가 어긋날 수 있는 시각이다.
    expect(buildPostDateTime("2026-08-22", new Date(2026, 7, 23, 23, 59, 59))).toBe(
      "2026-08-22T23:59:59"
    );
  });
});
