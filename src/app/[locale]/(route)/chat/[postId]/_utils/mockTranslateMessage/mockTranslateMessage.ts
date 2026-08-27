const MOCK_TRANSLATE_DELAY_MS = 600;

/**
 * 백엔드 번역 API가 준비되기 전까지 UI 검증용으로 쓰는 목업 함수입니다.
 * 실제 연동 시 이 함수의 호출부를 useAppMutation 기반 API 훅으로 교체하면 됩니다.
 */
const mockTranslateMessage = (text: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[번역됨] ${text}`);
    }, MOCK_TRANSLATE_DELAY_MS);
  });
};

export default mockTranslateMessage;
