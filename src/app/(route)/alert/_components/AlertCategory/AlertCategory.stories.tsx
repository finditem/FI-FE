import { Meta, StoryObj } from "@storybook/nextjs";
import AlertCategory from "./AlertCategory";

const meta: Meta<typeof AlertCategory> = {
  title: "페이지/알림 페이지/AlertCategory",
  component: AlertCategory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/alert",
        query: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[430px] bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AlertCategory>;

export const Default: Story = {};

export const SelectedChat: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/alert",
        query: { category: "chat" },
      },
    },
  },
};

export const SelectedNotice: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/alert",
        query: { category: "notice" },
      },
    },
  },
};
