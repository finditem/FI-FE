import { type MouseEvent, useCallback, useRef } from "react";

/**
 * 가로 스크롤 컨테이너에서 마우스 드래그로 `scrollLeft`를 움직이게 하는 훅입니다.
 *
 * 터치 스크롤이 없는 환경에서 리스트·칩 등을 손가락/포인터처럼 끌어 스크롤할 때 사용합니다.
 *
 * @returns 스크롤 컨테이너에 붙일 `{ ref, onMouseDown }` — `ref`는 대상 `div`, `onMouseDown`은 같은 요소의 `onMouseDown`에 연결
 *
 * @remarks
 * - `mousedown` 시 `document`에 `mousemove` / `mouseup`을 등록하고, 드래그 중 `scrollLeft`를 `scrollLeftStart - (pageX - startX)`로 갱신합니다.
 * - 드래그 중 `document.body`에 `cursor: grabbing`, `user-select: none`을 잠시 적용했다가 `mouseup`에서 되돌립니다.
 * - `mouseup`에서 `document` 리스너를 제거합니다.
 *
 * @author hyungjun
 *
 * @example
 * ```tsx
 * const { ref, onMouseDown } = useHorizontalDragScroll();
 * return (
 *   <div ref={ref} onMouseDown={onMouseDown} style={{ overflowX: "auto" }}>
 *     …
 *   </div>
 * );
 * ```
 */

const useHorizontalDragScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const handleMouseMove = useCallback((e: DocumentEventMap["mousemove"]) => {
    if (!scrollRef.current) return;
    const dx = e.pageX - startXRef.current;
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleMouseMove]);

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!scrollRef.current) return;
      e.preventDefault();
      startXRef.current = e.pageX;
      scrollLeftStartRef.current = scrollRef.current.scrollLeft;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  return { ref: scrollRef, onMouseDown };
};

export default useHorizontalDragScroll;
