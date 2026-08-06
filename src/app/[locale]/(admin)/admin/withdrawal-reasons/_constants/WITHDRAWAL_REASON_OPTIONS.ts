import { WithdrawalReasonType } from "../_types/WithdrawalReasonType";

export const WITHDRAWAL_REASON_OPTIONS: { label: string; value: WithdrawalReasonType }[] = [
  { label: "전체", value: "" },
  { label: "잘 사용하지 않아요", value: "NOT_USING" },
  { label: "서비스에 대한 신뢰도가 낮아요", value: "LOW_TRUST" },
  { label: "사용이 어려워요", value: "DIFFICULT_TO_USE" },
  { label: "다른 계정이 있어요", value: "DUPLICATE_ACCOUNT" },
  { label: "불쾌감을 주는 사용자를 만났어요", value: "UNPLEASANT_USER" },
  { label: "억울하게 서비스 이용이 제한됐어요", value: "UNFAIR_RESTRICTION" },
  { label: "기타", value: "OTHER" },
];
