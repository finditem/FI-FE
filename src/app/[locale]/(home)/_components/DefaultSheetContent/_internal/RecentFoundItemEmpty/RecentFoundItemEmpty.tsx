import { useTranslations } from "next-intl";
import { Icon } from "@/components";

const RecentFoundItemEmpty = () => {
  const t = useTranslations("RecentFoundItemEmpty");

  return (
    <div className="h-[118px] w-full gap-2 py-[14px] flex-col-center">
      <Icon name="LogoCharacterOutlined" size={64} className="text-labelsVibrant-quaternary" />
      <p className="text-body2-medium text-layout-body-default">{t("emptyText")}</p>
    </div>
  );
};

export default RecentFoundItemEmpty;
