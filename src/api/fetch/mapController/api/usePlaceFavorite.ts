"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import type { PlaceSummary } from "../types/SearchLocationPlacesType";

/** `result.places` 배열을 가진 장소 목록 캐시들의 쿼리 키 접두사 */
const PLACE_LIST_QUERY_KEYS = ["search-location-places", "neighborhood-places"];

type PlaceListCache = ApiBaseResponseType<{ places?: PlaceSummary[] }>;
type PlaceSummaryCache = ApiBaseResponseType<PlaceSummary>;
type FavoriteContext = { previousIsFavorite: boolean };

/** 장소 상세 캐시 1건의 `isFavorite`를 뒤집는다. 캐시가 비어 있으면 그대로 둔다. */
export const setFavoriteInPlaceSummary = (
  cache: PlaceSummaryCache | undefined,
  isFavorite: boolean
): PlaceSummaryCache | undefined =>
  cache?.result ? { ...cache, result: { ...cache.result, isFavorite } } : cache;

/** 장소 목록 캐시에서 해당 `placeId`만 찾아 `isFavorite`를 뒤집는다. */
export const setFavoriteInPlaceList = (
  cache: PlaceListCache | undefined,
  placeId: number,
  isFavorite: boolean
): PlaceListCache | undefined => {
  const places = cache?.result?.places;
  if (!places) return cache;

  return {
    ...cache,
    result: {
      ...cache.result,
      places: places.map((place) => (place.placeId === placeId ? { ...place, isFavorite } : place)),
    },
  };
};

/**
 * 가보고 싶은 장소 추가/취소. 로그인이 필요합니다.
 *
 * @remarks
 * 같은 장소의 `isFavorite`가 상세(`place-summary`)와 목록(`search-location-places`,
 * `neighborhood-places`) 캐시에 흩어져 있어, 낙관적 업데이트에서 세 곳을 함께 뒤집습니다.
 * 실패하면 이전 값으로 되돌리고, 성공/실패와 무관하게 마지막에 무효화해 서버 값으로 맞춥니다.
 */
const usePlaceFavorite = (placeId: number) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const t = useTranslations("usePlaceFavorite");

  const patchCaches = (isFavorite: boolean) => {
    queryClient.setQueriesData<PlaceSummaryCache>({ queryKey: ["place-summary", placeId] }, (old) =>
      setFavoriteInPlaceSummary(old, isFavorite)
    );

    queryClient.setQueriesData<PlaceListCache>(
      { predicate: (query) => PLACE_LIST_QUERY_KEYS.includes(query.queryKey[0] as string) },
      (old) => setFavoriteInPlaceList(old, placeId, isFavorite)
    );
  };

  const invalidatePlaceQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["place-summary", placeId] });
    queryClient.invalidateQueries({
      predicate: (query) => PLACE_LIST_QUERY_KEYS.includes(query.queryKey[0] as string),
    });
  };

  const buildOptions = (nextIsFavorite: boolean, successKey: string, errorKey: string) => ({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["place-summary", placeId] });
      patchCaches(nextIsFavorite);
      return { previousIsFavorite: !nextIsFavorite };
    },
    onSuccess: () => addToast(t(successKey), "success" as const),
    onError: (_error: unknown, _variables: unknown, context: unknown) => {
      const typedContext = context as FavoriteContext | undefined;
      if (typedContext) patchCaches(typedContext.previousIsFavorite);
      addToast(t(errorKey), "error" as const);
    },
    onSettled: invalidatePlaceQueries,
  });

  const addFavorite = useAppMutation<
    void,
    ApiBaseResponseType<{ placeId: number; isFavorite: boolean }>
  >("auth", `/places/${placeId}/favorites`, "post", buildOptions(true, "addSuccess", "addError"));

  const removeFavorite = useAppMutation<
    void,
    ApiBaseResponseType<{ placeId: number; isFavorite: boolean }>
  >(
    "auth",
    `/places/${placeId}/favorites`,
    "delete",
    buildOptions(false, "removeSuccess", "removeError")
  );

  return {
    toggleFavorite: (isFavorite: boolean) =>
      isFavorite ? removeFavorite.mutate() : addFavorite.mutate(),
    isPending: addFavorite.isPending || removeFavorite.isPending,
  };
};

export default usePlaceFavorite;
