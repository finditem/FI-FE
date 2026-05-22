"use client";

import { useState } from "react";
import { Filter, FilterTab } from "@/components";
import { useFilterParams } from "@/hooks";
import { PUBLIC_CATEGORY_CODES, PUBLIC_REGION_CODES } from "@/constants";
import PublicDataFilterBottomSheet from "../PublicDataFilterBottomSheet/PublicDataFilterBottomSheet";
import { PublicFilterStateType } from "../../../_types/PublicFilterStateType";
import { PUBLIC_DEFAULT_FILTERS } from "../../PUBLIC_DATA_CONST";

const PublicDataFilterSection = () => {
  const { region, category } = useFilterParams();
  const [filters, setFilters] = useState<PublicFilterStateType>(PUBLIC_DEFAULT_FILTERS);
  const [selectedTab, setSelectedTab] = useState<FilterTab>("region");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openSheet = (tab: FilterTab) => {
    setFilters({
      ...PUBLIC_DEFAULT_FILTERS,
      publicRegion: region ?? "",
      publicCategory: category ?? "",
    });
    setSelectedTab(tab);
    setIsFilterOpen(true);
  };

  const filterConfigs = {
    region: {
      ariaLabel: "지역 선택 필터",
      onSelected: !!region,
      icon: { name: "Location" as const, size: 16 },
      label: region
        ? (PUBLIC_REGION_CODES.find((r) => r.value === region)?.label ?? region)
        : "지역 선택",
      iconPosition: "leading" as const,
    },
    category: {
      ariaLabel: "카테고리 필터",
      onSelected: !!category,
      icon: { name: "ArrowDown" as const, size: 12 },
      label:
        PUBLIC_CATEGORY_CODES.find((c) => c.value === (category as string))?.label ?? "카테고리",
      iconPosition: "trailing" as const,
    },
  };

  return (
    <>
      <section
        aria-label="필터 영역"
        className="flex h-[67px] w-full items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap px-5 no-scrollbar"
      >
        {(["region", "category"] as const).map((tabValue) => {
          const config = filterConfigs[tabValue];

          return (
            <Filter
              key={tabValue}
              ariaLabel={config.ariaLabel}
              onSelected={config.onSelected}
              icon={config.icon}
              iconPosition={config.iconPosition}
              className="flex-shrink-0"
              onClick={() => openSheet(tabValue)}
            >
              {config.label}
            </Filter>
          );
        })}
      </section>

      {isFilterOpen && (
        <PublicDataFilterBottomSheet
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </>
  );
};

export default PublicDataFilterSection;
