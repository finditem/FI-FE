import { getAuthRoute } from "../getAuthRoute/getAuthRoute";

/**
 * 로그인·회원가입·인증 콜백 경로인지 로케일과 경로 구간을 기준으로 판별합니다.
 * @param pathname - 로케일 접두사를 포함할 수 있는 현재 경로입니다.
 *
 * @author suhyeon
 *
 * @example
 * isAuthRoute("/en/login/email"); // true
 */
export const isAuthRoute = (pathname: string): boolean => {
  const { pathname: routePathname } = getAuthRoute(pathname);
  return ["/login", "/sign-up", "/auth"].some(
    (basePathname) => routePathname === basePathname || routePathname.startsWith(`${basePathname}/`)
  );
};
