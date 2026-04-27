"use client";

import { useSearchUpdateQueryString } from "@/hooks";
import { DetailHeader } from "@/components/layout";
import DefaultListSection from "../DefaultListSection/DefaultListSection";
import { SEARCH_HEADER_TITLE } from "../../_constants/SEARCH_HEADER_TITLE";
import { HeaderSearch } from "@/components/layout/DetailHeader/DetailHeaderParts";
import DefaultListSearch from "../DefaultListSearch/DefaultListSearch";

const DefaultListView = () => {
  const { searchMode, searchUpdateQuery } = useSearchUpdateQueryString();
  const isDefaultMode = searchMode === "default";

  return (
    <div className="h-base">
      <DetailHeader title={SEARCH_HEADER_TITLE[searchMode]}>
        {isDefaultMode && (
          <HeaderSearch
            ariaLabel="게시글 검색"
            onClick={() => searchUpdateQuery("search", "post")}
          />
        )}
      </DetailHeader>

      <h1 className="sr-only">{SEARCH_HEADER_TITLE[searchMode]}</h1>

      {isDefaultMode ? (
        <DefaultListSection searchUpdateQuery={searchUpdateQuery} />
      ) : (
        <DefaultListSearch />
      )}
    </div>
  );
};

export default DefaultListView;
