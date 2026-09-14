import { useTranslations } from "next-intl";
import useGetChatTranslationUsage from "@/api/fetch/chatMessage/api/useGetChatTranslationUsage";

const FALLBACK_DAILY_LIMIT = 20;

const TranslationUsageBadge = () => {
  const t = useTranslations("TranslationUsageBadge");
  const { data: usage } = useGetChatTranslationUsage();
  const usedCount = usage?.usedCount ?? 0;
  const limit = usage?.limit ?? FALLBACK_DAILY_LIMIT;

  return (
    <div className="flex justify-center py-2">
      <span className="rounded-[100px] px-3 py-1 text-caption1-semibold text-neutral-normal-disabled bg-fill-neutral-normal-disabled">
        {t("usageLabel", { usedCount, limit })}
      </span>
    </div>
  );
};

export default TranslationUsageBadge;
