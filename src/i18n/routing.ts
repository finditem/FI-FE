import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  localePrefix: "as-needed",
  // 접두사 없는 주소는 항상 한국어로 처리한다. 켜두면 쿠키나 브라우저 언어로 /en에 강제 이동된다.
  localeDetection: false,
});
