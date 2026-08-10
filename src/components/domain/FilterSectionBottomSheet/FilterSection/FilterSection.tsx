"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { normalizeEnumValue } from "@/utils";
import { Filter } from "@/components/common";
import FilterBottomSheet from "../FilterBottomSheet/FilterBottomSheet";
import { useFilterLabelMaps } from "../_constants/LABELS";
import {
  CategoryFilterValue,
  FilterTab,
  FindStatusFilterValue,
  SortFilterValue,
  StatusFilterValue,
} from "../_types/types";
import { FiltersStateType } from "../_types/filtersStateType";
import { DEFAULT_FILTERS } from "../_constants/DEFAULT_FILTERS";
import {
  filterSelectionState,
  normalizedFilterValues,
} from "../../../../utils/deriveFilterParams/deriveFilterParams";
import { useFilterParams } from "@/hooks";
import { useFilterTabs } from "../_constants/TABS";
import DateRangeBottomSheet from "../../DateRangeBottomSheet/DateRangeBottomSheet";
import { getDateRangeLabel } from "@/utils/getDateRangeLabel/getDateRangeLabel";

/**
 * 페이지 타입에 따라 동적인 필터 목록을 렌더링하는 필터 섹션 컴포넌트입니다.
 *
 * `TABS` 상수를 참조하여 `LIST`, `MY_POSTS`, `MY_FAVORITES` 각 모드에 맞는 필터 순서와 종류를 노출합니다.
 * 지역, 카테고리, 정렬, 찾음여부, 분류, 기간 각각의 필터 선택 시 해당 BottomSheet를 호출합니다.
 * 기간 필터(`date`)의 경우 별도의 `DateRangeBottomSheet`를 사용합니다.
 *
 * @author jikwon (Original)
 * @author suhyeon (Refactored)
 */

interface FilterSectionProps {
  /** 페이지의 유형 ('LIST' | 'MY_POSTS' | 'MY_FAVORITES' | 'PUBLIC_DATA'), (default: "LIST") */
  pageType?: "LIST" | "MY_POSTS" | "MY_FAVORITES" | "PUBLIC_DATA";
}

/**
 * @example
 * ```tsx
 * // 일반 리스트 페이지에서 사용할 때
 * <FilterSection pageType="LIST" />
 *
 * * // 내 게시글 페이지에서 사용할 때
 * <FilterSection pageType="MY_POSTS" />
 * ```
 */

const FilterSection = ({ pageType = "LIST" }: FilterSectionProps) => {
  const tf = useTranslations("FilterSection");
  const TABS = useFilterTabs();
  const {
    categoryDefaultLabel,
    categoryLabelMap: CATEGORY_LABEL_MAP,
    sortLabelMap: SORT_LABEL_MAP,
    findStatusDefaultLabel,
    findStatusLabelMap: FIND_STATUS_LABEL_MAP,
    statusDefaultLabel,
    statusLabelMap: STATUS_LABEL_MAP,
  } = useFilterLabelMaps();
  const { region, category, sort, status, findStatus, startDate, endDate } = useFilterParams();
  const [filters, setFilters] = useState<FiltersStateType>(DEFAULT_FILTERS);
  const [selectedTab, setSelectedTab] = useState<FilterTab>("region");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const { normalizedCategory, normalizedSort, normalizedStatus, normalizedFindStatus } =
    normalizedFilterValues({ region, category, sort, status, findStatus });

  const selectionState = filterSelectionState({
    region,
    category,
    sort,
    status,
    findStatus,
    startDate,
    endDate,
  });

  const openSheet = (tab: FilterTab) => {
    setFilters({
      ...DEFAULT_FILTERS,
      startDate: startDate ?? "",
      endDate: endDate ?? "",
      region: region ?? "",
      category: normalizeEnumValue<Exclude<CategoryFilterValue, undefined>>(category),
      sort: normalizeEnumValue<SortFilterValue>(sort) ?? "LATEST",
      status: normalizeEnumValue<Exclude<StatusFilterValue, undefined>>(status),
      findStatus: normalizeEnumValue<Exclude<FindStatusFilterValue, undefined>>(findStatus),
    });
    setSelectedTab(tab);

    if (tab === "date") {
      setIsDateOpen(true);
      return;
    }

    setIsFilterOpen(true);
  };

  const dateLabel = getDateRangeLabel(startDate, endDate);

  const filterConfigs: Record<FilterTab, any> = {
    date: {
      ariaLabel: tf("dateAriaLabel"),
      onSelected: selectionState.isDateSelected,
      icon: { name: "Calendar", size: 16 },
      label: dateLabel,
      iconPosition: "leading",
    },
    region: {
      ariaLabel: tf("regionAriaLabel"),
      onSelected: selectionState.isRegionSelected,
      icon: { name: "Location", size: 16 },
      label: selectionState.isRegionSelected ? region : tf("regionUnselectedLabel"),
      iconPosition: "leading",
    },
    category: {
      ariaLabel: tf("categoryAriaLabel"),
      onSelected: selectionState.isCategorySelected,
      icon: { name: "ArrowDown", size: 12 },
      label: (normalizedCategory && CATEGORY_LABEL_MAP[normalizedCategory]) ?? categoryDefaultLabel,
      iconPosition: "trailing",
    },
    sort: {
      ariaLabel: tf("sortAriaLabel"),
      onSelected: selectionState.isSortSelected && normalizedSort !== "LATEST",
      icon: { name: "ArrowDown", size: 12 },
      label: (normalizedSort && SORT_LABEL_MAP[normalizedSort]) ?? SORT_LABEL_MAP.LATEST,
      iconPosition: "trailing",
    },
    findStatus: {
      ariaLabel: tf("findStatusAriaLabel"),
      onSelected: selectionState.isFindStatusSelected,
      icon: { name: "ArrowDown", size: 12 },
      label:
        (normalizedFindStatus && FIND_STATUS_LABEL_MAP[normalizedFindStatus]) ??
        findStatusDefaultLabel,
      iconPosition: "trailing",
    },
    status: {
      ariaLabel: tf("statusAriaLabel"),
      onSelected: selectionState.isStatusSelected,
      icon: { name: "ArrowDown", size: 12 },
      label: (normalizedStatus && STATUS_LABEL_MAP[normalizedStatus]) ?? statusDefaultLabel,
      iconPosition: "trailing",
    },
  };

  return (
    <>
      <section
        aria-label={tf("sectionAriaLabel")}
        className="flex h-[67px] w-full items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap px-5 no-scrollbar"
      >
        {TABS[pageType].map((tab) => {
          const config = filterConfigs[tab.value as FilterTab];
          if (!config) return null;

          return (
            <Filter
              key={tab.value}
              ariaLabel={config.ariaLabel}
              onSelected={config.onSelected}
              icon={config.icon}
              iconPosition={config.iconPosition}
              className="flex-shrink-0"
              onClick={() => openSheet(tab.value as FilterTab)}
            >
              {config.label}
            </Filter>
          );
        })}
      </section>

      {isFilterOpen && (
        <FilterBottomSheet
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          filters={filters}
          setFilters={setFilters}
          pageType={pageType}
        />
      )}

      {isDateOpen && (
        <DateRangeBottomSheet
          filters={filters}
          setFilters={setFilters}
          isOpen={isDateOpen}
          onClose={() => setIsDateOpen(false)}
        />
      )}
    </>
  );
};

export default FilterSection;
