"use client";

import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

type PublicDataTabType = "lost" | "found";

export const usePublicDataTabQuery = () => {
  const t = useTranslations("PublicDataTabs");
  const PUBLIC_LIST_TABS: { label: string; key: PublicDataTabType }[] = [
    { label: t("lostLabel"), key: "lost" },
    { label: t("foundLabel"), key: "found" },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsConfig = useParams();

  const isSearchPage = pathname.includes("/search");

  const currentTabFromQuery = searchParams.get("type") === "found" ? "found" : "lost";
  const currentTabFromParam = paramsConfig?.type === "found" ? "found" : "lost";

  const activeTab: PublicDataTabType = isSearchPage ? currentTabFromParam : currentTabFromQuery;

  const handleTabChange = (key: PublicDataTabType) => {
    if (isSearchPage) {
      const params = new URLSearchParams(searchParams.toString());
      router.replace(`/public-data/${key}/search?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      params.set("type", key);
      router.replace(`/public-data?${params.toString()}`);
    }
  };

  return {
    activeTab,
    handleTabChange,
    PUBLIC_LIST_TABS,
  };
};
