import { useTranslations } from "next-intl";
import { formatKoreanDate } from "@/utils/formatDate/formatKoreanDate/formatKoreanDate";

const useFormatKoreanDate = () => {
  const t = useTranslations("useFormatKoreanDate");
  const weekdays = t.raw("weekdays") as string[];

  return (isoString: string) => formatKoreanDate(isoString, weekdays);
};

export default useFormatKoreanDate;
