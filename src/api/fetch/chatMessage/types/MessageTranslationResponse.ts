import { TranslationTargetLanguage } from "./MessageTranslationRequest";

export interface MessageTranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: TranslationTargetLanguage;
  /** 이번 번역 반영 후 오늘 사용한 횟수 */
  usedCount: number;
  /** 일일 번역 가능 횟수 */
  limit: number;
}
