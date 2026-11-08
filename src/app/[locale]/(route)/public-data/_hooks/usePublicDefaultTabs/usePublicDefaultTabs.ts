import { useTranslations } from "next-intl";
import { PUBLIC_DEFAULT_TABS } from "../../_components/PUBLIC_DATA_CONST";

const usePublicDefaultTabs = () => {
  const t = useTranslations("PublicDefaultTabs");

  return PUBLIC_DEFAULT_TABS.map((tab) => ({ ...tab, label: t(tab.value) }));
};

export default usePublicDefaultTabs;
