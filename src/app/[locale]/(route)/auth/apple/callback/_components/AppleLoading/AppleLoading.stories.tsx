import type { Meta, StoryObj } from "@storybook/nextjs";
import AppleLoading from "./AppleLoading";

const meta: Meta<typeof AppleLoading> = {
  title: "페이지/애플 로그인 페이지/AppleLoading",
  component: AppleLoading,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppleLoading>;

export const Default: Story = {};
