import { useTranslations } from "next-intl";
import { Icon } from "@/components";

const RecentSearchEmpty = () => {
  const t = useTranslations("RecentSearchEmpty");

  return (
    <div role="status" className="w-full gap-5 py-3 flex-col-center">
      <div className="h-[32px] w-[32px] flex-shrink-0 rounded-full bg-fill-neutral-strong-default flex-center">
        <Icon name="Clock" size={20} />
      </div>
      <p className="text-body1-regular text-labelsVibrant-primary">{t("emptyText")}</p>
    </div>
  );
};

export default RecentSearchEmpty;
