"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useHorizontalDragScroll } from "@/hooks";
import { cn } from "@/utils";
import { MAIN_SEARCH_CHIPS, MainSearchChipType } from "../HOME_CONST";

interface MainSearchChipListProps {
  /** 처음 선택돼 있을 칩 */
  defaultSelectedType?: MainSearchChipType | null;
  /** 칩 선택/해제 시 호출. 선택된 타입이 없으면 `null` */
  onSelect?: (type: MainSearchChipType | null) => void;
}

/**
 * 메인 홈 검색바 아래 가로 스크롤 필터칩 목록입니다.
 *
 * @remarks
 * - 같은 칩을 다시 누르면 선택이 해제됩니다(단일 선택).
 * - 선택 시 연한 브랜드 배경(`fill-brand-subtle-default_2`) + 브랜드 보더(`border-brand-normal-default`)로 강조하며, 텍스트와 아이콘 색은 그대로 둡니다.
 * - `onSelect`는 선택된 타입을 알려주기만 합니다. 지도에 해당 타입 핀만 렌더링하는 기능은 아직 미구현입니다.
 */
const MainSearchChipList = ({ defaultSelectedType = null, onSelect }: MainSearchChipListProps) => {
  const t = useTranslations("MainSearchChipList");
  const { ref, onMouseDown } = useHorizontalDragScroll();
  const [selectedType, setSelectedType] = useState<MainSearchChipType | null>(defaultSelectedType);

  const handleClick = (type: MainSearchChipType) => {
    const next = selectedType === type ? null : type;
    setSelectedType(next);
    onSelect?.(next);
  };

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="flex gap-1 overflow-x-auto no-scrollbar">
      {MAIN_SEARCH_CHIPS.map(({ type, icon }) => {
        const isSelected = selectedType === type;

        return (
          <button
            key={type}
            type="button"
            aria-pressed={isSelected}
            onClick={() => handleClick(type)}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full border px-[18px] py-2",
              "whitespace-nowrap text-body1-semibold text-neutralInversed-normal-default",
              "shadow-[0_0_5px_rgba(0,0,0,0.1)] transition-colors",
              isSelected
                ? "border-brand-normal-default bg-fill-brand-subtle-default_2"
                : "border-transparent bg-white"
            )}
          >
            <Image src={icon} alt="" width={16} height={16} draggable={false} />
            {t(type)}
          </button>
        );
      })}
    </div>
  );
};

export default MainSearchChipList;
