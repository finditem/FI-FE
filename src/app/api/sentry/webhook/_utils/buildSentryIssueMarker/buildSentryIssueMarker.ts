/**
 * GitHub 이슈 본문에 숨겨 넣는 Sentry 이슈 ID 표식을 만드는 유틸 함수입니다.
 *
 * @remarks
 * - 마크다운에서 보이지 않는 HTML 주석이라 본문 모양은 바뀌지 않습니다.
 * - 웹훅 라우트는 이 표식으로 기존 이슈를 찾아 중복 생성을 막고, `sentry-issue-sync.yml` 워크플로는
 *   같은 표식에서 ID를 읽어 Sentry 상태를 바꿉니다. 형식을 바꾸면 워크플로의 정규식도 함께 고칩니다.
 *
 * @param sentryIssueId - Sentry 이슈의 숫자 ID
 *
 * @returns `<!-- sentry-issue-id: 123 -->` 형태의 문자열
 *
 * @author jigwon
 */

/**
 * @example
 * buildSentryIssueMarker("7822947679"); // "<!-- sentry-issue-id: 7822947679 -->"
 */
export const buildSentryIssueMarker = (sentryIssueId: string) =>
  `<!-- sentry-issue-id: ${sentryIssueId} -->`;
