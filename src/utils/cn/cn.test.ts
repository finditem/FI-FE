import { cn } from "./cn";

describe("cn", () => {
  it("단일 클래스를 그대로 반환한다", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("여러 클래스를 공백으로 합쳐 반환한다", () => {
    expect(cn("px-4", "py-2", "text-sm")).toBe("px-4 py-2 text-sm");
  });

  it("false, undefined, null은 무시한다", () => {
    expect(cn("px-4", false, undefined, null, "text-sm")).toBe("px-4 text-sm");
  });

  it("조건이 true인 경우 클래스를 포함한다", () => {
    expect(cn("base", true && "active")).toBe("base active");
  });

  it("조건이 false인 경우 클래스를 제외한다", () => {
    expect(cn("base", false && "active")).toBe("base");
  });

  it("인자가 없으면 빈 문자열을 반환한다", () => {
    expect(cn()).toBe("");
  });
});
