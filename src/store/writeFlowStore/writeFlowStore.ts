import { create } from "zustand";

/**
 * 게시글 작성 플로우 UI 상태를 관리하는 Zustand 스토어입니다.
 *
 * @author jikwon
 */

type WriteFlowProps = {
  /** 임시저장 모달 표시 여부 */
  tempModalShown: boolean;
  /** 임시저장 모달 표시 여부 설정 */
  setTempModalShown: (v: boolean) => void;
  /** 작성 가이드 팝업 표시 여부 */
  showManualPopup: boolean;
  /** 작성 가이드 팝업 표시 여부 설정 */
  setShowManualPopup: (v: boolean) => void;
  /** 작성 플로우 상태 초기화 */
  resetWriteFlow: () => void;
};

export const useWriteFlowStore = create<WriteFlowProps>((set) => ({
  tempModalShown: false,
  setTempModalShown: (v) => set({ tempModalShown: v }),
  showManualPopup: false,
  setShowManualPopup: (v) => set({ showManualPopup: v }),
  resetWriteFlow: () => set({ tempModalShown: false }),
}));
