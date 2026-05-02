import type { Meta, StoryObj } from "@storybook/nextjs";
import NotificationSettingList from "./NotificationSettingList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof NotificationSettingList> = {
  title: "페이지/마이페이지/알림 설정 페이지/NotificationSettingList",
  component: NotificationSettingList,
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
        <div className="w-[390px] border border-gray-200">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationSettingList>;

export const Default: Story = {};
