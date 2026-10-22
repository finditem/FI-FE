import type { ReviewEmotionType } from "@/api/fetch/review";

/**
 * 감정별 히어로 캐릭터 일러스트 경로(`public/reviews` 하위).
 * MOVED(감동)/GRATEFUL(감사)/HEART_FLUTTERED(심쿵).
 */
export const REVIEW_EMOTION_CHARACTER: Record<ReviewEmotionType, string> = {
  GRATEFUL: "/reviews/review-gratitude.png",
  MOVED: "/reviews/review-touched.png",
  HEART_FLUTTERED: "/reviews/review-flutter.png",
};
