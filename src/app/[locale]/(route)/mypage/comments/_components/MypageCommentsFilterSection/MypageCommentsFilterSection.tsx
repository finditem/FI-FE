"use client";

import { Filter, KebabMenu, DateRangeBottomSheet } from "@/components";
import { useState } from "react";
import { useFilterParams, useFilterSync } from "@/hooks";
import { getDateRangeLabel, normalizeEnumValue } from "@/utils";
import {
  filterSelectionState,
  normalizedFilterValues,
} from "@/utils/deriveFilterParams/deriveFilterParams";
import { CommentFilterState } from "../../_types/commentFilterType";
import {
  COMMENT_DEFAULT_FILTERS,
  SIMPLE_SORT_LABEL_KEY_MAP,
  SORT_KEBAB_ITEM,
} from "../../_constants/COMMENT_FILTER";
import { SimpleSortType } from "@/types";
import { useTranslations } from "next-intl";

const MypageCommentsFilterSection = () => {
  const t = useTranslations("MypageCommentsFilterSection");
  const { startDate, endDate, simpleSort } = useFilterParams();

  const { filters, setFilters, updateFilters } = useFilterSync<CommentFilterState>({
    defaultFilters: COMMENT_DEFAULT_FILTERS,
    currentFiltersFromUrl: {
      startDate: startDate ?? "",
      endDate: endDate ?? "",
      simpleSort: normalizeEnumValue<SimpleSortType>(simpleSort) ?? "LATEST",
    },
  });

  const [isFilterSheet, setIsFilterSheet] = useState<{
    isOpen: boolean;
    mode: "Date" | "Sort";
  }>({ isOpen: false, mode: "Date" });

  const { normalizedSimpleSort } = normalizedFilterValues({ simpleSort });
  const selectionState = filterSelectionState({ startDate, endDate, simpleSort });
  const dateLabel = startDate || endDate ? getDateRangeLabel(startDate, endDate) : t("date");

  const kebabMenuItems = SORT_KEBAB_ITEM.map((item) => ({
    text: t(item.labelKey),
    onClick: () => {
      updateFilters({ simpleSort: item.value });
      setIsFilterSheet((prev) => ({ ...prev, isOpen: false }));
    },
  }));

  return (
    <section className="flex w-full gap-2 px-5 py-[14px]" aria-label={t("sectionAriaLabel")}>
      <Filter
        name="date"
        ariaLabel={t("date")}
        icon={{ name: "Calendar", size: 16 }}
        iconPosition="leading"
        onSelected={selectionState.isDateSelected}
        onClick={() => setIsFilterSheet({ isOpen: true, mode: "Date" })}
      >
        {dateLabel}
      </Filter>

      <div className="relative">
        <Filter
          ariaLabel={t("sortAriaLabel")}
          icon={{ name: "ArrowDown", size: 16 }}
          onSelected={selectionState.isSimpleSortSelected}
          onClick={() => setIsFilterSheet({ mode: "Sort", isOpen: true })}
          iconPosition="trailing"
        >
          {normalizedSimpleSort ? t(SIMPLE_SORT_LABEL_KEY_MAP[normalizedSimpleSort]) : t("latest")}
        </Filter>

        {isFilterSheet.mode === "Sort" && isFilterSheet.isOpen && (
          <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2">
            <KebabMenu items={kebabMenuItems} />
          </div>
        )}
      </div>

      {isFilterSheet.isOpen && isFilterSheet.mode === "Date" && (
        <DateRangeBottomSheet
          isOpen={isFilterSheet.isOpen}
          onClose={() => setIsFilterSheet((prev) => ({ ...prev, isOpen: false }))}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </section>
  );
};

export default MypageCommentsFilterSection;
