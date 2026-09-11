import { useTranslations } from "next-intl";
import { Icon } from "@/components";

const RecentFoundItemEmpty = () => {
  const t = useTranslations("RecentFoundItemEmpty");

  return (
    <div className="min-h-[120px] w-full gap-4 py-[14px] flex-col-center">
      <Icon name="LogoCharacterOutlined" size={84} className="text-labelsVibrant-quaternary" />
      <p className="text-body2-medium text-layout-body-default">{t("emptyText")}</p>
    </div>
  );
};

export default RecentFoundItemEmpty;
