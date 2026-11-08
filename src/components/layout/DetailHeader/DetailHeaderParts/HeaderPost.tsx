"use client";

import { useTranslations } from "next-intl";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Post = ({ ariaLabel, ...props }: BaseButtonProps) => {
  const t = useTranslations("DetailHeader");
  const isDisabledStyle = props.disabled
    ? "text-neutralInversed-strong-default text-h2-medium"
    : "text-brand-strongUseThis-default text-h2-bold";

  return (
    <button className={isDisabledStyle} aria-label={ariaLabel ?? t("saveAriaLabel")} {...props}>
      {t("postLabel")}
    </button>
  );
};

export default Post;
