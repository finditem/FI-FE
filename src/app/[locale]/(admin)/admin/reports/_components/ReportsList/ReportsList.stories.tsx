import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import ReportsList from "./ReportsList";

const queryClient = new QueryClient();

const meta: Meta<typeof ReportsList> = {
  title: "관리자 페이지/신고, 문의 관리/ReportsList",
  component: ReportsList,
  tags: ["autodocs"],
  args: {
    activeTab: "report",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "신고/문의 관리 페이지 리스트 컴포넌트",
      },
    },
  },

  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-[390px] border">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ReportsList>;

export const Report: Story = {};

export const Inquiry: Story = {
  args: {
    activeTab: "inquiry",
  },
};
