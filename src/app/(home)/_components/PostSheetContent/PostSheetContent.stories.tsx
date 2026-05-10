import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ToastProvider } from "@/providers/ToastProviders";
import PostSheetContent from "./PostSheetContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof PostSheetContent> = {
  title: "페이지/메인 페이지/PostSheetContent",
  component: PostSheetContent,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-[320px] w-full max-w-[430px] bg-white px-5">
            <Suspense fallback={<div>로딩…</div>}>
              <Story />
            </Suspense>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostSheetContent>;

export const ShortKeyword: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        searchParams: {
          search: "역",
        },
      },
    },
  },
};

export const Searching: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        searchParams: {
          search: "서울특별시 마포구 테헤란로",
        },
      },
    },
  },
};
