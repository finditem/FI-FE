"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Search = ({ ariaLabel, ...props }: BaseButtonProps) => {
  const t = useTranslations("DetailHeader");
  return (
    <button {...props} aria-label={ariaLabel ?? t("searchAriaLabel")}>
      <Icon name="Search" className="text-flatGray-900" />
    </button>
  );
};

export default Search;
