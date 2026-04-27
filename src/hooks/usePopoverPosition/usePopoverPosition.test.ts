import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import usePopoverPosition from "./usePopoverPosition";

const domRect = (left: number, top: number, width: number, height: number): DOMRect => ({
  left,
  top,
  width,
  height,
  x: left,
  y: top,
  right: left + width,
  bottom: top + height,
  toJSON: () => ({}),
});

describe("usePopoverPosition", () => {
  let anchor: HTMLDivElement;
  let popover: HTMLDivElement;
  let anchorRef: RefObject<HTMLDivElement | null>;
  let popoverRef: RefObject<HTMLDivElement | null>;

  beforeEach(() => {
    anchor = document.createElement("div");
    popover = document.createElement("div");
    anchorRef = { current: anchor };
    popoverRef = { current: popover };

    jest.spyOn(anchor, "getBoundingClientRect").mockReturnValue(domRect(10, 20, 100, 30));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("isOpen이 false이면 scroll/resize 리스너를 등록하지 않는다", () => {
    const add = jest.spyOn(window, "addEventListener");

    renderHook(() => usePopoverPosition(false, anchorRef, popoverRef));

    expect(add).not.toHaveBeenCalledWith("scroll", expect.any(Function), true);
    expect(add).not.toHaveBeenCalledWith("resize", expect.any(Function));

    add.mockRestore();
  });

  it("isOpen이 true이면 앵커 rect 기준으로 팝오버 left/top/width를 설정한다", () => {
    renderHook(() => usePopoverPosition(true, anchorRef, popoverRef));

    expect(popover.style.left).toBe("10px");
    expect(popover.style.top).toBe("58px");
    expect(popover.style.width).toBe("100px");
  });

  it("offset을 바꾸면 top에 반영된다", () => {
    renderHook(() => usePopoverPosition(true, anchorRef, popoverRef, 4));

    expect(popover.style.top).toBe("54px");
  });

  it("minWidthPx가 앵커보다 크면 width에 반영된다", () => {
    renderHook(() => usePopoverPosition(true, anchorRef, popoverRef, 8, 160));

    expect(popover.style.width).toBe("160px");
  });

  it("minWidthPx가 앵커보다 작으면 앵커 너비를 쓴다", () => {
    renderHook(() => usePopoverPosition(true, anchorRef, popoverRef, 8, 50));

    expect(popover.style.width).toBe("100px");
  });

  it("resize 이벤트 후 rect 변화가 스타일에 반영된다", () => {
    const spy = jest.spyOn(anchor, "getBoundingClientRect");
    spy.mockReturnValueOnce(domRect(0, 0, 50, 10));
    spy.mockReturnValue(domRect(40, 5, 50, 10));

    renderHook(() => usePopoverPosition(true, anchorRef, popoverRef, 0));

    expect(popover.style.left).toBe("0px");

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(popover.style.left).toBe("40px");
  });

  it("scroll 이벤트(캡처) 후에도 위치를 갱신한다", () => {
    const spy = jest.spyOn(anchor, "getBoundingClientRect");
    spy.mockReturnValueOnce(domRect(1, 2, 3, 4));
    spy.mockReturnValue(domRect(5, 6, 7, 8));

    renderHook(() => usePopoverPosition(true, anchorRef, popoverRef, 0));

    expect(popover.style.left).toBe("1px");

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(popover.style.left).toBe("5px");
  });

  it("isOpen이 false로 바뀌면 리스너를 제거한다", () => {
    const remove = jest.spyOn(window, "removeEventListener");

    const { rerender } = renderHook(
      ({ open }: { open: boolean }) => usePopoverPosition(open, anchorRef, popoverRef),
      { initialProps: { open: true } }
    );

    rerender({ open: false });

    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function), true);
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));

    remove.mockRestore();
  });

  it("앵커 또는 팝오버 ref가 null이면 스타일을 건드리지 않는다", () => {
    const brokenAnchor: RefObject<HTMLDivElement | null> = { current: null };

    renderHook(() => usePopoverPosition(true, brokenAnchor, popoverRef));

    expect(popover.style.left).toBe("");
  });
});
