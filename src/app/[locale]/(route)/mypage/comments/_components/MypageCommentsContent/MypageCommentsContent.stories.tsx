import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageCommentsContent from "./MypageCommentsContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypageCommentsContent> = {
  title: "페이지/마이페이지/내 댓글 페이지/MypageCommentsContent",
  component: MypageCommentsContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/comments",
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
type Story = StoryObj<typeof MypageCommentsContent>;

export const Default: Story = {};

export const WithKeyword: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage/comments",
        query: {
          keyword: "러닝",
        },
      },
    },
  },
};
