"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { cn, parseYmd } from "@/utils";
import useMakeDate from "./_hooks/useMakeDate";
import PopupLayout from "../PopupLayout/PopupLayout";
import { Button, Filter } from "@/components/common";
import { applyFiltersToUrl } from "../../../utils/applyFiltersToUrl/applyFiltersToUrl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterParams } from "@/hooks/domain";
import { useToast } from "@/context/ToastContext";

const DateWheel = ({
  dateArray,
  selected,
  onSelected,
  label,
}: {
  dateArray: number[];
  selected: number;
  onSelected: (value: number) => void;
  label?: string;
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiperInstance && !swiperInstance.destroyed) {
      const index = dateArray.indexOf(selected);
      if (index !== -1 && swiperInstance.activeIndex !== index) {
        swiperInstance.slideTo(index);
      }
    }
  }, [selected, dateArray, swiperInstance]);

  return (
    <div className="h-[140px] w-full overflow-hidden flex-center">
      <Swiper
        direction="vertical"
        slidesPerView={5}
        centeredSlides={true}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => onSelected(dateArray[swiper.activeIndex])}
        initialSlide={dateArray.indexOf(selected)}
        className="h-full w-full"
        modules={[Mousewheel]}
        mousewheel={{
          forceToAxis: true, // 세로 스크롤만 허용
          sensitivity: 0.5, // 휠 감도 조절
          thresholdDelta: 10, // 작은 떨림 무시
        }}
        spaceBetween={8}
      >
        {/* 중앙 선택 영역 강조를 위한 오버레이 */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-[40%] w-full border-b border-neutral-normal-default bg-white opacity-50" />
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[40%] w-full border-t border-neutral-normal-default bg-white opacity-50" />

        {dateArray.map((item) => (
          <SwiperSlide
            key={item}
            className={cn(
              "flex w-full items-center justify-center text-h2-regular text-layout-header-default transition-colors",
              "[&.swiper-slide-active]:text-h2-regular [&.swiper-slide-active]:text-layout-header-default [&.swiper-slide-active]:opacity-100",
              "cursor-default select-none"
            )}
          >
            <div className="flex-center">
              {item}
              {label && <span>{label}</span>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

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
      // TODO(수현): 문구 확인 필요
      addToast("종료일은 시작일보다 이전일 수 없어요", "warning");
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
        <h2 className="text-h2-medium">기간 설정</h2>

        {/* 상단 탭 버튼 */}
        <div className="flex gap-[14px]">
          <Filter
            ariaLabel="시작일"
            onSelected={activeTab === "startDate"}
            onClick={() => setActiveTab("startDate")}
            className="!px-10 !py-2"
          >
            시작일
          </Filter>
          <Filter
            ariaLabel="종료일"
            onSelected={activeTab === "endDate"}
            className="!px-10 !py-2"
            onClick={() => setActiveTab("endDate")}
          >
            종료일
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
            label="월"
          />

          <DateWheel
            dateArray={activeTab === "startDate" ? startDays : EndDays}
            selected={activeTab === "startDate" ? selectStartDate.day : selectEndDate.day}
            onSelected={(val) =>
              activeTab === "startDate"
                ? handleStartDateChange("day", val)
                : handleEndDateChange("day", val)
            }
            label="일"
          />
        </div>
      </div>

      <div className="flex w-full gap-2">
        <Button
          ariaLabel="날짜 초기화 버튼"
          variant="outlined"
          className="h-11 w-1/3"
          onClick={handleResetDateFilters}
        >
          초기화
        </Button>
        <Button onClick={handleApply} size="big" className="h-11 w-2/3">
          적용하기
        </Button>
      </div>
    </PopupLayout>
  );
};

export default DateRangeBottomSheet;
