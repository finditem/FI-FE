"use client";

import { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, PopupLayout, FilterTab } from "@/components";
import { cn } from "@/utils";
import { PUBLIC_CATEGORY_CODES, PUBLIC_REGION_CODES } from "@/constants";
import { PublicFilterStateType } from "../../../_types/PublicFilterStateType";
import { PUBLIC_DEFAULT_TABS } from "../../PUBLIC_DATA_CONST";

interface PublicDataFilterBottomSheetProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedTab: FilterTab;
  setSelectedTab: (tab: FilterTab) => void;
  filters: PublicFilterStateType;
  setFilters: Dispatch<SetStateAction<PublicFilterStateType>>;
}

const PublicDataFilterBottomSheet = ({
  isOpen,
  setIsOpen,
  selectedTab,
  setSelectedTab,
  filters,
  setFilters,
}: PublicDataFilterBottomSheetProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.publicRegion) {
      params.set("region", filters.publicRegion);
    } else {
      params.delete("region");
    }
    if (filters.publicCategory) {
      params.set("category", filters.publicCategory);
    } else {
      params.delete("category");
    }
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    setIsOpen(false);
  };

  return (
    <PopupLayout
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="flex min-h-[530px] flex-col justify-between gap-5 py-10"
    >
      <div className="w-full gap-6 flex-col-center">
        <h2 className="text-h2-medium text-layout-header-default">필터</h2>

        <section role="tablist" className="w-full flex-center">
          {PUBLIC_DEFAULT_TABS.map((tab) => {
            const isSelected = selectedTab === tab.value;

            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={isSelected}
                aria-label={`${tab.label} 필터`}
                className={cn(
                  "min-h-[60px] flex-1 text-[20px] font-semibold",
                  isSelected
                    ? "border-b-2 border-brand-normal-default text-brand-normal-default"
                    : "text-system-unselected"
                )}
                onClick={() => setSelectedTab(tab.value as FilterTab)}
              >
                {tab.label}
              </button>
            );
          })}
        </section>

        {/* 지역선택 */}
        {selectedTab === "region" && (
          <div role="radiogroup" aria-label="지역 선택" className="flex w-full flex-wrap gap-2">
            <PublicDataChipButton
              label="전체"
              value=""
              selected={filters.publicRegion === ""}
              onSelect={() => setFilters((prev) => ({ ...prev, publicRegion: "" }))}
            />
            {PUBLIC_REGION_CODES.map((regionCode) => (
              <PublicDataChipButton
                key={regionCode.value}
                label={regionCode.label}
                value={regionCode.value}
                selected={filters.publicRegion === regionCode.value}
                onSelect={() => setFilters((prev) => ({ ...prev, publicRegion: regionCode.value }))}
              />
            ))}
          </div>
        )}

        {/* 카테고리 선택 */}
        {selectedTab === "category" && (
          <div role="radiogroup" aria-label="카테고리 선택" className="flex w-full flex-wrap gap-2">
            <PublicDataChipButton
              label="전체"
              value=""
              selected={!filters.publicCategory}
              onSelect={() => setFilters((prev) => ({ ...prev, publicCategory: "" }))}
            />
            {PUBLIC_CATEGORY_CODES.map((cat) => (
              <PublicDataChipButton
                key={cat.value}
                label={cat.label}
                value={cat.value}
                selected={filters.publicCategory === cat.value}
                onSelect={() => setFilters((prev) => ({ ...prev, publicCategory: cat.value }))}
              />
            ))}
          </div>
        )}
      </div>

      <Button role="button" ariaLabel="필터 적용" className="w-full" onClick={handleApply}>
        적용하기
      </Button>
    </PopupLayout>
  );
};

export default PublicDataFilterBottomSheet;

const PublicDataChipButton = ({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-pressed={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(value)}
      className={cn(
        "rounded-full px-[18px] py-2 text-body1-semibold",
        selected
          ? "text-white bg-fill-neutralInversed-normal-enteredSelected"
          : "text-neutralInversed-normal-default bg-fill-neutralInversed-normal-default"
      )}
    >
      {label}
    </button>
  );
};
