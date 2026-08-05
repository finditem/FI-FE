import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminReportsItem from "./AdminReportsItem";

const meta: Meta<typeof AdminReportsItem> = {
  title: "관리자 공통 컴포넌트/AdminReportsItem",
  component: AdminReportsItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "관리자 신고/문의 리스트 아이템 공통 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] border">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
  args: {
    data: {
      href: "text",
      title: "text",
      content: "text",
      nickname: "text",
      createdAt: "text",
      processStatus: { label: "text", className: "text-red-500" },
      answerStatus: { label: "text", className: "text-blue-500" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdminReportsItem>;

export const Default: Story = {};
