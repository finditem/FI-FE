import { useTranslations } from "next-intl";
import { MANUAL_LIST } from "../../_components/MANUAL_CONST";

const useManualTabs = () => {
  const t = useTranslations("ManualTabs");

  return MANUAL_LIST.map((item) => ({ ...item, label: t(item.key) }));
};

export default useManualTabs;
