import { formatKoreanDate, getDateKey } from "./formatKoreanDate";

describe("formatKoreanDate", () => {
  it("로컬 달력 기준 YYYY.MM.DD 와 한국어 요일을 반환한다 (타임존 없는 ISO)", () => {
    expect(formatKoreanDate("2025-02-09T00:00:00")).toBe("2025.02.09 일요일");
  });

  it("파싱 실패 시 빈 문자열", () => {
    expect(formatKoreanDate("invalid")).toBe("");
  });
});

describe("getDateKey", () => {
  it("로컬 날짜로 년-월(0~11)-일 키를 만든다", () => {
    expect(getDateKey("2025-02-09T00:00:00")).toBe("2025-1-9");
  });

  it("파싱 실패 시 빈 문자열", () => {
    expect(getDateKey("invalid")).toBe("");
  });
});
