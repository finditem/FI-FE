import { useTranslations } from "next-intl";
import { ALERT_CATEGORIES } from "../../_components/ALERT_CONST";

const useAlertCategories = () => {
  const t = useTranslations("AlertCategories");

  return ALERT_CATEGORIES.map((category) => ({ ...category, label: t(`${category.key}Label`) }));
};

export default useAlertCategories;
