"use client";

import { Filter, DateRangeBottomSheet } from "@/components";
import { useState } from "react";
import {
  filterSelectionState,
  normalizedFilterValues,
} from "@/utils/deriveFilterParams/deriveFilterParams";
import { ACTIVITY_LABEL_KEY_MAP } from "../../_constants/ACTIVITY_LABEL";
import { useActivityFilter } from "../../_hooks/useActivityFilter";
import { useActivityOptions } from "../../_hooks/useActivityOptions/useActivityOptions";
import ActivityBottomSheet from "../ActivityBottomSheet/ActivityBottomSheet";
import { cn } from "@/utils";
import { getDateRangeLabel } from "@/utils/getDateRangeLabel/getDateRangeLabel";
import { useTranslations } from "next-intl";

const ActivityFilterSection = () => {
  const t = useTranslations("ActivityFilterSection");
  const activityOptions = useActivityOptions();
  const { filters, setFilters, startDate, endDate, activity } = useActivityFilter();

  const [isBottomSheet, setIsBottomSheet] = useState<{
    isOpen: boolean;
    mode: "Date" | "Activity";
  }>({ isOpen: false, mode: "Date" });

  const dateLabel =
    startDate || endDate ? getDateRangeLabel(startDate, endDate, t("date")) : t("date");

  const { normalizedActivity } = normalizedFilterValues({ activity: activity });
  const selectionState = filterSelectionState({ startDate, endDate, activity });

  return (
    <section className="flex w-full gap-2 px-5 py-[14px]" aria-label={t("sectionAriaLabel")}>
      <Filter
        name="date"
        ariaLabel={t("date")}
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
        ariaLabel={t("activityAriaLabel")}
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
        {normalizedActivity ? t(ACTIVITY_LABEL_KEY_MAP[normalizedActivity]) : t("activityType")}
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
          title={t("bottomSheetTitle")}
          option={activityOptions}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </section>
  );
};

export default ActivityFilterSection;
