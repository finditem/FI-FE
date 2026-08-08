import type { SupportTabKey } from "../../SupportTab/_internal/SUPPORT_TABS";
import type { FaqItem } from "./FAQ_ITEMS";

const TAB_KEY_TO_FAQ_CATEGORY: Record<SupportTabKey, FaqItem["category"]> = {
  all: "전체",
  account: "계정",
  usage: "이용 방법",
  etc: "기타",
};

export const filterFaqItemsByTab = (items: FaqItem[], tab: SupportTabKey): FaqItem[] => {
  const category = TAB_KEY_TO_FAQ_CATEGORY[tab];
  return items.filter((item) => item.category === category);
};
