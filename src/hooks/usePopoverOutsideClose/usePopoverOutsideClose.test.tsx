import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";

import usePopoverOutsideClose from "./usePopoverOutsideClose";

const dispatchMousedownOnDocument = (target: EventTarget | null) => {
  const e = new MouseEvent("mousedown", { bubbles: true });
  Object.defineProperty(e, "target", { value: target, enumerable: true });
  document.dispatchEvent(e);
};

describe("usePopoverOutsideClose", () => {
  let anchorRef: RefObject<HTMLDivElement | null>;
  let popoverRef: RefObject<HTMLDivElement | null>;
  let anchor: HTMLDivElement;
  let popover: HTMLDivElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    anchor = document.createElement("div");
    popover = document.createElement("div");
    outside = document.createElement("div");
    document.body.append(anchor, popover, outside);

    anchorRef = { current: anchor };
    popoverRef = { current: popover };
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("isOpen이 false이면 document에 mousedown 리스너를 달지 않는다", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const onClose = jest.fn();

    renderHook(() => usePopoverOutsideClose(false, anchorRef, popoverRef, onClose));

    expect(addSpy).not.toHaveBeenCalledWith("mousedown", expect.any(Function));
    addSpy.mockRestore();
  });

  it("앵커·팝오버 바깥 mousedown이면 onClose를 호출한다", () => {
    const onClose = jest.fn();

    renderHook(() => usePopoverOutsideClose(true, anchorRef, popoverRef, onClose));

    act(() => {
      dispatchMousedownOnDocument(outside);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("앵커 내부 mousedown이면 onClose를 호출하지 않는다", () => {
    const inner = document.createElement("span");
    anchor.appendChild(inner);
    const onClose = jest.fn();

    renderHook(() => usePopoverOutsideClose(true, anchorRef, popoverRef, onClose));

    act(() => {
      dispatchMousedownOnDocument(inner);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("팝오버 내부 mousedown이면 onClose를 호출하지 않는다", () => {
    const inner = document.createElement("button");
    popover.appendChild(inner);
    const onClose = jest.fn();

    renderHook(() => usePopoverOutsideClose(true, anchorRef, popoverRef, onClose));

    act(() => {
      dispatchMousedownOnDocument(inner);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("isOpen이 false로 바뀌면 리스너가 제거된다", () => {
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const onClose = jest.fn();

    const { rerender } = renderHook(
      ({ open }: { open: boolean }) => usePopoverOutsideClose(open, anchorRef, popoverRef, onClose),
      { initialProps: { open: true } }
    );

    rerender({ open: false });

    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    removeSpy.mockRestore();
  });

  it("앵커와 팝오버가 같은 요소여도 내부 클릭은 닫지 않는다", () => {
    const shared = document.createElement("div");
    const inner = document.createElement("span");
    shared.appendChild(inner);
    const sharedRef: RefObject<HTMLDivElement | null> = { current: shared };
    const onClose = jest.fn();

    renderHook(() => usePopoverOutsideClose(true, sharedRef, sharedRef, onClose));

    act(() => {
      dispatchMousedownOnDocument(inner);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
