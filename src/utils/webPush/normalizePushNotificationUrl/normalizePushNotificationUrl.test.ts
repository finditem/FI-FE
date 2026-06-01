import {
  buildRoutePathFromReference,
  normalizePushNotificationPath,
  resolvePushNotificationOpenUrl,
  resolvePushNotificationPathFromPayload,
} from "./normalizePushNotificationUrl";

describe("normalizePushNotificationPath", () => {
  it("localhost 절대 URL을 pathname만 추출해 /list로 매핑한다", () => {
    expect(normalizePushNotificationPath("http://localhost:3000/posts/3")).toBe("/list/3");
    expect(normalizePushNotificationPath("https://release.example.com/posts/3")).toBe("/list/3");
  });

  it("상대 경로 /posts를 /list로 매핑한다", () => {
    expect(normalizePushNotificationPath("/posts/3")).toBe("/list/3");
  });

  it("채팅 API 경로를 /chat으로 매핑한다", () => {
    expect(normalizePushNotificationPath("/posts/5/chats")).toBe("/chat/5");
    expect(normalizePushNotificationPath("/posts/5/chats?roomId=9")).toBe("/chat/5?roomId=9");
  });

  it("이미 앱 라우트인 경로는 유지한다", () => {
    expect(normalizePushNotificationPath("/list/3")).toBe("/list/3");
    expect(normalizePushNotificationPath("/chat/1?roomId=2")).toBe("/chat/1?roomId=2");
    expect(normalizePushNotificationPath("/mypage/inquiries/4")).toBe("/mypage/inquiries/4");
    expect(normalizePushNotificationPath("/notice/5")).toBe("/notice/5");
    expect(normalizePushNotificationPath("/mypage/reports/6")).toBe("/mypage/reports/6");
  });
});

describe("buildRoutePathFromReference", () => {
  it("referenceType 기준으로 alertRouteUrl과 동일한 경로를 만든다", () => {
    expect(buildRoutePathFromReference("POST", 3)).toBe("/list/3");
    expect(buildRoutePathFromReference("COMMENT", 3)).toBe("/list/3");
    expect(buildRoutePathFromReference("CHAT", 1, 2)).toBe("/chat/1?roomId=2");
    expect(buildRoutePathFromReference("INQUIRY", 4)).toBe("/mypage/inquiries/4");
    expect(buildRoutePathFromReference("NOTICE", 5)).toBe("/notice/5");
    expect(buildRoutePathFromReference("REPORT", 6)).toBe("/mypage/reports/6");
  });
});

describe("resolvePushNotificationPathFromPayload", () => {
  it("referenceType이 있으면 잘못된 url보다 reference를 우선한다", () => {
    expect(
      resolvePushNotificationPathFromPayload({
        url: "http://localhost/posts/99",
        referenceType: "POST",
        referenceId: 3,
      })
    ).toBe("/list/3");
  });

  it("payload.data에 reference가 있어도 경로를 만든다", () => {
    expect(
      resolvePushNotificationPathFromPayload({
        data: { referenceType: "CHAT", referenceId: 10, roomId: 20 },
      })
    ).toBe("/chat/10?roomId=20");
  });
});

describe("resolvePushNotificationOpenUrl", () => {
  it("현재 origin과 정규화된 path를 합친다", () => {
    expect(
      resolvePushNotificationOpenUrl("http://localhost/posts/3", "https://release.example.com")
    ).toBe("https://release.example.com/list/3");
  });
});
