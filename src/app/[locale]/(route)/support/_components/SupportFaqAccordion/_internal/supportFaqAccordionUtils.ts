import type { SupportTabKey } from "../../SupportTab/_internal/SUPPORT_TABS";
import type { FaqItem } from "./FAQ_ITEMS";

export const getFaqAnchorId = (id: number) => `faq-${id}`;

export const getExpandedIdFromHash = (): number | null => {
  const match = window.location.hash.match(/^#faq-(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
};

export const filterFaqItemsByTab = <T extends FaqItem>(items: T[], tab: SupportTabKey): T[] => {
  return items.filter((item) => item.category === tab);
};
