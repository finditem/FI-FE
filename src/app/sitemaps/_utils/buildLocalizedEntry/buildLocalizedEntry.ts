import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/constants/SITE_URL";

/**
 * 사이트맵 항목 하나를 기본 로케일 주소와 로케일별 대체 링크(hreflang)로 만듭니다.
 *
 * @remarks
 * - 홈은 `""`가 아니라 `"/"`로 넘겨야 `getPathname`이 en 접두사를 붙여 대체 링크가 `/en`을 가리킵니다.
 * - `x-default`는 기본 로케일(ko) 주소를 가리킵니다.
 *
 * @param href - 로케일 접두사를 제외한 경로
 * @param rest - `lastModified`, `changeFrequency`, `priority`
 *
 * @author suhyeon
 */
/**
 * @example
 * ```ts
 * buildLocalizedEntry("/list", { changeFrequency: "daily", priority: 0.8 });
 * ```
 */
export const buildLocalizedEntry = (
  href: string,
  rest: Pick<MetadataRoute.Sitemap[number], "lastModified" | "changeFrequency" | "priority">
): MetadataRoute.Sitemap[number] => ({
  url: `${SITE_URL}${getPathname({ locale: routing.defaultLocale, href })}`,
  ...rest,
  alternates: {
    languages: {
      ...Object.fromEntries(
        routing.locales.map((locale) => [locale, `${SITE_URL}${getPathname({ locale, href })}`])
      ),
      "x-default": `${SITE_URL}${getPathname({ locale: routing.defaultLocale, href })}`,
    },
  },
});
