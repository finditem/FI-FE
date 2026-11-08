import { SENTRY_ASSIGNEE_MAP } from "../../_constants/SENTRY_ASSIGNEE_MAP";

const LOCALE_SEGMENTS = new Set([":locale", "[locale]", "ko", "en"]);

/**
 * culprit에서 경로 부분만 꺼낸다. 전체 URL이면 pathname을, 아니면 처음 나오는 `/...` 조각을 쓴다.
 * 경로 안에 `(route)` 같은 괄호가 있으므로 괄호에서 끊지 않고, 감싸는 괄호의 `)`는 조각 단위로 떼어낸다.
 */
const extractPath = (culprit: string) => {
  const url = culprit.match(/https?:\/\/\S+/)?.[0];
  if (url) {
    try {
      return new URL(url).pathname;
    } catch {
      return undefined;
    }
  }
  return culprit.match(/\/\S*/)?.[0];
};

/**
 * Sentry culprit에서 라우트를 뽑아 `SENTRY_ASSIGNEE_MAP`의 GitHub 담당자를 찾는 유틸 함수입니다.
 *
 * @remarks
 * - culprit 형식이 런타임마다 다릅니다. `/list`, `/:locale/write/post/:id`, `GET /[locale]`,
 *   `Page.generateMetadata (/(route)/list/[id])`, `https://release.finditem.kr/mypage`를 모두 처리합니다.
 * - 경로에서 locale 조각과 `(route)` 같은 route group을 빼고 남은 첫 조각을 키로 씁니다. 남는 조각이 없으면 `home`입니다.
 * - culprit에 경로가 없거나(함수 이름만 있는 서버 에러 등) 표에 없는 라우트면 `undefined`를 돌려줍니다.
 *
 * @param culprit - Sentry 이슈의 `culprit`
 *
 * @returns GitHub 로그인 또는 `undefined`
 *
 * @author jigwon
 */

/**
 * @example
 * // SENTRY_ASSIGNEE_MAP = { write: "octocat" }
 * resolveSentryAssignee("/:locale/write/post/:id"); // "octocat"
 * resolveSentryAssignee("/chat"); // undefined
 */
export const resolveSentryAssignee = (culprit?: string | null) => {
  if (!culprit) return undefined;

  const path = extractPath(culprit);
  if (!path) return undefined;

  const routeKey =
    path
      .split("/")
      .map((segment) => segment.replace(/\)+$/, ""))
      .find(
        (segment) => segment !== "" && !LOCALE_SEGMENTS.has(segment) && !segment.startsWith("(")
      ) ?? "home";

  return SENTRY_ASSIGNEE_MAP[routeKey];
};
