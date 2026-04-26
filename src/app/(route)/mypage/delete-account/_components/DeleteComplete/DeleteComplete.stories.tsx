import type { Meta, StoryObj } from "@storybook/nextjs";
import DeleteComplete from "./DeleteComplete";

const meta: Meta<typeof DeleteComplete> = {
  title: "페이지/마이페이지/회원 탈퇴 페이지/DeleteComplete",
  component: DeleteComplete,
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
type Story = StoryObj<typeof DeleteComplete>;

export const Default: Story = {};
