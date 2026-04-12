import { ButtonHTMLAttributes } from "react";
import { SIZES } from "./constantKebabMenuButton";
import Icon from "../../Icon/Icon";
import { cn } from "@/utils";

/**
 * @author hyungjun
 *
 * Kebab 메뉴에서 사용하는 단일 버튼 컴포넌트입니다.
 * 주로 메뉴 항목의 상세 옵션을 표시하는 역할을 합니다.
 *
 * @param ariaLabel - 접근성을 위한 버튼 라벨 텍스트입니다. (기본값: `"Kebab 메뉴 버튼"`)
 *
 * @param size - 아이콘의 크기를 지정합니다.
 * `"large"` | `"small"` (기본값: `"large"`)
 *
 * @example
 * ```tsx
 * <KebabMenuButton
 *   ariaLabel="상세 옵션 버튼"
 *   onClick={() => console.log('옵션 클릭')}
 *   size="small"
 * />
 * ```
 */

interface KebabMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string;
  size?: "large" | "small";
}

const KebabMenuButton = ({ ariaLabel, size = "large", ...props }: KebabMenuButtonProps) => {
  return (
    <button {...props} aria-label={ariaLabel}>
      <Icon
        name="DetailMenu"
        size={SIZES[size]}
        className={cn(
          "text-neutral-normal-default hover:text-neutral-normal-hover active:text-neutral-normal-preesed disabled:text-neutral-normal-disabled",
          props.className
        )}
      />
    </button>
  );
};

export default KebabMenuButton;
