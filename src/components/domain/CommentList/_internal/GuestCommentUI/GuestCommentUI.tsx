import Link from "next/link";
import { UseQueryResult } from "@tanstack/react-query";
import { GetPostsCommentsResponse, useGetRepliesPostsComments } from "@/api/fetch/comment";
import { Button, Icon } from "@/components/common";
import { CommentItemType } from "@/types";
import CommentItem from "../../CommentItem";

export const MOCK_COMMENT_DATA: CommentItemType[] = [
  {
    id: 1,
    deleted: false,
    depth: 0,
    content: "딤드 제거하신 거 다 보입니다.",
    createdAt: "2026-03-07T10:00:00",
    authorResponse: {
      userId: 1,
      nickName: "console.log",
      profileImage: "/user/default-profile.svg",
    },
    childCommentCount: 0,
    imageList: [],
    likeCount: 3,
    isLike: false,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 2,
    deleted: false,
    depth: 1,
    content: "테스트 중이신 것 같은데… 이 정도는 봐드리겠습니다.",
    createdAt: "2026-03-07T10:05:00",
    authorResponse: {
      userId: 2,
      nickName: "undefined",
      profileImage: "/user/default-profile.svg",
    },
    childCommentCount: 0,
    imageList: [],
    likeCount: 1,
    isLike: false,
    canEdit: false,
    canDelete: false,
  },
];

const mockUseFetchReplies: typeof useGetRepliesPostsComments = () =>
  ({
    data: {
      comments: [],
      hasNext: false,
      nextPage: 0,
      remainingCount: 0,
      totalCommentCount: 0,
    },
    isLoading: false,
    isError: false,
    isSuccess: true,
    isFetching: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    hasNextPage: false,
    hasPreviousPage: false,
    fetchNextPage: async () => ({}) as any,
    fetchPreviousPage: async () => ({}) as any,
    error: null,
    refetch: async () => ({}) as any,
  }) as any;

/**
 * 비회원 전용 댓글 UI
 *
 * @author jikwon
 */

/**
 * 비회원 전용 댓글 UI
 *
 * @author jikwon
 */

const GuestCommentUI = () => {
  return (
    <section className="border-t pt-[18px]">
      <div className="relative">
        <ul aria-hidden="true" inert className="pointer-events-none select-none">
          {MOCK_COMMENT_DATA.map((item) => (
            <CommentItem
              data={item}
              postId={0}
              key={item.id}
              useFetchReplies={mockUseFetchReplies}
              onDeleteComment={() => {}}
              onFavoriteComment={() => {}}
              isGuest={true}
            />
          ))}
        </ul>

        <div
          role="region"
          aria-labelledby="guest-comment-title"
          aria-describedby="guest-comment-description"
          className="absolute inset-0 z-10 space-y-8 bg-white/60 backdrop-blur-sm flex-col-center"
        >
          <div className="space-y-5 flex-col-center">
            <Icon name="NoComments" size={70} />

            <div className="gap-[6px] flex-col-center">
              <h2 id="guest-comment-title" className="text-h2-bold text-layout-header-default">
                로그인하고 댓글을 확인하세요.
              </h2>

              <p
                id="guest-comment-description"
                className="text-body2-regular text-layout-body-default"
              >
                댓글 내용은 로그인 후 확인하실 수 있습니다.
              </p>
            </div>
          </div>

          <Button as={Link} href={"/login"} variant="outlined" className="min-h-11 bg-white">
            로그인 화면으로 이동하기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GuestCommentUI;
