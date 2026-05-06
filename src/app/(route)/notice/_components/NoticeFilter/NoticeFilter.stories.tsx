import type { Meta, StoryObj } from "@storybook/nextjs";
import { Suspense } from "react";
import NoticeFilter from "./NoticeFilter";

const mockSearchUpdateQuery = (key: string, value?: string) => {
  console.log(`searchUpdateQuery called with key: ${key}, value: ${value}`);
};

const meta: Meta<typeof NoticeFilter> = {
  title: "페이지/공지사항 목록 페이지/NoticeFilter",
  component: NoticeFilter,
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
        component: "공지 목록의 정렬(sortType)을 선택하는 필터입니다. URL 쿼리와 연동됩니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <Suspense fallback={null}>
        <div className="inline-block min-w-[200px] rounded-lg border border-divider-default bg-white">
          <Story />
        </div>
      </Suspense>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NoticeFilter>;

export const Default: Story = {
  args: {
    searchUpdateQuery: mockSearchUpdateQuery,
  },
};

export const SortOldest: Story = {
  args: {
    searchUpdateQuery: mockSearchUpdateQuery,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/notice",
        query: {
          sortType: "oldest",
        },
      },
    },
    docs: {
      description: {
        story: "`sortType=oldest`일 때 라벨이 오래된 순으로 보입니다.",
      },
    },
  },
};

export const SortMostViewed: Story = {
  args: {
    searchUpdateQuery: mockSearchUpdateQuery,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/notice",
        query: {
          sortType: "most_viewed",
        },
      },
    },
    docs: {
      description: {
        story: "`sortType=most_viewed`일 때 라벨이 조회 많은 순으로 보입니다.",
      },
    },
  },
};
