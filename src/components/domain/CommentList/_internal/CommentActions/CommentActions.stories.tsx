import type { Meta, StoryObj } from "@storybook/react";
import CommentActions from "./CommentActions";

const meta: Meta<typeof CommentActions> = {
  title: "공통 컴포넌트 도메인/CommentList/_internal/CommentActions",
  component: CommentActions,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    setViewReply: () => {},
    setIsReplyFormOpen: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof CommentActions>;

export const Default: Story = {
  args: {
    isThreadItem: false,
    viewReply: false,
    isReplyFormOpen: false,
    isGuest: false,
    replyCount: 3,
  },
};

export const ReplyOpened: Story = {
  args: {
    ...Default.args,
    viewReply: true,
  },
};

export const FormOpened: Story = {
  args: {
    ...Default.args,
    isReplyFormOpen: true,
  },
};

export const GuestState: Story = {
  args: {
    ...Default.args,
    isGuest: true,
  },
};

// 아무것도 렌더링되지 않아야 함
export const ThreadItem: Story = {
  args: {
    ...Default.args,
    isThreadItem: true,
  },
};
