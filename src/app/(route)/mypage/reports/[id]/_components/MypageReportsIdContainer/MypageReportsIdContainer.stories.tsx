import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageReportsIdContainer from "./MypageReportsIdContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypageReportsIdContainer> = {
  title: "페이지/마이페이지/신고 내역 페이지/MypageReportsIdContainer",
  component: MypageReportsIdContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
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
type Story = StoryObj<typeof MypageReportsIdContainer>;

export const Default: Story = {
  args: {
    id: 1,
  },
};
