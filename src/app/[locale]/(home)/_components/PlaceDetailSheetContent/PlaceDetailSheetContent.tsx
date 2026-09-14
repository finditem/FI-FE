"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useSearchLocationPlaces, usePlaceSummary } from "@/api/fetch/mapController";
import type {
  NearbyPostFilter as NearbyPostFilterValue,
  PlaceType,
} from "@/api/fetch/mapController";
import { getDistanceMeters } from "@/utils";
import { PLACE_RADIUS_M } from "../HOME_CONST";
import type { PlaceDetailTab } from "../../_types/PlaceDetailTab";
import NeighborhoodPlaceCard from "../NeighborhoodPlaceCard/NeighborhoodPlaceCard";
import NeighborhoodPlaceCardSkeleton from "../NeighborhoodPlaceCardSkeleton/NeighborhoodPlaceCardSkeleton";
import PlaceDetailTabs from "./_internal/PlaceDetailTabs/PlaceDetailTabs";
import NearbyPostList from "./_internal/NearbyPostList/NearbyPostList";
import NearbyPostFilter from "./_internal/NearbyPostFilter/NearbyPostFilter";

const MESSAGE_STYLE = "py-6 text-center text-body2-medium text-layout-body-default";

interface PlaceDetailSheetContentProps {
  placeId: number;
  placeType: PlaceType;
}

/**
 * 지도에서 장소 마커를 선택했을 때 열리는 시트입니다.
 *
 * @remarks
 * 동네 정보 탭은 선택한 장소 하나가 아니라 반경 안의 같은 카테고리 장소를 모두 보여줍니다.
 * 장소에는 게시글의 `nearby-posts`에 대응하는 엔드포인트가 없어, 지도 조회 결과(`search-location`)를
 * 반경으로 잘라 씁니다. 마커를 누르면 지도 중심이 그 장소로 이동하므로 이 결과가 곧 장소 주변이 됩니다.
 */
const PlaceDetailSheetContent = ({ placeId, placeType }: PlaceDetailSheetContentProps) => {
  const t = useTranslations("PlaceDetailSheet");
  const [tab, setTab] = useState<PlaceDetailTab>("place");
  const [postFilter, setPostFilter] = useState<NearbyPostFilterValue>({});

  const { data: summaryData } = usePlaceSummary(placeId);
  const { data: placesData, isLoading } = useSearchLocationPlaces(placeType);

  const selectedPlace = summaryData?.result;
  const nearbyPlaces = (placesData?.result?.places ?? []).filter((place) => {
    if (!selectedPlace) return false;
    const distance = getDistanceMeters(
      { lat: selectedPlace.latitude, lng: selectedPlace.longitude },
      { lat: place.latitude, lng: place.longitude }
    );
    return distance <= PLACE_RADIUS_M.outer;
  });

  return (
    <div className="space-y-4">
      <PlaceDetailTabs value={tab} onChange={setTab} />

      {tab === "place" ? (
        <ErrorBoundary fallback={<p className={MESSAGE_STYLE}>{t("loadError")}</p>}>
          {isLoading ? (
            <NeighborhoodPlaceCardSkeleton count={3} />
          ) : nearbyPlaces.length === 0 ? (
            <p className={MESSAGE_STYLE}>{t("emptyPlace")}</p>
          ) : (
            <ul className="divide-y divide-divider-default">
              {nearbyPlaces.map((place) => (
                <NeighborhoodPlaceCard key={place.placeId} place={place} />
              ))}
            </ul>
          )}
        </ErrorBoundary>
      ) : (
        <>
          <NearbyPostFilter value={postFilter} onChange={setPostFilter} />
          <ErrorBoundary fallback={<p className={MESSAGE_STYLE}>{t("loadError")}</p>}>
            <NearbyPostList placeId={placeId} filter={postFilter} />
          </ErrorBoundary>
        </>
      )}
    </div>
  );
};

export default PlaceDetailSheetContent;
