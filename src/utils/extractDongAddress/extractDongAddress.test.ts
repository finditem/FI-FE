import { extractDongAddress } from "./extractDongAddress";

describe("extractDongAddress", () => {
  it("공백으로 구분된 토큰 중 뒤에서부터 `동`으로 끝나는 첫 토큰을 반환한다", () => {
    expect(extractDongAddress("서울특별시 강남구 역삼동 123-45")).toBe("역삼동");
  });

  it("여러 `동` 토큰이 있으면 배열 뒤쪽에 가까운 것을 반환한다", () => {
    expect(extractDongAddress("서울 광진구 능동 봉천동 12")).toBe("봉천동");
  });

  it("단일 토큰이 `…동`이면 그대로 반환한다", () => {
    expect(extractDongAddress("역삼동")).toBe("역삼동");
  });

  it("`동`으로 끝나는 토큰이 없으면 빈 문자열을 반환한다", () => {
    expect(extractDongAddress("서울특별시 강남구 테헤란로 123")).toBe("");
  });

  it("빈 문자열이면 빈 문자열을 반환한다", () => {
    expect(extractDongAddress("")).toBe("");
  });

  it("공백만 있으면 빈 문자열을 반환한다", () => {
    expect(extractDongAddress("   ")).toBe("");
  });

  it("연속 공백이 있어도 정상적으로 토큰을 찾는다", () => {
    expect(extractDongAddress("서울  강남구  역삼동")).toBe("역삼동");
  });
});
