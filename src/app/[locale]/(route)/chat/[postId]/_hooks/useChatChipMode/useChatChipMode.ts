import { useTranslations } from "next-intl";
import { CHAT_CHIP_MODE } from "../../_components/CHATROOM_CONST";

const useChatChipMode = () => {
  const t = useTranslations("ChatChip");

  return {
    FIND: { ...CHAT_CHIP_MODE.FIND, text: t("findLabel") },
    LOST: { ...CHAT_CHIP_MODE.LOST, text: t("lostLabel") },
    FOUND_STATUS: { ...CHAT_CHIP_MODE.FOUND_STATUS, text: t("foundStatusLabel") },
  } as const;
};

export default useChatChipMode;
