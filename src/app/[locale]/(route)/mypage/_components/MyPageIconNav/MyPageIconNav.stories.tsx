import type { Meta, StoryObj } from "@storybook/react";
import MyPageIconNav from "./MyPageIconNav";

const meta: Meta<typeof MyPageIconNav> = {
  title: "페이지/마이페이지/MypageIconNav",
  component: MyPageIconNav,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyPageIconNav>;

export const Default: Story = {
  render: () => (
    <div className="w-[375px] bg-white">
      <MyPageIconNav />
    </div>
  ),
};
