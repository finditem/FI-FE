"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { usePlaceFavorite } from "@/api/fetch/mapController";
import { formatPlaceSchedule } from "@/utils";
import { NeighborhoodPlace } from "../../_types/NeighborhoodPlace";
import PlaceStatusBadge from "./_internal/PlaceStatusBadge/PlaceStatusBadge";

interface NeighborhoodPlaceCardProps {
  place: NeighborhoodPlace;
}

const NeighborhoodPlaceCard = ({ place }: NeighborhoodPlaceCardProps) => {
  const t = useTranslations("NeighborhoodSection");
  const {
    placeId,
    name,
    thumbnailUrl,
    address,
    station,
    stationDistanceMeters,
    type,
    operationStatus,
    isFavorite,
  } = place;
  const { toggleFavorite, isPending } = usePlaceFavorite(placeId);

  const schedule = formatPlaceSchedule(place);
  const scheduleIcon = type === "POPUP" ? "PlaceCalendar" : "PlaceClock";

  return (
    <li aria-label={name} className="flex items-center gap-3 py-4">
      <Image
        src={thumbnailUrl}
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
              {station} · {stationDistanceMeters}m
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <PlaceStatusBadge status={operationStatus} />
          {schedule && (
            <div className="flex items-center gap-1">
              <Icon name={scheduleIcon} size={16} className="shrink-0" />
              <p className="whitespace-nowrap text-caption1-medium text-labelsVibrant-primary">
                {schedule}
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={t("favoriteAriaLabel", { name })}
        disabled={isPending}
        onClick={() => toggleFavorite(isFavorite)}
        className="flex size-9 shrink-0 items-center justify-center disabled:opacity-50"
      >
        <Icon name={isFavorite ? "PlaceHeartActive" : "PlaceHeart"} size={24} />
      </button>
    </li>
  );
};

export default NeighborhoodPlaceCard;
