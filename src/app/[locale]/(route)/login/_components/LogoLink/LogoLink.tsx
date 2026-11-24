import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";

const LogoLink = () => {
  const t = useTranslations("LogoLink");

  return (
    <Link className="cursor-pointer gap-6 flex-col-center" href={"/"}>
      <span className="sr-only">{t("homeAriaLabel")}</span>
      <Icon name="LogoChatgil" size={84} title={t("logoIconTitle")} />
      <Icon name="LogoNameChatgil" width={142} height={64} title={t("brandName")} />
      <h3 className="text-body2-medium text-labelsVibrant-secondary">{t("slogan")}</h3>
    </Link>
  );
};

export default LogoLink;
