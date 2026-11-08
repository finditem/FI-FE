"use client";

import { PopupLayout, Button, Filter } from "@/components";
import { Dispatch, SetStateAction, useState } from "react";
import { CategoryType } from "@/types";
import { CATEGORY_OPTIONS } from "@/constants";
import { usePutNotificationSetting } from "@/api/fetch/notification";
import { useTranslations } from "next-intl";

interface NotificationCategoryProps {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: Dispatch<SetStateAction<boolean>>;
  categoryOn: CategoryType[];
}

const NotificationCategory = ({
  isBottomSheetOpen,
  setIsBottomSheetOpen,
  categoryOn,
}: NotificationCategoryProps) => {
  const t = useTranslations("NotificationCategory");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType[]>(categoryOn);
  const { mutate: notificationMutate, isPending } = usePutNotificationSetting();

  const handleToClick = () => {
    notificationMutate({ enabledCategories: selectedCategory });
    setIsBottomSheetOpen(false);
  };

  return (
    <PopupLayout
      isOpen={isBottomSheetOpen}
      onClose={() => setIsBottomSheetOpen(false)}
      className="flex px-5 py-10 flex-col-center"
    >
      <div className="mb-8">
        <h2 className="text-h2-medium text-layout-header-default">{t("title")}</h2>
      </div>

      <div className="mb-12 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((item) => (
          <Filter
            key={item.value}
            ariaLabel={t(`categories.${item.value}`)}
            onSelected={selectedCategory.includes(item.value)}
            onClick={() =>
              setSelectedCategory((prev) =>
                prev.includes(item.value)
                  ? prev.filter((v) => v !== item.value)
                  : [...prev, item.value]
              )
            }
          >
            {t(`categories.${item.value}`)}
          </Filter>
        ))}
      </div>

      <Button className="w-full" onClick={() => handleToClick()} disabled={isPending}>
        {t("apply")}
      </Button>
    </PopupLayout>
  );
};

export default NotificationCategory;
