import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageReportsFilter from "./MypageReportsFilter";

const meta: Meta<typeof MypageReportsFilter> = {
  title: "페이지/마이페이지/신고 내역 페이지/MypageReportsFilter",
  component: MypageReportsFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/reports",
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
type Story = StoryObj<typeof MypageReportsFilter>;

export const Default: Story = {};

export const FilteredByResolved: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          reportStatus: "RESOLVED",
        },
      },
    },
  },
};
