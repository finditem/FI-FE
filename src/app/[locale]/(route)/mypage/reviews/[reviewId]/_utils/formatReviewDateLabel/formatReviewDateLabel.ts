import { formatYmdLabel } from "@/utils";

/**
 * 후기 상세의 ISO 날짜 문자열을 화면 표기용 `YYYY.MM.DD` 라벨로 바꿉니다.
 *
 * @remarks
 * - 발신 날짜·분실 일시처럼 상대 시간("30분 전")이 아니라 항상 절대 날짜로 보여야 하는 자리에 씁니다
 *   (상대 시간이 필요한 리스트 카드 등은 `useFormatDate`를 쓰세요).
 * - 서버가 `Z` 없이 보내는 로컬 시각(예: `2026-10-12T14:00:00`)을 그대로 로컬 날짜로 해석합니다.
 * - 값이 없거나 파싱에 실패하면 빈 문자열을 반환하므로, 호출부에서 표기 여부를 판단할 수 있습니다.
 *
 * @example
 * ```ts
 * formatReviewDateLabel("2026-10-12T14:00:00"); // "2026.10.12"
 * formatReviewDateLabel(null); // ""
 * ```
 */
export const formatReviewDateLabel = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return formatYmdLabel({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
};
