import { useTranslations } from "next-intl";
import { useSupportTabs } from "../../SupportTab/_internal";
import { FAQ_ITEMS } from "./FAQ_ITEMS";

const useFaqItems = () => {
  const t = useTranslations("SupportFaqAccordion");
  const tabs = useSupportTabs();

  return FAQ_ITEMS.map((item) => ({
    ...item,
    question: t(`question${item.id}`),
    answer: t(`answer${item.id}`),
    categoryLabel: tabs.find((tab) => tab.key === item.category)?.label ?? "",
    link: item.link && { ...item.link, text: t(`linkText${item.id}`) },
  }));
};

export type FaqItemView = ReturnType<typeof useFaqItems>[number];
export default useFaqItems;
