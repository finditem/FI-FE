import { useTranslations } from "next-intl";
import useChatTranslationUsage, {
  DAILY_TRANSLATION_LIMIT,
} from "../../../../_hooks/useChatTranslationUsage/useChatTranslationUsage";

const TranslationUsageBadge = () => {
  const t = useTranslations("TranslationUsageBadge");
  const usedCount = useChatTranslationUsage((state) => state.usedCount);

  return (
    <div className="flex justify-center py-2">
      <span className="rounded-[100px] bg-fill-neutral-normal-disabled px-3 py-1 text-caption1-semibold text-neutral-normal-disabled">
        {t("usageLabel", { usedCount, limit: DAILY_TRANSLATION_LIMIT })}
      </span>
    </div>
  );
};

export default TranslationUsageBadge;
