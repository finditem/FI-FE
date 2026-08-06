"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useVWorldAddressSearch } from "@/hooks";
import { highlightText } from "@/utils";
import { VWorldAddressItem } from "@/types";

interface RegionSearchViewProps {
  searchQuery: string;
}

const RegionSearchView = ({ searchQuery }: RegionSearchViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: results = [], isLoading } = useVWorldAddressSearch(searchQuery);

  const handleRegionClick = (regionValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", regionValue);
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isEmptyResult = !isLoading && searchQuery.trim().length >= 2 && results.length === 0;

  return (
    <section className="flex flex-col">
      {results.map((item: VWorldAddressItem, index: number) => {
        const address = item.address.road || item.address.parcel;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleRegionClick(address)}
            className="min-h-[60px] w-full border-b border-neutral-normal-default bg-white p-5 text-left text-body2-medium text-neutral-strong-default transition-colors hover:bg-flatGray-25"
          >
            {highlightText(address, searchQuery.trim())}
          </button>
        );
      })}

      {isEmptyResult && (
        <p className="px-5 py-[10px] text-body1-medium text-layout-header-default">
          검색 결과가 없습니다.
        </p>
      )}
    </section>
  );
};

export default RegionSearchView;
