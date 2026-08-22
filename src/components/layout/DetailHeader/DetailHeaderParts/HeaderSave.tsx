"use client";

import { useTranslations } from "next-intl";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Save = ({ ariaLabel, ...props }: BaseButtonProps) => {
  const t = useTranslations("DetailHeader");
  const isDisabledStyle = props.disabled ? "text-flatGreen-200" : "text-flatGreen-500";
  return (
    <button {...props} className={isDisabledStyle} aria-label={ariaLabel ?? t("saveAriaLabel")}>
      {t("tempSaveLabel")}
    </button>
  );
};

export default Save;
