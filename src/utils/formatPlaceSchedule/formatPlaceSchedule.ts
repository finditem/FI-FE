import type { PlaceSummary } from "@/api/fetch/mapController";

/** 서버가 주는 `HH:mm:ss`에서 초를 떼어 `HH:mm`으로 만든다. */
const toHourMinute = (time: string) => time.slice(0, 5);

/** `YYYY-MM-DD`를 카드에 쓰는 `YY.MM.DD` 형태로 바꾼다. */
const toShortDate = (date: string) => date.slice(2).replaceAll("-", ".");

/**
 * 장소 카드에 표시할 운영 문구를 만듭니다.
 *
 * 팝업은 운영 기간을(`26.07.11 ~ 07.13`), 그 외는 조회일의 영업시간을(`07:30~18:00`) 씁니다.
 * 영업시간이 여러 구간이면 첫 구간의 시작과 마지막 구간의 종료로 묶고, 정기 휴무일처럼
 * 표시할 값이 없으면 빈 문자열을 반환합니다.
 */
export const formatPlaceSchedule = ({
  type,
  operationPeriod,
  todayBusinessHours,
}: Pick<PlaceSummary, "type" | "operationPeriod" | "todayBusinessHours">): string => {
  if (type === "POPUP" && operationPeriod) {
    const { startDate, endDate } = operationPeriod;
    return `${toShortDate(startDate)} ~ ${toShortDate(endDate).slice(3)}`;
  }

  const business = todayBusinessHours?.filter((range) => range.type === "BUSINESS") ?? [];
  if (business.length === 0) return "";

  return `${toHourMinute(business[0].startTime)}~${toHourMinute(business[business.length - 1].endTime)}`;
};
