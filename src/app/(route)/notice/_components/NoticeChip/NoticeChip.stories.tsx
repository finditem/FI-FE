import type { Meta, StoryObj } from "@storybook/nextjs";
import NoticeChip from "./NoticeChip";

const LABEL_OPTIONS = ["습득", "분실", "공지사항", "문의내역"] as const;

const meta: Meta<typeof NoticeChip> = {
  title: "페이지/공지사항 목록/NoticeChip",
  component: NoticeChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "공지 관련 화면 상단에 쓰이는 라벨 칩입니다.",
      },
    },
  },
  argTypes: {
    label: {
      control: "select",
      options: [...LABEL_OPTIONS],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "390px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NoticeChip>;

export const Default: Story = {
  args: {
    label: "공지사항",
  },
};

export const 습득: Story = {
  args: {
    label: "습득",
  },
};

export const 분실: Story = {
  args: {
    label: "분실",
  },
};

export const 문의내역: Story = {
  args: {
    label: "문의내역",
  },
};
