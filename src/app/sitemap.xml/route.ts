import { SITE_URL } from "@/constants/SITE_URL";
import { SITEMAP_PATHS } from "../sitemaps/_constants/SITEMAP_PATHS";

// 인덱스 내용은 경로 목록뿐이라 빌드 시점에 고정한다.
export const dynamic = "force-static";

/**
 * 종류별 사이트맵을 묶는 사이트맵 인덱스입니다.
 *
 * @remarks
 * Next.js의 `sitemap.ts`는 인덱스 형식을 만들지 못해 route handler로 직접 응답합니다. robots.txt와
 * 서치 콘솔에 등록된 `/sitemap.xml` 주소를 그대로 유지하기 위해 이 경로를 인덱스로 씁니다.
 */
export function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...SITEMAP_PATHS.map((path) => `  <sitemap><loc>${SITE_URL}${path}</loc></sitemap>`),
    "</sitemapindex>",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
