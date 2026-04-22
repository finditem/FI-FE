import type { Meta, StoryObj } from "@storybook/react";
import CommentMeta from "./CommentMeta";

const meta: Meta<typeof CommentMeta> = {
  title: "공통 컴포넌트 도메인/CommentList/_internal/CommentMeta",
  component: CommentMeta,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onDeleteComment: () => {},
    queryKey: ["test"],
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CommentMeta>;

const defaultData = {
  authorId: "123",
  createdAt: new Date().toISOString(),
  authorName: "사용자닉네임",
  profileImage: "https://picsum.photos/150",
  commentId: 1,
  deleted: false,
  canDelete: true,
};

export const Default: Story = {
  args: {
    data: defaultData,
    isGuest: false,
    isThreadItem: false,
  },
};

export const ThreadItem: Story = {
  args: {
    ...Default.args,
    isThreadItem: true,
  },
};

export const CannotDelete: Story = {
  args: {
    ...Default.args,
    data: {
      ...defaultData,
      canDelete: false,
    },
  },
};

export const Deleted: Story = {
  args: {
    ...Default.args,
    data: {
      ...defaultData,
      deleted: true,
    },
  },
};

export const Guest: Story = {
  args: {
    ...Default.args,
    isGuest: true,
  },
};
