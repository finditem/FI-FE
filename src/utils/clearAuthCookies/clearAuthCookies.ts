import type { NextResponse } from "next/server";

function appendExpiredTokenCookies(response: NextResponse, domain?: string): void {
  const domainAttribute = domain ? `; Domain=${domain}` : "";
  for (const cookieName of ["access_token", "refresh_token"]) {
    response.headers.append(
      "Set-Cookie",
      `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${domainAttribute}`
    );
  }
}

/**
 * 호스트 전용 토큰과 서비스 공통 도메인의 토큰을 모두 만료시킵니다.
 * @remarks
 * Path는 /를 전제로 합니다. 같은 이름의 Domain별 쿠키를 보존하도록 헤더를 추가하므로,
 * 이후 ResponseCookies.set으로 토큰 삭제 헤더를 덮어쓰지 않아야 합니다.
 * @param response - 쿠키 삭제 헤더를 추가할 응답입니다.
 * @param host - 요청의 Host 헤더이며 로컬 포트를 포함할 수 있습니다.
 *
 * @author suhyeon
 *
 * @example
 * clearAuthCookies(response, request.headers.get("host"));
 */
export const clearAuthCookies = (response: NextResponse, host: string | null): NextResponse => {
  const hostname = host?.split(":")[0] ?? "";
  appendExpiredTokenCookies(response);

  if (hostname === "finditem.kr" || hostname.endsWith(".finditem.kr")) {
    appendExpiredTokenCookies(response, ".finditem.kr");
  }
  return response;
};
