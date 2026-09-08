import { create } from "zustand";

export const DAILY_TRANSLATION_LIMIT = 20;

interface ChatTranslationUsageStore {
  usedCount: number;
  incrementUsedCount: () => void;
}

/**
 * 채팅 번역 일일 사용 횟수를 세션 동안만 들고 있는 임시 클라이언트 상태입니다.
 * 실제 횟수 차감/조회 API가 준비되면 이 스토어 대신 서버 응답으로 대체합니다.
 */
const useChatTranslationUsage = create<ChatTranslationUsageStore>((set) => ({
  usedCount: 0,
  incrementUsedCount: () =>
    set((state) => ({ usedCount: Math.min(state.usedCount + 1, DAILY_TRANSLATION_LIMIT) })),
}));

export default useChatTranslationUsage;
