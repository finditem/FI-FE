"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

type PublicDataTabType = "lost" | "found";

const PUBLIC_LIST_TABS: { label: string; key: PublicDataTabType }[] = [
  { label: "분실", key: "lost" },
  { label: "습득", key: "found" },
];

export const usePublicDataTabQuery = () => {
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
