import "@testing-library/jest-dom";
import React from "react";
import koMessages from "./src/messages/ko.json";

// 테스트는 기본 로케일(ko) 메시지를 그대로 사용해, 컴포넌트가 useTranslations를 쓰더라도
// 기존 하드코딩 문자열을 검증하던 테스트를 그대로 통과시킨다.
const getNestedMessage = (namespace: string | undefined, key: string) => {
  const scope = namespace
    ? namespace.split(".").reduce<any>((acc, part) => acc?.[part], koMessages)
    : koMessages;
  return key.split(".").reduce<any>((acc, part) => acc?.[part], scope);
};

jest.mock("next-intl", () => {
  const actual = jest.requireActual("next-intl");

  const translate =
    (namespace?: string) => (key: string, values?: Record<string, string | number>) => {
      const message = getNestedMessage(namespace, key);
      if (typeof message !== "string") return key;
      if (!values) return message;

      return Object.entries(values).reduce(
        (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
        message
      );
    };

  return {
    ...actual,
    useTranslations: (namespace?: string) => translate(namespace),
    useLocale: () => "ko",
  };
});

// IntersectionObserver 모킹
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => React.createElement("div", { "data-testid": "swiper" }, children),

  SwiperSlide: ({ children }: any) =>
    React.createElement("div", { "data-testid": "swiper-slide" }, children),
}));

jest.mock("swiper/modules", () => ({
  Pagination: {},
}));

jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
