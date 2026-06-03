"use client";

import { Icon } from "@/components";
import { cn } from "@/utils";
import { useMainRecentSearch } from "@/store";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import RecentSearchEmpty from "../../../MainSearchHeader/_internal/RecentSearchEmpty/RecentSearchEmpty";
import { handleSearchDropdownRowKeyDown } from "../../../../_utils/searchDropdownListKeyboard";

const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
};

interface LatestListProps {
  setFocused: (focused: boolean) => void;
  dropdownRootRef: RefObject<HTMLElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

const LatestList = ({ setFocused, dropdownRootRef, searchInputRef }: LatestListProps) => {
  const router = useRouter();
  const recentItems = useMainRecentSearch((s) => s.recentItems);
  const addRecentSearch = useMainRecentSearch((s) => s.addRecentSearch);
  const removeRecentSearch = useMainRecentSearch((s) => s.removeRecentSearch);

  const runSearch = (keyword: string) => {
    addRecentSearch(keyword);
    router.push(`/?search=${encodeURIComponent(keyword)}`, { scroll: false });
    setFocused(false);
  };

  if (recentItems.length === 0) return <RecentSearchEmpty />;

  return (
    <ul>
      {recentItems.map((item) => (
        <li key={item.keyword}>
          <div
            data-search-dropdown-item
            role="button"
            tabIndex={0}
            aria-label={`${item.keyword} 검색`}
            onClick={() => runSearch(item.keyword)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                runSearch(item.keyword);
                return;
              }
              handleSearchDropdownRowKeyDown(e, dropdownRootRef, searchInputRef);
            }}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3 border-b border-labelsVibrant-quaternary py-4 transition-colors",
              "[&:is(:hover,:focus)]:bg-fill-neutral-strong-default"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-[32px] w-[32px] flex-shrink-0 rounded-full bg-fill-neutral-strong-default flex-center">
                <Icon name="Clock" size={20} />
              </div>
              <p className="truncate text-body1-regular text-labelsVibrant-primary">
                {item.keyword}
              </p>
            </div>
            <div className="flex items-center gap-[9px]">
              <time
                className="text-body1-regular text-labelsVibrant-primary"
                dateTime={item.searchedAt}
              >
                {formatShortDate(item.searchedAt)}
              </time>
              <button
                type="button"
                aria-label="최근 검색어 삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentSearch(item.keyword);
                }}
              >
                <Icon name="XSecond" size={20} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LatestList;
