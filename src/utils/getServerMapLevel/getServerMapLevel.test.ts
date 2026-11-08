import { getServerMapLevel } from "./getServerMapLevel";

describe("getServerMapLevel", () => {
  it("줌을 20 - zoom 레벨로 변환한다", () => {
    expect(getServerMapLevel(15)).toBe(5);
    expect(getServerMapLevel(14)).toBe(6);
    expect(getServerMapLevel(12)).toBe(8);
  });

  it("줌이 19를 넘어도 1 미만으로 내려가지 않는다", () => {
    expect(getServerMapLevel(20)).toBe(1);
    expect(getServerMapLevel(21)).toBe(1);
  });

  it("줌이 12보다 작아도 서버가 처리하는 상한 8을 넘지 않는다", () => {
    expect(getServerMapLevel(11)).toBe(8);
    expect(getServerMapLevel(6)).toBe(8);
  });
});
