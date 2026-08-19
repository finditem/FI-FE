import { useTranslations } from "next-intl";
import { EMPTY_MODE_STYLE } from "../../_components/CHATROOM_CONST";

const useEmptyModeStyle = () => {
  const t = useTranslations("EmptyChatRoom");

  return {
    lost: { ...EMPTY_MODE_STYLE.lost, helpText: t("lostHelpText") },
    find: { ...EMPTY_MODE_STYLE.find, helpText: t("findHelpText") },
  } as const;
};

export default useEmptyModeStyle;
