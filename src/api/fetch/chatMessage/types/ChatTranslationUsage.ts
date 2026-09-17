export interface ChatTranslationUsage {
  /** 오늘 사용한 번역 횟수 */
  usedCount: number;
  /** 일일 번역 가능 횟수 */
  limit: number;
  /** 다시 번역할 수 있는 시각(ISO 8601). 매일 자정(Asia/Seoul)에 초기화됩니다. */
  nextAvailableAt: string;
}
