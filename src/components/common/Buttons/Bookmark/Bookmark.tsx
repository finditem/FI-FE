import { ButtonHTMLAttributes } from "react";
import { SIZES } from "./constantBookmark";
import Icon from "../../Icon/Icon";

/**
 * 즐겨찾기(북마크) 토글에 사용하는 공통 버튼 컴포넌트입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `disabled` 등 표준 `button` 속성과 함께 사용할 수 있습니다.
 * - 활성·비활성에 따라 별 아이콘 색상이 달라지며, `aria-pressed`로 토글 상태를 노출합니다.
 *
 * @author hyungjun
 */
interface BookmarkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 접근성용 `aria-label` (default: '즐겨찾기 버튼') */
  ariaLabel?: string;
  /** 북마크 활성 여부 */
  isActive: boolean;
  /** 별 아이콘 크기 (default: 'medium') */
  size?: "large" | "medium" | "small";
}

/**
 * @example
 * ```tsx
 * <Bookmark ariaLabel="북마크" isActive={bookmarkIsActive} size="large" />
 * ```
 */

const Bookmark = ({
  ariaLabel = "즐겨찾기 버튼",
  isActive,
  size = "medium",
  ...props
}: BookmarkProps) => {
  return (
    <button {...props} aria-label={ariaLabel} aria-pressed={isActive}>
      <Icon
        name="Star"
        size={SIZES[size]}
        className={isActive ? "text-system-bookmark" : "text-neutralInversed-strong-pressed"}
      />
    </button>
  );
};

export default Bookmark;
