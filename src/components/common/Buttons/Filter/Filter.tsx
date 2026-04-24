import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";
import Icon, { Props } from "../../Icon/Icon";

/**
 * 리스트·게시판 등에서 조건 필터를 선택할 때 쓰는 공통 버튼 컴포넌트입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `disabled` 등 표준 `button` 속성과 함께 사용할 수 있습니다.
 * - `onSelected`에 따라 선택·비선택 스타일이 달라지고, `loading`이면 스피너가 보이며 버튼이 비활성화됩니다.
 * - `aria-label`에는 인자로 넘긴 문자열 뒤에 ` 필터` 접미사가 붙습니다.
 *
 * @author hyungjun
 */
interface FilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼에 표시할 콘텐츠 */
  children: ReactNode;
  /** 로딩 시 스피너 표시 및 비활성 (default: false) */
  loading?: boolean;
  /** 표시할 아이콘에 넘길 `Icon` 설정 (`name` 등). `loading`이면 스피너가 우선합니다. */
  icon?: Props;
  /** 아이콘을 자식 콘텐츠 기준 앞·뒤 배치 (`icon`이 있을 때만, default: 'leading') */
  iconPosition?: "leading" | "trailing";
  /** 현재 필터가 선택된 상태인지 여부 */
  onSelected: boolean;
  /** 접근성용 라벨. 실제 `aria-label`은 `{값} 필터` 형식입니다. */
  ariaLabel: string;
}

/**
 * @example
 * ```tsx
 * <Filter
 *   ariaLabel="최신순"
 *   onSelected={selectedFilter === "recent"}
 *   icon={{ name: "ChevronDown" }}
 *   iconPosition="trailing"
 *   onClick={() => setSelectedFilter("recent")}
 * >
 *   최신순
 * </Filter>
 * ```
 */

const Filter = ({
  children,
  loading = false,
  icon,
  iconPosition,
  onSelected,
  ariaLabel,
  ...props
}: FilterProps) => {
  const finalIconPosition = icon && (iconPosition ?? "leading");

  return (
    <button
      {...props}
      aria-label={`${ariaLabel} 필터`}
      className={cn(
        "gap-[4px] whitespace-nowrap rounded-full px-[18px] py-[8px] text-body1-semibold transition-colors duration-150 flex-center",
        !onSelected &&
          "text-neutralInversed-normal-default bg-fill-neutralInversed-normal-default hover:text-black hover:bg-fill-neutralInversed-normal-hover active:text-neutralInversed-normal-pressed active:bg-fill-neutralInversed-normal-pressed disabled:text-neutralInversed-normal-disabled disabled:bg-fill-neutralInversed-normal-disabled",
        onSelected &&
          !loading &&
          "text-white bg-fill-neutralInversed-normal-enteredSelected hover:text-white active:text-white active:bg-fill-neutralInversed-normal-enteredSelected",
        onSelected && loading && "bg-fill-neutralInversed-normal-disabled",
        props.className
      )}
    >
      {loading ? (
        <Icon name="Loading" className="animate-spin" />
      ) : (
        finalIconPosition === "leading" && icon && <Icon {...icon} />
      )}
      {!loading && children}
      {!loading && finalIconPosition === "trailing" && icon && <Icon {...icon} />}
    </button>
  );
};

export default Filter;
