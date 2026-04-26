import type { Meta, StoryObj } from "@storybook/react";
import ActivityBottomSheet from "./ActivityBottomSheet";
import { useState } from "react";
import { ActivityFilterState } from "../../_types/ActivityFilterType";
import { useActivityFilter } from "../../_hooks/useActivityFilter";
import { ACTIVITY_OPTIONS } from "../../_constants/ACTIVITY_OPTIONS";

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
    const [isOpen, setIsOpen] = useState(true);
    const { filters, setFilters, startDate, endDate, activity } = useActivityFilter();

    return (
      <>
        <ActivityBottomSheet
          title="필터"
          option={ACTIVITY_OPTIONS}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          filters={filters}
          setFilters={setFilters}
        />
      </>
    );
  },
};
