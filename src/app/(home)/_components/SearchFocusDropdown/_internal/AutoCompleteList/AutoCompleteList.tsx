"use client";

import { Icon } from "@/components/common";
import { useVWorldAddressSearch } from "@/hooks";
import { useMainRecentSearch } from "@/store";
import type { VWorldAddressItem } from "@/types";
import { cn } from "@/utils";
import { highlightText } from "@/utils";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface AutoCompleteListProps {
  searchKeyword: string;
  setFocused: (focused: boolean) => void;
}

const AutoCompleteList = ({ searchKeyword, setFocused }: AutoCompleteListProps) => {
  const router = useRouter();
  const addRecentSearch = useMainRecentSearch((s) => s.addRecentSearch);
  const query = searchKeyword.trim();
  const { data: results = [], isLoading, isFetching } = useVWorldAddressSearch(query);

  const uniqueResults = useMemo(() => {
    const seenAddresses = new Set<string>();

    return results.filter((item) => {
      const address = item.address.road || item.address.parcel;
      if (!address) return false;
      if (seenAddresses.has(address)) return false;
      seenAddresses.add(address);
      return true;
    });
  }, [results]);

  const handleSelect = (item: VWorldAddressItem) => {
    const address = item.address.road || item.address.parcel;
    if (!address) return;
    addRecentSearch(address);
    router.push(`/?search=${encodeURIComponent(address)}`, { scroll: false });
    setFocused(false);
  };

  if (query.length < 2 || (!isLoading && uniqueResults.length === 0)) return null;

  return (
    <ul className={cn(!isFetching && "border-b-[3px] border-labelsVibrant-quaternary")}>
      {uniqueResults.map((item, index, array) => {
        const address = item.address.road || item.address.parcel;
        return (
          <li key={address}>
            <button
              type="button"
              aria-label="자동완성 지역 검색어 클릭"
              onClick={() => handleSelect(item)}
              className={cn(
                "w-full cursor-pointer border-b border-labelsVibrant-quaternary py-4 transition-colors",
                "[&:is(:hover,:focus)]:bg-fill-brand-subtle-default_2",
                index !== array.length - 1 && "hover:border-brand-normal-disabled"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-[32px] w-[32px] flex-shrink-0 rounded-full bg-fill-brand-subtle-default_2 flex-center">
                  <Icon name="Search" size={20} className="text-system-success" />
                </div>
                <p className="truncate text-body1-regular text-labelsVibrant-primary">
                  {highlightText(address, query)}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default AutoCompleteList;
