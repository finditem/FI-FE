import { useEffect } from "react";

const DEFAULT_POPOVER_OFFSET = 8;

/**
 * @author hyungjun
 *
 * anchor 위치·너비를 기준으로 popover 레이어의 좌표·폭을 동기화하는 훅입니다.
 *
 * 열림 상태에서 최초 1회 좌표를 계산하고, 스크롤/리사이즈 시 좌표를 갱신합니다.
 *
 * @param isOpen - popover 열림 상태
 * @param anchorRef - 기준(트리거) 요소 ref
 * @param popoverRef - popover 레이어 요소 ref
 * @param offset - anchor 하단에서 popover까지의 간격(px), 기본값 8
 * @param minWidthPx - popover 최소 너비(px). 앵커가 더 좁을 때 옵션 텍스트가 잘리지 않게 할 때 사용
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
