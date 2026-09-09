// TODO(준열): 백엔드 즐겨찾기 API 연동 시 useState 토글을 useMutation + onMutate 낙관적 업데이트로 교체.
//             NeighborhoodPlace에 isFavorite 필드 추가하고 ["neighborhood-places", filter] 캐시를 패치.

"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { NeighborhoodPlace } from "../../_types/NeighborhoodPlace";
import PlaceStatusBadge from "./_internal/PlaceStatusBadge/PlaceStatusBadge";

interface NeighborhoodPlaceCardProps {
  place: NeighborhoodPlace;
}

const NeighborhoodPlaceCard = ({ place }: NeighborhoodPlaceCardProps) => {
  const t = useTranslations("NeighborhoodSection");
  const { name, imageUrl, address, stationName, distanceM, category, status, schedule } = place;
  const [isFavorite, setIsFavorite] = useState(false);

  const scheduleIcon = category === "POPUP" ? "PlaceCalendar" : "PlaceClock";

  return (
    <article className="flex items-center gap-3 py-4">
      <Image
        src={imageUrl}
        alt=""
        width={100}
        height={100}
        className="size-[100px] shrink-0 rounded-2xl object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-body1-semibold text-black">{name}</p>
          <p className="truncate text-caption1-regular text-labelsVibrant-secondary">{address}</p>
          <div className="flex min-w-0 items-center gap-1">
            <Icon name="PlaceMarker" size={16} className="shrink-0" />
            <p className="truncate text-caption1-regular text-layout-header-default">
              {stationName} · {distanceM}m
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <PlaceStatusBadge status={status} />
          <div className="flex items-center gap-1">
            <Icon name={scheduleIcon} size={16} className="shrink-0" />
            <p className="whitespace-nowrap text-caption1-medium text-labelsVibrant-primary">
              {schedule}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={t("favoriteAriaLabel", { name })}
        onClick={() => setIsFavorite((prev) => !prev)}
        className="flex size-9 shrink-0 items-center justify-center"
      >
        <Icon name={isFavorite ? "PlaceHeartActive" : "PlaceHeart"} size={24} />
      </button>
    </article>
  );
};

export default NeighborhoodPlaceCard;
