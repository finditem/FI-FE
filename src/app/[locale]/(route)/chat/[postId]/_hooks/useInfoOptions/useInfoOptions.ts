import { useTranslations } from "next-intl";
import { INFO_OPTIONS } from "../../_components/CHATROOM_CONST";

const useInfoOptions = () => {
  const t = useTranslations("ChatRoomHeaderInfoButton");

  return INFO_OPTIONS.map((option) => ({ ...option, label: t(`${option.value}Label`) }));
};

export default useInfoOptions;
