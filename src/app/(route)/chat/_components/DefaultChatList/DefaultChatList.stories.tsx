import { Meta, StoryObj } from "@storybook/nextjs";
import DefaultChatList from "./DefaultChatList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient();

const meta: Meta<typeof DefaultChatList> = {
  title: "페이지/채팅 페이지/DefaultChatList",
  component: DefaultChatList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅 목록의 기본 뷰를 표시하는 컴포넌트입니다. 검색 입력창, 필터 버튼, 채팅 아이템 목록을 포함합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-[430px] border border-gray-200">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DefaultChatList>;

export const Default: Story = {
  render: () => {
    const searchUpdateQuery = (key: string, value?: string) => {
      console.log(`searchUpdateQuery called: ${key} = ${value}`);
    };

    return <DefaultChatList searchUpdateQuery={searchUpdateQuery} />;
  },
};
