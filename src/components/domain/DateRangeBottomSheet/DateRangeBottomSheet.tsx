"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { parseYmd } from "@/utils";
import useMakeDate from "./_hooks/useMakeDate";
import PopupLayout from "../PopupLayout/PopupLayout";
import { Button, DateWheel, Filter } from "@/components/common";
import { applyFiltersToUrl } from "../../../utils/applyFiltersToUrl/applyFiltersToUrl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterParams } from "@/hooks";
import { useToast } from "@/context/ToastContext";

type DateRangeFilterBase = {
  startDate?: string;
  endDate?: string;
};

interface DateRangeBottomSheetProps<T extends DateRangeFilterBase> {
  isOpen: boolean;
  onClose: () => void;
  filters: T;
  setFilters: Dispatch<SetStateAction<T>>;
}

const DateRangeBottomSheet = <T extends DateRangeFilterBase>({
  isOpen,
  onClose,
  filters,
  setFilters,
}: DateRangeBottomSheetProps<T>) => {
  const t = useTranslations("DateRangeBottomSheet");
  const { startDate, endDate } = useFilterParams();

  const queryStartDate = parseYmd(startDate);
  const queryEndDate = parseYmd(endDate);

  const {
    years: startYears,
    months: startMonths,
    days: startDays,
    selectDate: selectStartDate,
    handleDateChange: handleStartDateChange,
    handleResetDate: handleStartResetDate,
  } = useMakeDate(queryStartDate ?? undefined);

  const {
    years: EndYears,
    months: EndMonths,
    days: EndDays,
    selectDate: selectEndDate,
    handleDateChange: handleEndDateChange,
    handleResetDate: handleEndResetDate,
  } = useMakeDate(queryEndDate ?? undefined);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { addToast } = useToast();

  const handleApply = () => {
    const formattedStartDate = `${selectStartDate.year}-${String(selectStartDate.month).padStart(2, "0")}-${String(selectStartDate.day).padStart(2, "0")}`;
    const formattedEndDate = `${selectEndDate.year}-${String(selectEndDate.month).padStart(2, "0")}-${String(selectEndDate.day).padStart(2, "0")}`;

    const start = new Date(formattedStartDate);
    const end = new Date(formattedEndDate);

    if (start > end) {
      addToast(t("invalidRange"), "warning");
      return;
    }

    const nextFilters = { ...filters, startDate: formattedStartDate, endDate: formattedEndDate };

    const qs = applyFiltersToUrl({
      filters: nextFilters,
      searchParams: new URLSearchParams(searchParams.toString()),
    });

    router.replace(qs ? `${pathname}?${qs}` : pathname);

    setFilters(nextFilters);

    onClose();
  };

  const [activeTab, setActiveTab] = useState<"startDate" | "endDate">("startDate");

  const handleResetDateFilters = () => {
    const nextFilters = { ...filters, startDate: undefined, endDate: undefined };

    const qs = applyFiltersToUrl({
      filters: nextFilters,
      searchParams: new URLSearchParams(searchParams.toString()),
    });

    router.replace(qs ? `${pathname}?${qs}` : pathname);

    setFilters(nextFilters);

    onClose();
  };

  return (
    <PopupLayout
      isOpen={isOpen}
      onClose={onClose}
      className="w-full gap-12 px-5 py-10 flex-col-center"
    >
      <div className="w-full gap-8 flex-col-center">
        <h2 className="text-h2-medium">{t("title")}</h2>

        {/* 상단 탭 버튼 */}
        <div className="flex gap-[14px]">
          <Filter
            ariaLabel={t("startDate")}
            onSelected={activeTab === "startDate"}
            onClick={() => setActiveTab("startDate")}
            className="!px-10 !py-2"
          >
            {t("startDate")}
          </Filter>
          <Filter
            ariaLabel={t("endDate")}
            onSelected={activeTab === "endDate"}
            className="!px-10 !py-2"
            onClick={() => setActiveTab("endDate")}
          >
            {t("endDate")}
          </Filter>
        </div>

        <div className="flex w-full items-center justify-between px-4">
          <DateWheel
            dateArray={activeTab === "startDate" ? startYears : EndYears}
            selected={activeTab === "startDate" ? selectStartDate.year : selectEndDate.year}
            onSelected={(val) =>
              activeTab === "startDate"
                ? handleStartDateChange("year", val)
                : handleEndDateChange("year", val)
            }
          />

          <DateWheel
            dateArray={activeTab === "startDate" ? startMonths : EndMonths}
            selected={activeTab === "startDate" ? selectStartDate.month : selectEndDate.month}
            onSelected={(val) =>
              activeTab === "startDate"
                ? handleStartDateChange("month", val)
                : handleEndDateChange("month", val)
            }
            label={t("month")}
          />

          <DateWheel
            dateArray={activeTab === "startDate" ? startDays : EndDays}
            selected={activeTab === "startDate" ? selectStartDate.day : selectEndDate.day}
            onSelected={(val) =>
              activeTab === "startDate"
                ? handleStartDateChange("day", val)
                : handleEndDateChange("day", val)
            }
            label={t("day")}
          />
        </div>
      </div>

      <div className="flex w-full gap-2">
        <Button
          ariaLabel={t("resetAriaLabel")}
          variant="outlined"
          className="h-11 w-1/3"
          onClick={handleResetDateFilters}
        >
          {t("reset")}
        </Button>
        <Button onClick={handleApply} size="big" className="h-11 w-2/3">
          {t("apply")}
        </Button>
      </div>
    </PopupLayout>
  );
};

export default DateRangeBottomSheet;
