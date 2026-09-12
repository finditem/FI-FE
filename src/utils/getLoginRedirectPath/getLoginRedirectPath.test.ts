import { getLoginRedirectPath } from "./getLoginRedirectPath";

describe("getLoginRedirectPath", () => {
  it("현재 경로를 callbackUrl로 붙인다", () => {
    expect(getLoginRedirectPath("/?place=cafe&place-id=1")).toBe(
      "/login?callbackUrl=%2F%3Fplace%3Dcafe%26place-id%3D1"
    );
  });

  it("로그인 페이지에서 호출하면 순환을 막기 위해 callbackUrl을 붙이지 않는다", () => {
    expect(getLoginRedirectPath("/login")).toBe("/login");
  });

  it("외부 URL은 붙이지 않는다", () => {
    expect(getLoginRedirectPath("https://evil.example.com")).toBe("/login");
    expect(getLoginRedirectPath("//evil.example.com")).toBe("/login");
  });
});
