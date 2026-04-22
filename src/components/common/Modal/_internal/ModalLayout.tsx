"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";
import { useModalBackdrop, useModalLockAndEsc } from "@/hooks";

/**
 * 모달의 공통 레이아웃 컴포넌트입니다.
 *
 * @remarks
 * - 모달이 열려있는 동안 스크롤을 차단하고 ESC 키로 닫을 수 있습니다.
 * - 백드롭 클릭 시 `onClose`가 호출됩니다.
 *
 * @author jikwon
 */

interface ModalLayoutProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 (ESC/백드롭 포함) */
  onClose?: () => void;
  /** 모달 내부 자식 컴포넌트 */
  children: ReactNode;
  /** 모달 컨테이너에 적용할 클래스 */
  className: string;
  /** 테스트에서 dialog 루트를 식별할 때 사용 */
  dialogTestId?: string;
}

/**
 * @example
 * ```tsx
 * <ModalLayout isOpen={isOpen} onClose={onClose} className="gap-6 p-6">
 *   <h2>모달 제목</h2>
 *   <p>모달 내용</p>
 * </ModalLayout>
 * ```
 */

const ModalLayout = ({ isOpen, onClose, children, className, dialogTestId }: ModalLayoutProps) => {
  useModalLockAndEsc({ isOpen, onClose });
  const onBackdropMouseDown = useModalBackdrop({ onClose });

  if (!isOpen) return null;

  return createPortal(
    <div
      onMouseDown={onBackdropMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        data-testid={dialogTestId}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "rounded-[8px] border border-gray-200 bg-white",
          "flex flex-col overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalLayout;
