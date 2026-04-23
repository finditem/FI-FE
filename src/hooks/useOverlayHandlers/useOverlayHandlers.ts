"use client";

import { useEffect, useCallback } from "react";

/**
 * 모달이 열렸을 때 스크롤을 잠그고, ESC 키로 닫을 수 있도록 처리하는 커스텀 훅입니다.
 *
 * @remarks
 * - `isOpen`이 false가 되면 스크롤 잠금이 해제됩니다.
 * - 기존 `overflow` 스타일을 저장했다가 언마운트 시 복원합니다.
 *
 * @param isOpen - 모달 열림 여부
 * @param onClose - ESC 키 입력 시 실행할 닫기 핸들러
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * useModalLockAndEsc({
 *   isOpen,
 *   onClose: () => setIsOpen(false),
 * });
 * ```
 */

export const useModalLockAndEsc = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);
};

/**
 * 배경(Backdrop) 클릭 시 모달을 닫는 이벤트 핸들러를 반환하는 커스텀 훅입니다.
 *
 * @remarks
 * - 모달 내부 컨텐츠를 클릭한 경우에는 닫히지 않습니다.
 * - 반환된 핸들러를 배경 요소의 `onMouseDown`에 연결해야 합니다.
 *
 * @param onClose - 배경 클릭 시 실행할 닫기 핸들러
 *
 * @returns 배경 클릭 이벤트 핸들러 (`onMouseDown`에 사용)
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const onBackdropClick = useModalBackdrop({
 *   onClose: () => setIsOpen(false),
 * });
 *
 * return (
 *   <div className="modal-backdrop" onMouseDown={onBackdropClick}>
 *     <div className="modal-content">...</div>
 *   </div>
 * );
 * ```
 */

export const useModalBackdrop = ({ onClose }: { onClose?: () => void }) => {
  const onBackdropMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose?.();
    },
    [onClose]
  );

  return onBackdropMouseDown;
};
