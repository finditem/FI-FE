import type { RefObject } from "react";
import { AutoCompleteList, LatestList } from "./_internal";

const SearchFocusDropdown = ({
  focused,
  setFocused,
  searchKeyword,
  dropdownRootRef,
  searchInputRef,
}: {
  focused: boolean;
  setFocused: (focused: boolean) => void;
  searchKeyword: string;
  dropdownRootRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
}) => {
  if (!focused) return null;

  return (
    <div ref={dropdownRootRef} className="pt-[77px]" data-search-dropdown-root>
      <AutoCompleteList
        searchKeyword={searchKeyword}
        setFocused={setFocused}
        dropdownRootRef={dropdownRootRef}
        searchInputRef={searchInputRef}
      />
      <LatestList
        setFocused={setFocused}
        dropdownRootRef={dropdownRootRef}
        searchInputRef={searchInputRef}
      />
    </div>
  );
};

export default SearchFocusDropdown;
