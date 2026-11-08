import { reloadWithLocale } from "./navigation";

describe("reloadWithLocale", () => {
  beforeEach(() => {
    document.cookie = "NEXT_LOCALE=en; path=/";
    // jsdom은 페이지 이동을 구현하지 않아 콘솔 오류만 남긴다.
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.mocked(console.error).mockRestore();
  });

  it("이동하기 전에 언어 쿠키를 새 언어로 바꾼다", () => {
    reloadWithLocale("/mypage", "ko");

    expect(document.cookie).toContain("NEXT_LOCALE=ko");
    expect(document.cookie).not.toContain("NEXT_LOCALE=en");
  });
});
