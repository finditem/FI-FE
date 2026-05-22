"use client";

import { PopupLayout, Button, Filter } from "@/components";
import { Dispatch, SetStateAction, useState } from "react";
import { CategoryType } from "@/types";
import usePutNotificationSetting from "@/api/fetch/notification/api/usePutNotificationSetting";
import { CATEGORY_OPTIONS } from "@/constants";

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
        <h2 className="text-h2-medium text-layout-header-default">카테고리 키워드</h2>
      </div>

      <div className="mb-12 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((item) => (
          <Filter
            key={item.value}
            ariaLabel={item.label}
            onSelected={selectedCategory.includes(item.value)}
            onClick={() =>
              setSelectedCategory((prev) =>
                prev.includes(item.value)
                  ? prev.filter((v) => v !== item.value)
                  : [...prev, item.value]
              )
            }
          >
            {item.label}
          </Filter>
        ))}
      </div>

      <Button className="w-full" onClick={() => handleToClick()} disabled={isPending}>
        적용하기
      </Button>
    </PopupLayout>
  );
};

export default NotificationCategory;
