"use client";

import { Filter } from "@/components";
import { useClickOutside } from "@/hooks";
import { cn } from "@/utils";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { NoticeSortType } from "@/types";
import { FILTER_OPTIONS } from "../NOTICE_LIST_CONST";

interface NoticeFilterProps {
  searchUpdateQuery: (key: string, value?: string) => void;
}

const NoticeFilter = ({ searchUpdateQuery }: NoticeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const outerRef = useClickOutside(() => setIsOpen(false));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const selectedSortType = searchParams.get("sortType");
  const sortTypeDisplayText =
    FILTER_OPTIONS.find((option) => option.value.toLowerCase() === selectedSortType?.toLowerCase())
      ?.label ?? "최신순";

  const handleOptionClick = (value: NoticeSortType) => {
    const queryValue = value === "LATEST" ? undefined : value.toLowerCase();
    searchUpdateQuery("sortType", queryValue);
    setIsOpen(false);
  };

  return (
    <div ref={outerRef} className="relative inline-block px-5 py-[14px]">
      <Filter
        ariaLabel="공지사항 정렬"
        onSelected={!!selectedSortType}
        onClick={() => setIsOpen((prev) => !prev)}
        icon={{ name: "ArrowDown", size: 12 }}
        iconPosition="trailing"
      >
        {sortTypeDisplayText}
      </Filter>
      {isOpen && (
        <div ref={dropdownRef} className="absolute top-[60px] z-50 flex flex-col">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              type="button"
              className={cn(
                "glass-card w-full text-nowrap border border-white bg-flatGray-25/70 px-7 py-4 text-left text-h3-medium text-neutral-normal-default transition-colors flex-center",
                "first:rounded-t-[20px] last:rounded-b-[20px]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeFilter;
