import { useTranslations } from "next-intl";
import { POST_FILTER_ITEMS, CATEGORY_FILTER_ITEM } from "../../_components/HOME_CONST";

const useFilterItems = () => {
  const t = useTranslations("FilterItems");

  return {
    postFilterItems: POST_FILTER_ITEMS.map((item) => ({ ...item, label: t(item.value) })),
    categoryFilterItem: { ...CATEGORY_FILTER_ITEM, label: t(CATEGORY_FILTER_ITEM.value) },
  };
};

export default useFilterItems;
