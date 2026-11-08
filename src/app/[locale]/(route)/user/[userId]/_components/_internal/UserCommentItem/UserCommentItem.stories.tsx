import type { Meta, StoryObj } from "@storybook/nextjs";
import CommentItem from "./UserCommentItem";

type Story = StoryObj<typeof CommentItem>;

const meta: Meta<typeof CommentItem> = {
  title: "페이지/타인 페이지/CommentItem",
  component: CommentItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    data: {
      control: "object",
      description: "댓글 데이터",
    },
  },
  args: {
    data: {
      postId: 1,
      comment: "여기에 댓글 내용이 표기됩니다",
      date: "2025.11.02",
      likes: 5,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
};

export default meta;

export const Default: Story = {};
