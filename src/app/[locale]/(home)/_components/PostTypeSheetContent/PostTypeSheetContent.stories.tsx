import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostTypeSheetContent from "./PostTypeSheetContent";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof PostTypeSheetContent> = {
  title: "페이지/메인 페이지/PostTypeSheetContent",
  component: PostTypeSheetContent,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/", searchParams: { feed: "post", "post-type": "lost" } },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-full max-w-[430px] bg-white px-5">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostTypeSheetContent>;

export const Lost: Story = {};

export const Found: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/", searchParams: { feed: "post", "post-type": "find" } },
    },
  },
};

export const AllTypes: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/", searchParams: { feed: "post" } },
    },
  },
};
