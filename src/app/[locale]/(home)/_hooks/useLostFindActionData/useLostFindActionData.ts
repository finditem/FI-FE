import { useTranslations } from "next-intl";
import { LOST_FIND_ACTION_DATA } from "../../_components/HOME_CONST";

const useLostFindActionData = () => {
  const t = useTranslations("LostFindActionData");

  return LOST_FIND_ACTION_DATA.map((item) => ({
    ...item,
    title: t(item.type),
  }));
};

export default useLostFindActionData;
