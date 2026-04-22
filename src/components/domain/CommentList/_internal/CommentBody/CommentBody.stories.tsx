import type { Meta, StoryObj } from "@storybook/react";
import CommentBody from "./CommentBody";

const meta: Meta<typeof CommentBody> = {
  title: "공통 컴포넌트 도메인/CommentList/_internal/CommentBody",
  component: CommentBody,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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

type Story = StoryObj<typeof CommentBody>;

export const Default: Story = {
  args: {
    bodyData: {
      content: "댓글 본문 내용입니다. 자유롭게 작성된 텍스트가 표시됩니다.",
      images: [],
    },
  },
};

export const WithImages: Story = {
  args: {
    bodyData: {
      content: "이미지와 함께 작성된 댓글입니다.",
      images: [
        { id: 1, imageUrl: "https://picsum.photos/100?random=1" },
        { id: 2, imageUrl: "https://picsum.photos/100?random=2" },
      ],
    },
  },
};
