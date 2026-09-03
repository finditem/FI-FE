import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { NeighborhoodPlaceStatus } from "../../../../../../_types/NeighborhoodPlace";

interface PlaceStatusBadgeProps {
  status: NeighborhoodPlaceStatus;
}

const STATUS_STYLE: Record<NeighborhoodPlaceStatus, string> = {
  OPEN: "bg-[#d0ffee] text-brand-normal-default",
  UPCOMING: "bg-layout_2depth text-labelsVibrant-secondary",
};

/** 동네 구경 장소 카드의 운영 상태 뱃지 (운영중 / 오픈 예정) */
const PlaceStatusBadge = ({ status }: PlaceStatusBadgeProps) => {
  const t = useTranslations("NeighborhoodSection");

  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full px-[7.5px] text-caption2-semibold",
        STATUS_STYLE[status]
      )}
    >
      {t(status === "OPEN" ? "statusOpen" : "statusUpcoming")}
    </span>
  );
};

export default PlaceStatusBadge;
