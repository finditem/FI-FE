import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import { SnackBarProvider } from "@/providers/SnackBarProviders";
import UserBlockModal from "./UserBlockModal";

const queryClient = new QueryClient();

const meta: Meta<typeof UserBlockModal> = {
  title: "공통 컴포넌트 도메인/UserBlockModal",
  component: UserBlockModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <SnackBarProvider>
            <Story />
          </SnackBarProvider>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof UserBlockModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("모달 닫기"),
    writerId: 123,
  },
};
