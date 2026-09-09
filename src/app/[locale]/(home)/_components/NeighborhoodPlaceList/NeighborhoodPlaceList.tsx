"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import useNeighborhoodPlaces from "../../_hooks/useNeighborhoodPlaces/useNeighborhoodPlaces";
import { NeighborhoodPlaceFilter } from "../../_types/NeighborhoodPlace";
import NeighborhoodPlaceCard from "../NeighborhoodPlaceCard/NeighborhoodPlaceCard";

const LIST_STYLE = "divide-y divide-divider-default";

interface NeighborhoodPlaceListProps {
  filter: NeighborhoodPlaceFilter;
  collapsedCount?: number;
}

const NeighborhoodPlaceList = ({ filter, collapsedCount }: NeighborhoodPlaceListProps) => {
  const t = useTranslations("NeighborhoodSection");
  const [expanded, setExpanded] = useState(false);
  const { data } = useNeighborhoodPlaces(filter);

  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-body2-medium text-layout-body-default">{t("empty")}</p>
    );
  }

  const visiblePlaces = !collapsedCount || expanded ? data : data.slice(0, collapsedCount);
  const canExpand = !!collapsedCount && !expanded && data.length > collapsedCount;

  return (
    <>
      <ul className={LIST_STYLE}>
        {visiblePlaces.map((place) => (
          <NeighborhoodPlaceCard key={place.id} place={place} />
        ))}
      </ul>
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
  );
};

export default NeighborhoodPlaceList;
