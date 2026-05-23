import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminListItem from "./AdminListItem";

const meta: Meta<typeof AdminListItem> = {
  title: "관리자 공통 컴포넌트/AdminListItem",
  component: AdminListItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "상세 페이지 공통 헤더 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] border">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
  args: {
    data: {
      noticeId: 1,
      title: "text",
      category: "GENERAL",
      pinned: true,
      viewCount: 1,
      likeCount: 1,
      createdAt: "text",
      isNew: true,
      isHot: true,
      thumbnailUrl: "https://picsum.photos/400/300?random=1",
    },
    imageAlt: "text",
    link: "text",
  },
};

export default meta;
type Story = StoryObj<typeof AdminListItem>;

export const Default: Story = {};
export const NoImage: Story = {
  args: {
    data: {
      noticeId: 1,
      title: "text",
      category: "GENERAL",
      pinned: true,
      viewCount: 1,
      likeCount: 1,
      createdAt: "text",
      isNew: true,
      isHot: true,
      thumbnailUrl: "",
    },
    imageAlt: "text",
    link: "text",
  },
};
