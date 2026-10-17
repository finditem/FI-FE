"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useGetUserMeFavoritePlaces } from "@/api/fetch/user";
import { Filter, MypageEmptyUI, PlaceCard, PlaceCardSkeleton } from "@/components";
import { PLACE_FILTER_OPTIONS, PlaceFilterValue } from "@/constants";
import { useToast } from "@/context/ToastContext";
import { useHorizontalDragScroll, useInfiniteScroll } from "@/hooks";

/**
 * 마이페이지 찜한 장소 목록입니다. 개수 문구, 종류 필터 칩, 장소 카드 목록을 무한 스크롤로 보여 줍니다.
 *
 * @remarks
 * - 전체 보기에서 찜한 장소가 하나도 없으면 칩 없이 빈 상태만 보여 줍니다.
 * - 개수 문구는 응답에 `totalCount`가 있을 때만 보여 줍니다.
 *
 * @example
 * ```tsx
 * <MypageFavoritePlacesContent />
 * ```
 */
const MypageFavoritePlacesContent = () => {
  const t = useTranslations("MypageFavoritePlacesContent");
  const tFilter = useTranslations("PlaceFilter");
  const { addToast } = useToast();
  const { ref: chipsRef, onMouseDown } = useHorizontalDragScroll();
  const [filter, setFilter] = useState<PlaceFilterValue>("ALL");

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetUserMeFavoritePlaces(filter === "ALL" ? undefined : filter);

  const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  useEffect(() => {
    if (isError) addToast(t("loadError"), "error");
  }, [isError, addToast, t]);

  const places = data?.places ?? [];

  if (!isLoading && filter === "ALL" && places.length === 0) {
    return <MypageEmptyUI pageType="favoritePlaces" />;
  }

  return (
    <section className="flex flex-col gap-3 pt-4">
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>

      {/* TODO(준열): 백엔드에 totalCount 추가를 요청했다. 응답에 포함되기 전까지는 개수 문구가 보이지 않는다. */}
      {data?.totalCount !== undefined && (
        <p className="text-body2-medium text-layout-body-default">
          {t("totalCount", { count: data.totalCount })}
        </p>
      )}

      <div
        ref={chipsRef}
        onMouseDown={onMouseDown}
        className="flex gap-2 overflow-x-auto no-scrollbar"
      >
        {PLACE_FILTER_OPTIONS.map(({ value, labelKey }) => (
          <Filter
            key={value}
            ariaLabel={tFilter(labelKey)}
            onSelected={filter === value}
            onClick={() => setFilter(value)}
          >
            {tFilter(labelKey)}
          </Filter>
        ))}
      </div>

      {isLoading ? (
        <PlaceCardSkeleton />
      ) : places.length === 0 ? (
        <MypageEmptyUI pageType="favoritePlaces" />
      ) : (
        <>
          <ul className="divide-y divide-divider-default">
            {places.map((place) => (
              <PlaceCard key={place.placeId} place={place} />
            ))}
          </ul>
          <div ref={ref} className="h-10" />
        </>
      )}
    </section>
  );
};

export default MypageFavoritePlacesContent;
