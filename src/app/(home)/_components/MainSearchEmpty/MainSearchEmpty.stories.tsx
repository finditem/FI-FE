import type { Meta, StoryObj } from "@storybook/nextjs";
import MainSearchEmpty from "./MainSearchEmpty";

const meta: Meta<typeof MainSearchEmpty> = {
  title: "페이지/메인/MainSearchEmpty",
  component: MainSearchEmpty,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainSearchEmpty>;

export const Default: Story = {};
