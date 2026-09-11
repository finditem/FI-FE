"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useMainKakaoMapStore } from "@/store";
import { PLACE_FILTER_TO_CATEGORY, PlaceFilterValue } from "../HOME_CONST";
import NeighborhoodPlaceList from "../NeighborhoodPlaceList/NeighborhoodPlaceList";
import NeighborhoodPlaceCardSkeleton from "../NeighborhoodPlaceCardSkeleton/NeighborhoodPlaceCardSkeleton";
import PlaceFilterSheetCount from "./_internal/PlaceFilterSheetCount/PlaceFilterSheetCount";

interface PlaceFilterSheetContentProps {
  placeValue: PlaceFilterValue;
}

const MESSAGE_STYLE = "py-6 text-center text-body2-medium text-layout-body-default";

const PlaceFilterSheetContent = ({ placeValue }: PlaceFilterSheetContentProps) => {
  const t = useTranslations("PlaceFilterSheet");
  const collapseSheet = useMainKakaoMapStore((s) => s.triggerPlaceSheetCollapse);
  const filter = PLACE_FILTER_TO_CATEGORY[placeValue];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-h2-bold text-neutral-strong-hover">{t(`${placeValue}Title`)}</h2>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <PlaceFilterSheetCount filter={filter} placeValue={placeValue} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <ErrorBoundary fallback={<p className={MESSAGE_STYLE}>{t("loadError")}</p>}>
        <Suspense fallback={<NeighborhoodPlaceCardSkeleton count={5} />}>
          <NeighborhoodPlaceList filter={filter} />
        </Suspense>
      </ErrorBoundary>

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={collapseSheet}
          className="flex items-center gap-1 rounded-full border border-divider-default bg-white px-4 py-2 text-body2-medium text-layout-header-default shadow-[0_0_5px_rgba(0,0,0,0.1)]"
        >
          <Icon name="MapMyLocation" size={16} />
          {t("mapButton")}
        </button>
      </div>
    </div>
  );
};

export default PlaceFilterSheetContent;
