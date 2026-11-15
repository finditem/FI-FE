/**
 * 사이트맵 인덱스(`/sitemap.xml`)가 가리키는 종류별 사이트맵 경로입니다.
 * 종류별로 나눠 서치 콘솔에서 색인 현황을 따로 볼 수 있게 합니다. 새 종류를 추가하면 여기에도 넣습니다.
 */
export const SITEMAP_PATHS = [
  "/sitemaps/static/sitemap.xml",
  "/sitemaps/posts/sitemap.xml",
  "/sitemaps/notices/sitemap.xml",
] as const;
