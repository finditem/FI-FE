import "@testing-library/jest-dom";
import React from "react";
import koMessages from "./src/messages/ko.json";

// 테스트는 기본 로케일(ko) 메시지를 그대로 사용해, 컴포넌트가 useTranslations를 쓰더라도
// 기존 하드코딩 문자열을 검증하던 테스트를 그대로 통과시킨다. next-intl의 실제 createTranslator를
// 사용해 ICU MessageFormat(plural 등)도 실제 라이브러리 동작과 동일하게 평가한다.
jest.mock("next-intl", () => {
  const actual = jest.requireActual("next-intl");

  return {
    ...actual,
    useTranslations: (namespace?: string) =>
      actual.createTranslator({ locale: "ko", messages: koMessages, namespace }),
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
