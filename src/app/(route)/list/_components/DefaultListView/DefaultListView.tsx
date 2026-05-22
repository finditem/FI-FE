"use client";

import { useSearchUpdateQueryString } from "@/hooks";
import { DetailHeader, HeaderSearch } from "@/components";
import DefaultListSection from "../DefaultListSection/DefaultListSection";
import DefaultListSearch from "../DefaultListSearch/DefaultListSearch";
import { SEARCH_HEADER_TITLE } from "../LIST_CONST";

const DefaultListView = () => {
  const { searchMode, searchUpdateQuery } = useSearchUpdateQueryString();
  const isDefaultMode = searchMode === "default";

  const headerTitle = SEARCH_HEADER_TITLE[searchMode];

  return (
    <div className="h-hf-base">
      <DetailHeader title={headerTitle}>
        {isDefaultMode && (
          <HeaderSearch
            ariaLabel="게시글 검색"
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
