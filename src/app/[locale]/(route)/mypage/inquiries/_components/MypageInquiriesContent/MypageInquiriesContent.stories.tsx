import type { Meta, StoryObj } from "@storybook/nextjs";
import MypageInquiriesContent from "./MypageInquiriesContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof MypageInquiriesContent> = {
  title: "페이지/마이페이지/1:1 문의 페이지/MypageInquiriesContent",
  component: MypageInquiriesContent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/mypage/inquiries",
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
type Story = StoryObj<typeof MypageInquiriesContent>;

export const Default: Story = {};

export const FilteredByResolved: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          inquiryStatus: "RESOLVED",
        },
      },
    },
  },
};
