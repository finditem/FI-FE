import type { Meta, StoryObj } from "@storybook/nextjs";
import NoticeDetailHeader from "./NoticeDetailHeader";

const BACK_PATH_OPTIONS = ["/find", "/lost", "/notice?tab=notice", "/notice?tab=customer"] as const;

const meta: Meta<typeof NoticeDetailHeader> = {
  title: "페이지/공지사항/NoticeDetailHeader",
  component: NoticeDetailHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: "공지·문의 상세 등에서 이전 목록으로 돌아가기 위한 헤더입니다.",
      },
    },
  },
  argTypes: {
    backPath: {
      control: "select",
      options: [...BACK_PATH_OPTIONS],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "390px", border: "1px solid #E2E2E2" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NoticeDetailHeader>;

export const Default: Story = {
  args: {
    backPath: "/notice?tab=notice",
  },
};

export const ToFind: Story = {
  args: {
    backPath: "/find",
  },
};

export const ToLost: Story = {
  args: {
    backPath: "/lost",
  },
};

export const ToCustomerTab: Story = {
  args: {
    backPath: "/notice?tab=customer",
  },
};
