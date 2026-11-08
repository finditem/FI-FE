import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import ListSearch from "./ListSearch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof ListSearch> = {
  title: "페이지/채팅 목록 페이지/ListSearch",
  component: ListSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/chat",
        searchParams: {},
      },
    },
    docs: {
      description: {
        component:
          "채팅 목록 지역 검색 화면에서 시·군·구 입력과 브이월드 자동완성 결과를 보여주는 영역입니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="mx-auto w-full max-w-[430px] border-x border-divider-default bg-white">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListSearch>;

export const Default: Story = {
  render: () => <ListSearch />,
};
