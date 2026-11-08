import { useTranslations } from "next-intl";
import { CheckBoxConfig } from "../../_constants/CheckBoxConfig";

export const useDeleteAccountReasons = () => {
  const t = useTranslations("DeleteAccountReason");

  return CheckBoxConfig.map((item) => ({
    value: item.value,
    label: t(item.labelKey),
  }));
};
