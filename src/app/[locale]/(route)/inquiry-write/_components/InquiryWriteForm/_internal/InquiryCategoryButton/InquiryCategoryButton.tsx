"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InquiryTargetType } from "@/types";
import { Icon, RequiredText, CategoryPopup } from "@/components";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import useInquiryCategoryOptions from "../../../../_hooks/useInquiryCategoryOptions/useInquiryCategoryOptions";

interface InquiryWriteFormValues {
  inquiryType?: InquiryTargetType;
}

const InquiryCategoryButton = () => {
  const t = useTranslations("InquiryWrite");
  const categoryOptions = useInquiryCategoryOptions();
  const [categoryPopupOpen, setCategoryPopupOpen] = useState(false);
  const { control, setValue } = useFormContext<InquiryWriteFormValues>();
  const category = useWatch({ control, name: "inquiryType" });

  const handleSelectCategory = (selectedCategory: InquiryTargetType) => {
    setValue("inquiryType", selectedCategory, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCategoryPopupOpen(false);
  };

  const categoryLabel = categoryOptions.find((option) => option.value === category)?.label ?? "";

  return (
    <div className="px-5 py-2">
      <button
        className={cn(
          "border-transparent flex w-full items-center rounded-full border px-4 py-3 text-start text-body1-regular bg-fill-neutral-subtle-default focus:border-brand-normal-default focus:outline-none disabled:bg-fill-neutral-subtle-pressed",
          category ? "text-layout-header-default" : "text-layout-body-default"
        )}
        type="button"
        onClick={() => setCategoryPopupOpen(true)}
      >
        {categoryLabel || t("categoryPlaceholder")}
        {!category && <RequiredText />}
        <Icon name="ArrowDown" size={12} className="ml-auto text-neutralInversed-normal-default" />
      </button>

      <CategoryPopup
        isOpen={categoryPopupOpen}
        onClose={() => setCategoryPopupOpen(false)}
        onSelect={(category) => handleSelectCategory(category as InquiryTargetType)}
        mode="inquiry"
        defaultSelected={category}
        options={categoryOptions}
      />
    </div>
  );
};

export default InquiryCategoryButton;
