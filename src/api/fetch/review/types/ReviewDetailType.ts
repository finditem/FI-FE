/** 감정 유형. MOVED(감동), GRATEFUL(감사), HEART_FLUTTERED(심쿵) */
export type ReviewEmotionType = "MOVED" | "GRATEFUL" | "HEART_FLUTTERED";

/** 도움 경험. 응답에 담긴 순서대로 노출한다. */
export type ReviewHelpType =
  | "KIND_AND_WARM"
  | "TRUSTWORTHY_COMMUNICATION"
  | "QUICK_RESPONSE"
  | "SAFE_STORAGE"
  | "USEFUL_INFORMATION";

/** 후기 당사자(보낸/받은 사용자). 탈퇴한 사용자면 userId·nickname·profileImageUrl이 null이다. */
export interface ReviewUser {
  userId: number | null;
  nickname: string | null;
  profileImageUrl: string | null;
  withdrawn: boolean;
}

/** 후기가 가리키는 원본 게시글. 삭제되었으면 deleted가 true이고 date·createdAt이 null일 수 있다. */
export interface ReviewPost {
  postId: number;
  title: string;
  address: string;
  /** 삭제 시점의 스냅샷 썸네일 URL. 없을 수 있다. */
  thumbnailUrl: string | null;
  /** 분실 일시. 게시글이 남아 있지 않으면 null */
  date: string | null;
  /** 게시글 작성 일시. 게시글이 남아 있지 않으면 null */
  createdAt: string | null;
  deleted: boolean;
}

export interface ReviewDetailResponse {
  reviewId: number;
  emotion: ReviewEmotionType;
  helpTypes: ReviewHelpType[];
  /** 상세 후기. 작성하지 않았으면 null */
  content: string | null;
  createdAt: string;
  /** 후기를 보낸 사용자 */
  author: ReviewUser;
  /** 후기를 받은 사용자 */
  recipient: ReviewUser;
  post: ReviewPost;
  /** 채팅방 이동용 id. 채팅방 연결이 없으면 null */
  roomId: number | null;
}
