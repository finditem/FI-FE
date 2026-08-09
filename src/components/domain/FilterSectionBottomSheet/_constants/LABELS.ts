import { useTranslations } from "next-intl";
import { CategoryType, ItemStatus, PostType } from "@/types";
import { SortFilterValue } from "../_types/types";

export const useFilterLabelMaps = () => {
  const t = useTranslations("FilterOptions");

  const categoryLabelMap: Record<CategoryType, string> = {
    ELECTRONICS: t("category.ELECTRONICS"),
    WALLET: t("category.WALLET"),
    ID_CARD: t("category.ID_CARD"),
    JEWELRY: t("category.JEWELRY"),
    BAG: t("category.BAG"),
    CARD: t("category.CARD"),
    ETC: t("category.ETC"),
  };

  const sortLabelMap: Record<SortFilterValue, string> = {
    LATEST: t("sort.LATEST"),
    OLDEST: t("sort.OLDEST"),
    MOST_FAVORITED: t("sort.MOST_FAVORITED"),
    MOST_VIEWED: t("sort.MOST_VIEWED"),
  };

  const findStatusLabelMap: Record<ItemStatus, string> = {
    SEARCHING: t("findStatus.SEARCHING"),
    FOUND: t("findStatus.FOUND"),
  };

  const statusLabelMap: Record<PostType, string> = {
    LOST: t("status.LOST"),
    FOUND: t("status.FOUND"),
  };

  return {
    categoryDefaultLabel: t("field.category"),
    categoryLabelMap,
    sortLabelMap,
    findStatusDefaultLabel: t("field.findStatus"),
    findStatusLabelMap,
    statusDefaultLabel: t("field.status"),
    statusLabelMap,
  };
};
