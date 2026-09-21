const DEFAULT_ADMIN_URL = "https://a.finditem.kr";

/**
 * 관리자 앱(finditem/admin)의 절대 URL을 만듭니다.
 *
 * @remarks
 * - 관리자 화면은 별도 앱으로 분리되어 운영 앱에는 `/admin` 라우트가 없습니다.
 * - 공지 작성·수정처럼 관리자 앱에 있는 화면으로 보낼 때 사용합니다.
 * - `NEXT_PUBLIC_ADMIN_URL`이 없으면 기본 관리자 도메인을 사용합니다.
 *
 * @example
 * ```ts
 * getAdminUrl("/admin/notice/write"); // "https://a.finditem.kr/admin/notice/write"
 * ```
 */

export const getAdminUrl = (path: string) => {
  const baseUrl = (process.env.NEXT_PUBLIC_ADMIN_URL || DEFAULT_ADMIN_URL).replace(/\/$/, "");
  return `${baseUrl}${path}`;
};
