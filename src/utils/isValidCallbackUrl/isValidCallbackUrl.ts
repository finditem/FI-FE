/**
 * 주어진 값이 안전한 내부 콜백 URL인지 검사합니다.
 *
 * - `/`로 시작해야 합니다.
 * - `//` 또는 `/\`로 시작하는 경우 Open Redirect 공격 방지를 위해 거부합니다.
 * - `/login`, `/sign-up` 경로는 순환 리다이렉트 방지를 위해 거부합니다.
 *
 * @param url - 검사할 값
 * @returns 안전한 내부 경로이면 `true`, 아니면 `false`
 * @author suhyeon
 */
export const isValidCallbackUrl = (url: unknown): url is string =>
  typeof url === "string" &&
  /^\/(?!\/|\\)/.test(url) &&
  !url.startsWith("/login") &&
  !url.startsWith("/sign-up");
