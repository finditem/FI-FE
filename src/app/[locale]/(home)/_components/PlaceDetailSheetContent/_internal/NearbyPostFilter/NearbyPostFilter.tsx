"use client";

import { useTranslations } from "next-intl";
import { useHorizontalDragScroll } from "@/hooks";
import { Filter } from "@/components";
import { CATEGORY_OPTIONS } from "@/constants";
import type { CategoryType, PostType } from "@/types";
import type { NearbyPostFilter as NearbyPostFilterValue } from "@/api/fetch/mapController";
import type { PostFilterChipValue } from "../../../../_types/PostFilterChipValue";
import useFilterItems from "../../../../_hooks/useFilterItems/useFilterItems";
import CategoryFilter from "../../../HomeFilterSection/_internal/CategoryFilter/CategoryFilter";

const CHIP_TO_POST_TYPE: Record<PostFilterChipValue, PostType | undefined> = {
  all: undefined,
  lost: "LOST",
  find: "FOUND",
};

interface NearbyPostFilterProps {
  value: NearbyPostFilterValue;
  onChange: (next: NearbyPostFilterValue) => void;
}

/**
 * 근처 분실물 탭의 필터 칩입니다.
 *
 * @remarks
 * 칩 UI는 헤더 필터와 같은 `Filter`/`CategoryFilter`를 쓰지만, 상태는 URL이 아니라 이 탭 안에
 * 둡니다. `HomeFilterSection`처럼 `?post-type`·`?category`를 공유하면 시트를 닫은 뒤에도 헤더 칩
 * 선택이 남습니다.
 */
const NearbyPostFilter = ({ value, onChange }: NearbyPostFilterProps) => {
  const t = useTranslations("FilterItems");
  const tFilterOptions = useTranslations("FilterOptions");
  const { ref, onMouseDown } = useHorizontalDragScroll();
  const { postFilterItems, categoryFilterItem } = useFilterItems();

  const selectedChip: PostFilterChipValue =
    value.postType === "LOST" ? "lost" : value.postType === "FOUND" ? "find" : "all";
  const selectedCategory = CATEGORY_OPTIONS.find((option) => option.value === value.category);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="sticky top-0 z-10 -mx-5 flex gap-2 border-b border-divider-default bg-white pb-[14px] pl-5 no-scrollbar"
    >
      {postFilterItems.map((item) => (
        <Filter
          key={item.value}
          ariaLabel={item.label}
          onSelected={item.value === selectedChip}
          onClick={() => onChange({ ...value, postType: CHIP_TO_POST_TYPE[item.value] })}
        >
          {item.label}
        </Filter>
      ))}
      <CategoryFilter
        ariaLabel={categoryFilterItem.label}
        label={
          selectedCategory ? tFilterOptions(`category.${selectedCategory.value}`) : t("category")
        }
        isSelected={!!selectedCategory}
        selectedValue={value.category ?? ""}
        onSelect={(next) => onChange({ ...value, category: (next || undefined) as CategoryType })}
      />
    </div>
  );
};

export default NearbyPostFilter;
