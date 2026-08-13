import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";

const LogoLink = () => {
  const t = useTranslations("LogoLink");

  return (
    <Link className="cursor-pointer gap-3 flex-center" href={"/"} aria-label={t("homeAriaLabel")}>
      <Icon name="Logo" size={40} title={t("logoIconTitle")} />
      <h2 className="text-h2-bold text-flatGreen-500">{t("brandName")}</h2>
    </Link>
  );
};

export default LogoLink;
