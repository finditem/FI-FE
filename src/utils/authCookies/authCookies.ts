import type { NextResponse } from "next/server";

export const clearAuthCookies = (response: NextResponse, host: string | null) => {
  const hostname = host?.split(":")[0] ?? "";
  const domains: (string | undefined)[] = [undefined];
  if (hostname === "finditem.kr" || hostname.endsWith(".finditem.kr")) {
    domains.push(".finditem.kr");
  }
  for (const name of ["access_token", "refresh_token"]) {
    // ResponseCookies는 같은 이름을 덮어쓰므로 서로 다른 범위는 헤더로 추가한다.
    for (const domain of domains) {
      response.headers.append(
        "Set-Cookie",
        `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`
      );
    }
  }
  return response;
};
