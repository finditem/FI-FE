import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";
import Icon, { Props } from "../../Icon/Icon";

/**
 * @author hyungjun
 *
 * 리스트나 게시판 등에서 조건별로 필터링할 때 사용하는 버튼 컴포넌트입니다.
 * `onSelected` 상태에 따라 시각적 스타일이 달라지며,
 * 로딩 중일 경우 스피너 아이콘이 표시됩니다.
 *
 * @param children - 버튼 내부에 표시할 콘텐츠입니다. (텍스트 또는 요소)
 *
 * @param loading - 로딩 상태를 표시합니다.
 * `true`일 경우 버튼은 비활성화되고 로딩 스피너가 표시됩니다. (기본값: `false`)
 *
 * @param icon - 버튼에 표시할 아이콘 컴포넌트의 Props입니다.
 * `name`, `size`, `className` 등을 지정할 수 있습니다.
 *
 * @param iconPosition - 아이콘의 위치를 설정합니다.
 * `"leading"`(왼쪽) | `"trailing"`(오른쪽). (기본값: `"leading"`)
 *
 * @param onSelected - 필터의 선택 상태를 제어합니다.
 * `true`일 경우 활성화 스타일이 적용됩니다.
 *
 * @param ariaLabel - 접근성을 위한 라벨 텍스트입니다.
 * 실제 `aria-label` 속성에는 `"필터"` 접미사가 함께 붙습니다.
 *
 * @example
 * ```tsx
 * <Filter
 *   ariaLabel="최신순"
 *   onSelected={selectedFilter === 'recent'}
 *   icon={{ name: "ChevronDown" }}
 *   iconPosition="trailing"
 *   onClick={() => setSelectedFilter('recent')}
 * >
 *   최신순
 * </Filter>
 * ```
 */

interface FilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  icon?: Props;
  iconPosition?: "leading" | "trailing";
  onSelected: boolean;
  ariaLabel: string;
}

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
          "active:bg-fill-neutralInversed-normal-pressed text-neutralInversed-normal-default bg-fill-neutralInversed-normal-default hover:text-black hover:bg-fill-neutralInversed-normal-hover active:text-neutralInversed-normal-pressed disabled:text-neutralInversed-normal-disabled disabled:bg-fill-neutralInversed-normal-disabled",
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
