import { parseNumber } from "./parseNumber";

describe("parseNumber", () => {
  it("유효한 숫자 문자열이면 숫자로 변환해 반환한다.", () => {
    expect(parseNumber("37.5665", 0)).toBe(37.5665);
  });

  it("정수 문자열이면 정수로 반환한다.", () => {
    expect(parseNumber("1000", 0)).toBe(1000);
  });

  it("음수 문자열이면 음수로 반환한다.", () => {
    expect(parseNumber("-5", 0)).toBe(-5);
  });

  it("'0' 문자열이면 0을 반환한다.", () => {
    expect(parseNumber("0", 99)).toBe(0);
  });

  it("value가 null이면 fallback을 반환한다.", () => {
    expect(parseNumber(null, 126.977)).toBe(126.977);
  });

  it("숫자로 변환할 수 없는 문자열이면 fallback을 반환한다.", () => {
    expect(parseNumber("abc", 1000)).toBe(1000);
  });

  it("빈 문자열이면 Number('') === 0이므로 0을 반환한다.", () => {
    expect(parseNumber("", 500)).toBe(0);
  });
});
