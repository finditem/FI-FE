/**
 * 신고와 관련된 타입 정의입니다.
 *
 * @author jikwon
 */

/**
 * 신고 처리 상태
 * - PENDING: 접수됨
 * - REVIEWED: 검토 중
 * - RESOLVED: 처리 완료
 */

export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED";

/**
 * 신고 대상 타입
 * - POST: 게시글
 * - COMMENT: 댓글
 * - USER: 유저
 * - CHAT: 채팅
 */

export type ReportTargetType = "POST" | "COMMENT" | "USER" | "CHAT";

/**
 * 신고 사유 타입
 * - IRRELEVANT_CONTENT: 실제 분실/발견한 물건이 아닌 내용
 * - DUPLICATE: 동일한 내용이 여러 번 게시됨
 * - SPAM: 분실물과 무관한 홍보성 게시글
 * - OFFENSIVE_LANGUAGE: 채팅 또는 댓글에 모욕적 표현
 * - EXTORTION: 물건 반환을 빌미로 금전 요구
 * - FALSE_CLAIM: 실제 주인이 아닌 사람의 소유 주장
 * - ETC: 기타
 */

export type ReportType =
  | "IRRELEVANT_CONTENT"
  | "DUPLICATE"
  | "SPAM"
  | "OFFENSIVE_LANGUAGE"
  | "EXTORTION"
  | "FALSE_CLAIM"
  | "ETC";

/**
 * 신고 목록 필터 상태
 * - ALL: 전체
 * - PENDING: 접수됨
 * - REVIEWED: 검토 중
 * - RESOLVED: 처리 완료
 */

export type ReportFilterStatus = "ALL" | "PENDING" | "REVIEWED" | "RESOLVED";
