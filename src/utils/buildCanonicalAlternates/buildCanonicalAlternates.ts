import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * 페이지의 canonical 주소를 현재 로케일에 맞춰 생성합니다.
 *
 * @remarks
 * - 루트 레이아웃의 `metadataBase`를 기준으로 해석되므로 호스트 없이 경로만 반환합니다.
 * - 기본 로케일(ko)은 접두사 없이, en은 `/en` 접두사가 붙은 자기 참조 canonical이 됩니다.
 * - 쿼리스트링은 담지 않습니다. 같은 화면의 쿼리 변형(`?type=` 등)을 하나로 모으려는 용도입니다.
 *
 * @param href - 로케일 접두사를 제외한 경로 (예: `"/list"`)
 * @param locale - 현재 로케일
 *
 * @example
 * export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 *   const { locale } = await params;
 *   return { alternates: buildCanonicalAlternates("/list", locale) };
 * }
 */
export const buildCanonicalAlternates = (
  href: string,
  locale: string
): NonNullable<Metadata["alternates"]> => ({
  canonical: getPathname({ locale: locale as (typeof routing.locales)[number], href }),
});
