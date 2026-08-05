import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageInquiriesIdContainer from "./MypageInquiriesIdContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypageInquiriesIdContainer> = {
  title: "페이지/마이페이지/1:1 문의 페이지/MypageInquiriesIdContainer",
  component: MypageInquiriesIdContainer,
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
type Story = StoryObj<typeof MypageInquiriesIdContainer>;

export const Default: Story = {
  args: {
    id: 1,
  },
};
