/**
 * Sentry 이슈의 발생 라우트별 GitHub 담당자 표입니다. 키는 `[locale]`과 route group을 뺀 첫 경로 조각입니다.
 *
 * @remarks
 * - 예: culprit이 `/:locale/write/post/:id`, `Page.generateMetadata (/(route)/list/[id])`이면 키는 각각
 *   `write`, `list`입니다. 홈(`/`)의 키는 `home`입니다. 변환 규칙은 `resolveSentryAssignee`에 있습니다.
 * - 값은 GitHub 로그인이고 저장소 협업자여야 합니다. 표에 없는 라우트는 담당자 없이 이슈를 만듭니다.
 * - 2026-11-08 기준 커밋 이력으로 정했습니다. 라우트 폴더의 전체 커밋 수(`[locale]` 이동 전 경로 포함)가 가장 많은
 *   사람을 담당자로 두되, 최근 90일 동안 커밋이 없는 사람은 건너뛰고 다음 순위를 썼습니다.
 *   wlrnjs가 맡을 라우트는 본인 요청으로 junye0l에게 넘겼습니다.
 *   담당이 바뀌면 이 표를 직접 고칩니다.
 *
 * @author jigwon
 */
export const SENTRY_ASSIGNEE_MAP: Record<string, string> = {
  home: "junye0l",
  admin: "junye0l",
  alert: "suhyeon0111",
  auth: "suhyeon0111",
  "change-password": "junye0l",
  chat: "suhyeon0111",
  "find-pw": "suhyeon0111",
  hello: "junye0l",
  "inquiry-write": "suhyeon0111",
  list: "junye0l",
  login: "suhyeon0111",
  manual: "junye0l",
  mypage: "suhyeon0111",
  notice: "junye0l",
  "public-data": "junye0l",
  "sign-up": "suhyeon0111",
  support: "suhyeon0111",
  terms: "suhyeon0111",
  user: "junye0l",
  write: "junye0l",
};
