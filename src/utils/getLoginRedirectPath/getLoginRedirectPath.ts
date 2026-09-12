import { isValidCallbackUrl } from "../isValidCallbackUrl/isValidCallbackUrl";

/**
 * 로그인이 필요한 동작에서 이동할 로그인 경로를 만듭니다.
 *
 * 돌아올 경로는 `callbackUrl`로 넘기며, 미들웨어가 보호 경로에서 쓰는 형식과 같습니다.
 * 외부 URL이나 `/login` 같은 순환 경로는 {@link isValidCallbackUrl}에서 걸러 붙이지 않습니다.
 *
 * @param currentPath - 쿼리스트링까지 포함한 현재 경로
 */
export const getLoginRedirectPath = (currentPath: string): string =>
  isValidCallbackUrl(currentPath)
    ? `/login?callbackUrl=${encodeURIComponent(currentPath)}`
    : "/login";
