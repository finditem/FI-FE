import type { Meta, StoryObj } from "@storybook/nextjs";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useMemo } from "react";

import {
  MOCK_USERS_ME_NOTICE_HEADER_ADMIN,
  MOCK_USERS_ME_NOTICE_HEADER_USER,
  createMockNoticeDetailHeaderResponse,
} from "@/mock/data";

import NoticeDetailHeader from "./NoticeDetailHeader";

function HeaderStoryShell({ id, role }: { id: number; role: "ADMIN" | "USER" }) {
  const queryClient = useMemo(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,

          staleTime: Infinity,
        },
      },
    });

    client.setQueryData(
      ["users-me"],

      role === "ADMIN" ? MOCK_USERS_ME_NOTICE_HEADER_ADMIN : MOCK_USERS_ME_NOTICE_HEADER_USER
    );

    client.setQueryData(["notice-detail", id], createMockNoticeDetailHeaderResponse(id));

    return client;
  }, [id, role]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-[120px] w-full max-w-[430px] bg-white">
        <NoticeDetailHeader id={id} />
      </div>
    </QueryClientProvider>
  );
}

const meta: Meta<typeof NoticeDetailHeader> = {
  title: "페이지/공지사항 상세/NoticeDetailHeader",

  component: NoticeDetailHeader,

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
          "공지 상세 상단 헤더입니다. 공유·(관리자) 수정·삭제 메뉴와 모달을 포함합니다. 스토리는 `users-me`·`notice-detail` 쿼리 캐시를 미리 채웁니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NoticeDetailHeader>;

export const VisitorOrMember: Story = {
  render: () => <HeaderStoryShell id={1} role="USER" />,

  parameters: {
    docs: {
      description: {
        story: "일반 사용자: 공유 버튼만 노출됩니다.",
      },
    },
  },
};

export const Admin: Story = {
  render: () => <HeaderStoryShell id={1} role="ADMIN" />,

  parameters: {
    docs: {
      description: {
        story: "관리자: 공유와 더보기(케밥) 메뉴가 노출됩니다.",
      },
    },
  },
};
