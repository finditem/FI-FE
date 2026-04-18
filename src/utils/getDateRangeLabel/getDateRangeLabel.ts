/**
 * 시작일과 종료일을 받아 포맷팅된 기간 레이블을 반환하는 유틸 함수입니다.
 *
 * @remarks
 * - 날짜 형식이 유효하지 않거나 데이터가 없으면 "기간"을 반환합니다.
 * - 내부적으로 `parseYmd`와 `formatYmdLabel`을 사용하여 처리합니다.
 *
 * @param startDate - '2025-01-01' 형식의 시작일 (선택 사항)
 * @param endDate - '2025-01-31' 형식의 종료일 (선택 사항)
 *
 * @returns 포맷팅된 기간 (예: "2025.01.01 ~ 2026.01.01") 또는 "기간"
 *
 * @author suhyeon
 */

import { formatYmdLabel } from "../formatYmdLabel/formatYmdLabel";
import { parseYmd } from "../parseYmd/parseYmd";

export const getDateRangeLabel = (startDate?: string | null, endDate?: string | null): string => {
  const startDateObj = startDate ? parseYmd(startDate) : null;
  const endDateObj = endDate ? parseYmd(endDate) : null;

  const startLabel = startDateObj ? formatYmdLabel(startDateObj) : "";
  const endLabel = endDateObj ? formatYmdLabel(endDateObj) : "";

  if (!startLabel && !endLabel) return "기간";

  return `${startLabel} ~ ${endLabel}`;
};
