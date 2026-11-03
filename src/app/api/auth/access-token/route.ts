import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * 액세스 토큰을 클라이언트에 노출하지 않으면서 토큰의 존재 여부와 변경 여부만 알려줍니다.
 *
 * 토큰 원문을 돌려주면 XSS가 하나라도 생겼을 때 HttpOnly 쿠키가 있어도 토큰을 꺼내갈 수 있으므로,
 * 알림 SSE 클라이언트가 실제로 필요로 하는 값(토큰이 있는지, 바뀌었는지)만 해시로 내보냅니다.
 * SSE 연결 자체는 쿠키(`withCredentials`)로 인증하므로 토큰 원문은 필요하지 않습니다.
 */
async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value ?? null;
  const tokenHash = accessToken ? await hashToken(accessToken) : null;

  return NextResponse.json(
    { hasToken: accessToken !== null, tokenHash },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
