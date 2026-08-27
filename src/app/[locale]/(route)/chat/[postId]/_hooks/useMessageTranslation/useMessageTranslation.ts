import { useState } from "react";
import mockTranslateMessage from "../../_utils/mockTranslateMessage/mockTranslateMessage";

const useMessageTranslation = (originalContent: string) => {
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
    const result = await mockTranslateMessage(originalContent);
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
