"use client";

import { cn } from "@/utils";
import { useModalBackdrop, useModalLockAndEsc } from "@/hooks";
import { createPortal } from "react-dom";
import { motion, useDragControls } from "framer-motion";

// 손잡이를 이만큼(px) 끌어내리거나 이 속도(px/s) 이상으로 내리면 닫는다.
const DRAG_CLOSE_OFFSET = 100;
const DRAG_CLOSE_VELOCITY = 500;

/**
 * 화면 하단에서 위로 올라오는 팝업 레이아웃 컴포넌트입니다.
 *
 * @remarks
 * - `isOpen`이 false이면 렌더링하지 않습니다.
 * - ESC 키 및 백드롭 클릭으로 닫힙니다.
 * - `document.body`에 포털로 렌더링됩니다.
 * - `draggable`이면 상단에 손잡이를 표시하고, 손잡이를 아래로 끌어 닫을 수 있습니다.
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
  /** 상단 손잡이를 표시하고 아래로 끌어 닫을 수 있게 할지 여부 (default: false) */
  draggable?: boolean;
}

/**
 * @example
 * ```tsx
 * <PopupLayout isOpen={isOpen} onClose={onClose}>
 *   <p>팝업 내용</p>
 * </PopupLayout>
 *
 * <PopupLayout isOpen={isOpen} onClose={onClose} draggable>
 *   <p>손잡이를 끌어 닫을 수 있는 팝업</p>
 * </PopupLayout>
 * ```
 */

const PopupLayout = ({
  isOpen,
  onClose,
  children,
  className,
  draggable = false,
}: PopupLayoutProps) => {
  useModalLockAndEsc({ isOpen, onClose });
  const onBackdropMouseDown = useModalBackdrop({ onClose });
  const dragControls = useDragControls();

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/30"
      onMouseDown={onBackdropMouseDown}
    >
      <motion.div
        className={cn(
          "w-full rounded-t-2xl bg-white px-6",
          "tablet:max-w-[768px] tablet:px-20",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        drag={draggable ? "y" : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 1 }}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y > DRAG_CLOSE_OFFSET || velocity.y > DRAG_CLOSE_VELOCITY) onClose?.();
        }}
      >
        {draggable && (
          <div
            data-testid="popup-drag-handle"
            onPointerDown={(e) => dragControls.start(e)}
            className="flex w-full shrink-0 cursor-grab touch-none justify-center pb-3 pt-3"
          >
            <div className="h-[3px] w-[50px] rounded-full bg-labelsVibrant-primary" />
          </div>
        )}
        {children}
      </motion.div>
    </div>,
    document.body
  );
};

export default PopupLayout;
