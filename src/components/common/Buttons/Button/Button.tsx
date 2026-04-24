import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { SIZE_STYLES, LOADING_SPINNER_SIZE, VARIANT_STYLES, BASE_STYLES } from "./constantButton";
import Icon, { Props } from "../../Icon/Icon";

type Size = "big" | "medium" | "small";

/**
 * 다양한 스타일과 크기를 지원하는 공통 버튼 컴포넌트의 props입니다.
 *
 * @remarks
 * - `variant`, `hierarchy`, `size` 조합으로 시각적 스타일을 맞추고, 아이콘·로딩 스피너를 함께 쓸 수 있습니다.
 * - `as`로 렌더링 루트를 바꾸면(예: `Link`) 해당 컴포넌트가 받는 props는 나머지 spread로 그대로 전달됩니다.
 * - 실제 DOM이 `button`일 때만 `type: "button"`과 `disabled` 병합이 적용되며, `loading`이면 눌림을 막습니다.
 * - `ignoreBase`가 `true`이면 기본·크기·variant 클래스를 붙이지 않고 넘긴 `className`만 사용합니다.
 *
 * @author hyungjun
 */
type ButtonProps<E extends ElementType = "button"> = {
  /** 렌더링에 사용할 루트 컴포넌트 (default: 'button') */
  as?: E;
  /** 버튼 스타일 변형 (default: 'solid') */
  variant?: "solid" | "outlined" | "inversed" | "auth";
  /** solid 변형의 위계 (default: 'normal') */
  hierarchy?: "normal" | "subtle";
  /** 버튼 크기 (default: 'medium') */
  size?: Size;
  /** 아이콘을 자식 콘텐츠 기준 앞·뒤 배치 (`icon`이 있을 때만 적용, default: 'leading') */
  iconPosition?: "leading" | "trailing";
  /** 버튼에 표시할 아이콘에 넘길 `Icon` 설정 (`name` 등) */
  icon?: Props;
  /** 로딩 시 스피너 표시 및 상호작용 차단 (default: false) */
  loading?: boolean;
  /** 접근성용 `aria-label`. 없으면 속성을 생략하며 스크린 리더는 `children` 텍스트를 사용합니다. */
  ariaLabel?: string;
  /** 버튼 내부 콘텐츠 */
  children: ReactNode;
  /** `true`면 기본·크기·variant 유틸 클래스를 적용하지 않음 (default: false) */
  ignoreBase?: boolean;
} & ComponentPropsWithoutRef<E>;

/**
 * @example
 * ```tsx
 * // button으로 사용
 * <Button
 *   variant="solid"
 *   hierarchy="normal"
 *   size="medium"
 *   icon={{ name: "Plus" }}
 *   iconPosition="leading"
 *   onClick={handleClick}
 * >
 *   추가하기
 * </Button>
 *
 * // Link 등 다른 컴포넌트로 렌더링
 * <Button as={Link} href="/about" variant="outlined" size="medium">
 *   상세보기
 * </Button>
 *
 * // ignoreBase로 기본 스타일 없이 class만 지정
 * <Button as={Link} href="/about" ignoreBase className="p-4">
 *   상세보기
 * </Button>
 * ```
 */

const Button = <E extends ElementType = "button">({
  as,
  variant = "solid",
  hierarchy = "normal",
  size = "medium",
  iconPosition,
  icon,
  loading = false,
  children,
  disabled,
  className = "",
  ariaLabel,
  ignoreBase,
  ...props
}: ButtonProps<E>) => {
  const Component = (as ?? "button") as ElementType;

  const variantClass =
    variant === "solid" ? VARIANT_STYLES.solid[hierarchy] : VARIANT_STYLES[variant].base;

  const glassCard = variant === "solid" && "glass-card";

  const finalIconPosition = icon && (iconPosition ?? "leading");

  const combinedStyles = ignoreBase
    ? className
    : `${BASE_STYLES} ${SIZE_STYLES[size]} ${variantClass} ${glassCard} ${className}`;

  const isButton = Component === "button";

  const content = loading ? (
    <Icon name="Loading" className="animate-spin" size={LOADING_SPINNER_SIZE[size]} />
  ) : (
    <>
      {finalIconPosition === "leading" && icon && <Icon {...icon} />}
      {children}
      {finalIconPosition === "trailing" && icon && <Icon {...icon} />}
    </>
  );

  const commonProps = {
    className: combinedStyles,
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(isButton && {
      disabled: disabled || loading,
      type: "button" as const,
    }),
    ...props,
  };

  return <Component {...commonProps}>{content}</Component>;
};

export default Button;
