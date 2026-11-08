import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageCommentsFilterSection from "./MypageCommentsFilterSection";

const meta: Meta<typeof MypageCommentsFilterSection> = {
  title: "페이지/마이페이지/내 댓글 페이지/MypageCommentsFilterSection",
  component: MypageCommentsFilterSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/comments",
        query: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] border-b border-divider-default bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MypageCommentsFilterSection>;

export const Default: Story = {};

export const WithDateFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
      },
    },
  },
};

export const WithSortFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          simpleSort: "OLDEST",
        },
      },
    },
  },
};
