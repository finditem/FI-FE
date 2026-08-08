import type { Meta, StoryObj } from "@storybook/nextjs";
import FloatingInquiryButton from "./FloatingInquiryButton";

const meta: Meta<typeof FloatingInquiryButton> = {
  title: "페이지/자주 묻는 질문 페이지/FloatingInquiryButton",
  component: FloatingInquiryButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingInquiryButton>;

export const Default: Story = {
  render: () => (
    <div className="relative min-h-[480px] w-full max-w-[390px] bg-white">
      <FloatingInquiryButton />
    </div>
  ),
};
