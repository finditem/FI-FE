import { Meta, StoryObj } from "@storybook/nextjs";
import TabContents from "./TabContents";
import { MOCK_USER_PROFILE_DATA_BY_COMMENTS, MOCK_USER_PROFILE_DATA_BY_POSTS } from "@/mock/data";

const meta: Meta<typeof TabContents> = {
  title: "페이지/타인 페이지/TabContents",
  component: TabContents,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    selectedTab: "posts",
    isLoading: false,
    data: undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Post: Story = {
  args: {
    selectedTab: "posts",
    isLoading: false,
    data: MOCK_USER_PROFILE_DATA_BY_POSTS.list,
  },
};

export const Comment: Story = {
  args: {
    selectedTab: "comments",
    isLoading: false,
    data: MOCK_USER_PROFILE_DATA_BY_COMMENTS.list,
  },
};

export const Favorite: Story = {
  args: {
    selectedTab: "favorites",
    isLoading: false,
    data: MOCK_USER_PROFILE_DATA_BY_POSTS.list,
  },
};
