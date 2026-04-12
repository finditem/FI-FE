import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface MypageActivityResponse extends ApiBaseResponseType<MypageActivityType> {}

export interface MypageActivityType {
  activities: ActivityGroupItemType[];
  nextCursor: number;
  hasNext: boolean;
}

export interface ActivityGroupItemType {
  date: string;
  activities: ActivityEachItemType[];
}

export interface ActivityEachItemType {
  type: ActivityDetailType;
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// TODO(수현): 백엔드 수정 후 타입 확인 필요
export type ActivityDetailType =
  | "POST"
  | "COMMENT"
  | "FAVORITE"
  | "INQUIRY"
  | "INQUIRY_RECEIVED"
  | "INQUIRY_ANSWERED"
  | "REPORT"
  | "REPORT_RECEIVED"
  | "REPORT_ANSWERED";
