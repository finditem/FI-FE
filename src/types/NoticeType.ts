/**
 * 공지사항과 관련된 타입 정의입니다.
 *
 * @author jikwon
 */

/**
 * 공지사항 카테고리
 * - GENERAL: 일반
 * - EVENT: 이벤트
 * - MAINTENANCE: 점검
 * - IMPORTANT: 중요
 * - UPDATE: 업데이트
 */

export type NoticeCategory = "GENERAL" | "EVENT" | "MAINTENANCE" | "IMPORTANT" | "UPDATE";

/**
 * 공지사항 정렬 타입
 * - LATEST: 최신순
 * - OLDEST: 오래된순
 * - MOST_VIEWED: 조회순
 */

export type NoticeSortType = "LATEST" | "OLDEST" | "MOST_VIEWED";
