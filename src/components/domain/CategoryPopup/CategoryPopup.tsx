"use client";
"use no memo";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Icon, RadioOptionItem } from "@/components/common";
import { PopupLayout } from "@/components/domain";
import { CategoryType, InquiryTargetType, NoticeCategory } from "@/types";
import {
  CATEGORY_OPTIONS,
  CATEGORY_SELECT_ICON_MAP,
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

  // 카테고리 아이콘은 게시글 카테고리에만 있습니다. 공지·문의는 ETC 등 값이 겹쳐도 아이콘을 붙이지 않습니다.
  const getCategoryIcon = (value: string) =>
    mode === "post" ? CATEGORY_SELECT_ICON_MAP[value as CategoryType] : undefined;

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
          {categoryOptions.map((option) => {
            const iconName = getCategoryIcon(option.value);
            const isSelected = selected === option.value;

            return (
              <RadioOptionItem
                key={option.value}
                option={option}
                selected={selected || ""}
                onChange={(value) => setSelected(value as CategoryValueByMode[T])}
                inputName="category"
                trailing={
                  iconName && (
                    <Icon
                      name={iconName}
                      size={24}
                      className={
                        isSelected
                          ? "text-brand-strongUseThis-default"
                          : "text-labelsVibrant-tertiary"
                      }
                    />
                  )
                }
              />
            );
          })}
        </div>
      </section>

      <Button type="button" className="min-h-11" disabled={!selected} onClick={handleApply}>
        {t("apply")}
      </Button>
    </PopupLayout>
  );
};

export default CategoryPopup;
