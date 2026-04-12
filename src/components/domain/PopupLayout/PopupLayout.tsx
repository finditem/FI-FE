"use client";

import { cn } from "@/utils";
import { useModalBackdrop, useModalLockAndEsc } from "@/hooks";
import { createPortal } from "react-dom";

/**
 * @author jikwon
 *
 * 팝업 레이아웃 컴포넌트입니다.
 *
 * @param isOpen - 모달 열림 여부
 * @param onClose - 닫기 핸들러(ESC/백드롭 포함)
 * @param children - 모달 내용
 * @param className - 추가 CSS 클래스
 *
 * @example
 * ```tsx
 * <PopupLayout isOpen={isOpen} onClose={onClose}>
 *   <p>팝업 내용</p>
 * </PopupLayout>
 * ```
 */
interface PopupLayoutProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

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
