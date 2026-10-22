import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { ReviewHelpType } from "./ReviewCreateType";

export type ReviewListType = "RECEIVED" | "SENT";

export interface ReviewListUser {
  userId: number | null;
  nickname: string | null;
  profileImageUrl: string | null;
  withdrawn: boolean;
}

export interface ReviewListItem {
  reviewId: number;
  emotion: "MOVED" | "GRATEFUL" | "HEART_FLUTTERED";
  helpTypes: ReviewHelpType[];
  content: string | null;
  createdAt: string;
  user: ReviewListUser;
}

export interface ReviewListResult {
  reviewList: ReviewListItem[];
  reviewCount: number;
  nextCursor: number | null;
  hasNext: boolean;
}

export type ReviewListResponse = ApiBaseResponseType<ReviewListResult>;
