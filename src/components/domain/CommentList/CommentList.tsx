import { ViewMoreComment } from "@/components/common";
import {
  DeleteCommentVariables,
  GetPostsCommentsData,
  useGetRepliesPostsComments,
} from "@/api/fetch/comment";
import CommentItem from "./CommentItem";
import { EmptyCommentUI, GuestCommentUI } from "./_internal";
import { formatCappedNumber } from "@/utils";

/**
 * 게시글의 댓글 목록을 렌더링하는 컴포넌트입니다.
 *
 * @remarks
 * - 비로그인 상태(`isLoggedIn`이 false)이면 `GuestCommentUI`를 렌더링합니다.
 * - 댓글이 없으면 `EmptyCommentUI`를 렌더링합니다.
 *
 * @author jikwon
 */

interface CommentListProps {
  /** 게시글 ID */
  postId: number;
  /** 댓글 목록 데이터 */
  comments?: GetPostsCommentsData;
  /** 답글 작성 함수 */
  onSubmit: (content: string, image: File | null, parentId: number) => void | Promise<unknown>;
  /** 답글 작성 중 로딩 상태 */
  isPending: boolean;
  /** 로그인 여부 */
  isLoggedIn?: boolean;
  /** 답글 조회 함수 */
  useFetchReplies: typeof useGetRepliesPostsComments;
  /** 답글 삭제 함수 */
  onDeleteComment: (commentVariables: DeleteCommentVariables) => void;
  /** 답글 좋아요 함수 */
  onFavoriteComment: (commentId: number, isLike: boolean, queryKey: unknown[]) => void;
  /** 댓글 페이지네이션 함수 */
  onCommentLoadMore?: () => void;
}

/**
 * @example
 * ```tsx
 * <CommentList
 *   postId={1}
 *   comments={comments}
 *   onSubmit={handleSubmit}
 *   isPending={false}
 *   isLoggedIn={true}
 *   useFetchReplies={useGetRepliesPostsComments}
 *   onDeleteComment={handleDelete}
 *   onFavoriteComment={handleFavorite}
 * />
 * ```
 */

const CommentList = ({
  postId,
  comments,
  onSubmit,
  isPending,
  isLoggedIn,
  useFetchReplies,
  onDeleteComment,
  onFavoriteComment,
  onCommentLoadMore,
}: CommentListProps) => {
  if (!isLoggedIn) return <GuestCommentUI />;
  if (!comments) return null;

  const hasNext = comments.hasNext;
  const data = comments.comments;
  const isEmpty = data.length === 0;

  return (
    <>
      <header className="w-full border-t border-divider-default px-5">
        <h2 className="mt-[18px] flex items-center gap-1 py-2 text-body1-semibold text-layout-header-default">
          댓글<span>{formatCappedNumber(comments.totalCommentCount, 999)}</span>
        </h2>
      </header>

      {isEmpty && isLoggedIn ? (
        <EmptyCommentUI />
      ) : (
        <ul>
          {data.map((comment) => (
            <CommentItem
              key={comment.id}
              postId={postId}
              data={comment}
              onSubmit={onSubmit}
              isPending={isPending}
              useFetchReplies={useFetchReplies}
              onDeleteComment={onDeleteComment}
              onFavoriteComment={onFavoriteComment}
            />
          ))}
        </ul>
      )}

      {hasNext && <ViewMoreComment count={comments.remainingCount} onClick={onCommentLoadMore} />}
    </>
  );
};

export default CommentList;
