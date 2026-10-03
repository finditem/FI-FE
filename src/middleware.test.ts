/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const createRequest = (
  path: string,
  { cookie, fetchDest = "document" }: { cookie?: string; fetchDest?: string } = {}
) => {
  const headers = new Headers({ "sec-fetch-dest": fetchDest });
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
};

const getLocation = (response: Response) => {
  const location = response.headers.get("location");
  return location ? new URL(location).pathname + new URL(location).search : null;
};

const hasSessionCookie = (response: Response) =>
  (response.headers.get("set-cookie") ?? "").includes("locale_session=1");

describe("middleware 세션 첫 접속 언어 복원", () => {
  it("세션 첫 요청이고 NEXT_LOCALE이 en이면 /en 주소로 이동하고 세션 쿠키를 저장한다", () => {
    const response = middleware(createRequest("/mypage?tab=1", { cookie: "NEXT_LOCALE=en" }));

    expect(getLocation(response)).toBe("/en/mypage?tab=1");
    expect(hasSessionCookie(response)).toBe(true);
  });

  it("세션 첫 요청의 루트 주소는 /en으로 이동한다", () => {
    const response = middleware(createRequest("/", { cookie: "NEXT_LOCALE=en" }));

    expect(getLocation(response)).toBe("/en");
  });

  it("세션 쿠키가 있으면 NEXT_LOCALE이 en이어도 이동하지 않는다", () => {
    const response = middleware(
      createRequest("/mypage", { cookie: "NEXT_LOCALE=en; locale_session=1" })
    );

    expect(getLocation(response)).toBeNull();
  });

  it("NEXT_LOCALE이 없으면 이동하지 않고 세션 쿠키만 저장한다", () => {
    const response = middleware(createRequest("/"));

    expect(getLocation(response)).toBeNull();
    expect(hasSessionCookie(response)).toBe(true);
  });

  it("접두사가 붙은 주소는 NEXT_LOCALE이 en이어도 /en으로 보내지 않는다", () => {
    const response = middleware(createRequest("/ko/mypage", { cookie: "NEXT_LOCALE=en" }));

    expect(getLocation(response)).toBe("/mypage");
  });

  it("페이지 요청이 아니면 이동하지 않고 세션 쿠키도 저장하지 않는다", () => {
    const response = middleware(
      createRequest("/mypage", { cookie: "NEXT_LOCALE=en", fetchDest: "empty" })
    );

    expect(getLocation(response)).toBeNull();
    expect(hasSessionCookie(response)).toBe(false);
  });
});

describe("middleware 세션 만료 시 토큰 쿠키 삭제", () => {
  const getTokenCookies = (host: string) => {
    const headers = new Headers({ host, cookie: "locale_session=1" });
    const request = new NextRequest(
      new URL("/login?reason=session-expired", "http://localhost:3000"),
      { headers }
    );
    return middleware(request)
      .headers.getSetCookie()
      .filter((cookie) => /^(access|refresh)_token=/.test(cookie));
  };

  it.each(["www.finditem.kr", "finditem.kr", "a.finditem.kr:443"])(
    "%s에서는 상위 도메인으로 발급된 쿠키를 지우도록 Domain=.finditem.kr을 붙인다",
    (host) => {
      const cookies = getTokenCookies(host);

      expect(cookies).toHaveLength(2);
      cookies.forEach((cookie) => expect(cookie).toContain("Domain=.finditem.kr"));
    }
  );

  it.each(["localhost:3000", "evilfinditem.kr"])("%s에서는 도메인을 붙이지 않는다", (host) => {
    const cookies = getTokenCookies(host);

    expect(cookies).toHaveLength(2);
    cookies.forEach((cookie) => expect(cookie).not.toContain("Domain="));
  });
});
