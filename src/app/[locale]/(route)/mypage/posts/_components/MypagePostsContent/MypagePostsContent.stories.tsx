import type { Meta, StoryObj } from "@storybook/nextjs";
import MypagePostsContent from "./MypagePostsContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypagePostsContent> = {
  title: "페이지/마이페이지/내 게시글 페이지/MypagePostsContent",
  component: MypagePostsContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/posts",
        query: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-[390px]">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MypagePostsContent>;

export const Default: Story = {};

export const WithKeyword: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage/posts",
        query: {
          keyword: "러닝화",
        },
      },
    },
  },
};
