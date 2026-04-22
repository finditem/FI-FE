import Icon from "../Icon/Icon";

/**
 * 상태를 나타내는 작은 원형 뱃지 컴포넌트입니다.
 *
 * @remarks
 * - `variant`에 따라 아이콘이 달라집니다.
 *
 * @author jikwon
 */

interface BadgeProps {
  /** 뱃지 종류. `"new"`: 신규 항목, `"hot"`: 인기 항목 */
  variant: "new" | "hot";
  /** 아이콘 크기(px) (default: 15) */
  size?: number;
}

/**
 * @example
 * ```tsx
 * <Badge variant="new" />
 * <Badge variant="hot" size={16} />
 * ```
 */

function Badge({ variant, size = 15 }: BadgeProps) {
  const isNew = variant === "new";

  return (
    <div aria-label={isNew ? "최신 글" : "인기 글"}>
      <Icon name={isNew ? "NewBadge" : "HotBadge"} size={size} />
    </div>
  );
}

export default Badge;
