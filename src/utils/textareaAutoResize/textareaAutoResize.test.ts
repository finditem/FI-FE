import { MAX_TEXTAREA_HEIGHT_PX, textareaAutoResize } from "./textareaAutoResize";

describe("textareaAutoResize", () => {
  const createTextarea = () => document.createElement("textarea");

  it("scrollHeight가 상한 이하면 그만큼 height(px)로 맞춘다", () => {
    const ta = createTextarea();
    Object.defineProperty(ta, "scrollHeight", { value: 80, configurable: true });
    textareaAutoResize(ta);
    expect(ta.style.height).toBe("80px");
  });

  it("scrollHeight가 상한을 넘으면 height는 상한(px)로 제한한다", () => {
    const ta = createTextarea();
    Object.defineProperty(ta, "scrollHeight", { value: 500, configurable: true });
    textareaAutoResize(ta);
    expect(ta.style.height).toBe(`${MAX_TEXTAREA_HEIGHT_PX}px`);
  });

  it("overflowY는 hidden", () => {
    const ta = createTextarea();
    Object.defineProperty(ta, "scrollHeight", { value: 40, configurable: true });
    textareaAutoResize(ta);
    expect(ta.style.overflowY).toBe("hidden");
  });
});
