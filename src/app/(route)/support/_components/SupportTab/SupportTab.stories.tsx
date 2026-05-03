import type { Meta, StoryObj } from "@storybook/nextjs";
import SupportTab from "./SupportTab";

const meta: Meta<typeof SupportTab> = {
  title: "페이지/자주 묻는 질문/SupportTab",
  component: SupportTab,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/support",
        query: { tab: "all" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SupportTab>;

export const Default: Story = {};

export const SelectedAccount: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/support",
        query: { tab: "account" },
      },
    },
  },
};

export const SelectedUsage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/support",
        query: { tab: "usage" },
      },
    },
  },
};

export const SelectedEtc: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/support",
        query: { tab: "etc" },
      },
    },
  },
};
