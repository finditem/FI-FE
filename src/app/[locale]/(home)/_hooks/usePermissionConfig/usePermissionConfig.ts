import { useTranslations } from "next-intl";
import { PERMISSION_CONFIG } from "../../_components/HOME_CONST";

const usePermissionConfig = () => {
  const t = useTranslations("PermissionConfig");

  return {
    Location: {
      ...PERMISSION_CONFIG.Location,
      title: t("locationTitle"),
      description: t("locationDescription"),
      agreeBtnText: t("locationAgreeBtnText"),
    },
    Alert: {
      ...PERMISSION_CONFIG.Alert,
      title: t("alertTitle"),
      description: t("alertDescription"),
      agreeBtnText: t("alertAgreeBtnText"),
    },
  };
};

export default usePermissionConfig;
