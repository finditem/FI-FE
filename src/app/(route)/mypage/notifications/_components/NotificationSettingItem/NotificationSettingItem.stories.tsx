import type { Meta, StoryObj } from "@storybook/nextjs";
import NotificationSettingItem from "./NotificationSettingItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationSetting } from "@/api/fetch/notification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const MOCK_NOTIFICATION_STATUS: NotificationSetting = {
  commentEnabled: true,
  chatEnabled: true,
  inquiryReplyEnabled: true,
  reportResultEnabled: false,
  favoriteEnabled: true,
  noticeEnabled: true,
  categoryEnabled: false,
  enabledCategories: [],
  browserNotificationEnabled: true,
  marketingConsent: false,
  contentPolicyAgreed: true,
  termsOfServiceAgreed: true,
};

const meta: Meta<typeof NotificationSettingItem> = {
  title: "페이지/마이페이지/알림 설정 페이지/NotificationSettingItem",
  component: NotificationSettingItem,
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
        <ul className="w-[390px] border border-gray-200">
          <Story />
        </ul>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationSettingItem>;

export const ToggledOn: Story = {
  args: {
    item: { label: "댓글", value: "commentEnabled" },
    browserNotification: true,
    notificationStatus: MOCK_NOTIFICATION_STATUS,
    isOn: true,
  },
};

export const ToggledOff: Story = {
  args: {
    item: { label: "신고", value: "reportResultEnabled" },
    browserNotification: true,
    notificationStatus: MOCK_NOTIFICATION_STATUS,
    isOn: false,
  },
};

export const BrowserNotificationDisabled: Story = {
  args: {
    item: { label: "댓글", value: "commentEnabled" },
    browserNotification: false,
    notificationStatus: MOCK_NOTIFICATION_STATUS,
    isOn: true,
  },
};

export const CategorySelector: Story = {
  args: {
    item: { label: "카테고리 키워드 선택", value: "enabledCategories" },
    browserNotification: true,
    notificationStatus: MOCK_NOTIFICATION_STATUS,
    isOn: false,
  },
};
