/** 감정 유형. MOVED(감동), GRATEFUL(감사), HEART_FLUTTERED(심쿵) */
export type ReviewEmotionType = "MOVED" | "GRATEFUL" | "HEART_FLUTTERED";

/** 도움 경험. 1개 이상 선택 */
export type ReviewHelpType =
  | "KIND_AND_WARM"
  | "TRUSTWORTHY_COMMUNICATION"
  | "QUICK_RESPONSE"
  | "SAFE_STORAGE"
  | "USEFUL_INFORMATION";

export interface ReviewCreateRequest {
  /** 찾기 완료 id. 채팅방 상세의 findCompletion.findCompletionId 값 */
  findCompletionId: number;
  emotion: ReviewEmotionType;
  helpTypes: ReviewHelpType[];
  /** 상세 후기. 선택 입력, 최대 300자 */
  content?: string;
}

export interface ReviewIdResponse {
  reviewId: number;
}
