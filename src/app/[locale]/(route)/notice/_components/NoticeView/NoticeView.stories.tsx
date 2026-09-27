import type { Meta, StoryObj } from "@storybook/nextjs";
import type { InfiniteData } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query";
import type { GetNoticesResponse } from "@/api/fetch/notice/types/NoticesType";
import { MOCK_NOTICES_RESPONSE_FIRST_PAGE, MOCK_NOTICES_RESPONSE_LAST_PAGE } from "@/mock/data";
import NoticeView from "./NoticeView";

const NOTICES_QUERY_KEY = ["notices", undefined, undefined, undefined, 10] as const;

function seedNoticesCache(client: QueryClient, page: GetNoticesResponse) {
  client.setQueryData<InfiniteData<GetNoticesResponse>>(NOTICES_QUERY_KEY, {
    pages: [page],
    pageParams: [undefined],
  });
}

function StoryShell({ page }: { page: GetNoticesResponse }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  seedNoticesCache(queryClient, page);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full max-w-[430px] border-x border-divider-default bg-white">
        <NoticeView />
      </div>
    </QueryClientProvider>
  );
}

const meta: Meta<typeof NoticeView> = {
  title: "페이지/공지사항 목록 페이지/NoticeView",
  component: NoticeView,
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
          "공지 목록 무한 스크롤 뷰입니다. `useGetNotices`(Suspense)와 하단 센티널로 다음 페이지를 불러옵니다. 스토리는 쿼리 캐시를 미리 채워 네트워크 없이 표시합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoticeView>;

export const LastPage: Story = {
  render: () => <StoryShell page={MOCK_NOTICES_RESPONSE_LAST_PAGE} />,
  parameters: {
    docs: {
      description: {
        story: "마지막 페이지(`hasNext: false`). 하단 무한 스크롤 센티널이 없습니다.",
      },
    },
  },
};

export const HasNextPage: Story = {
  render: () => <StoryShell page={MOCK_NOTICES_RESPONSE_FIRST_PAGE} />,
  // 센티널이 화면에 보이면 다음 페이지를 요청하는데 스토리북에는 API가 없어 404로 스토리가 깨진다.
  // 이 스토리에 있는 동안만 오프라인으로 두어 요청을 대기 상태로 멈추고, 떠날 때 되돌린다.
  beforeEach: () => {
    onlineManager.setOnline(false);
    return () => onlineManager.setOnline(true);
  },
  parameters: {
    docs: {
      description: {
        story: "다음 페이지가 있을 때(`hasNext: true`). 하단에 로드 트리거용 영역이 보입니다.",
      },
    },
  },
};
