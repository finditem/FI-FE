import { useTranslations } from "next-intl";
import { SUPPORT_TAB_KEYS } from "./SUPPORT_TABS";

const useSupportTabs = () => {
  const t = useTranslations("SupportTab");

  return SUPPORT_TAB_KEYS.map((key) => ({ key, label: t(key) }));
};

export default useSupportTabs;
