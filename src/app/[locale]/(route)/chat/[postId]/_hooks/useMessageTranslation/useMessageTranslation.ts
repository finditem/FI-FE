import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import usePostMessageTranslation from "@/api/fetch/chatMessage/api/usePostMessageTranslation";
import useGetChatTranslationUsage from "@/api/fetch/chatMessage/api/useGetChatTranslationUsage";
import { TranslationTargetLanguage } from "@/api/fetch/chatMessage/types/MessageTranslationRequest";
import useTranslationLimitToast from "../useTranslationLimitToast/useTranslationLimitToast";

interface UseMessageTranslationParams {
  roomId: number;
  messageId: number;
  roomVisitId: string;
  originalContent: string;
}

const TRANSLATION_LIMIT_STATUS = 429;

const toTargetLanguage = (locale: string): TranslationTargetLanguage =>
  locale === "en" ? "EN" : "KO";

const useMessageTranslation = ({
  roomId,
  messageId,
  roomVisitId,
  originalContent,
}: UseMessageTranslationParams) => {
  const t = useTranslations("ChatBox");
  const locale = useLocale();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const openLimitToast = useTranslationLimitToast((state) => state.open);
  const { data: usage } = useGetChatTranslationUsage();
  const { mutateAsync, isPending } = usePostMessageTranslation(roomId, messageId);

  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const isLimitReached = usage != null && usage.usedCount >= usage.limit;

  useEffect(() => {
    if (!isLimitReached || !usage) return;

    const delay = new Date(usage.nextAvailableAt).getTime() - Date.now();
    if (delay <= 0) {
      queryClient.invalidateQueries({ queryKey: ["chatTranslationUsage"] });
      return;
    }

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["chatTranslationUsage"] });
    }, delay);
    return () => clearTimeout(timer);
  }, [isLimitReached, usage, queryClient]);

  const toggleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedContent) {
      setIsTranslated(true);
      return;
    }

    if (isLimitReached) {
      openLimitToast();
      return;
    }

    try {
      const response = await mutateAsync({
        requestId: crypto.randomUUID(),
        roomVisitId,
        targetLanguage: toTargetLanguage(locale),
      });
      setTranslatedContent(response.result.translatedText);
      setIsTranslated(true);
      queryClient.invalidateQueries({ queryKey: ["chatTranslationUsage"] });
    } catch (error) {
      // 서버가 횟수 초과(429)로 거절하면 제한 토스트, 그 외에는 실패 토스트로 재시도를 유도합니다.
      if (isAxiosError(error) && error.response?.status === TRANSLATION_LIMIT_STATUS) {
        openLimitToast();
        queryClient.invalidateQueries({ queryKey: ["chatTranslationUsage"] });
      } else {
        addToast(t("translateError"), "error");
      }
    }
  };

  return {
    displayContent: isTranslated && translatedContent ? translatedContent : originalContent,
    isTranslated,
    isTranslating: isPending,
    toggleTranslate,
  };
};

export default useMessageTranslation;
