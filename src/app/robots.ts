import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const disallowPaths = ["/admin", "/mypage/", "/chat", "/write", "/alert"];
  const localizedDisallowPaths = routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .flatMap((locale) => disallowPaths.map((path) => `/${locale}${path}`));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...disallowPaths, ...localizedDisallowPaths],
    },
    sitemap: "https://www.finditem.kr/sitemap.xml",
  };
}
