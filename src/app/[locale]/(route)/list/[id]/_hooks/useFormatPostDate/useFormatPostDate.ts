import { useTranslations } from "next-intl";
import { formatPostDate } from "../../_utils/formatPostDate/formatPostDate";

/**
 * 게시글 작성일시를 현재 로케일의 경과 시간 라벨로 만드는 훅입니다.
 *
 * @remarks
 * - 구간을 나누는 규칙은 `formatPostDate`에 있고 이 훅은 라벨만 갈아끼웁니다. 한국어 고정 문구가 필요하면 그 함수를 직접 쓰세요.
 * - 문구는 `PostDetailBody` 네임스페이스에 있습니다. 영어는 ICU plural을 써서 단수와 복수를 나눕니다.
 *
 * @returns 날짜 문자열을 받아 경과 시간 라벨을 돌려주는 함수
 *
 * @author jikwon
 */
/**
 * @example
 * ```tsx
 * const formatPostDate = useFormatPostDate();
 * formatPostDate(createdAt); // 결과: "3일 전" 또는 "3 days ago"
 * ```
 */
export const useFormatPostDate = () => {
  const t = useTranslations("PostDetailBody");

  return (date: string) =>
    formatPostDate(date, {
      minutesAgo: (minutes) => t("minutesAgo", { count: minutes }),
      hoursAgo: (hours) => t("hoursAgo", { count: hours }),
      daysAgo: (days) => t("daysAgo", { count: days }),
      weeksAgo: (weeks) => t("weeksAgo", { count: weeks }),
      monthsAgo: (months) => t("monthsAgo", { count: months }),
      yearsAgo: (years) => t("yearsAgo", { count: years }),
    });
};
