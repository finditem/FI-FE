import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import mockTranslateMessage from "../../_utils/mockTranslateMessage/mockTranslateMessage";
import useChatTranslationUsage from "../useChatTranslationUsage/useChatTranslationUsage";
import useTranslationLimitToast from "../useTranslationLimitToast/useTranslationLimitToast";

const useMessageTranslation = (originalContent: string) => {
  const t = useTranslations("ChatBox");
  const { addToast } = useToast();
  const reserveTranslation = useChatTranslationUsage((state) => state.reserveTranslation);
  const releaseTranslation = useChatTranslationUsage((state) => state.releaseTranslation);
  const openLimitToast = useTranslationLimitToast((state) => state.open);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const toggleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedContent) {
      setIsTranslated(true);
      return;
    }

    if (!reserveTranslation()) {
      openLimitToast();
      return;
    }

    setIsTranslating(true);
    try {
      const result = await mockTranslateMessage(originalContent);
      setTranslatedContent(result);
      setIsTranslated(true);
    } catch {
      releaseTranslation();
      addToast(t("translateError"), "error");
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    displayContent: isTranslated && translatedContent ? translatedContent : originalContent,
    isTranslated,
    isTranslating,
    toggleTranslate,
  };
};

export default useMessageTranslation;
