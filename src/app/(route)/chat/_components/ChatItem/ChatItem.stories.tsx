import { Meta, StoryObj } from "@storybook/nextjs";
import ChatItem from "./ChatItem";
import { MOCK_CHAT_ITEM } from "@/mock/data";

const meta: Meta<typeof ChatItem> = {
  title: "페이지/채팅 목록 페이지/ChatItem",
  component: ChatItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅 목록의 개별 채팅 아이템을 표시하는 컴포넌트입니다. 사용자 프로필, 게시글 썸네일, 메시지 미리보기, 읽지 않은 메시지 수를 포함합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[430px] border border-gray-200">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatItem>;

export const Default: Story = {
  render: () => {
    return <ChatItem chatRoom={MOCK_CHAT_ITEM} />;
  },
};
