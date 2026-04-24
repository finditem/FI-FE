import { cn } from "@/utils";
import { ButtonHTMLAttributes } from "react";

/**
 * ON/OFF를 슬라이더 형태로 보여 주는 토글 컨트롤입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `className` 등 표준 `button` 속성과 함께 사용할 수 있습니다.
 * - `toggleState`에 따라 트랙 색과 손잡이 위치가 바뀝니다.
 * - `disabled`이면 상호작용이 막히고, 보이는 상태와 `aria-checked`는 OFF에 맞춰집니다(`toggleState`가 ON이어도 동일).
 * - `aria-checked`로 체크 상태를 노출합니다.
 *
 * @author hyungjun
 */
interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 접근성용 `aria-label` (default: '토글 버튼') */
  ariaLabel?: string;
  /** 켜짐·꺼짐 표시에 쓰는 제어 값(제어 컴포넌트로 넘깁니다) */
  toggleState: boolean;
  /** 비활성 여부 (default: false) */
  disabled?: boolean;
}

/**
 * @example
 * ```tsx
 * <ToggleButton
 *   ariaLabel="알림 설정 토글"
 *   toggleState={isNotificationOn}
 *   onClick={() => setIsNotificationOn((prev) => !prev)}
 * />
 * ```
 */

const ToggleButton = ({
  ariaLabel = "토글 버튼",
  toggleState,
  disabled = false,
  ...props
}: ToggleButtonProps) => {
  const finalToggleState = disabled ? false : toggleState;
  return (
    <button
      {...props}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-checked={finalToggleState}
      className={cn(
        "h-[30px] w-[64px] rounded-full p-1 transition-colors duration-200 disabled:bg-fill-neutralInversed-normal-disabled",
        disabled || !finalToggleState ? "bg-labelsVibrant-tertiary" : "bg-fill-brand-normal-default"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200",
          finalToggleState ? "translate-x-[34px]" : "translate-x-0"
        )}
      />
    </button>
  );
};

export default ToggleButton;
