/** 후기 감정 종류. 히어로 캐릭터 일러스트와 도착 메시지를 결정한다. */
export type ReviewEmotion = "gratitude" | "touched" | "flutter";

/** 감정별 히어로 캐릭터 일러스트 경로(`public/reviews` 하위). 감사/감동/심쿵. */
export const REVIEW_EMOTION_CHARACTER: Record<ReviewEmotion, string> = {
  gratitude: "/reviews/review-gratitude.png",
  touched: "/reviews/review-touched.png",
  flutter: "/reviews/review-flutter.png",
};

/**
 * 후기 데이터 연동 전 기본 감정.
 * TODO(수현): 후기 조회 API의 감정 필드로 대체하고, 감정에 따라 캐릭터와 도착 메시지를 분기한다.
 */
export const DEFAULT_REVIEW_EMOTION: ReviewEmotion = "gratitude";
