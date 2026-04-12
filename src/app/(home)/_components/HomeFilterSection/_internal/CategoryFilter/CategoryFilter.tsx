"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter } from "@/components/common";
import { MAP_CATEGORY_FILTER_OPTIONS } from "@/constants";
import { CATEGORY_FILTER_DROPDOWN_MIN_WIDTH_PX } from "../../../../_constants/FILTER";
import { cn } from "@/utils";
import { usePopoverOutsideClose, usePopoverPosition } from "@/hooks";

interface CategoryFilterProps {
  ariaLabel: string;
  label: string;
  isSelected: boolean;
  selectedValue: string;
  onSelect: (value?: string) => void;
}

const CategoryFilter = ({
  ariaLabel,
  label,
  isSelected,
  selectedValue,
  onSelect,
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  usePopoverOutsideClose(isOpen, triggerRef, dropdownRef, () => setIsOpen(false));
  usePopoverPosition(
    isOpen,
    triggerRef,
    dropdownRef,
    undefined,
    CATEGORY_FILTER_DROPDOWN_MIN_WIDTH_PX
  );

  const handleOptionClick = (value: string) => {
    onSelect(value === "" ? undefined : value);
    setIsOpen(false);
  };

  return (
    <>
      <div ref={triggerRef}>
        <Filter
          ariaLabel={ariaLabel}
          onSelected={isSelected}
          icon={{ name: "ArrowDown", size: 12 }}
          iconPosition="trailing"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {label}
        </Filter>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 flex max-h-[200px] min-h-0 flex-col overflow-y-auto overscroll-y-contain rounded-[20px] no-scrollbar"
          >
            {MAP_CATEGORY_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value === "" ? "all" : option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  "glass-card h-[58px] w-full shrink-0 text-nowrap border border-white bg-flatGray-25/70 px-7 text-h3-medium text-neutral-normal-default transition-colors flex-center",
                  "first:rounded-t-[20px] last:rounded-b-[20px]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default CategoryFilter;
