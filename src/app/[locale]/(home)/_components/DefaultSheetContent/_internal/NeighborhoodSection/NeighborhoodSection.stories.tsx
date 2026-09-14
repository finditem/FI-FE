import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import NeighborhoodSection from "./NeighborhoodSection";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof NeighborhoodSection> = {
  title: "페이지/메인 페이지/NeighborhoodSection",
  component: NeighborhoodSection,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-full max-w-[430px] bg-white px-5 py-4">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NeighborhoodSection>;

export const Default: Story = {};
