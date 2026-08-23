"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, ModalLayout } from "@/components/common";
import { cn } from "@/utils";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import MonthWheel from "../MonthWheel/MonthWheel";

/**
 * 날짜를 고르는 모달입니다.
 *
 * @remarks
 * - 기본은 월 그리드이고, 제목을 누르면 연·월 휠로 전환됩니다.
 * - 오늘 이후의 날짜는 고를 수 없습니다. 하한은 `MIN_YEAR`입니다.
 * - 날짜를 고르면 곧바로 `onSelect`를 호출하고 모달을 닫습니다.
 * - 치수와 색은 Figma의 `popup_cal`(13385:134201) 값을 따릅니다.
 *
 * @author jikwon
 */

/** 서비스 오픈 연도. `useMakeDate`의 하한과 맞춥니다. */
const MIN_YEAR = 2025;

/** 화살표를 감싸는 정사각 버튼 크기입니다. 아이콘보다 커서 터치 영역을 넓힙니다. */
const ARROW_BUTTON_CLASS = "size-9 flex-center";

interface DatePickerModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 선택된 날짜. 없으면 오늘 기준으로 엽니다. */
  selectedDate: Date | null;
  /** 날짜 선택 핸들러 */
  onSelect: (date: Date) => void;
}

const DatePickerModal = ({ isOpen, onClose, selectedDate, onSelect }: DatePickerModalProps) => {
  const t = useTranslations("DatePickerModal");
  const monthLabels = t.raw("months") as string[];

  const today = new Date();
  const baseDate = selectedDate ?? today;

  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [view, setView] = useState({
    year: baseDate.getFullYear(),
    month: baseDate.getMonth() + 1,
  });

  // 모달을 다시 열면 선택된 날짜(없으면 오늘)가 보이는 달로 되돌립니다.
  useEffect(() => {
    if (!isOpen) return;
    setIsWheelOpen(false);
    setView({ year: baseDate.getFullYear(), month: baseDate.getMonth() + 1 });
  }, [isOpen, baseDate.getFullYear(), baseDate.getMonth()]);

  const isFirstMonth = view.year === MIN_YEAR && view.month === 1;
  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth() + 1;

  const moveMonth = (step: number) => {
    const moved = new Date(view.year, view.month - 1 + step, 1);
    setView({ year: moved.getFullYear(), month: moved.getMonth() + 1 });
  };

  const handleSelectDate = (date: Date) => {
    onSelect(date);
    onClose();
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      // ModalLayout의 기본 radius가 8px이라 시안의 12px로 덮습니다. cn이 clsx라 병합되지 않아 !가 필요합니다.
      className="w-fit !rounded-[12px] p-5"
      dialogTestId="date-picker-modal"
    >
      <div className="flex w-[304px] flex-col items-end gap-2">
        <div className={cn("flex w-full flex-col", isWheelOpen ? "gap-[14px]" : "gap-1")}>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsWheelOpen((prev) => !prev)}
              aria-expanded={isWheelOpen}
              className={cn(
                "flex items-center text-h3-semibold",
                // 휠이 열리면 제목이 초록으로 바뀝니다. (13385:146077의 [Fg]/Brand/Normal/Default #0aa874)
                isWheelOpen ? "text-flatGreen-500" : "text-labelsVibrant-primary"
              )}
            >
              {t("monthTitle", { year: view.year, month: monthLabels[view.month - 1] })}
              <span className={ARROW_BUTTON_CLASS}>
                <Icon
                  // ArrowRight는 #787878이 박혀 있어 색을 바꿀 수 없습니다. currentColor를 따르는 Small 쪽을 씁니다.
                  name={isWheelOpen ? "ArrowDown" : "ArrowRightSmall"}
                  size={24}
                  className="text-brand-normal-default"
                />
              </span>
            </button>

            {!isWheelOpen && (
              <span className="flex items-center">
                <button
                  type="button"
                  onClick={() => moveMonth(-1)}
                  disabled={isFirstMonth}
                  aria-label={t("prevMonth")}
                  className={cn(
                    ARROW_BUTTON_CLASS,
                    "text-brand-normal-default disabled:text-neutral-normal-placeholder"
                  )}
                >
                  <Icon name="ArrowLeftSmall" size={32} />
                </button>
                <button
                  type="button"
                  onClick={() => moveMonth(1)}
                  disabled={isCurrentMonth}
                  aria-label={t("nextMonth")}
                  className={cn(
                    ARROW_BUTTON_CLASS,
                    "text-brand-normal-default disabled:text-neutral-normal-placeholder"
                  )}
                >
                  <Icon name="ArrowRightSmall" size={32} />
                </button>
              </span>
            )}
          </div>

          {isWheelOpen ? (
            <MonthWheel
              year={view.year}
              month={view.month}
              minYear={MIN_YEAR}
              maxDate={today}
              onChange={setView}
            />
          ) : (
            <>
              <CalendarGrid
                year={view.year}
                month={view.month}
                selectedDate={selectedDate}
                maxDate={today}
                onSelectDate={handleSelectDate}
              />
              <hr className="border-t border-neutral-normal-default" />
            </>
          )}
        </div>

        {!isWheelOpen && (
          <button
            type="button"
            onClick={() => handleSelectDate(new Date())}
            className="h-10 rounded-[10px] px-5 text-body1-semibold text-system-success"
          >
            {t("today")}
          </button>
        )}
      </div>
    </ModalLayout>
  );
};

export default DatePickerModal;
