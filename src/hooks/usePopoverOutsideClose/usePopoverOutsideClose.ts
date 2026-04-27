import { RefObject, useEffect } from "react";

/**
 * 앵커(트리거)와 팝오버 레이어 둘 다 밖에서 `mousedown`이 발생하면 `onClose`를 호출하는 훅입니다.
 *
 * 레이어를 `createPortal` 등으로 DOM 상에서 앵커와 떨어져 두었을 때, 단일 `ref`의 `contains`만으로는
 * 바깥 클릭을 구분하기 어려우므로 두 `ref`를 함께 넘깁니다.
 *
 * @param isOpen - `true`일 때만 `document`에 리스너를 등록합니다.
 * @param anchorRef - 트리거를 감싼 요소 등, 클릭 시 닫히면 안 되는 앵커 쪽 DOM
 * @param popoverRef - 팝오버 패널 루트 DOM
 * @param onClose - 바깥 클릭으로 닫을 때 실행할 콜백
 *
 * @remarks
 * - `document`에 `mousedown`을 사용합니다 (`useClickOutside` 등과 동일한 패턴).
 * - `anchorRef.current` 또는 `popoverRef.current`가 `null`이면 해당 영역은 “내부가 아님”으로 보지 않아, 한쪽만 붙은 상태에서는 `onClose`가 호출되지 않을 수 있습니다.
 * - 의존성 배열에 `anchorRef`·`popoverRef` 객체가 포함되어 있으므로, 보통 `useRef`로 안정적인 ref 객체를 넘깁니다.
 *
 * @author hyungjun
 * /
 
/**
 * @example
 * ```tsx
 * usePopoverOutsideClose(isOpen, triggerRef, dropdownRef, () => setIsOpen(false));
 * ```
 */

const usePopoverOutsideClose = (
  isOpen: boolean,
  anchorRef: RefObject<HTMLDivElement | null>,
  popoverRef: RefObject<HTMLDivElement | null>,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideAnchor = anchorRef.current && !anchorRef.current.contains(target);
      const isOutsidePopover = popoverRef.current && !popoverRef.current.contains(target);

      if (isOutsideAnchor && isOutsidePopover) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, anchorRef, popoverRef, onClose]);
};

export default usePopoverOutsideClose;
