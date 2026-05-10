import { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { NotificationListItem } from "@/api/fetch/notification";
import { MOCK_ALERT_NOTIFICATION_ITEM } from "@/mock/data/alert.data";
import AlertView from "./AlertView";

const createAlertListQueryClient = (items: NotificationListItem[]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  queryClient.setQueryData(["notificationList", "all"], {
    pageParams: [undefined],
    pages: [
      {
        isSuccess: true,
        code: "COMMON200",
        message: "성공",
        result: {
          content: items,
          nextCursor: 0,
          hasNext: false,
        },
      },
    ],
  });

  return queryClient;
};

const meta: Meta<typeof AlertView> = {
  title: "페이지/알림 페이지/AlertView",
  component: AlertView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/alert",
        query: {},
      },
    },
  },
  args: {
    isDeleteMode: false,
    setIsDeleteMode: () => {},
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={createAlertListQueryClient([MOCK_ALERT_NOTIFICATION_ITEM])}>
        <div className="max-w-[430px] bg-white">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AlertView>;

export const Default: Story = {};

export const DeleteMode: Story = {
  args: {
    isDeleteMode: true,
  },
};

export const EmptyNotifications: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={createAlertListQueryClient([])}>
        <div className="max-w-[430px] bg-white">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};
