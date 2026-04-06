"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DateRangeBottomSheet } from "@/components/domain";
import { useClickOutside } from "@/hooks";
import { useFilterParams } from "@/hooks/domain";
import { Filter } from "@/components/common";
import { AdminDropdown } from "@/app/(admin)/admin/_components";
import { getDateRangeLabel } from "@/utils/getDateRangeLabel/getDateRangeLabel";
import {
  categories,
  findStatus as findStatusOptions,
} from "@/components/domain/FilterSectionBottomSheet/_constants/CONSTANTS";

const getSortLabel = (sortValue?: string) => {
  switch (sortValue) {
    case "OLDEST":
      return "오래된순";
    case "MOST_FAVORITED":
      return "인기순";
    case "MOST_VIEWED":
      return "조회수 많은 순";
    case "LATEST":
    default:
      return "최신순";
  }
};

const getCategoryLabel = (categoryValue?: string) => {
  const found = categories.find((c) => c.value === categoryValue);
  return found && found.value ? found.label : "카테고리";
};

const getFindStatusLabel = (findStatusValue?: string) => {
  const found = findStatusOptions.find((f) => f.value === findStatusValue);
  return found && found.value ? found.label : "찾음 여부";
};

const ADMIN_CONTENT_SORT_OPTIONS = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "MOST_FAVORITED", label: "인기순" },
  { value: "MOST_VIEWED", label: "조회수 많은 순" },
];

const ContentAgreeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { startDate, endDate, sort, category, findStatus } = useFilterParams();
  const containerRef = useClickOutside(() => {
    setIsSortOpen(false);
    setIsCategoryOpen(false);
    setIsFindStatusOpen(false);
  });

  const [bottomSheetFilters, setBottomSheetFilters] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
  });

  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFindStatusOpen, setIsFindStatusOpen] = useState(false);

  useEffect(() => {
    setBottomSheetFilters({
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
    });
  }, [startDate, endDate]);

  const handleSortChange = (newSort: string) => {
    const currentSort = sort || "LATEST";

    if (currentSort === newSort) {
      setIsSortOpen(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (newSort === "LATEST") {
      params.delete("sort");
    } else {
      params.set("sort", newSort.toLowerCase());
    }

    const newQueryString = params.toString();
    router.replace(newQueryString ? `${pathname}?${newQueryString}` : pathname);
    setIsSortOpen(false);
  };

  const handleCategoryChange = (newCategory: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!newCategory) {
      params.delete("category");
    } else {
      params.set("category", newCategory.toLowerCase());
    }

    const newQueryString = params.toString();
    router.replace(newQueryString ? `${pathname}?${newQueryString}` : pathname);
    setIsCategoryOpen(false);
  };

  const handleFindStatusChange = (newFindStatus: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!newFindStatus) {
      params.delete("find-status");
    } else {
      params.set("find-status", newFindStatus.toLowerCase());
    }

    const newQueryString = params.toString();
    router.replace(newQueryString ? `${pathname}?${newQueryString}` : pathname);
    setIsFindStatusOpen(false);
  };

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2 px-5 py-[10px]">
      <Filter
        ariaLabel={getDateRangeLabel(startDate, endDate)}
        onSelected={!!(startDate || endDate)}
        icon={{ name: "Calendar", size: 16 }}
        iconPosition="leading"
        onClick={() => setIsDateSheetOpen(true)}
      >
        {getDateRangeLabel(startDate, endDate)}
      </Filter>

      <div className="relative shrink-0">
        <Filter
          ariaLabel={getCategoryLabel(category)}
          onSelected={!!category}
          icon={{ name: "ArrowDown", size: 16 }}
          iconPosition="trailing"
          onClick={() => {
            setIsCategoryOpen((prev) => !prev);
            setIsSortOpen(false);
            setIsFindStatusOpen(false);
          }}
        >
          {getCategoryLabel(category)}
        </Filter>
        <AdminDropdown
          open={isCategoryOpen}
          options={categories.map((c) => ({ label: c.label, value: c.value || "all" }))}
          onSelect={(val) => handleCategoryChange(val === "all" ? undefined : val)}
          className="left-0 top-[45px] w-[140px] shadow-lg"
        />
      </div>

      <div className="relative shrink-0">
        <Filter
          ariaLabel={getFindStatusLabel(findStatus)}
          onSelected={!!findStatus}
          icon={{ name: "ArrowDown", size: 16 }}
          iconPosition="trailing"
          onClick={() => {
            setIsFindStatusOpen((prev) => !prev);
            setIsSortOpen(false);
            setIsCategoryOpen(false);
          }}
        >
          {getFindStatusLabel(findStatus)}
        </Filter>
        <AdminDropdown
          open={isFindStatusOpen}
          options={findStatusOptions.map((f) => ({ label: f.label, value: f.value || "all" }))}
          onSelect={(val) => handleFindStatusChange(val === "all" ? undefined : val)}
          className="left-0 top-[45px] w-[140px] shadow-lg"
        />
      </div>

      <div className="relative shrink-0">
        <Filter
          ariaLabel={getSortLabel(sort)}
          onSelected={!!sort && sort !== "LATEST"}
          icon={{ name: "ArrowDown", size: 16 }}
          iconPosition="trailing"
          onClick={() => {
            setIsSortOpen((prev) => !prev);
            setIsCategoryOpen(false);
            setIsFindStatusOpen(false);
          }}
        >
          {getSortLabel(sort)}
        </Filter>
        <AdminDropdown
          open={isSortOpen}
          options={ADMIN_CONTENT_SORT_OPTIONS}
          onSelect={handleSortChange}
          className="left-0 top-[45px] w-[140px] shadow-lg"
        />
      </div>

      {isDateSheetOpen && (
        <DateRangeBottomSheet
          isOpen={isDateSheetOpen}
          onClose={() => setIsDateSheetOpen(false)}
          filters={bottomSheetFilters}
          setFilters={setBottomSheetFilters}
        />
      )}
    </div>
  );
};

export default ContentAgreeFilter;
