import { useTranslations } from "next-intl";
import { SUPPORT_MENU_ITEMS } from "../../_components/HOME_CONST";

const useSupportMenuItems = () => {
  const t = useTranslations("SupportMenuItems");

  return SUPPORT_MENU_ITEMS.map((item) => ({
    ...item,
    label: t(`${item.type}Label`),
  }));
};

export default useSupportMenuItems;
