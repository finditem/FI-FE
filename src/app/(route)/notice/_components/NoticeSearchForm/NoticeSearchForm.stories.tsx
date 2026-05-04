import type { Meta, StoryObj } from "@storybook/nextjs";
import { Suspense } from "react";
import NoticeSearchForm from "./NoticeSearchForm";

const meta: Meta<typeof NoticeSearchForm> = {
  title: "페이지/공지사항 목록/NoticeSearchForm",
  component: NoticeSearchForm,
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
          "공지 목록 검색 입력입니다. 제출 시 URL의 `keyword` 쿼리를 갱신합니다 (`useSearchUpdateQueryString`).",
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
type Story = StoryObj<typeof NoticeSearchForm>;

export const Default: Story = {};

export const WithKeywordInUrl: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/notice",
        query: {
          keyword: "점검",
        },
      },
    },
    docs: {
      description: {
        story: "주소에 `keyword`가 있으면 입력창에 해당 값이 채워집니다.",
      },
    },
  },
};
