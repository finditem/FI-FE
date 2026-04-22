import type { Meta, StoryObj } from "@storybook/react";
import ReadOnlyCommentItem from "./ReadOnlyCommentItem";

const meta: Meta<typeof ReadOnlyCommentItem> = {
  title: "공통 컴포넌트 도메인/ReadOnlyCommentItem",
  component: ReadOnlyCommentItem,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ul className="mx-auto max-w-md bg-white">
        <Story />
      </ul>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReadOnlyCommentItem>;

export const Default: Story = {
  args: {
    data: {
      userImageUrl: "https://picsum.photos/150",
      userName: "일반사용자",
      content: "읽기 전용 댓글 내용입니다. 삭제나 신고 액션이 없습니다.",
      createdAt: new Date().toISOString(),
      isAdmin: false,
    },
  },
};

export const AdminAppointed: Story = {
  args: {
    data: {
      userImageUrl: "",
      userName: "관리자계정",
      content: "관리자가 작성한 안내 댓글입니다.",
      createdAt: new Date().toISOString(),
      isAdmin: true,
    },
  },
};

export const WithImages: Story = {
  args: {
    data: {
      userImageUrl: "https://picsum.photos/150",
      userName: "사진리뷰어",
      content: "사진이 포함된 읽기 전용 댓글입니다.",
      createdAt: new Date().toISOString(),
      isAdmin: false,
    },
    images: ["https://picsum.photos/100", "https://picsum.photos/100?random=1"],
  },
};
