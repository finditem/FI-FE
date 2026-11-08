import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageReportsContent from "./MypageReportsContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypageReportsContent> = {
  title: "페이지/마이페이지/신고 내역 페이지/MypageReportsContent",
  component: MypageReportsContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/reports",
        query: {},
      },
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
type Story = StoryObj<typeof MypageReportsContent>;

export const Default: Story = {};

export const FilteredByResolved: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          reportStatus: "RESOLVED",
        },
      },
    },
  },
};
