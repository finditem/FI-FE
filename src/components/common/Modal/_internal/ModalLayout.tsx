"use client";

import { createPortal } from "react-dom";
import { cn } from "@/utils";
import { useModalBackdrop, useModalLockAndEsc } from "@/hooks";

/**
 * @author jikwon
 *
 * 모달 레이아웃 컴포넌트입니다.
 *
 * @param isOpen - 모달이 열려있는지 여부
 * @param onClose - 모달을 닫는 함수
 * @param children - 모달 내부의 자식 컴포넌트
 * @param className - 모달의 추가 CSS 클래스
 *
 * useModalLockAndEsc 훅을 사용하여 모달이 열려있는 동안 스크롤을 차단하고 ESC 키를 눌렀을 때 모달을 닫습니다.
 * useModalBackdrop 훅을 사용하여 모달 백드롭을 클릭했을 때 모달을 닫습니다.
 *
 * @example
 * ```tsx
 * <ModalLayout isOpen={isOpen} onClose={onClose}>
 *   <h2>모달 제목</h2>
 *   <p>모달 내용</p>
 * </ModalLayout>
 * ```
 */
interface ModalLayoutProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className: string;
  /** 테스트 등에서 dialog 루트를 식별할 때 사용 */
  dialogTestId?: string;
}

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
