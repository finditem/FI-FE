import { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import ReportModal from "./ReportModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof ReportModal> = {
  title: "공통 컴포넌트/ReportModal",
  component: ReportModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Story />
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenPost: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    targetType: "POST",
    targetId: 1,
    invalidateKeys: [["posts"], ["post", 1]],
  },
};

export const OpenChat: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    targetType: "CHAT",
    targetId: 99,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    targetType: "USER",
    targetId: 10,
  },
};
