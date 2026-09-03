"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { useMainKakaoMapStore } from "@/store";
import { PLACE_FILTER_TO_CATEGORY, PlaceFilterValue } from "../HOME_CONST";
import useNeighborhoodPlaces from "../../_hooks/useNeighborhoodPlaces/useNeighborhoodPlaces";
import NeighborhoodPlaceCard from "../NeighborhoodPlaceCard/NeighborhoodPlaceCard";
import NeighborhoodPlaceCardSkeleton from "../NeighborhoodPlaceCardSkeleton/NeighborhoodPlaceCardSkeleton";

interface PlaceFilterSheetContentProps {
  placeValue: PlaceFilterValue;
}

const LIST_STYLE = "divide-y divide-divider-default";
const MESSAGE_STYLE = "py-6 text-center text-body2-medium text-layout-body-default";

/**
 * 검색바 아래 팝업/카페/맛집 칩을 눌렀을 때 바텀시트에 표시되는 장소 필터 시트 내용입니다.
 *
 * @remarks
 * 데이터는 아직 목업입니다({@link useNeighborhoodPlaces}). "지도" 버튼은 바텀시트를 최소 높이로 접습니다.
 */
const PlaceFilterSheetContent = ({ placeValue }: PlaceFilterSheetContentProps) => {
  const t = useTranslations("PlaceFilterSheet");
  const collapseSheet = useMainKakaoMapStore((s) => s.triggerPlaceSheetCollapse);
  const { data, isLoading, isError } = useNeighborhoodPlaces(PLACE_FILTER_TO_CATEGORY[placeValue]);
  const places = data ?? [];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-h2-bold text-neutral-strong-hover">{t(`${placeValue}Title`)}</h2>
        {!isLoading && !isError && (
          <p className="text-body2-medium text-layout-body-default">
            {t(`${placeValue}Count`, { count: places.length })}
          </p>
        )}
      </div>

      {isError ? (
        <p className={MESSAGE_STYLE}>{t("loadError")}</p>
      ) : isLoading ? (
        <div className={LIST_STYLE}>
          <NeighborhoodPlaceCardSkeleton count={5} />
        </div>
      ) : places.length === 0 ? (
        <p className={MESSAGE_STYLE}>{t("empty")}</p>
      ) : (
        <div className={LIST_STYLE}>
          {places.map((place) => (
            <NeighborhoodPlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

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
