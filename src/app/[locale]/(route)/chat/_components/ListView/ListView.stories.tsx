import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import ListView from "./ListView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof ListView> = {
  title: "페이지/채팅 목록 페이지/ListView",
  component: ListView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/chat",
        searchParams: {},
      },
    },
    docs: {
      description: {
        component:
          "채팅 목록 화면 레이아웃입니다. URL의 `search` 쿼리에 따라 기본 목록(`DefaultChatList`) 또는 지역·게시글 검색 UI(`ListSearch`)를 보여줍니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="mx-auto min-h-[480px] w-full max-w-[430px] border-x border-divider-default bg-white">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListView>;

/** 일반 채팅 목록(필터·리스트). `search` 쿼리 없음 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/chat",
        searchParams: {},
      },
    },
  },
};

/** 지역 선택 검색. 헤더 제목이 「지역 선택」으로 바뀝니다. */
export const RegionSearch: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/chat",
        searchParams: {
          search: "region",
        },
      },
    },
  },
};

/** 게시글 검색 등 `search=post` 진입. 헤더는 「채팅」, 본문은 검색 UI입니다. */
export const PostSearch: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/chat",
        searchParams: {
          search: "post",
        },
      },
    },
  },
};
