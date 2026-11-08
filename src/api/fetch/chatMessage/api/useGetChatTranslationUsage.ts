import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ChatTranslationUsage } from "../types/ChatTranslationUsage";

/**
 * 오늘의 채팅 번역 사용 횟수/한도/재사용 가능 시각을 조회합니다.
 * 매일 자정(Asia/Seoul)에 서버에서 초기화됩니다.
 */
const useGetChatTranslationUsage = () =>
  useAppQuery<ApiBaseResponseType<ChatTranslationUsage>, unknown, ChatTranslationUsage>(
    "auth",
    ["chatTranslationUsage"],
    "/users/me/chat-translation-usage",
    { select: (data) => data.result }
  );

export default useGetChatTranslationUsage;
