import { isValidCallbackUrl } from "./isValidCallbackUrl";

// URL 파서가 조용히 지워 Open Redirect 우회에 악용되는 제어 문자들입니다.
// 소스에서 눈에 보이지 않아 혼동되지 않도록 코드 포인트로 생성합니다.
const TAB = String.fromCharCode(9);
const LINE_FEED = String.fromCharCode(10);
const CARRIAGE_RETURN = String.fromCharCode(13);
const NUL = String.fromCharCode(0);

describe("isValidCallbackUrl", () => {
  describe("안전한 내부 경로는 통과시킨다", () => {
    it.each([
      "/",
      "/mypage",
      "/write/post",
      "/write/post?type=lost&category=wallet",
      "/search?q=%EC%A7%80%EA%B0%91",
      "/post/123#comment",
    ])("%s 는 true", (url) => {
      expect(isValidCallbackUrl(url)).toBe(true);
    });
  });

  describe("문자열이 아니면 거부한다", () => {
    it.each([undefined, null, 123, {}, [], true])("%p 는 false", (value) => {
      expect(isValidCallbackUrl(value)).toBe(false);
    });
  });

  describe("슬래시로 시작하지 않는 값은 거부한다", () => {
    it.each(["", "evil.com", "https://evil.com", "http:/evil.com", "../secret"])(
      "%s 는 false",
      (url) => {
        expect(isValidCallbackUrl(url)).toBe(false);
      }
    );
  });

  describe("프로토콜 상대 URL 접두어는 거부한다", () => {
    // host가 더미 오리진(x)과 우연히 같아 오리진 비교만으로는 통과하는 //x/path, /\x/path 까지 막는다.
    it.each(["//evil.com", "//evil.com/path", "/\\evil.com", "//x/path", "/\\x/path"])(
      "%s 는 false",
      (url) => {
        expect(isValidCallbackUrl(url)).toBe(false);
      }
    );
  });

  describe("URL 파서가 지워 우회에 악용되는 제어 문자는 거부한다", () => {
    it.each([
      ["탭", `/${TAB}/evil.com`],
      ["줄바꿈", `/${LINE_FEED}https://evil.com`],
      ["캐리지 리턴", `/path${CARRIAGE_RETURN}/evil.com`],
      ["널 문자", `/path${NUL}/evil.com`],
    ])("%s 가 끼어 있으면 false", (_label, url) => {
      expect(isValidCallbackUrl(url)).toBe(false);
    });
  });

  describe("순환 리다이렉트를 유발하는 경로는 거부한다", () => {
    it.each(["/login", "/login/email", "/sign-up", "/sign-up/terms"])("%s 는 false", (url) => {
      expect(isValidCallbackUrl(url)).toBe(false);
    });
  });
});
