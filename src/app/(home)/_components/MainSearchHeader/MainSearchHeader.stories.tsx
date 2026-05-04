import { Meta, StoryObj } from "@storybook/nextjs";
import MainSearchHeader from "./MainSearchHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient();

const meta = {
  title: "페이지/메인/MainSearchHeader",
  component: MainSearchHeader,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
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
} satisfies Meta<typeof MainSearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <MainSearchHeader />,
};
