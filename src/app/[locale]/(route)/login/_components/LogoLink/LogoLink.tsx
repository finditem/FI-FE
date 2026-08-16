import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";

const LogoLink = () => {
  const t = useTranslations("LogoLink");

  return (
    <Link className="cursor-pointer gap-6 flex-col-center" href={"/"}>
      <span className="sr-only">{t("homeAriaLabel")}</span>
      <Icon name="Logo" size={84} title={t("logoIconTitle")} />
      <div className="gap-3 flex-col-center">
        <h2 className="text-title2-bold text-flatGreen-500">{t("brandName")}</h2>
        <h3 className="text-body2-medium text-labelsVibrant-secondary">{t("slogan")}</h3>
      </div>
    </Link>
  );
};

export default LogoLink;
