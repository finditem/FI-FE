/**
 * 문의와 관련된 타입 정의입니다.
 *
 * @author jikwon
 */

/**
 * 문의 처리 상태
 * - RECEIVED: 접수됨
 * - PENDING: 답변 진행 중
 * - ANSWERED: 답변 완료
 */

export type InquiryStatus = "RECEIVED" | "PENDING" | "ANSWERED";

/**
 * 문의 대상 유형
 * - ACCOUNT_LOGIN: 계정/로그인
 * - USAGE: 서비스 이용
 * - BUG: 오류/버그
 * - SUGGESTION: 건의사항
 * - ETC: 기타
 */

export type InquiryTargetType = "ACCOUNT_LOGIN" | "USAGE" | "BUG" | "SUGGESTION" | "ETC";

/**
 * 문의 유형
 * - GENERAL: 일반
 * - TECHNICAL: 기술
 * - ACCOUNT: 계정
 * - PAYMENT: 결제
 * - REPORT_ISSUE: 신고
 * - SERVICE: 서비스
 * - ETC: 기타
 */

export type InquiryType =
  | "GENERAL"
  | "TECHNICAL"
  | "ACCOUNT"
  | "PAYMENT"
  | "REPORT_ISSUE"
  | "SERVICE"
  | "ETC";

/**
 * 문의 목록 필터 상태
 * - ALL: 전체
 * - RECEIVED: 접수됨
 * - PENDING: 답변 진행 중
 * - ANSWERED: 답변 완료
 */

export type InquiryFilterStatus = "ALL" | "RECEIVED" | "PENDING" | "ANSWERED";
