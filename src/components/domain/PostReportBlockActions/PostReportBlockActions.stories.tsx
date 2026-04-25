import type { Meta, StoryObj } from "@storybook/react";
import PostReportBlockActions from "./PostReportBlockActions";

const meta: Meta<typeof PostReportBlockActions> = {
  title: "공통 컴포넌트 도메인/PostReportBlockActions",
  component: PostReportBlockActions,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof PostReportBlockActions>;

export const Default: Story = {
  args: {
    onOpenReport: () => alert("신고 모달 열기"),
    onOpenBlock: () => alert("차단 모달 열기"),
  },
};
