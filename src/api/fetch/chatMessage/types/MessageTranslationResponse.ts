import { TranslationTargetLanguage } from "./MessageTranslationRequest";

export interface MessageTranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: TranslationTargetLanguage;
  usedCount: number;
  limit: number;
}
