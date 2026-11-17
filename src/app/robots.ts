import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { PRODUCTION_HOST } from "@/constants/PRODUCTION_HOST";
import { SITE_URL } from "@/constants/SITE_URL";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");

  // release, Vercel 미리보기 등 운영이 아닌 호스트는 전체 크롤링을 막고 사이트맵도 알리지 않는다.
  // 이미 링크가 퍼진 주소는 next.config.ts의 X-Robots-Tag 헤더로 색인에서도 뺀다.
  if (host !== PRODUCTION_HOST) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const disallowPaths = ["/mypage/", "/chat", "/write", "/alert"];
  const localizedDisallowPaths = routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .flatMap((locale) => disallowPaths.map((path) => `/${locale}${path}`));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...disallowPaths, ...localizedDisallowPaths],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
