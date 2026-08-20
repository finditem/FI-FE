"use client";

import { TextareaHTMLAttributes } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

interface InquiryTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

const InquiryTextarea = ({ name, ...props }: InquiryTextareaProps) => {
  const t = useTranslations("InquiryWrite");
  const { register, control, setValue } = useFormContext();
  const inputValue = useWatch({ control, name });

  return (
    <div className="px-7">
      <textarea
        className="h-[300px] w-full resize-none text-body1-regular text-layout-header-default placeholder:text-body1-regular placeholder:text-labelsVibrant-tertiary"
        {...register(name)}
        placeholder={t("contentPlaceholder")}
        {...props}
      />
    </div>
  );
};

export default InquiryTextarea;
