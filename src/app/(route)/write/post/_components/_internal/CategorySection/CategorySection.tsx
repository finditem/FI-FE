"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CategoryType, NoticeCategory } from "@/types";
import { getItemCategoryLabel } from "@/utils";
import { Icon, RequiredText, CategoryPopup } from "@/components";
import { PostWriteFormValues } from "../../../_types/PostWriteType";

const CategorySection = () => {
  const [categoryPopupOpen, setCategoryPopupOpen] = useState(false);

  const { control, setValue } = useFormContext<PostWriteFormValues>();
  const category = useWatch({ control, name: "category" });

  const onSelectCategory = (category: CategoryType | NoticeCategory) => {
    setValue("category", category as CategoryType, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCategoryPopupOpen(false);
  };

  const categoryLabel = category ? getItemCategoryLabel(category) : "";

  return (
    <>
      <section
        onClick={() => setCategoryPopupOpen(true)}
        className="flex cursor-pointer items-center justify-between border-b border-flatGray-50 px-5 py-6"
      >
        <span className="text-body1-medium text-neutral-normal-default placeholder:text-neutral-normal-placeholder">
          {categoryLabel || "카테고리를 선택해 주세요."} {!category && <RequiredText />}
        </span>
        <button type="button" aria-label="카테고리 선택" className="size-6">
          <Icon name="ArrowDown" size={24} />
        </button>
      </section>

      <CategoryPopup
        isOpen={categoryPopupOpen}
        onClose={() => setCategoryPopupOpen(false)}
        onSelect={(category) => onSelectCategory(category as CategoryType)}
        defaultSelected={category || undefined}
      />
    </>
  );
};

export default CategorySection;
