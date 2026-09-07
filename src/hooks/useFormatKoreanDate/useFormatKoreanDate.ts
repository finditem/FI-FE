import { useLocale, useTranslations } from "next-intl";
import { formatKoreanDate } from "@/utils/formatDate/formatKoreanDate/formatKoreanDate";
import { parseDateString } from "@/utils/formatDate/parseDateString/parseDateString";

const useFormatKoreanDate = () => {
  const locale = useLocale();
  const t = useTranslations("useFormatKoreanDate");
  const weekdays = t.raw("weekdays") as string[];

  return (isoString: string) => {
    if (locale === "en") {
      const targetDate = parseDateString(isoString);
      if (!targetDate) return "";

      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(targetDate);
    }

    return formatKoreanDate(isoString, weekdays);
  };
};

export default useFormatKoreanDate;
