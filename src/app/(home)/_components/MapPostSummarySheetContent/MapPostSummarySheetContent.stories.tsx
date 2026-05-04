import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ToastProvider } from "@/providers/ToastProviders";
import MapPostSummarySheetContent from "./MapPostSummarySheetContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof MapPostSummarySheetContent> = {
  title: "페이지/메인/MapPostSummarySheetContent",
  component: MapPostSummarySheetContent,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-[280px] w-full max-w-[430px] bg-white px-5">
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
type Story = StoryObj<typeof MapPostSummarySheetContent>;

export const Loading: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        searchParams: {
          "marker-id": "1",
        },
      },
    },
  },
};
