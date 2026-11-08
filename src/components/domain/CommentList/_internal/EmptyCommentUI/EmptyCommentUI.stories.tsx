import type { Meta, StoryObj } from "@storybook/nextjs";
import EmptyCommentUI from "./EmptyCommentUI";

const meta = {
  title: "공통 컴포넌트/CommentList/EmptyCommentUI",
  component: EmptyCommentUI,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ul className="w-[380px] border border-[#E5E5E5]">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof EmptyCommentUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Guest: Story = {
  args: {
    isGuest: true,
  },
};
