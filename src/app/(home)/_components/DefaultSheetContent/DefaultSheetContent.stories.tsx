import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ToastProvider } from "@/providers/ToastProviders";
import DefaultSheetContent from "./DefaultSheetContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof DefaultSheetContent> = {
  title: "페이지/메인/DefaultSheetContent",
  component: DefaultSheetContent,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-full max-w-[430px] overflow-auto bg-white px-5 pb-8 pt-4">
            <Suspense
              fallback={<div className="text-body2-medium text-layout-body-default">로딩 중…</div>}
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
type Story = StoryObj<typeof DefaultSheetContent>;

export const Default: Story = {};
