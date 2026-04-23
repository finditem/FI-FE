import { ToastType } from "@/types/ToastTypes";
import { cn } from "@/utils";
import { TOAST_A11Y_CONFIG, TOAST_CONFIG } from "./ToastTypes";
import Icon from "../Icon/Icon";

/**
 * 토스트 컴포넌트입니다.
 *
 * @remarks
 * - `type`에 따라 배경색, 아이콘, 크기가 달라집니다.
 * - `"success"`: 성공 메시지
 * - `"error"`: 오류 메시지
 * - `"warning"`: 경고 메시지
 *
 * @author jikwon
 */

interface ToastProps {
  /** 토스트에 표시될 메시지 */
  message: string;
  /** 토스트 종류 */
  type: ToastType;
}

/**
 * @example
 * ```tsx
 * <Toast message="저장되었습니다." type="success" />
 * <Toast message="오류가 발생했습니다." type="error" />
 * <Toast message="주의가 필요합니다." type="warning" />
 * ```
 */

function getToastConfig(type: ToastType) {
  return TOAST_CONFIG[type] ?? TOAST_CONFIG.success;
}

function getToastA11yProps(type: ToastType) {
  return TOAST_A11Y_CONFIG[type] ?? TOAST_A11Y_CONFIG.success;
}

const Toast = ({ message = "Text", type }: ToastProps) => {
  const { bg, icon, size } = getToastConfig(type);
  const { role, ariaLive } = getToastA11yProps(type);

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={cn(
        "glass-card w-full gap-3 rounded-lg bg-toast px-5 py-3 flex-center",
        "text-body1-semibold text-neutralInversed-normal-enteredSelected shadow-md"
      )}
    >
      <div aria-hidden="true" className={cn(bg, "size-5 rounded-full flex-center")}>
        <Icon name={icon} size={size} />
      </div>
      <p className="min-w-0 break-words">{message}</p>
    </div>
  );
};

export default Toast;
