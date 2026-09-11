import type { PlaceSummary } from "@/api/fetch/mapController";

/** 서버가 주는 `HH:mm:ss`에서 초를 떼어 `HH:mm`으로 만든다. */
const toHourMinute = (time: string) => time.slice(0, 5);

/** `YYYY-MM-DD`를 카드에 쓰는 `YY.MM.DD` 형태로 바꾼다. */
const toShortDate = (date: string) => date.slice(2).replaceAll("-", ".");

const pickRange = (hours: PlaceSummary["todayBusinessHours"], type: "BUSINESS" | "BREAK_TIME") => {
  const ranges = hours?.filter((range) => range.type === type) ?? [];
  if (ranges.length === 0) return "";

  return `${toHourMinute(ranges[0].startTime)}~${toHourMinute(ranges[ranges.length - 1].endTime)}`;
};

/**
 * 장소 카드에 표시할 운영 문구를 만듭니다.
 *
 * 팝업은 운영 기간(`26.07.11 ~ 07.13`)을 쓰고, 그 외는 운영 상태에 따라 보여줄 시간이 달라집니다.
 * - `BREAK_TIME`: 브레이크 시간(`15:00~17:00`)
 * - `UPCOMING`: 영업 시작 시각(`11:00`) — "오픈" 문구는 i18n이 필요해 호출부에서 붙입니다
 * - 그 외: 조회일 영업시간(`07:30~18:00`)
 *
 * 표시할 값이 없으면(정기 휴무일 등) 빈 문자열을 반환합니다.
 */
export const formatPlaceSchedule = ({
  type,
  operationStatus,
  operationPeriod,
  todayBusinessHours,
}: Pick<
  PlaceSummary,
  "type" | "operationStatus" | "operationPeriod" | "todayBusinessHours"
>): string => {
  if (type === "POPUP" && operationPeriod) {
    const { startDate, endDate } = operationPeriod;
    return `${toShortDate(startDate)} ~ ${toShortDate(endDate).slice(3)}`;
  }

  if (operationStatus === "BREAK_TIME") {
    return pickRange(todayBusinessHours, "BREAK_TIME");
  }

  if (operationStatus === "UPCOMING") {
    const business = todayBusinessHours?.filter((range) => range.type === "BUSINESS") ?? [];
    return business.length > 0 ? toHourMinute(business[0].startTime) : "";
  }

  return pickRange(todayBusinessHours, "BUSINESS");
};
