import type { Meta, StoryObj } from "@storybook/react";
import ActivityContent from "./ActivityContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof ActivityContent> = {
  title: "페이지/마이페이지/내 활동내역 페이지/ActivityContent",
  component: ActivityContent,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ActivityContent />
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/activity",
        query: {
          keyword: "러닝",
        },
      },
    },
  },
};
