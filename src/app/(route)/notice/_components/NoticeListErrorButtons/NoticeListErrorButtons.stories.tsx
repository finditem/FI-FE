import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NoticeListErrorButtons from "./NoticeListErrorButtons";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof NoticeListErrorButtons> = {
  title: "페이지/공지사항 목록/NoticeListErrorButtons",
  component: NoticeListErrorButtons,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component:
          "공지 목록을 불러오지 못했을 때 표시되는 액션입니다. 목록 쿼리를 다시 요청하거나 고객센터 문의 페이지로 이동합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="rounded-lg border border-divider-default bg-white p-6">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NoticeListErrorButtons>;

export const Default: Story = {};
