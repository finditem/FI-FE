import { useTranslations } from "next-intl";
import { POLICE_BANNER } from "../../_components/HOME_CONST";

const usePoliceBanner = () => {
  const t = useTranslations("PoliceSection");

  return {
    ...POLICE_BANNER,
    title: t("bannerTitle"),
    logoAlt: t("logoAlt"),
  };
};

export default usePoliceBanner;
