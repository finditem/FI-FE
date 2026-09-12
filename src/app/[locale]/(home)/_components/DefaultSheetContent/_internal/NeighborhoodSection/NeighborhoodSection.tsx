"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { Filter } from "@/components";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useHorizontalDragScroll } from "@/hooks";
import { NeighborhoodPlaceFilter } from "../../../../_types/NeighborhoodPlace";
import NeighborhoodPlaceList from "../../../NeighborhoodPlaceList/NeighborhoodPlaceList";
import NeighborhoodPlaceCardSkeleton from "../../../NeighborhoodPlaceCardSkeleton/NeighborhoodPlaceCardSkeleton";

const FILTERS: { value: NeighborhoodPlaceFilter; labelKey: string }[] = [
  { value: "ALL", labelKey: "filterAll" },
  { value: "POPUP", labelKey: "filterPopup" },
  { value: "CAFE", labelKey: "filterCafe" },
  { value: "RESTAURANT", labelKey: "filterRestaurant" },
];

const COLLAPSED_COUNT = 3;

const NeighborhoodSection = () => {
  const t = useTranslations("NeighborhoodSection");
  const { ref, onMouseDown } = useHorizontalDragScroll();
  const [filter, setFilter] = useState<NeighborhoodPlaceFilter>("ALL");

  const handleFilterClick = (value: NeighborhoodPlaceFilter) => {
    setFilter(value);
  };

  return (
    <section className="space-y-4">
      <p className="mt-14 pl-1 text-h2-bold text-neutral-strong-hover">{t("title")}</p>

      <div ref={ref} onMouseDown={onMouseDown} className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(({ value, labelKey }) => (
          <Filter
            key={value}
            ariaLabel={t(labelKey)}
            onSelected={filter === value}
            onClick={() => handleFilterClick(value)}
          >
            {t(labelKey)}
          </Filter>
        ))}
      </div>

      <ErrorBoundary
        fallback={
          <p className="py-6 text-center text-body2-medium text-layout-body-default">
            {t("loadError")}
          </p>
        }
      >
        <Suspense fallback={<NeighborhoodPlaceCardSkeleton />}>
          <NeighborhoodPlaceList key={filter} filter={filter} collapsedCount={COLLAPSED_COUNT} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default NeighborhoodSection;
