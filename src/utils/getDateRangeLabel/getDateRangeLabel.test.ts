import { getDateRangeLabel } from "./getDateRangeLabel";

describe("getDateRangeLabel", () => {
  it("유효한 날짜가 없으면 전달받은 기본 레이블을 반환한다", () => {
    expect(getDateRangeLabel("bad", null, "Date")).toBe("Date");
  });

  it("기본 레이블을 전달하지 않으면 기존 한국어 레이블을 반환한다", () => {
    expect(getDateRangeLabel("bad", null)).toBe("기간");
  });
});
