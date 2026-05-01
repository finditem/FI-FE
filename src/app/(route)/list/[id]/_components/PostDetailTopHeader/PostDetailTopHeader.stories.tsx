import { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import PostDetailTopHeader from "./PostDetailTopHeader";
import type { PostActionData } from "../../_types/PostActionType";

const createMockQueryClient = (postId: number) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  queryClient.setQueryData(["postMeta", postId], {
    result: {
      title: "홍대입구역 8번 출구 앞에서 검정 지갑 발견",
      summary: "검정색 반지갑을 발견했습니다. 본인 확인 후 전달드릴게요.",
      thumbnailUrl: "https://picsum.photos/400/300?random=2",
      address: "서울특별시 마포구 양화로 160",
      likeCount: 5,
      commentCount: 3,
      viewCount: 128,
    },
  });
  return queryClient;
};

const meta: Meta<typeof PostDetailTopHeader> = {
  title: "페이지/상세 페이지/PostDetailTopHeader",
  component: PostDetailTopHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, { args }) => (
      <QueryClientProvider client={createMockQueryClient(args.postId)}>
        <ToastProvider>
          <div className="w-[390px] border border-gray-200">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultPostData: PostActionData = {
  isMine: false,
  writerId: 1,
  favoriteStatus: false,
  postStatus: "SEARCHING",
};

export const Default: Story = {
  args: {
    postId: 1,
    postData: defaultPostData,
  },
};

export const Favorited: Story = {
  args: {
    postId: 1,
    postData: { ...defaultPostData, favoriteStatus: true },
  },
};

export const IsMine: Story = {
  args: {
    postId: 1,
    postData: { ...defaultPostData, isMine: true },
  },
};
