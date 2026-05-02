import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageInquiriesFilter from "./MypageInquiriesFilter";

const meta: Meta<typeof MypageInquiriesFilter> = {
  title: "페이지/마이페이지/1:1 문의 페이지/MypageInquiriesFilter",
  component: MypageInquiriesFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/inquiries",
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
type Story = StoryObj<typeof MypageInquiriesFilter>;

export const Default: Story = {};

export const FilteredByResolved: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          inquiryStatus: "RESOLVED",
        },
      },
    },
  },
};
