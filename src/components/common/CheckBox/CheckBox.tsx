"use client";
// "use no memo";

import Icon from "../Icon/Icon";
import { InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";

interface CheckBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> {
  id: string;
  label?: string;
  boxSize?: string;
  textStyle?: string;
  iconSize?: string;
  checked: boolean;
}

const CheckBox = ({
  id,
  label,
  boxSize,
  textStyle,
  iconSize,
  checked,
  onChange,
  ...props
}: CheckBoxProps) => {
  const t = useTranslations("CheckBox");

  return (
    <label htmlFor={id} className="flex cursor-pointer items-center">
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <div
        className={cn(
          "relative h-6 w-6 rounded bg-fill-neutral-strong-pressed flex-center",
          checked && "bg-fill-brand-normal-default",
          boxSize
        )}
      >
        <Icon
          name="Check"
          title={checked ? t("checked") : t("unchecked")}
          className={cn(
            "absolute left-1/2 top-1/2 h-2 -translate-x-1/2 -translate-y-1/2 text-neutral-normal-default peer-checked:text-neutral-normal-enteredSelected",
            iconSize
          )}
        />
      </div>
      {label && (
        <span
          className={cn(
            "ml-2 cursor-default select-none text-body1-semibold text-neutral-normal-default peer-checked:text-neutral-normal-enteredSelected",
            textStyle
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default CheckBox;
