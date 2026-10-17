import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPageMenuSection from "./MyPageMenuSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MyPageMenuSection> = {
  title: "페이지/마이페이지/MyPageMenuSection",
  component: MyPageMenuSection,
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
          <div className="flex min-h-screen w-[390px] flex-col gap-3 bg-layout_2depth p-4">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyPageMenuSection>;

export const LoggedIn: Story = {
  args: { isUserLogin: true },
};

export const Guest: Story = {
  args: { isUserLogin: false },
};
