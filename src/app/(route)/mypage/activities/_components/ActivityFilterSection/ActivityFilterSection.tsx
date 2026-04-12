"use client";

import { Filter } from "@/components/common";
import { useState } from "react";
import { DateRangeBottomSheet } from "@/components/domain";
import { ACTIVITY_OPTIONS } from "../../_constants/ACTIVITY_OPTIONS";
import {
  filterSelectionState,
  normalizedFilterValues,
} from "@/utils/deriveFilterParams/deriveFilterParams";
import { ACTIVITY_LABEL_MAP } from "../../_constants/ACTIVITY_LABEL";
import { useActivityFilter } from "../../_hooks/useActivityFilter";
import ActivityBottomSheet from "../ActivityBottomSheet/ActivityBottomSheet";
import { cn } from "@/utils";
import { getDateRangeLabel } from "@/utils/getDateRangeLabel/getDateRangeLabel";

const ActivityFilterSection = () => {
  const { filters, setFilters, startDate, endDate, activity } = useActivityFilter();

  const [isBottomSheet, setIsBottomSheet] = useState<{
    isOpen: boolean;
    mode: "Date" | "Activity";
  }>({ isOpen: false, mode: "Date" });

  const dateLabel = getDateRangeLabel(startDate, endDate);

  const { normalizedActivity } = normalizedFilterValues({ activity: activity });
  const selectionState = filterSelectionState({ startDate, endDate, activity });

  return (
    <section className="flex w-full gap-2 px-5 py-[14px]" aria-label="필터 선택 영역">
      <Filter
        name="date"
        ariaLabel="기간"
        icon={{
          name: "Calendar",
          size: 16,
          className: cn(
            "text-neutral-normal-default",
            selectionState.isDateSelected && "text-white"
          ),
        }}
        iconPosition="leading"
        onSelected={selectionState.isDateSelected}
        onClick={() => setIsBottomSheet({ isOpen: true, mode: "Date" })}
      >
        {dateLabel}
      </Filter>

      <Filter
        name="activity"
        ariaLabel="활동 유형"
        icon={{
          name: "ArrowDown",
          size: 16,
          className: cn(
            "text-neutral-normal-default",
            selectionState.isActivitySelected && "text-white"
          ),
        }}
        iconPosition="trailing"
        onSelected={selectionState.isActivitySelected}
        onClick={() => setIsBottomSheet({ isOpen: true, mode: "Activity" })}
      >
        {(normalizedActivity && ACTIVITY_LABEL_MAP[normalizedActivity]) ?? "유형"}
      </Filter>

      {isBottomSheet.isOpen && isBottomSheet.mode === "Date" && (
        <DateRangeBottomSheet
          isOpen={isBottomSheet.isOpen}
          onClose={() => setIsBottomSheet((prev) => ({ ...prev, isOpen: false }))}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {isBottomSheet.isOpen && isBottomSheet.mode === "Activity" && (
        <ActivityBottomSheet
          isOpen={isBottomSheet.isOpen}
          onClose={() => setIsBottomSheet((prev) => ({ ...prev, isOpen: false }))}
          title="필터"
          option={ACTIVITY_OPTIONS}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </section>
  );
};

export default ActivityFilterSection;
