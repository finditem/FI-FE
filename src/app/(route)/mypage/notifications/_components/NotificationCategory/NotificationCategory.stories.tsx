import type { Meta, StoryObj } from "@storybook/nextjs";
import NotificationCategory from "./NotificationCategory";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof NotificationCategory> = {
  title: "페이지/마이페이지/알림 설정 페이지/NotificationCategory",
  component: NotificationCategory,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationCategory>;

export const Open: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <QueryClientProvider client={queryClient}>
        <div className="w-[390px]">
          <NotificationCategory
            isBottomSheetOpen={isOpen}
            setIsBottomSheetOpen={setIsOpen}
            categoryOn={[]}
          />
        </div>
      </QueryClientProvider>
    );
  },
};

export const WithSelectedCategories: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <QueryClientProvider client={queryClient}>
        <div className="w-[390px]">
          <NotificationCategory
            isBottomSheetOpen={isOpen}
            setIsBottomSheetOpen={setIsOpen}
            categoryOn={["RUNNING", "CLIMBING"]}
          />
        </div>
      </QueryClientProvider>
    );
  },
};
