/**
 * 유저 탈퇴 사유 타입
 * - NOT_USING: 사용하지 않음
 * - LOW_TRUST: 신뢰도가 낮음
 * - DIFFICULT_TO_USE: 사용하기 어려움
 * - DUPLICATE_ACCOUNT: 중복 계정
 * - UNPLEASANT_USER: 불쾌한 사용자
 * - UNFAIR_RESTRICTION: 부당한 제한
 * - OTHER: 기타
 *
 * @author jikwon
 */

export type WithdrawalReason =
  | "NOT_USING"
  | "LOW_TRUST"
  | "DIFFICULT_TO_USE"
  | "DUPLICATE_ACCOUNT"
  | "UNPLEASANT_USER"
  | "UNFAIR_RESTRICTION"
  | "OTHER";
