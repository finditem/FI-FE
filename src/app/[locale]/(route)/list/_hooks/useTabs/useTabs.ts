import { useTranslations } from "next-intl";
import { TABS } from "../../_components/LIST_CONST";

const useTabs = () => {
  const t = useTranslations("Tabs");

  return TABS.map((tab) => ({ ...tab, label: t(`${tab.key}Label`) }));
};

export default useTabs;
