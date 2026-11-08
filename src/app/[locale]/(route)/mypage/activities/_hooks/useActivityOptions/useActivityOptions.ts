import { useTranslations } from "next-intl";
import { ACTIVITY_OPTIONS } from "../../_constants/ACTIVITY_OPTIONS";

export const useActivityOptions = () => {
  const t = useTranslations("ActivityFilterSection");

  return ACTIVITY_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));
};
