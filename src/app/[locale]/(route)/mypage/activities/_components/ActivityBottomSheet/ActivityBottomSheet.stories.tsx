import type { Meta, StoryObj } from "@storybook/react";
import ActivityBottomSheet from "./ActivityBottomSheet";
import { useState } from "react";
import { useActivityFilter } from "../../_hooks/useActivityFilter";
import { useActivityOptions } from "../../_hooks/useActivityOptions/useActivityOptions";
import { useTranslations } from "next-intl";

const meta: Meta<typeof ActivityBottomSheet> = {
  title: "페이지/마이페이지/내 활동내역 페이지/ActivityBottomSheet",
  component: ActivityBottomSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityBottomSheet>;

export const Default: Story = {
  render: (args) => {
    const t = useTranslations("ActivityFilterSection");
    const activityOptions = useActivityOptions();
    const [isOpen, setIsOpen] = useState(true);
    const { filters, setFilters, startDate, endDate, activity } = useActivityFilter();

    return (
      <>
        <ActivityBottomSheet
          title={t("bottomSheetTitle")}
          option={activityOptions}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          filters={filters}
          setFilters={setFilters}
        />
      </>
    );
  },
};
