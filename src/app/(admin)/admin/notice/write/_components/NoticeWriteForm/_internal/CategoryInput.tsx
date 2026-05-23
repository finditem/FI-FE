"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { NoticeCategory } from "@/types";
import { NoticeWriteFormValues } from "../../../_types/NoticeWriteType";
import { Icon, RequiredText, CategoryPopup } from "@/components";

const CATEGORY_LABEL: Record<NoticeCategory, string> = {
  IMPORTANT: "중요",
  UPDATE: "업데이트",
  MAINTENANCE: "점검",
  EVENT: "이벤트",
  GENERAL: "일반",
};

const getNoticeCategoryLabel = (category: NoticeCategory): string => CATEGORY_LABEL[category];

const CategoryInput = () => {
  const [categoryPopupOpen, setCategoryPopupOpen] = useState(false);

  const { control, setValue } = useFormContext<NoticeWriteFormValues>();
  const category = useWatch({ control, name: "category" });

  const onSelectCategory = (category: NoticeCategory) => {
    setValue("category", category, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCategoryPopupOpen(false);
  };

  const categoryLabel = category ? getNoticeCategoryLabel(category as NoticeCategory) : "";

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
        mode="notice"
        isOpen={categoryPopupOpen}
        onClose={() => setCategoryPopupOpen(false)}
        defaultSelected={category ? (category as NoticeCategory) : undefined}
        onSelect={(c) => onSelectCategory(c as NoticeCategory)}
      />
    </>
  );
};

export default CategoryInput;
