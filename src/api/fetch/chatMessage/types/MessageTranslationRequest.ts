export type TranslationTargetLanguage = "KO" | "EN";

export interface MessageTranslationRequest {
  /** 멱등성 보장을 위한 요청 식별자. 번역 시도마다 새로 생성하며, 같은 값을 다른 메시지/입장/언어에 재사용하면 409로 거절됩니다. */
  requestId: string;
  /** 채팅방 입장 시마다 프론트에서 새로 발급하는 방문 식별자. 서버가 재진입을 구분하는 데 사용합니다. */
  roomVisitId: string;
  targetLanguage: TranslationTargetLanguage;
}
