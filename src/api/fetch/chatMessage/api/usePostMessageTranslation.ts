import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { MessageTranslationRequest } from "../types/MessageTranslationRequest";
import { MessageTranslationResponse } from "../types/MessageTranslationResponse";

/**
 * 채팅 메시지 한 건을 번역합니다.
 * `roomId`/`messageId`는 URL 경로에, `requestId`/`roomVisitId`/`targetLanguage`는 요청 바디로 전달합니다.
 */
const usePostMessageTranslation = (roomId: number, messageId: number) =>
  useAppMutation<MessageTranslationRequest, ApiBaseResponseType<MessageTranslationResponse>>(
    "auth",
    `/chats/${roomId}/messages/${messageId}/translations`,
    "post"
  );

export default usePostMessageTranslation;
