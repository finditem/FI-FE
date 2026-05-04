import type { Meta, StoryObj } from "@storybook/nextjs";
import type { InfiniteData } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import type { GetNoticeCommentsResponse } from "@/api/fetch/noticeComment/types/GetNoticeComments";
import {
  MOCK_NOTICE_COMMENTS_EMPTY_FIRST_PAGE,
  MOCK_USERS_ME_NOTICE_HEADER_USER,
  createMockNoticeDetailHeaderResponse,
} from "@/mock/data";
import { ToastProvider } from "@/providers/ToastProviders";
import NoticeDetailView from "./NoticeDetailView";

function DetailStoryShell({ id }: { id: number }) {
  const queryClient = useMemo(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
        },
      },
    });

    client.setQueryData(["users-me"], MOCK_USERS_ME_NOTICE_HEADER_USER);
    client.setQueryData(["notice-detail", id], createMockNoticeDetailHeaderResponse(id));
    client.setQueryData<InfiniteData<GetNoticeCommentsResponse>>(["notice-comments", id], {
      pages: [MOCK_NOTICE_COMMENTS_EMPTY_FIRST_PAGE],
      pageParams: [undefined],
    });

    return client;
  }, [id]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex min-h-[480px] w-full max-w-[430px] flex-col border-x border-divider-default bg-white">
          <NoticeDetailView id={id} />
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}

const meta: Meta<typeof NoticeDetailView> = {
  title: "페이지/공지사항 상세/NoticeDetailView",
  component: NoticeDetailView,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/notice/1",
        query: {},
      },
    },
    docs: {
      description: {
        component:
          "공지 상세 본문·댓글 목록·댓글 작성 폼을 묶은 뷰입니다. 스토리는 로그인 사용자 기준으로 `notice-detail`·`users-me`·`notice-comments` 쿼리 캐시를 시드합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoticeDetailView>;

export const Default: Story = {
  render: () => <DetailStoryShell id={1} />,
};
