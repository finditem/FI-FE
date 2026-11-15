/**
 * 검색엔진 색인을 허용하는 운영 호스트입니다.
 *
 * release(`release.finditem.kr`)도 Vercel production 환경으로 배포되어 `VERCEL_ENV`로는 운영과 구분할 수
 * 없으므로, 요청 호스트가 이 값과 같을 때만 운영으로 봅니다. `robots.ts`와 `next.config.ts`의
 * `X-Robots-Tag` 헤더가 함께 씁니다.
 */
export const PRODUCTION_HOST = "www.finditem.kr";
