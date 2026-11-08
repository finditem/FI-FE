import type { Meta, StoryObj } from "@storybook/nextjs";
import Terms from "./Terms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import { DEFAULT_NOTIFICATION_SETTING } from "@/app/[locale]/(route)/mypage/notifications/_constants/DEFAULT_NOTIFICATION_SETTING";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof Terms> = {
  title: "공통/domain/Terms",
  component: Terms,
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
type Story = StoryObj<typeof Terms>;

export const PrivacyPolicy: Story = {
  args: {
    termName: "privacyPolicyAgreed",
  },
};

export const TermsOfService: Story = {
  args: {
    termName: "termsOfServiceAgreed",
  },
};

export const MarketingConsent: Story = {
  args: {
    termName: "marketingConsent",
    pageType: "TERM",
  },
  // 선택 약관은 알림 설정을 조회하는데 스토리북에는 API가 없어 요청이 실패한다.
  // 캐시를 미리 채워 요청 없이 표시한다.
  beforeEach: () => {
    queryClient.setQueryData(["/notifications/settings"], {
      isSuccess: true,
      code: "COMMON200",
      message: "성공",
      result: DEFAULT_NOTIFICATION_SETTING,
    });
  },
};

export const WithButton: Story = {
  args: {
    termName: "privacyPolicyAgreed",
    showButton: true,
    pageType: "SIGN_UP",
  },
};
