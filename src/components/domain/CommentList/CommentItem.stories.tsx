import type { Meta, StoryObj } from "@storybook/react";
import CommentItem from "./CommentItem";

const meta: Meta<typeof CommentItem> = {
  title: "공통 컴포넌트 도메인/CommentList/CommentItem",
  component: CommentItem,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ul className="mx-auto max-w-md p-4">
        <Story />
      </ul>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {
  args: {
    level: "comment",
    data: {
      id: 1,
      content: "댓글 내용입니다.",
      createdAt: new Date().toISOString(),
      deleted: false,
      canDelete: true,
      likeCount: 5,
      isLike: false,
      childCommentCount: 2,
      imageList: [],
      authorResponse: {
        userId: 123,
        nickName: "찾아줄게",
        profileImage: "https://picsum.photos/150",
      },
    } as any,
    postId: 1,
    isGuest: false,
    useFetchReplies: (() => ({
      data: { comments: [], hasNext: false, remainingCount: 0 },
      fetchNextPage: () => {},
    })) as any,
    onDeleteComment: () => alert("댓글 삭제 클릭"),
    onFavoriteComment: () => alert("댓글 좋아요 클릭"),
    onSubmit: () => alert("답글 작성 클릭"),
  },
};

export const Guest: Story = {
  args: {
    ...Default.args,
    isGuest: true,
  },
};
