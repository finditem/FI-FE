import { useTranslations } from "next-intl";

interface PublicLostItemInfoProps {
  date: string;
  isLost: boolean;
}

const PublicLostItemInfo = ({ date, isLost }: PublicLostItemInfoProps) => {
  const t = useTranslations("PublicLostItemInfo");
  const dateLabel = isLost ? t("lostDateLabel") : t("foundDateLabel");

  return (
    <ul
      aria-label={t("dateInfoAriaLabel", { dateLabel })}
      className="flex flex-col gap-1 rounded-[24px] px-5 py-4 text-body1-regular text-layout-header-default bg-fill-neutral-strong-enteredSelected"
    >
      <li>
        {dateLabel}: {date}
      </li>
    </ul>
  );
};

export default PublicLostItemInfo;
