"use client";

import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { PUBLIC_LIST_TAB_KEYS } from "../../_components/PUBLIC_DATA_CONST";

type PublicDataTabType = (typeof PUBLIC_LIST_TAB_KEYS)[number];

export const usePublicDataTabQuery = () => {
  const t = useTranslations("PublicDataTabs");
  const tabs = PUBLIC_LIST_TAB_KEYS.map((key) => ({ label: t(`${key}Label`), key }));
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
    tabs,
  };
};
