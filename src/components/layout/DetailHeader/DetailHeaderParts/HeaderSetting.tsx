"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Setting = ({ ariaLabel, ...props }: BaseButtonProps) => {
  const t = useTranslations("DetailHeader");
  return (
    <button {...props} aria-label={ariaLabel ?? t("settingAriaLabel")}>
      <Icon name="Setting" />
    </button>
  );
};

export default Setting;
