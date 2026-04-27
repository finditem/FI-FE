import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import type { MouseEvent } from "react";

import useHorizontalDragScroll from "./useHorizontalDragScroll";

const mouseDownOn = (
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void,
  el: HTMLDivElement,
  pageX: number
) => {
  onMouseDown({
    preventDefault: jest.fn(),
    pageX,
    currentTarget: el,
  } as unknown as MouseEvent<HTMLDivElement>);
};

const dispatchMouseMoveOnDocument = (pageX: number) => {
  const e = new MouseEvent("mousemove", { bubbles: true });
  Object.defineProperty(e, "pageX", { value: pageX, enumerable: true });
  document.dispatchEvent(e);
};

describe("useHorizontalDragScroll", () => {
  it("ref와 onMouseDown을 반환한다", () => {
    const { result } = renderHook(() => useHorizontalDragScroll());

    expect(result.current.ref.current).toBeNull();
    expect(result.current.onMouseDown).toEqual(expect.any(Function));
  });

  it("mousedown 후 mousemove에 따라 scrollLeft가 갱신된다", () => {
    const { result } = renderHook(() => useHorizontalDragScroll());
    let scrollLeft = 40;

    const el = document.createElement("div");
    Object.defineProperty(el, "scrollLeft", {
      configurable: true,
      get: () => scrollLeft,
      set: (v: number) => {
        scrollLeft = v;
      },
    });

    result.current.ref.current = el;

    mouseDownOn(result.current.onMouseDown, el, 100);
    dispatchMouseMoveOnDocument(130);

    expect(scrollLeft).toBe(10);
  });

  it("mouseup 이후 mousemove로는 scrollLeft가 바뀌지 않는다", () => {
    const { result } = renderHook(() => useHorizontalDragScroll());
    let scrollLeft = 0;

    const el = document.createElement("div");
    Object.defineProperty(el, "scrollLeft", {
      configurable: true,
      get: () => scrollLeft,
      set: (v: number) => {
        scrollLeft = v;
      },
    });

    result.current.ref.current = el;

    mouseDownOn(result.current.onMouseDown, el, 50);
    dispatchMouseMoveOnDocument(80);
    fireEvent.mouseUp(document);
    const afterUp = scrollLeft;
    dispatchMouseMoveOnDocument(200);

    expect(scrollLeft).toBe(afterUp);
  });

  it("mouseup 시 body 스타일과 document 리스너가 정리된다", () => {
    const { result } = renderHook(() => useHorizontalDragScroll());
    const el = document.createElement("div");
    result.current.ref.current = el;

    mouseDownOn(result.current.onMouseDown, el, 0);
    expect(document.body.style.cursor).toBe("grabbing");
    expect(document.body.style.userSelect).toBe("none");

    const removeSpy = jest.spyOn(document, "removeEventListener");

    fireEvent.mouseUp(document);

    expect(document.body.style.cursor).toBe("");
    expect(document.body.style.userSelect).toBe("");
    expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));

    removeSpy.mockRestore();
  });

  it("ref가 없을 때 mousedown은 예외 없이 무시한다", () => {
    const { result } = renderHook(() => useHorizontalDragScroll());
    const el = document.createElement("div");

    result.current.ref.current = null;

    expect(() => {
      mouseDownOn(result.current.onMouseDown, el, 0);
    }).not.toThrow();
  });
});
