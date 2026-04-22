"use client";

import { cn } from "@/utils";
import { useModalBackdrop, useModalLockAndEsc } from "@/hooks";
import { createPortal } from "react-dom";

/**
 * 화면 하단에서 위로 올라오는 팝업 레이아웃 컴포넌트입니다.
 *
 * @remarks
 * - `isOpen`이 false이면 렌더링하지 않습니다.
 * - ESC 키 및 백드롭 클릭으로 닫힙니다.
 * - `document.body`에 포털로 렌더링됩니다.
 *
 * @author jikwon
 */

interface PopupLayoutProps {
  /** 팝업 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러. ESC 키 및 백드롭 클릭 시에도 호출됩니다. */
  onClose?: () => void;
  /** 팝업 내부에 렌더링할 콘텐츠 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

/**
 * @example
 * ```tsx
 * <PopupLayout isOpen={isOpen} onClose={onClose}>
 *   <p>팝업 내용</p>
 * </PopupLayout>
 * ```
 */

const PopupLayout = ({ isOpen, onClose, children, className }: PopupLayoutProps) => {
  useModalLockAndEsc({ isOpen, onClose });
  const onBackdropMouseDown = useModalBackdrop({ onClose });

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/30"
      onMouseDown={onBackdropMouseDown}
    >
      <div
        className={cn(
          "w-full rounded-t-2xl bg-white px-6",
          "tablet:max-w-[768px] tablet:px-20",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default PopupLayout;
