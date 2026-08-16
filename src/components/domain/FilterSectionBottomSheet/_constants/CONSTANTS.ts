import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const categoryValues = [
  undefined,
  "ELECTRONICS",
  "WALLET",
  "ID_CARD",
  "JEWELRY",
  "BAG",
  "CARD",
  "ETC",
] as const;

export const sortValues = ["LATEST", "OLDEST", "MOST_FAVORITED", "MOST_VIEWED"] as const;

export const findStatusValues = [undefined, "SEARCHING", "FOUND"] as const;

export const statusValues = [undefined, "LOST", "FOUND"] as const;

export const useFilterOptions = () => {
  const t = useTranslations("FilterOptions");

  return useMemo(
    () => ({
      categories: categoryValues.map((value) => ({
        value,
        label: value ? t(`category.${value}`) : t("all"),
      })),
      sort: sortValues.map((value) => ({ value, label: t(`sort.${value}`) })),
      findStatus: findStatusValues.map((value) => ({
        value,
        label: value ? t(`findStatus.${value}`) : t("all"),
      })),
      status: statusValues.map((value) => ({
        value,
        label: value ? t(`status.${value}`) : t("all"),
      })),
    }),
    [t]
  );
};
