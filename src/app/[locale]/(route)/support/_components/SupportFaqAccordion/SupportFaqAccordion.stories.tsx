import type { Meta, StoryObj } from "@storybook/nextjs";
import SupportFaqAccordion from "./SupportFaqAccordion";

const meta: Meta<typeof SupportFaqAccordion> = {
  title: "페이지/자주 묻는 질문 페이지/SupportFaqAccordion",
  component: SupportFaqAccordion,
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
type Story = StoryObj<typeof SupportFaqAccordion>;

export const Default: Story = {};

export const AccountTab: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/support",
        query: { tab: "account" },
      },
    },
  },
};

export const UsageTab: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/support",
        query: { tab: "usage" },
      },
    },
  },
};

export const EtcTab: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/support",
        query: { tab: "etc" },
      },
    },
  },
};
