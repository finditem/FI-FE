import type { Meta, StoryObj } from "@storybook/react";
import ReplyForm from "./ReplyForm";

const meta: Meta<typeof ReplyForm> = {
  title: "공통 컴포넌트 도메인/CommentList/_internal/ReplyForm",
  component: ReplyForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onSubmit: (content, file) => alert(`제출됨: ${content}, 파일 유무: ${!!file}`),
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReplyForm>;

export const Default: Story = {
  args: {
    isThreadItem: false,
    disabled: false,
    isPending: false,
  },
};

export const ThreadItemLevel: Story = {
  args: {
    isThreadItem: true,
    disabled: false,
    isPending: false,
  },
};

export const Disabled: Story = {
  args: {
    isThreadItem: false,
    disabled: true,
    isPending: false,
  },
};
