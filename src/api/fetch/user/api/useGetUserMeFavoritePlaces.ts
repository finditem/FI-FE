import { InfiniteData } from "@tanstack/react-query";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { PlaceSummary, PlaceType } from "@/api/fetch/mapController";
import { useAuthStore } from "@/store";
import { FavoritePlacesResponse } from "../types/FavoritePlacesResponseType";

interface FavoritePlacesData {
  places: PlaceSummary[];
  totalCount?: number;
}

/**
 * 내가 찜한(가보고 싶은) 장소 목록을 최근 저장순으로 무한 스크롤 조회합니다.
 *
 * @remarks
 * - 커서는 응답의 `nextFavoriteUpdatedAt`을 `lastFavoriteUpdatedAt` 파라미터로 보냅니다.
 * - `type`을 생략하면 전체 종류를 조회합니다.
 * - 찜 추가/취소(`usePlaceFavorite`)가 끝나면 `favorite-places` 키가 무효화되어 목록이 갱신됩니다.
 *
 * @param type 장소 종류 필터
 * @param size 한 페이지 크기 (1~20)
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage } = useGetUserMeFavoritePlaces("CAFE");
 * data?.places.map((place) => <PlaceCard key={place.placeId} place={place} />);
 * ```
 */
export const useGetUserMeFavoritePlaces = (type?: PlaceType, size = 20) => {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const queryParams = new URLSearchParams({ size: size.toString() });
  // TODO(준열): 백엔드에 type 필터 지원을 요청했다. 지원 전에는 파라미터가 무시되어 전체 목록이 온다.
  if (type) queryParams.set("type", type);

  return useAppInfiniteQuery<FavoritePlacesResponse, ApiBaseResponseType<null>, FavoritePlacesData>(
    "auth",
    ["favorite-places", type, size],
    `/users/me/favorite-places?${queryParams}`,
    {
      pageParamName: "lastFavoriteUpdatedAt",
      getNextPageParam: (lastPage) =>
        lastPage.result.hasNext ? (lastPage.result.nextFavoriteUpdatedAt ?? undefined) : undefined,
      select: (data: InfiniteData<FavoritePlacesResponse>) => ({
        places: data.pages.flatMap((page) => page.result.places),
        totalCount: data.pages[0]?.result.totalCount,
      }),
      enabled: isAuthInitialized,
    }
  );
};
