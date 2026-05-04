import type { Meta, StoryObj } from "@storybook/nextjs";
import { Suspense } from "react";
import NoticeList from "./NoticeList";
import { MOCK_NOTICE_ITEMS, MOCK_NOTICE_ITEM } from "@/mock/data";

const meta: Meta<typeof NoticeList> = {
  title: "페이지/공지사항 목록/NoticeList",
  component: NoticeList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/notice",
        query: {},
      },
    },
    docs: {
      description: {
        component:
          "공지 목록 아이템을 리스트로 표시합니다. 검색어가 있으면 제목에 하이라이트가 적용됩니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <Suspense fallback={null}>
        <div className="w-full max-w-[430px] border-x border-divider-default bg-white">
          <Story />
        </div>
      </Suspense>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NoticeList>;

export const Default: Story = {
  args: {
    notices: MOCK_NOTICE_ITEMS.slice(0, 4),
  },
};

export const SingleItem: Story = {
  args: {
    notices: [MOCK_NOTICE_ITEM],
  },
};

export const Empty: Story = {
  args: {
    notices: [],
  },
};

export const WithSearchKeyword: Story = {
  args: {
    notices: MOCK_NOTICE_ITEMS.slice(0, 3),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/notice",
        query: {
          keyword: "분실",
        },
      },
    },
    docs: {
      description: {
        story: "`keyword` 쿼리가 있을 때 제목에서 해당 문자열이 강조 표시됩니다.",
      },
    },
  },
};

export const WithThumbnail: Story = {
  args: {
    notices: [
      {
        ...MOCK_NOTICE_ITEM,
        noticeId: 50,
        title: "썸네일이 있는 공지",
        thumbnailUrl: "https://picsum.photos/seed/notice-thumb/180/180",
      },
    ],
  },
};
