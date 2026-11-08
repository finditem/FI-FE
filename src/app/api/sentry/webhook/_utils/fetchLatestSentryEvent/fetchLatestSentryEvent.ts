import { SENTRY_ORG_SLUG } from "../../_constants/SENTRY_ORG_SLUG";
import { SentryApiEvent } from "../../_types/SentryWebhookType";

/**
 * Sentry API에서 이슈의 최신 이벤트를 받아오는 유틸 함수입니다.
 *
 * @remarks
 * - 이슈 생성 웹훅(`issue.created`)에는 스택 트레이스, 요청 URL, 브라우저 정보가 들어 있지 않아서 본문을 채우려고 따로 조회합니다.
 * - `SENTRY_API_TOKEN`(`event:read` 권한)이 없거나 요청이 실패하면 `null`을 돌려줍니다.
 *   이슈 생성 자체를 막지 않도록 에러를 던지지 않습니다.
 * - 빌드용 `SENTRY_AUTH_TOKEN`은 소스맵 업로드 권한만 있을 수 있어 재사용하지 않습니다.
 *
 * @param issueId - Sentry 이슈의 숫자 ID (`data.issue.id`)
 *
 * @returns 최신 이벤트 또는 `null`
 *
 * @author jigwon
 */

/**
 * @example
 * const latestEvent = await fetchLatestSentryEvent(payload.data?.issue?.id);
 * // 토큰이 없으면 null
 */
export const fetchLatestSentryEvent = async (issueId?: string): Promise<SentryApiEvent | null> => {
  const token = process.env.SENTRY_API_TOKEN;
  if (!token || !issueId) return null;

  try {
    const response = await fetch(
      `https://sentry.io/api/0/organizations/${SENTRY_ORG_SLUG}/issues/${issueId}/events/latest/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) return null;

    return (await response.json()) as SentryApiEvent;
  } catch {
    return null;
  }
};
