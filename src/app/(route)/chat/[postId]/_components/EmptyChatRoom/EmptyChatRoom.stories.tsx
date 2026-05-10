import { Meta, StoryObj } from "@storybook/nextjs";
import EmptyChatRoom from "./EmptyChatRoom";

const meta: Meta<typeof EmptyChatRoom> = {
  title: "페이지/채팅 상세 페이지/EmptyChatRoom",
  component: EmptyChatRoom,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅방에 아직 메시지가 없을 때 노출되는 빈 상태 안내입니다. 게시글 유형(분실/발견)에 따라 아이콘과 안내 문구가 달라집니다.",
      },
    },
  },
  argTypes: {
    postMode: {
      control: "radio",
      options: ["lost", "find"],
      description: "분실(lost) / 발견(find)",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[420px] w-[390px] flex-col border border-divider-default bg-flatGray-25">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyChatRoom>;

/** 분실물 채팅 — 발견자에게 안내 */
export const Lost: Story = {
  args: {
    postMode: "lost",
  },
};

/** 발견물 채팅 — 분실자에게 안내 */
export const Find: Story = {
  args: {
    postMode: "find",
  },
};
