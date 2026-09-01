import { useState } from "react";
import { useTranslations } from "next-intl";
import mockTranslateMessage from "../../_utils/mockTranslateMessage/mockTranslateMessage";

const useMessageTranslation = (originalContent: string) => {
  const t = useTranslations("ChatBox");
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

    setIsTranslating(true);
    const result = await mockTranslateMessage(originalContent, t("translatedPrefix"));
    setTranslatedContent(result);
    setIsTranslating(false);
    setIsTranslated(true);
  };

  return {
    displayContent: isTranslated && translatedContent ? translatedContent : originalContent,
    isTranslated,
    isTranslating,
    toggleTranslate,
  };
};

export default useMessageTranslation;
