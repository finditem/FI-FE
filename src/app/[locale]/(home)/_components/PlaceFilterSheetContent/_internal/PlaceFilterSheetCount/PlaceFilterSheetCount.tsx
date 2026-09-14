"use client";

import { useTranslations } from "next-intl";
import { PlaceFilterValue } from "../../../HOME_CONST";
import useNeighborhoodPlaces from "../../../../_hooks/useNeighborhoodPlaces/useNeighborhoodPlaces";
import { NeighborhoodPlaceCategory } from "../../../../_types/NeighborhoodPlace";

interface PlaceFilterSheetCountProps {
  filter: NeighborhoodPlaceCategory;
  placeValue: PlaceFilterValue;
}

const PlaceFilterSheetCount = ({ filter, placeValue }: PlaceFilterSheetCountProps) => {
  const t = useTranslations("PlaceFilterSheet");
  const { data } = useNeighborhoodPlaces(filter);

  return (
    <p className="text-body2-medium text-layout-body-default">
      {t(`${placeValue}Count`, { count: data.length })}
    </p>
  );
};

export default PlaceFilterSheetCount;
