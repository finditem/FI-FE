"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Share = ({ ariaLabel, ...props }: BaseButtonProps) => {
  const t = useTranslations("DetailHeader");
  return (
    <button {...props} aria-label={ariaLabel ?? t("shareAriaLabel")}>
      <Icon name="Share" />
    </button>
  );
};

export default Share;
