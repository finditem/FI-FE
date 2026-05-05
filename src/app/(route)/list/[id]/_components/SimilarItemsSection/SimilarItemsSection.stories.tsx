import { Suspense } from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SimilarItemsSection from "./SimilarItemsSection";
import { MOCK_SIMILAR_POST_ITEMS } from "@/mock/data";
import type { SimilarDataItem } from "@/api/fetch/post";

const createMockQueryClient = (postId: number, items: SimilarDataItem[]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  queryClient.setQueryData(["similar", postId], { result: items });
  return queryClient;
};

const meta: Meta<typeof SimilarItemsSection> = {
  title: "페이지/상세 페이지/SimilarItemsSection",
  component: SimilarItemsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, { args }) => (
      <QueryClientProvider client={createMockQueryClient(args.postId, [MOCK_SIMILAR_POST_ITEMS])}>
        <Suspense fallback={null}>
          <div className="w-[390px] border border-gray-200">
            <Story />
          </div>
        </Suspense>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    postId: 1,
  },
};

export const WithCustomTitle: Story = {
  args: {
    postId: 1,
    title: "관련 분실물",
  },
};

export const MultipleItems: Story = {
  decorators: [
    (Story, { args }) => (
      <QueryClientProvider
        client={createMockQueryClient(args.postId, [
          MOCK_SIMILAR_POST_ITEMS,
          {
            ...MOCK_SIMILAR_POST_ITEMS,
            postId: 2,
            title: "갤럭시 S24 분실",
            thumbnailImageUrl: "",
          },
          {
            ...MOCK_SIMILAR_POST_ITEMS,
            postId: 3,
            title: "검정 지갑 분실",
            thumbnailImageUrl: "https://picsum.photos/400/300?random=2",
          },
        ])}
      >
        <Suspense fallback={null}>
          <div className="w-[390px] border border-gray-200">
            <Story />
          </div>
        </Suspense>
      </QueryClientProvider>
    ),
  ],
  args: {
    postId: 1,
  },
};

export const Empty: Story = {
  decorators: [
    (Story, { args }) => (
      <QueryClientProvider client={createMockQueryClient(args.postId, [])}>
        <Suspense fallback={null}>
          <div className="flex min-h-[80px] w-[390px] items-center justify-center border border-dashed border-gray-300">
            <p className="text-sm text-gray-400">유사 게시글 없음 (컴포넌트 미표시)</p>
            <Story />
          </div>
        </Suspense>
      </QueryClientProvider>
    ),
  ],
  args: {
    postId: 1,
  },
};
