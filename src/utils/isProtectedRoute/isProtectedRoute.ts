import { getAuthRoute } from "../getAuthRoute/getAuthRoute";

/**
 * 인증이 필요한 화면인지 로케일과 경로 구간을 기준으로 판별합니다.
 * @remarks 게스트 안내를 제공하는 /mypage 루트와 /chatbot 같은 유사 접두사는 제외합니다.
 * @param pathname - 로케일 접두사를 포함할 수 있는 현재 경로입니다.
 *
 * @author suhyeon
 *
 * @example
 * isProtectedRoute("/en/chat"); // true
 * isProtectedRoute("/mypage"); // false
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const { pathname: routePathname } = getAuthRoute(pathname);
  if (routePathname.startsWith("/mypage/")) return true;

  return ["/write", "/chat", "/alert", "/change-password"].some(
    (basePathname) => routePathname === basePathname || routePathname.startsWith(`${basePathname}/`)
  );
};
