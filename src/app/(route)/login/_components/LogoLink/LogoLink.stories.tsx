import type { Meta, StoryObj } from "@storybook/nextjs";
import LogoLink from "./LogoLink";

const meta: Meta<typeof LogoLink> = {
  title: "페이지/로그인/LogoLink",
  component: LogoLink,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof LogoLink>;

export const Default: Story = {};
