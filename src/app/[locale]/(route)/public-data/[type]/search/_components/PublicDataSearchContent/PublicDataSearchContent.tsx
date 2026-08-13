"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { InputSearch, Tab } from "@/components";
import PublicDataSearchList from "../PublicDataSearchList/PublicDataSearchList";
import { usePublicDataTabQuery } from "@/app/[locale]/(route)/public-data/_hooks/usePublicDataTabQuery/usePublicDataTabQuery";
import PublicDataBeforeSearch from "../PublicDataBeforeSearch/PublicDataBeforeSearch";
import useRecentSearch from "../../_hooks/useRecentSearch/useRecentSearch";

const PublicDataSearchContent = () => {
  const t = useTranslations("PublicDataSearchContent");
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsConfig = useParams();
  const type = paramsConfig.type === "found" ? "found" : "lost";
  const { activeTab, handleTabChange, PUBLIC_LIST_TABS } = usePublicDataTabQuery();
  const params = new URLSearchParams(searchParams.toString());
  const { recentSearches, addSearch, removeSearch } = useRecentSearch();

  const handlePublicDataSearch = (newKeyword: string) => {
    if (newKeyword === params.get("keyword")) return;

    if (!newKeyword) {
      params.delete("keyword");
    } else {
      params.set("keyword", newKeyword);
      addSearch(newKeyword);
    }

    router.replace(`/public-data/${type}/search?${params.toString()}`);
  };

  return (
    <>
      <section aria-label={t("searchAreaAriaLabel")} className="px-5 py-[10px]">
        <InputSearch
          name="search"
          mode="onChange"
          defaultValue={searchParams.get("keyword") || ""}
          placeholder={t("searchPlaceholder")}
          onEnter={handlePublicDataSearch}
        />
      </section>

      {params.get("keyword") && (
        <Tab
          tabs={PUBLIC_LIST_TABS}
          selected={activeTab}
          onValueChange={(key) => handleTabChange(key)}
          className="sticky left-0 top-[56px]"
        />
      )}

      {params.get("keyword") ? (
        <PublicDataSearchList />
      ) : (
        <PublicDataBeforeSearch
          recentSearches={recentSearches}
          removeSearch={removeSearch}
          onSearch={handlePublicDataSearch}
        />
      )}
    </>
  );
};

export default PublicDataSearchContent;
