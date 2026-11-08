import crypto from "crypto";

const toBase64Url = (value: string | Buffer) => Buffer.from(value).toString("base64url");

/**
 * GitHub App(`finditem-bot`) 설치 토큰을 발급하는 유틸 함수입니다.
 *
 * @remarks
 * - 이 토큰으로 이슈를 만들면 작성자가 개인 계정이 아니라 `finditem-bot[bot]`으로 표시됩니다.
 * - `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_INSTALLATION_ID` 환경변수가 필요합니다.
 *   Vercel에 private key를 한 줄로 넣으면 줄바꿈이 `\n` 문자열로 저장되므로 실제 줄바꿈으로 되돌려 씁니다.
 * - 앱 JWT는 서버 시계 오차를 감안해 발급 시각을 60초 앞당기고, 최대치인 10분보다 짧은 9분으로 만료를 둡니다.
 * - 설치 토큰은 1시간짜리라 요청마다 새로 발급해도 되며, 웹훅 빈도가 낮아 캐시하지 않습니다.
 *
 * @returns 설치 토큰. 발급에 실패하면 응답 본문을 담은 에러를 던집니다.
 *
 * @author jigwon
 */

/**
 * @example
 * const token = await getGithubAppToken();
 * await fetch("https://api.github.com/repos/finditem/FI-FE/issues", {
 *   headers: { Authorization: `Bearer ${token}` },
 * });
 */
export const getGithubAppToken = async () => {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;

  if (!appId || !privateKey || !installationId) {
    throw new Error("GitHub App 환경변수가 설정되지 않았습니다.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = toBase64Url(JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: appId }));
  const signature = crypto.sign("RSA-SHA256", Buffer.from(`${header}.${payload}`), privateKey);
  const jwt = `${header}.${payload}.${toBase64Url(signature)}`;

  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub App 토큰 발급 실패: ${await response.text()}`);
  }

  const { token } = (await response.json()) as { token: string };
  return token;
};
