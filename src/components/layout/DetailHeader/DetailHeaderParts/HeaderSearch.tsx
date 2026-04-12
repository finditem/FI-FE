"use client";

import { Icon } from "@/components/common";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Search = ({ ariaLabel = "검색", ...props }: BaseButtonProps) => {
  return (
    <button {...props} aria-label={ariaLabel}>
      <Icon name="Search" className="text-flatGray-900" />
    </button>
  );
};

export default Search;
