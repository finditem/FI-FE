import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ToastProvider } from "@/providers/ToastProviders";
import MainNaverMap from "./MainNaverMap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof MainNaverMap> = {
  title: "페이지/메인 페이지/MainNaverMap",
  component: MainNaverMap,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        searchParams: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div style={{ width: "100%", height: "480px" }}>
            <Suspense
              fallback={<div className="flex h-full items-center justify-center">지도 로딩…</div>}
            >
              <Story />
            </Suspense>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainNaverMap>;

export const Default: Story = {};
