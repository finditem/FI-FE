import type { Meta, StoryObj } from "@storybook/nextjs";
import HomeFilterSection from "./HomeFilterSection";

const meta: Meta<typeof HomeFilterSection> = {
  title: "페이지/메인 페이지/HomeFilterSection",
  component: HomeFilterSection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] bg-white px-5">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        searchParams: {},
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HomeFilterSection>;

export const Default: Story = {};

export const LostSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
        searchParams: {
          "post-type": "lost",
        },
      },
    },
  },
};

export const WithCategoryElectronics: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
        searchParams: {
          "post-type": "find",
          category: "electronics",
        },
      },
    },
  },
};

export const Hidden: Story = {
  args: {
    isHidden: true,
  },
};
