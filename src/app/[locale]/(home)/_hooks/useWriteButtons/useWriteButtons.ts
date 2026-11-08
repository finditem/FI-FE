import { useTranslations } from "next-intl";
import { WRITE_BUTTONS } from "../../_components/HOME_CONST";

const useWriteButtons = () => {
  const t = useTranslations("WriteButtons");

  return WRITE_BUTTONS.map((button) => ({
    ...button,
    label: t(`${button.type}Label`),
  }));
};

export default useWriteButtons;
