import { useEffect } from "react";

const DEFAULT_POPOVER_OFFSET = 8;

/**
 * 앵커의 `getBoundingClientRect()`를 읽어 팝오버 레이어의 `left`·`top`·`width` 스타일을 맞춥니다.
 *
 * 보통 `position: fixed` 등 뷰포트 기준으로 겹치는 드롭다운에 쓰며, 열린 동안 스크롤·창 크기 변화에 맞춰 위치를 다시 잡습니다.
 *
 * @param isOpen - `true`일 때만 측정·리스너 등록을 수행합니다.
 * @param anchorRef - 기준(트리거) 요소
 * @param popoverRef - 스타일을 적용할 팝오버 루트 요소
 * @param offset - 앵커 아래쪽으로 띄울 간격(px). 생략 시 `DEFAULT_POPOVER_OFFSET`(8)
 * @param minWidthPx - 지정 시 `Math.max(앵커 너비, minWidthPx)`를 팝오버 `width`로 씁니다.
 *
 * @remarks
 * - `popoverRef.current`에 `left`·`top`·`width`를 픽셀 문자열로 직접 대입합니다 (`position`은 호출부에서 지정).
 * - 스크롤은 캡처 단계(`addEventListener(..., true)`)로 구독해 중첩 스크롤에도 반응합니다.
 * - `anchorRef`/`popoverRef`의 `current`가 없으면 해당 프레임에서는 아무 것도 하지 않습니다.
 *
 * @author hyungjun
 *
 * @example
 * ```tsx
 * usePopoverPosition(isOpen, triggerRef, dropdownRef);
 * usePopoverPosition(isOpen, triggerRef, dropdownRef, 8, 200);
 * ```
 */

const usePopoverPosition = (
  isOpen: boolean,
  anchorRef: React.RefObject<HTMLDivElement | null>,
  popoverRef: React.RefObject<HTMLDivElement | null>,
  offset: number = DEFAULT_POPOVER_OFFSET,
  minWidthPx?: number
) => {
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!anchorRef.current || !popoverRef.current) return;

      const { left, top, height, width } = anchorRef.current.getBoundingClientRect();
      const popoverWidth = minWidthPx != null ? Math.max(width, minWidthPx) : width;
      popoverRef.current.style.left = `${left}px`;
      popoverRef.current.style.top = `${top + height + offset}px`;
      popoverRef.current.style.width = `${popoverWidth}px`;
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, anchorRef, popoverRef, offset, minWidthPx]);
};

export default usePopoverPosition;
