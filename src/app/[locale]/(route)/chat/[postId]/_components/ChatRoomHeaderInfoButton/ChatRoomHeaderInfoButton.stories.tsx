import { Meta, StoryObj } from "@storybook/nextjs";
import ChatRoomHeaderInfoButton from "./ChatRoomHeaderInfoButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const meta: Meta<typeof ChatRoomHeaderInfoButton> = {
  title: "페이지/채팅 상세 페이지/ChatRoomHeaderInfoButton",
  component: ChatRoomHeaderInfoButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅방 헤더의 정보 버튼 컴포넌트입니다. 클릭 시 메뉴가 열리며 차단/신고하기, 채팅방 나가기 옵션을 제공합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <div className="flex h-[200px] w-[430px] items-start justify-end border border-gray-200 p-4">
            <Story />
          </div>
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatRoomHeaderInfoButton>;

export const Default: Story = {
  render: () => {
    return <ChatRoomHeaderInfoButton roomId={1} />;
  },
};
