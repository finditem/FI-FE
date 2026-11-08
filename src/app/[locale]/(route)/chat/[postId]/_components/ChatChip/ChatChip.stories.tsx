import { Meta, StoryObj } from "@storybook/nextjs";
import ChatChip from "./ChatChip";

const meta: Meta<typeof ChatChip> = {
  title: "페이지/채팅 상세 페이지/ChatChip",
  component: ChatChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅방에서 게시글의 유형을 표시하는 칩 컴포넌트입니다. 발견 또는 분실을 구분하여 표시합니다.",
      },
    },
  },
  argTypes: {
    postMode: {
      control: "radio",
      options: ["find", "lost"],
      description: "게시글 유형 (발견/분실)",
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatChip>;

export const Find: Story = {
  args: {
    postMode: "FOUND",
  },
};

export const Lost: Story = {
  args: {
    postMode: "LOST",
  },
};
