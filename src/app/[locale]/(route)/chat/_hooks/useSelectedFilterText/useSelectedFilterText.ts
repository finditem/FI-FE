import { useTranslations } from "next-intl";

const useSelectedFilterText = () => {
  const t = useTranslations("ChatFilterOptions");

  return {
    oldest: t("oldestLabel"),
    latest: t("latestLabel"),
    all: t("allSelectedLabel"),
    found: t("foundLabel"),
    lost: t("lostLabel"),
  } as const;
};

export default useSelectedFilterText;
