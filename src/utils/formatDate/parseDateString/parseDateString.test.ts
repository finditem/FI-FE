import { parseDateString } from "./parseDateString";

describe("parseDateString", () => {
  it("빈 문자열이면 null", () => {
    expect(parseDateString("")).toBeNull();
  });

  it("타임존이 있으면 Date 생성자에 맡기고, 유효하면 Date를 반환한다", () => {
    const a = parseDateString("2020-01-15T00:00:00Z");
    const b = parseDateString("2020-01-15T00:00:00+09:00");
    expect(a).toBeInstanceOf(Date);
    expect(b).toBeInstanceOf(Date);
    expect(a?.getTime()).not.toBeNaN();
    expect(b?.getTime()).not.toBeNaN();
  });

  it("Z가 붙은 잘못된 문자열이면 null", () => {
    expect(parseDateString("2020-13-40T00:00:00Z")).toBeNull();
  });

  it("타임존 없이 YYYY-MM-DDTHH:mm:ss 는 로컬로 파싱하고, 성분이 일치하면 Date를 반환한다", () => {
    const d = parseDateString("2020-01-15T10:30:00");
    expect(d).toBeInstanceOf(Date);
    expect(d?.getFullYear()).toBe(2020);
    expect(d?.getMonth()).toBe(0);
    expect(d?.getDate()).toBe(15);
    expect(d?.getHours()).toBe(10);
    expect(d?.getMinutes()).toBe(30);
  });

  it("날짜만 있으면 시는 00:00:00으로 간주한다", () => {
    const d = parseDateString("2020-01-15");
    expect(d).toBeInstanceOf(Date);
    expect(d?.getHours()).toBe(0);
    expect(d?.getMinutes()).toBe(0);
  });

  it("소수 초는 밀리초 세 자리까지만 사용한다", () => {
    const d = parseDateString("2020-01-15T00:00:00.123456789");
    expect(d).toBeInstanceOf(Date);
    expect(d?.getMilliseconds()).toBe(123);
  });

  it("존재하지 않는 로컬 날짜(역검증 실패)이면 null", () => {
    expect(parseDateString("2020-02-30")).toBeNull();
  });

  it("로컬 패턴에 맞지 않는 문자열은 new Date에 맡긴다", () => {
    const d = parseDateString("Jan 15, 2020");
    expect(d).toBeInstanceOf(Date);
  });

  it("new Date(NaN)이 되는 문자열이면 null", () => {
    expect(parseDateString("invalid-xxx")).toBeNull();
  });
});
