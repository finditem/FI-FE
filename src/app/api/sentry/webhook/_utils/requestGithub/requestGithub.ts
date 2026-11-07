const GITHUB_REPO = "finditem/FI-FE";

/**
 * FI-FE 저장소의 GitHub REST API를 호출하는 유틸 함수입니다.
 *
 * @remarks
 * - `path`는 `/repos/finditem/FI-FE` 뒤에 붙는 경로입니다. 예: `/issues`, `/issues/12/comments`.
 * - 응답이 실패해도 던지지 않고 `Response`를 그대로 돌려줍니다. 상태 코드에 따른 처리는 호출부가 정합니다.
 *
 * @param token - `getGithubAppToken`으로 받은 설치 토큰
 * @param path - 저장소 기준 API 경로
 * @param init - `fetch` 옵션. `body`에 객체를 주면 JSON으로 직렬화합니다.
 *
 * @returns `fetch` 응답
 *
 * @author jigwon
 */

/**
 * @example
 * const response = await requestGithub(token, "/issues/12", { method: "PATCH", body: { state: "closed" } });
 */
export const requestGithub = (
  token: string,
  path: string,
  init: { method?: string; body?: unknown } = {}
) =>
  fetch(`https://api.github.com/repos/${GITHUB_REPO}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
