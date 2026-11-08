import { useTranslations } from "next-intl";
import formatDate from "@/utils/formatDate/formatDate/formatDate";

const useFormatDate = () => {
  const t = useTranslations("useFormatDate");

  return (date: string) =>
    formatDate(date, {
      now: t("now"),
      minutesAgo: (minutes) => t("minutesAgo", { count: minutes }),
      hoursAgo: (hours) => t("hoursAgo", { count: hours }),
      yesterday: t("yesterday"),
    });
};

export default useFormatDate;
