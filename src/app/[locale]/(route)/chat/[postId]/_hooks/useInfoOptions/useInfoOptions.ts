import { useTranslations } from "next-intl";
import { getInfoOptions } from "../../_components/CHATROOM_CONST";

const useInfoOptions = (canMarkFound: boolean) => {
  const t = useTranslations("ChatRoomHeaderInfoButton");
  const options = getInfoOptions(canMarkFound);

  return options.map((option, index) => ({
    ...option,
    label: t(`${option.value}Label`),
    position: index === 0 ? "first" : index === options.length - 1 ? "last" : "middle",
  }));
};

export default useInfoOptions;
