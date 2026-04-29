import type { Meta, StoryObj } from "@storybook/react";
import ActivityFilterSection from "./ActivityFilterSection";

const meta: Meta<typeof ActivityFilterSection> = {
  title: "페이지/마이페이지/내 활동내역 페이지/ActivityFilterSection",
  component: ActivityFilterSection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] border-b border-divider-default bg-white">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      // useSearchParams 등을 내부에서 사용할 경우 가상의 URL 설정
      navigation: {
        pathname: "/activity",
        query: {
          activity: "RUNNING",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFilterSection>;

export const Default: Story = {};

export const ActiveFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          activity: "CLIMBING",
        },
      },
    },
  },
};
