import { Meta, StoryObj } from "@storybook/nextjs";
import PostDetail from "./PostDetail";
import { MOCK_POST_DEFAULT_DETAIL } from "@/mock/data";
import { ToastProvider } from "@/providers/ToastProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const meta: Meta<typeof PostDetail> = {
  title: "페이지/상세 페이지/PostDetail",
  component: PostDetail,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <div className="w-[400px] border border-gray-200">
            <Story />
          </div>
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PostDetail>;

export const Single: Story = {
  args: {
    data: MOCK_POST_DEFAULT_DETAIL.result,
  },
};
