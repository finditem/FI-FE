import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageSearch from "./MypageSearch";

const meta: Meta<typeof MypageSearch> = {
  title: "공통/domain/MypageSearch",
  component: MypageSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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
type Story = StoryObj<typeof MypageSearch>;

export const Default: Story = {
  args: {
    searchMode: "posts",
  },
};

export const WithKeyword: Story = {
  args: {
    searchMode: "posts",
  },
  parameters: {
    nextjs: {
      navigation: {
        searchParams: {
          keyword: "분실물",
        },
      },
    },
  },
};

export const Favorites: Story = {
  args: {
    searchMode: "favorites",
  },
};

export const Comments: Story = {
  args: {
    searchMode: "comments",
  },
};
