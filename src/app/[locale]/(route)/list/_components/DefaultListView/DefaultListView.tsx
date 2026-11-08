"use client";

import { useTranslations } from "next-intl";
import { useSearchUpdateQueryString } from "@/hooks";
import { DetailHeader, HeaderSearch } from "@/components";
import DefaultListSection from "../DefaultListSection/DefaultListSection";
import DefaultListSearch from "../DefaultListSearch/DefaultListSearch";
import useSearchHeaderTitle from "../../_hooks/useSearchHeaderTitle/useSearchHeaderTitle";

const DefaultListView = () => {
  const t = useTranslations("DefaultListView");
  const searchHeaderTitle = useSearchHeaderTitle();
  const { searchMode, searchUpdateQuery } = useSearchUpdateQueryString();
  const isDefaultMode = searchMode === "default";

  const headerTitle = searchHeaderTitle[searchMode];

  return (
    <div className="h-hf-base">
      <DetailHeader title={headerTitle}>
        {isDefaultMode && (
          <HeaderSearch
            ariaLabel={t("searchAriaLabel")}
            onClick={() => searchUpdateQuery("search", "post")}
          />
        )}
      </DetailHeader>

      <h1 className="sr-only">{headerTitle}</h1>

      {isDefaultMode ? (
        <DefaultListSection searchUpdateQuery={searchUpdateQuery} />
      ) : (
        <DefaultListSearch />
      )}
    </div>
  );
};

export default DefaultListView;
