import { isValidCallbackUrl } from "./isValidCallbackUrl";
import {
  MOCK_AUTH_CALLBACK_VALID_URLS,
  MOCK_AUTH_CALLBACK_NON_STRING_VALUES,
  MOCK_AUTH_CALLBACK_NON_SLASH_URLS,
  MOCK_AUTH_CALLBACK_PROTOCOL_RELATIVE_URLS,
  MOCK_AUTH_CALLBACK_CONTROL_CHAR_URLS,
  MOCK_AUTH_CALLBACK_CIRCULAR_URLS,
} from "@/mock/data";

describe("isValidCallbackUrl", () => {
  describe("안전한 내부 경로는 통과시킨다", () => {
    it.each(MOCK_AUTH_CALLBACK_VALID_URLS)("%s 는 true", (url) => {
      expect(isValidCallbackUrl(url)).toBe(true);
    });
  });

  describe("문자열이 아니면 거부한다", () => {
    it.each(MOCK_AUTH_CALLBACK_NON_STRING_VALUES)("%p 는 false", (value) => {
      expect(isValidCallbackUrl(value)).toBe(false);
    });
  });

  describe("슬래시로 시작하지 않는 값은 거부한다", () => {
    it.each(MOCK_AUTH_CALLBACK_NON_SLASH_URLS)("%s 는 false", (url) => {
      expect(isValidCallbackUrl(url)).toBe(false);
    });
  });

  describe("프로토콜 상대 URL 접두어는 거부한다", () => {
    // host가 더미 오리진(x)과 우연히 같아 오리진 비교만으로는 통과하는 //x/path, /\x/path 까지 막는다.
    it.each(MOCK_AUTH_CALLBACK_PROTOCOL_RELATIVE_URLS)("%s 는 false", (url) => {
      expect(isValidCallbackUrl(url)).toBe(false);
    });
  });

  describe("URL 파서가 지워 우회에 악용되는 제어 문자는 거부한다", () => {
    it.each(MOCK_AUTH_CALLBACK_CONTROL_CHAR_URLS)("%s 가 끼어 있으면 false", (_label, url) => {
      expect(isValidCallbackUrl(url)).toBe(false);
    });
  });

  describe("순환 리다이렉트를 유발하는 경로는 거부한다", () => {
    it.each(MOCK_AUTH_CALLBACK_CIRCULAR_URLS)("%s 는 false", (url) => {
      expect(isValidCallbackUrl(url)).toBe(false);
    });
  });
});
