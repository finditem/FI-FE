import { getAdminUrl } from "./getAdminUrl";

describe("getAdminUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ADMIN_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_ADMIN_URL = originalEnv;
  });

  it("환경변수가 없으면 기본 관리자 도메인을 사용한다", () => {
    delete process.env.NEXT_PUBLIC_ADMIN_URL;
    expect(getAdminUrl("/admin/notice/write")).toBe("https://admin.finditem.kr/admin/notice/write");
  });

  it("환경변수 끝의 슬래시를 제거하고 경로를 붙인다", () => {
    process.env.NEXT_PUBLIC_ADMIN_URL = "http://localhost:3001/";
    expect(getAdminUrl("/admin")).toBe("http://localhost:3001/admin");
  });
});
