"use client";
"use no memo";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, RadioOptionItem } from "@/components/common";
import { PopupLayout } from "@/components/domain";
import { CategoryType, InquiryTargetType, NoticeCategory } from "@/types";
import {
  CATEGORY_OPTIONS,
  INQUIRY_WRITE_CATEGORY_OPTIONS,
  NOTICE_WRITE_CATEGORY_OPTIONS,
} from "@/constants";

type CategoryPopupMode = "post" | "notice" | "inquiry";
type CategoryValueByMode = {
  post: CategoryType;
  notice: NoticeCategory;
  inquiry: InquiryTargetType;
};

type CategoryOption<T extends string> = {
  value: T;
  label: string;
};

const CATEGORY_OPTIONS_BY_MODE: {
  [K in CategoryPopupMode]: readonly CategoryOption<CategoryValueByMode[K]>[];
} = {
  post: CATEGORY_OPTIONS,
  notice: NOTICE_WRITE_CATEGORY_OPTIONS,
  inquiry: INQUIRY_WRITE_CATEGORY_OPTIONS,
};

interface CategoryPopupProps<T extends CategoryPopupMode = "post"> {
  mode?: T;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: CategoryValueByMode[T]) => void;
  defaultSelected?: CategoryValueByMode[T];
  options?: readonly CategoryOption<CategoryValueByMode[T]>[];
}

const CategoryPopup = <T extends CategoryPopupMode = "post">({
  mode = "post" as T,
  isOpen,
  onClose,
  onSelect,
  defaultSelected,
  options,
}: CategoryPopupProps<T>) => {
  const t = useTranslations("CategoryPopup");
  const [selected, setSelected] = useState<CategoryValueByMode[T]>();
  const categoryOptions = options ?? CATEGORY_OPTIONS_BY_MODE[mode];

  useEffect(() => {
    if (!isOpen) return;
    if (!defaultSelected) return;
    setSelected(defaultSelected);
  }, [defaultSelected, isOpen]);

  const handleApply = () => {
    if (!selected) return;
    onSelect(selected);
  };

  return (
    <PopupLayout isOpen={isOpen} onClose={onClose} className="flex flex-col gap-12 px-5 py-10">
      <section className="flex flex-col gap-8">
        <h2 className="text-center text-h2-medium text-layout-header-default">{t("title")}</h2>

        <div className="flex flex-col gap-[2px]">
          {categoryOptions.map((option) => (
            <RadioOptionItem
              key={option.value}
              option={option}
              selected={selected || ""}
              onChange={(value) => setSelected(value as CategoryValueByMode[T])}
              inputName="category"
            />
          ))}
        </div>
      </section>

      <Button type="button" className="min-h-11" disabled={!selected} onClick={handleApply}>
        {t("apply")}
      </Button>
    </PopupLayout>
  );
};

export default CategoryPopup;
