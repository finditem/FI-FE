import { Meta, StoryObj } from "@storybook/nextjs";
import ChatRoomHeader from "./ChatRoomHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MOCK_CHAT_ROOM_FOUND, MOCK_CHAT_ROOM_LOST } from "@/mock/data/chat.data";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const meta: Meta<typeof ChatRoomHeader> = {
  title: "페이지/채팅 상세 페이지/ChatRoomHeader",
  component: ChatRoomHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅방 상단에 표시되는 헤더 컴포넌트입니다. 뒤로가기 버튼, 사용자 닉네임, 게시글 정보(썸네일, 칩, 제목, 위치)를 포함합니다.",
      },
    },
  },
  argTypes: {
    chatRoom: {
      control: "object",
      description: "채팅방 정보 (없으면 null 반환)",
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <div className="w-[430px] border border-gray-200">
            <Story />
          </div>
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatRoomHeader>;

export const Found: Story = {
  args: {
    chatRoom: MOCK_CHAT_ROOM_FOUND,
    roomId: MOCK_CHAT_ROOM_FOUND.roomId,
    withdrawn: false,
  },
};

export const Lost: Story = {
  args: {
    chatRoom: MOCK_CHAT_ROOM_LOST,
    roomId: MOCK_CHAT_ROOM_LOST.roomId,
    withdrawn: false,
  },
};

export const OpponentWithdrawn: Story = {
  args: {
    chatRoom: MOCK_CHAT_ROOM_FOUND,
    roomId: MOCK_CHAT_ROOM_FOUND.roomId,
    withdrawn: true,
    currentUserId: 999,
  },
};

export const WithoutThumbnail: Story = {
  args: {
    chatRoom: {
      ...MOCK_CHAT_ROOM_FOUND,
      postInfo: {
        ...MOCK_CHAT_ROOM_FOUND.postInfo,
        thumbnailUrl: "",
      },
    },
    roomId: MOCK_CHAT_ROOM_FOUND.roomId,
    withdrawn: false,
  },
};

export const Undefined: Story = {
  args: {
    chatRoom: undefined,
    roomId: 0,
    withdrawn: false,
  },
};
