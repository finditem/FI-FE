"use client";

import { useHorizontalDragScroll } from "@/hooks";
import { Filter } from "@/components/common";
import { POST_FILTER_ITEMS, CATEGORY_FILTER_ITEM } from "../../_constants/FILTER";
import { CATEGORY, POST_TYPE } from "../../_constants/QUERY_PARAMS";
import CategoryFilter from "./_internal/CategoryFilter/CategoryFilter";
import useHomeFilterQuery from "../../_hooks/useHomeFilterQuery";

const HomeFilterSection = ({ isHidden = false }: { isHidden?: boolean }) => {
  const { ref, onMouseDown } = useHorizontalDragScroll();
  const {
    categoryParam,
    selectedPostFilter,
    isCategorySelected,
    categoryFilterLabel,
    setFilterQuery,
  } = useHomeFilterQuery();

  if (isHidden) return null;

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="sticky top-0 z-10 -mx-5 flex gap-2 border-b border-divider-default bg-white pb-[14px] pl-5 no-scrollbar"
    >
      {POST_FILTER_ITEMS.map((item) => (
        <Filter
          key={item.value}
          ariaLabel={item.label}
          onSelected={item.value === selectedPostFilter}
          onClick={() => setFilterQuery(POST_TYPE, item.value)}
        >
          {item.label}
        </Filter>
      ))}
      <CategoryFilter
        ariaLabel={CATEGORY_FILTER_ITEM.label}
        label={categoryFilterLabel}
        isSelected={isCategorySelected}
        selectedValue={categoryParam}
        onSelect={(value) => setFilterQuery(CATEGORY, value)}
      />
    </div>
  );
};

export default HomeFilterSection;
