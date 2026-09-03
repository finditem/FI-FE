import { useTranslations } from "next-intl";
import { LOST_FIND_ACTION_DATA } from "../../_components/HOME_CONST";

const useLostFindActionData = () => {
  const t = useTranslations("LostFindActions");

  return LOST_FIND_ACTION_DATA.map((item) => ({
    ...item,
    emphasis: t(`${item.type}Emphasis`),
    rest: t(`${item.type}Rest`),
    subtitle: t(`${item.type}Subtitle`),
  }));
};

export default useLostFindActionData;
