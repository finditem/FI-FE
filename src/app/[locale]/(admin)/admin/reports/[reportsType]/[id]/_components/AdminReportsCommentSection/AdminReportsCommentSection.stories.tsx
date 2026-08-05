import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminReportsCommentSection from "./AdminReportsCommentSection";
import { ToastProvider } from "@/providers/ToastProviders";

const meta: Meta<typeof AdminReportsCommentSection> = {
  title: "관리자 페이지/신고, 문의 관리/상세페이지/GuestInquiriesDetailView",
  component: AdminReportsCommentSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "신고/문의 댓글 섹션 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="w-[390px] border">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminReportsCommentSection>;

export const Default: Story = {};
