import { buildSentryIssueMarker } from "../buildSentryIssueMarker/buildSentryIssueMarker";
import { GithubIssueSummary } from "../../_types/GithubIssueType";
import { requestGithub } from "../requestGithub/requestGithub";

const PER_PAGE = 100;
const MAX_PAGES = 10;

/**
 * Sentry 이슈 ID로 이미 만들어 둔 GitHub 이슈를 찾는 유틸 함수입니다.
 *
 * @remarks
 * - 검색 API는 색인이 늦어 방금 만든 이슈를 못 찾을 수 있습니다. 그래서 `sentry` 라벨 이슈 목록을 최신순으로 받아
 *   본문을 직접 대조합니다. 닫힌 이슈도 대상입니다.
 * - 본문의 숨김 표식(`buildSentryIssueMarker`)을 먼저 보고, 표식이 없던 예전 이슈는 Sentry 링크의
 *   `/issues/{id}/` 경로로 찾습니다. 예전 API 주소와 지금의 웹 주소 모두 이 경로를 포함합니다.
 * - 최대 1,000개까지만 훑습니다. 그보다 오래된 이슈는 없다고 봅니다.
 *
 * @param token - `getGithubAppToken`으로 받은 설치 토큰
 * @param sentryIssueId - Sentry 이슈의 숫자 ID
 *
 * @returns 찾은 이슈 또는 `null`. 목록 조회가 실패하면 에러를 던집니다.
 *
 * @author jigwon
 */

/**
 * @example
 * const existing = await findGithubIssueBySentryId(token, "7822947679");
 * if (existing?.state === "closed") {
 *   // 다시 연다
 * }
 */
export const findGithubIssueBySentryId = async (
  token: string,
  sentryIssueId: string
): Promise<GithubIssueSummary | null> => {
  const marker = buildSentryIssueMarker(sentryIssueId);
  const legacyLink = `/issues/${sentryIssueId}/`;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await requestGithub(
      token,
      `/issues?labels=sentry&state=all&sort=created&direction=desc&per_page=${PER_PAGE}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`GitHub 이슈 목록 조회 실패: ${await response.text()}`);
    }

    const issues = (await response.json()) as GithubIssueSummary[];
    const found = issues.find(
      (issue) =>
        !issue.pull_request && (issue.body?.includes(marker) || issue.body?.includes(legacyLink))
    );

    if (found) return found;
    if (issues.length < PER_PAGE) return null;
  }

  return null;
};
