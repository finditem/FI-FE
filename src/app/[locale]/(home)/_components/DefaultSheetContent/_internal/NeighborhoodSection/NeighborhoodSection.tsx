// TODO(준열) : 현재 목업 데이터로 작동 중 기능 구현시 목업데이터 삭제
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Filter, Icon } from "@/components";
import { useHorizontalDragScroll } from "@/hooks";
import useNeighborhoodPlaces from "../../../../_hooks/useNeighborhoodPlaces/useNeighborhoodPlaces";
import { NeighborhoodPlaceFilter } from "../../../../_types/NeighborhoodPlace";
import NeighborhoodPlaceCard from "../../../NeighborhoodPlaceCard/NeighborhoodPlaceCard";
import NeighborhoodPlaceCardSkeleton from "../../../NeighborhoodPlaceCardSkeleton/NeighborhoodPlaceCardSkeleton";

const FILTERS: { value: NeighborhoodPlaceFilter; labelKey: string }[] = [
  { value: "ALL", labelKey: "filterAll" },
  { value: "POPUP", labelKey: "filterPopup" },
  { value: "CAFE", labelKey: "filterCafe" },
  { value: "RESTAURANT", labelKey: "filterRestaurant" },
];

const COLLAPSED_COUNT = 3;
const LIST_STYLE = "divide-y divide-divider-default";

const NeighborhoodSection = () => {
  const t = useTranslations("NeighborhoodSection");
  const { ref, onMouseDown } = useHorizontalDragScroll();
  const [filter, setFilter] = useState<NeighborhoodPlaceFilter>("ALL");
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading, isError } = useNeighborhoodPlaces(filter);

  const places = data ?? [];
  const visiblePlaces = expanded ? places : places.slice(0, COLLAPSED_COUNT);
  const canExpand = !expanded && places.length > COLLAPSED_COUNT;

  const handleFilterClick = (value: NeighborhoodPlaceFilter) => {
    setFilter(value);
    setExpanded(false);
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

      {isError ? (
        <p className="py-6 text-center text-body2-medium text-layout-body-default">
          {t("loadError")}
        </p>
      ) : isLoading ? (
        <div className={LIST_STYLE}>
          <NeighborhoodPlaceCardSkeleton />
        </div>
      ) : places.length === 0 ? (
        <p className="py-6 text-center text-body2-medium text-layout-body-default">{t("empty")}</p>
      ) : (
        <>
          <div className={LIST_STYLE}>
            {visiblePlaces.map((place) => (
              <NeighborhoodPlaceCard key={place.id} place={place} />
            ))}
          </div>
          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex w-full items-center justify-center gap-1 py-2 text-body1-medium text-labelsVibrant-primary"
            >
              {t("moreButton")}
              <Icon name="ArrowDown" size={12} />
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default NeighborhoodSection;
