import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import AdminDetailSection from "./AdminDetailSection";

const queryClient = new QueryClient();

const meta: Meta<typeof AdminDetailSection> = {
  title: "관리자 공통 컴포넌트/AdminDetailSection",
  component: AdminDetailSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "상세 페이지 공통 헤더 컴포넌트",
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
  args: {
    type: "inquiry",
    data: {
      inquiryId: 1,
      title: "비회원 문의 제목입니다.",
      content: "문의 내용입니다.",
      inquiryType: "TECHNICAL",
      email: "asd@asd.com",
      createdAt: "2026-01-01T00:00:00",
      status: "RECEIVED",
      answered: true,
      comments: [],
      imageUrls: [],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdminDetailSection>;

export const Default: Story = {};
