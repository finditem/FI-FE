import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPageContainer from "./MyPageContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MyPageContainer> = {
  title: "페이지/마이페이지/MyPageContainer",
  component: MyPageContainer,
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
          <div className="min-h-screen w-[390px] items-center justify-center p-4">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyPageContainer>;

export const Default: Story = {
  args: {
    hasToken: false,
  },
};
