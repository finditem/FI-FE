import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/utils/clearAuthCookies/clearAuthCookies";

// 만료된 토큰으로도 세션 쿠키를 정리할 수 있어야 한다.
export function DELETE(request: NextRequest) {
  return clearAuthCookies(
    new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } }),
    request.headers.get("host") ?? request.nextUrl.host
  );
}
