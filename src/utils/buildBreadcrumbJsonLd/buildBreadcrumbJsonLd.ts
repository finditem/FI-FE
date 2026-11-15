import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/constants/SITE_URL";

interface BreadcrumbItem {
  /** 경로에 표시할 이름 */
  name: string;
  /** 로케일 접두사를 제외한 경로 (예: `"/list"`) */
  href: string;
}

/**
 * 상세 페이지의 BreadcrumbList 구조화 데이터를 만듭니다.
 *
 * @remarks
 * - `items` 순서대로 1부터 위치를 매깁니다. 첫 항목은 보통 홈, 마지막 항목은 현재 페이지입니다.
 * - 경로는 현재 로케일 기준 절대 주소로 바꿉니다(en은 `/en` 접두사).
 * - `next-intl` 내비게이션을 쓰므로 `@/utils` 배럴에 넣지 않고 경로로 직접 import합니다.
 *
 * @param items - 홈부터 현재 페이지까지의 경로 항목
 * @param locale - 현재 로케일
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * <JsonLd
 *   data={buildBreadcrumbJsonLd(
 *     [{ name: "홈", href: "/" }, { name: "공지사항", href: "/notice" }, { name: title, href: `/notice/${id}` }],
 *     locale
 *   )}
 * />
 * ```
 */
export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[], locale: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${getPathname({ locale: locale as (typeof routing.locales)[number], href: item.href })}`,
  })),
});
