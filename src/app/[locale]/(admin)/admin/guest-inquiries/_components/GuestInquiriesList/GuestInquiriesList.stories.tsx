import type { Meta, StoryObj } from "@storybook/nextjs";
import GuestInquiriesList from "./GuestInquiriesList";
import { ToastProvider } from "@/providers/ToastProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const meta: Meta<typeof GuestInquiriesList> = {
  title: "관리자 페이지/비회원 문의 관리/GuestInquiriesList",
  component: GuestInquiriesList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "비회원 문의 목록 컴포넌트",
      },
    },
    args: {
      status: "answered",
      answer: "answered",
      keyword: "",
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
type Story = StoryObj<typeof GuestInquiriesList>;

export const Default: Story = {};
