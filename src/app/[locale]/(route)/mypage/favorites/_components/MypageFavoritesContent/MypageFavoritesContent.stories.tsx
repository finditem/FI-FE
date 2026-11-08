import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageFavoritesContent from "./MypageFavoritesContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypageFavoritesContent> = {
  title: "페이지/마이페이지/즐겨찾기 페이지/MypageFavoritesContent",
  component: MypageFavoritesContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/favorites",
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
type Story = StoryObj<typeof MypageFavoritesContent>;

export const Default: Story = {};

export const WithKeyword: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage/favorites",
        query: {
          keyword: "러닝",
        },
      },
    },
  },
};
