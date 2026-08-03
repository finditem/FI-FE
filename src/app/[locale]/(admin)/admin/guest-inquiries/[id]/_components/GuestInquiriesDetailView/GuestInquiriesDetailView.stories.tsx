import type { Meta, StoryObj } from "@storybook/nextjs";
import GuestInquiriesDetailView from "./GuestInquiriesDetailView";
import { ToastProvider } from "@/providers/ToastProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const meta: Meta<typeof GuestInquiriesDetailView> = {
  title: "관리자 페이지/비회원 문의 관리/상세페이지/GuestInquiriesDetailView",
  component: GuestInquiriesDetailView,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "비회원 문의 상세 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <div className="w-[390px] border">
            <Story />
          </div>
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GuestInquiriesDetailView>;

export const Default: Story = {};
