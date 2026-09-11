import { create } from "zustand";

interface TranslationLimitToastStore {
  isOpen: boolean;
  /** open이 다시 호출될 때 자동 해제 타이머를 리셋하기 위한 값 */
  nonce: number;
  open: () => void;
  close: () => void;
}

/**
 * 번역 횟수 제한 도달 시 노출하는 하단 토스트(5-1)의 열림 상태를 관리합니다.
 * 메시지별 `ChatBox`에서 트리거하고 `ChatRoomMain`의 `TranslationLimitToast`가 구독합니다.
 */
const useTranslationLimitToast = create<TranslationLimitToastStore>((set) => ({
  isOpen: false,
  nonce: 0,
  open: () => set((state) => ({ isOpen: true, nonce: state.nonce + 1 })),
  close: () => set({ isOpen: false }),
}));

export default useTranslationLimitToast;
