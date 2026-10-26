/** @jest-environment node */
import { NextRequest } from "next/server";
import { DELETE } from "./route";
import { MOCK_AUTH_STALE_COOKIES } from "@/mock/data/auth.data";

it.each(["www.finditem.kr", "finditem.kr", "a.finditem.kr:443", "localhost:3000"])(
  "%s의 만료 토큰을 인증 요청 없이 정리한다",
  (host) => {
    const response = DELETE(
      new NextRequest(`https://${host}/api/auth/session`, {
        method: "DELETE",
        headers: { host, cookie: MOCK_AUTH_STALE_COOKIES },
      })
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const cookies = response.headers.getSetCookie();
    expect(cookies).toHaveLength(host.startsWith("localhost") ? 2 : 4);
    expect(cookies.every((c) => c.includes("Max-Age=0") && c.includes("Path=/"))).toBe(true);
  }
);
