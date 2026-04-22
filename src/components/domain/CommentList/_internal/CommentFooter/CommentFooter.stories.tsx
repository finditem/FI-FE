import type { Meta, StoryObj } from "@storybook/react";
import CommentFooter from "./CommentFooter";

const meta: Meta<typeof CommentFooter> = {
  title: "공통 컴포넌트 도메인/CommentList/_internal/CommentFooter",
  component: CommentFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    setIsReplyFormOpen: () => {},
    onFavoriteComment: () => {},
    queryKey: ["test"],
  },
};

export default meta;

type Story = StoryObj<typeof CommentFooter>;

export const Default: Story = {
  args: {
    footerData: {
      id: 1,
      likeCount: 5,
      isLike: false,
      deleted: false,
    },
    isReply: true,
    isGuest: false,
    isReplyFormOpen: false,
  },
};

export const Liked: Story = {
  args: {
    ...Default.args,
    footerData: {
      id: 1,
      likeCount: 6,
      isLike: true,
      deleted: false,
    },
  },
};

export const ReplyFormOpened: Story = {
  args: {
    ...Default.args,
    isReplyFormOpen: true,
  },
};

export const NotReplyLevel: Story = {
  args: {
    ...Default.args,
    isReply: false,
  },
};

export const DeletedStatus: Story = {
  args: {
    ...Default.args,
    footerData: {
      id: 1,
      likeCount: 0,
      isLike: false,
      deleted: true,
    },
  },
};
