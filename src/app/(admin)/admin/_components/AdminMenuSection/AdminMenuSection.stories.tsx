import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminMenuSection from "./AdminMenuSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient();

const meta: Meta<typeof AdminMenuSection> = {
  title: "관리자 페이지/메인 페이지/AdminMenuSection",
  component: AdminMenuSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "관리자 메뉴 섹션 컴포넌트",
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
type Story = StoryObj<typeof AdminMenuSection>;

export const Default: Story = {};
