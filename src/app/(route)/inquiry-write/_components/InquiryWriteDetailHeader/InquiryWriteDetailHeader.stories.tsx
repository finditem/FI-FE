import type { Meta, StoryObj } from "@storybook/nextjs";
import InquiryWriteDetailHeader from "./InquiryWriteDetailHeader";

const meta: Meta<typeof InquiryWriteDetailHeader> = {
  title: "페이지/1:1 문의 작성 페이지/InquiryWriteDetailHeader",
  component: InquiryWriteDetailHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[120px] w-full max-w-[764px] overflow-hidden border border-divider-default bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InquiryWriteDetailHeader>;

export const Default: Story = {
  args: {
    isDisabled: false,
    onSubmit: () => undefined,
  },
};

export const SubmitDisabled: Story = {
  args: {
    isDisabled: true,
    onSubmit: () => undefined,
  },
};
