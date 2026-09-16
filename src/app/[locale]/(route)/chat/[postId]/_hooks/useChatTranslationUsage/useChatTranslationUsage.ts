import { create } from "zustand";

export const DAILY_TRANSLATION_LIMIT = 20;

interface ChatTranslationUsageStore {
  usedCount: number;
  reserveTranslation: () => boolean;
  releaseTranslation: () => void;
}

/**
 * 채팅 번역 일일 사용 횟수를 세션 동안만 들고 있는 임시 클라이언트 상태입니다.
 * 실제 횟수 차감/조회 API가 준비되면 이 스토어 대신 서버 응답으로 대체합니다.
 */
const useChatTranslationUsage = create<ChatTranslationUsageStore>((set, get) => ({
  usedCount: 0,
  // 요청을 보내기 전에 한도를 확인하고 즉시 선점해, 동시에 여러 번역이 시작돼도 한도를 넘기지 않는다.
  reserveTranslation: () => {
    if (get().usedCount >= DAILY_TRANSLATION_LIMIT) return false;
    set((state) => ({ usedCount: state.usedCount + 1 }));
    return true;
  },
  releaseTranslation: () => set((state) => ({ usedCount: Math.max(state.usedCount - 1, 0) })),
}));

export default useChatTranslationUsage;
