import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const useFilterTabs = () => {
  const t = useTranslations("FilterOptions.field");

  return useMemo(
    () =>
      ({
        LIST: [
          { label: t("region"), value: "region" },
          { label: t("category"), value: "category" },
          { label: t("sort"), value: "sort" },
          { label: t("findStatus"), value: "findStatus" },
        ],
        MY_POSTS: [
          { label: t("date"), value: "date" },
          { label: t("status"), value: "status" },
          { label: t("category"), value: "category" },
          { label: t("sort"), value: "sort" },
          { label: t("findStatus"), value: "findStatus" },
        ],
        MY_FAVORITES: [
          { label: t("region"), value: "region" },
          { label: t("status"), value: "status" },
          { label: t("category"), value: "category" },
          { label: t("sort"), value: "sort" },
        ],
        PUBLIC_DATA: [
          { label: t("region"), value: "region" },
          { label: t("category"), value: "category" },
        ],
      }) as const,
    [t]
  );
};
