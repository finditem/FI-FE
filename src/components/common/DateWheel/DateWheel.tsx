"use client";

import { ReactNode, useEffect, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { cn } from "@/utils";

/**
 * 세로로 굴려서 값을 고르는 휠 피커입니다.
 *
 * @remarks
 * - 가운데 슬라이드가 선택 값이며, 슬라이드가 멈출 때 `onSelected`가 호출됩니다.
 * - `selected`가 밖에서 바뀌면 해당 위치로 스크롤합니다. controlled 방식으로 동작합니다.
 * - 가운데 강조는 두 가지입니다. `variant="overlay"`는 위아래를 흐리게 덮고, `variant="pill"`은 가운데에 알약 배경을 깝니다.
 * - 값이 숫자가 아닌 문자열로 보여야 하면 `renderLabel`로 표시만 바꿉니다. 내부 값은 항상 숫자입니다.
 *
 * @author suhyeon
 * @author jikwon (공통 컴포넌트로 분리, pill 변형 추가)
 */

/** 슬라이드 5개가 보이도록 맞춘 변형별 높이와 간격입니다. */
const VARIANT_LAYOUT = {
  overlay: { className: "h-[140px]", spaceBetween: 8 },
  pill: { className: "h-[156px]", spaceBetween: 4 },
} as const;

interface DateWheelProps {
  /** 굴려서 고를 값 목록 */
  dateArray: number[];
  /** 현재 선택된 값 */
  selected: number;
  /** 선택 값 변경 핸들러 */
  onSelected: (value: number) => void;
  /** 값 뒤에 붙일 단위 (예: `년`, `월`). `renderLabel`을 넘기면 무시됩니다. */
  label?: string;
  /** 값을 화면에 표시할 방법. 넘기지 않으면 `값 + label`로 표시합니다. */
  renderLabel?: (value: number) => ReactNode;
  /** 가운데 강조 방식 (default: "overlay") */
  variant?: "overlay" | "pill";
  /** 휠 전체에 적용할 클래스 */
  className?: string;
  /** 접근성을 위한 휠 설명 */
  ariaLabel?: string;
}

/**
 * @example
 * ```tsx
 * <DateWheel dateArray={years} selected={year} onSelected={setYear} label="년" />
 *
 * <DateWheel
 *   dateArray={monthValues}
 *   selected={monthValue}
 *   onSelected={setMonthValue}
 *   renderLabel={(value) => `${toYear(value)}년 ${toMonth(value)}월`}
 *   variant="pill"
 * />
 * ```
 */

const DateWheel = ({
  dateArray,
  selected,
  onSelected,
  label,
  renderLabel,
  variant = "overlay",
  className,
  ariaLabel,
}: DateWheelProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const layout = VARIANT_LAYOUT[variant];

  useEffect(() => {
    if (swiperInstance && !swiperInstance.destroyed) {
      const index = dateArray.indexOf(selected);
      if (index !== -1 && swiperInstance.activeIndex !== index) {
        swiperInstance.slideTo(index);
      }
    }
  }, [selected, dateArray, swiperInstance]);

  return (
    <div
      className={cn("w-full overflow-hidden flex-center", layout.className, className)}
      role="group"
      aria-label={ariaLabel}
    >
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
        spaceBetween={layout.spaceBetween}
      >
        {variant === "overlay" ? (
          <>
            {/* 중앙 선택 영역 강조를 위한 오버레이 */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-[40%] w-full border-b border-neutral-normal-default bg-white opacity-50" />
            <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[40%] w-full border-t border-neutral-normal-default bg-white opacity-50" />
          </>
        ) : (
          /* 가운데 한 줄에만 깔리는 알약 배경입니다. 슬라이드보다 높아 위아래로 조금 넘칩니다. */
          <div className="pointer-events-none absolute left-0 top-1/2 z-0 h-[37px] w-full -translate-y-1/2 rounded-full bg-flatGreen-200/15" />
        )}

        {dateArray.map((item) => (
          <SwiperSlide
            key={item}
            className={cn(
              "z-10 flex w-full items-center justify-center transition-colors",
              "cursor-default select-none",
              variant === "overlay"
                ? "text-h2-regular text-layout-header-default [&.swiper-slide-active]:opacity-100"
                : "text-h2-medium text-labelsVibrant-tertiary [&.swiper-slide-active]:text-labelsVibrant-primary"
            )}
          >
            <div className="flex-center">
              {renderLabel ? (
                renderLabel(item)
              ) : (
                <>
                  {item}
                  {label && <span>{label}</span>}
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DateWheel;
