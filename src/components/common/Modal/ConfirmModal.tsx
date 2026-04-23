import type { ReactNode } from "react";
import { cn } from "@/utils";
import Icon, { Props as IconProps } from "../Icon/Icon";
import { sizeMap, style } from "./CONST_MODAL";
import ModalLayout from "./_internal/ModalLayout";

/**
 * 확인/취소 액션을 제공하는 모달 컴포넌트입니다.
 *
 * @remarks
 * - ESC 키 및 백드롭 클릭 시 `onClose`가 호출됩니다.
 *
 * @author jikwon
 */

interface ConfirmModalProps {
  /** 모달 제목 */
  title: ReactNode;
  /** 모달 내용 */
  content: ReactNode;
  /** 아이콘 (이름/크기/접근성 라벨만 사용) */
  icon?: Pick<IconProps, "name" | "size" | "title">;
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 (ESC/백드롭 포함) */
  onClose: () => void;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 핸들러 */
  onCancel: () => void;
  /** 모달 크기 (default: 'medium') */
  size?: "small" | "medium";
}

/**
 * @example
 * ```tsx
 * <ConfirmModal
 *   title="삭제하시겠습니까?"
 *   content="삭제된 데이터는 복구할 수 없습니다."
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onConfirm={onConfirm}
 *   onCancel={onCancel}
 * />
 * ```
 */

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  content,
  icon,
  onConfirm,
  onCancel,
  size = "medium",
}: ConfirmModalProps) => {
  const buttons = [
    { key: "cancel", label: "취소", onClick: onCancel, className: style.cancelBtn },
    { key: "confirm", label: "확인", onClick: onConfirm, className: style.confirmBtn },
  ] as const;

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className={cn("gap-6 p-6 flex-col-center", sizeMap[size])}
    >
      <div className="gap-4 flex-col-center">
        {icon && (
          <div className="size-12 rounded-full bg-fill-neutralInversed-normal-enteredSelected flex-center">
            <Icon name={icon.name} size={icon.size} title={icon.title} className="text-white" />
          </div>
        )}
        <div className="gap-1 text-center flex-col-center">
          <div className="text-h3-semibold text-layout-header-default">{title}</div>
          <div className="text-body2-regular text-layout-body-default">{content}</div>
        </div>
      </div>

      <div className="w-full gap-2 flex-center">
        {buttons.map(({ key, label, onClick, className }) => (
          <button
            key={key}
            type="button"
            className={cn(style.baseBtn, className)}
            onClick={onClick}
          >
            {label}
          </button>
        ))}
      </div>
    </ModalLayout>
  );
};

export default ConfirmModal;
