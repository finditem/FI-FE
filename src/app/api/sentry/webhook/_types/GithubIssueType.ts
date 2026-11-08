/** GitHub `GET /repos/{repo}/issues` 응답 중 웹훅 동기화에 쓰는 필드 */
export type GithubIssueSummary = {
  number: number;
  state: "open" | "closed";
  html_url: string;
  body?: string | null;
  /** 이슈 목록 API는 PR도 함께 돌려주므로, 이 필드가 있으면 PR이다. */
  pull_request?: unknown;
};
