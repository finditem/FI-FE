import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import type { PlaceOperationStatus } from "@/api/fetch/mapController";

interface PlaceStatusBadgeProps {
  status: PlaceOperationStatus;
}

const STATUS_STYLE: Record<PlaceOperationStatus, string> = {
  OPEN: "bg-[#d0ffee] text-brand-normal-default",
  BREAK_TIME: "bg-fill-accent-lostItem text-accent-lostItem",
  UPCOMING: "bg-layout_2depth text-labelsVibrant-secondary",
  CLOSED: "bg-layout_2depth text-labelsVibrant-secondary",
};

const STATUS_LABEL_KEY: Record<PlaceOperationStatus, string> = {
  OPEN: "statusOpen",
  BREAK_TIME: "statusBreakTime",
  UPCOMING: "statusUpcoming",
  CLOSED: "statusClosed",
};

/** 장소 카드의 운영 상태 뱃지 (운영중 / 브레이크타임 / 오픈 예정 / 영업 종료) */
const PlaceStatusBadge = ({ status }: PlaceStatusBadgeProps) => {
  const t = useTranslations("NeighborhoodSection");

  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full px-[7.5px] text-caption2-semibold",
        STATUS_STYLE[status]
      )}
    >
      {t(STATUS_LABEL_KEY[status])}
    </span>
  );
};

export default PlaceStatusBadge;
