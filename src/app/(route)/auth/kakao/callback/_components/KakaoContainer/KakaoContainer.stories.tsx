import type { Meta, StoryObj } from "@storybook/nextjs";
import KakaoContainer from "./KakaoContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof KakaoContainer> = {
  title: "페이지/카카오 로그인 페이지/KakaoContainer",
  component: KakaoContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/auth/kakao/callback",
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
type Story = StoryObj<typeof KakaoContainer>;

export const Default: Story = {};
