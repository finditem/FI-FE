import { ButtonHTMLAttributes } from "react";
import { SIZES } from "./constantKebabMenuButton";
import Icon from "../../Icon/Icon";
import { cn } from "@/utils";

/**
 * 케밥 메뉴를 열거나 옵션을 띄울 때 쓰는 트리거 버튼입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `disabled`, `className` 등 표준 `button` 속성과 함께 사용할 수 있습니다.
 * - 라벨 아이콘은 `DetailMenu`이며, `size`에 따라 아이콘만 스케일됩니다.
 * - 넘긴 `className`은 버튼에도 전달되고, 아이콘 쪽 스타일 조합(`cn`)에도 함께 들어갑니다.
 *
 * @author hyungjun
 */
interface KebabMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 접근성용 `aria-label` */
  ariaLabel?: string;
  /** 아이콘 크기 (default: 'large') */
  size?: "large" | "small";
}

/**
 * @example
 * ```tsx
 * <KebabMenuButton
 *   ariaLabel="상세 옵션 버튼"
 *   onClick={() => console.log("옵션 클릭")}
 *   size="small"
 * />
 * ```
 */

const KebabMenuButton = ({ ariaLabel, size = "large", ...props }: KebabMenuButtonProps) => {
  return (
    <button {...props} aria-label={ariaLabel}>
      <Icon
        name="DetailMenu"
        size={SIZES[size]}
        className={cn(
          "text-neutral-normal-default hover:text-neutral-normal-hover active:text-neutral-normal-pressed disabled:text-neutral-normal-disabled",
          props.className
        )}
      />
    </button>
  );
};

export default KebabMenuButton;
