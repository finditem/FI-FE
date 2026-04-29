"use client";

import { useState } from "react";
import { DeleteCommentVariables, useGetRepliesPostsComments } from "@/api/fetch/comment";
import { Icon, ViewMoreComment } from "@/components/common";
import { cn } from "@/utils";
import { CommentItemType } from "@/types";
import { CommentBody, CommentMeta, CommentActions, CommentFooter, ReplyForm } from "./_internal";

/**
 * 댓글 및 답글을 렌더링하는 개별 댓글 아이템 컴포넌트입니다.
 *
 * @remarks
 * - 댓글 트리 구조를 재귀적으로 렌더링합니다.
 * - `onSubmit`, `useFetchReplies` 등 일부 props는 답글 기능을 처리하기 위한 것입니다.
 *
 * @author jikwon
 */

/** 댓글 레벨 */
type CommentCardLevel = "comment" | "reply" | "nestedReply";

interface CommentCardProps {
  /** 추가 스타일 */
  className?: string;
  /** 댓글 데이터 */
  data: CommentItemType;
  /** 게시글 ID */
  postId: number;
  /** 답글 작성 함수 */
  onSubmit?: (content: string, image: File | null, parentId: number) => void | Promise<unknown>;
  /** 답글 작성 중 로딩 상태 */
  isPending?: boolean;
  /** 답글 목록 조회 함수 */
  useFetchReplies: typeof useGetRepliesPostsComments;
  /** 답글 삭제 함수 */
  onDeleteComment: (commentVariables: DeleteCommentVariables) => void;
  /** 답글 좋아요 함수 */
  onFavoriteComment: (commentId: number, isLike: boolean, queryKey: unknown[]) => void;
  /** 댓글 레벨, 재귀 구조 전용 */
  level?: CommentCardLevel;
  /** 답글 자동 열림 여부, 재귀 구조 전용 */
  autoOpenReplies?: boolean;
  /** 부모 쿼리 키, 재귀 구조 전용 */
  parentQueryKey?: unknown[];
  /** 비회원 여부, Empty UI 전용 */
  isGuest?: boolean;
}

/**
 * @example
 * ```tsx
 * <CommentItem
 *   data={comment}
 *   postId={1}
 *   useFetchReplies={useGetRepliesPostsComments}
 *   onDeleteComment={handleDelete}
 *   onFavoriteComment={handleFavorite}
 * />
 * ```
 */

const CommentItem = ({
  level = "comment",
  className,
  data,
  postId,
  onSubmit,
  isPending,
  autoOpenReplies = false,
  useFetchReplies,
  isGuest = false,
  parentQueryKey,
  onDeleteComment,
  onFavoriteComment,
}: CommentCardProps) => {
  const isTopLevelComment = level === "comment";
  const isReply = level === "reply";
  const isNestedReply = level === "nestedReply";
  const isThreadItem = isReply || isNestedReply;

  const [viewReply, setViewReply] = useState(false);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

  const shouldFetchReplies = (isTopLevelComment && viewReply) || (isReply && autoOpenReplies);

  const { data: replyCommentData, fetchNextPage } = useFetchReplies({
    commentId: data.id,
    enabled: !isGuest && shouldFetchReplies,
  });

  const handleReplySubmit = async (content: string, image: File | null) => {
    if (!onSubmit) return;

    try {
      await onSubmit(content, image, data.id);
      setViewReply(true);
      setIsReplyFormOpen(false);
    } catch (e) {
      // no-op
    }
  };

  const authorId = data.authorResponse ? String(data.authorResponse.userId) : "";
  const authorName = data.authorResponse ? data.authorResponse.nickName : "";
  const profileImage = data.authorResponse ? data.authorResponse.profileImage : "";

  const replyComments = replyCommentData?.comments ?? [];
  const isRepliesVisible = shouldFetchReplies;
  const hasReplyComments = isRepliesVisible && replyComments.length > 0;

  const itemQueryKey = parentQueryKey ?? ["post-comments", postId];
  const childrenQueryKey = ["replies-post-comments", data.id, 10];

  return (
    <li className={cn("my-[18px]", !isNestedReply && "px-5", className)}>
      <div className="flex">
        {isNestedReply && (
          <Icon name="CommentReplyIcon" size={24} className="text-border-divider-default" />
        )}

        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex flex-col gap-3">
              <CommentMeta
                data={{
                  authorId,
                  createdAt: data.createdAt,
                  authorName,
                  profileImage,
                  commentId: data.id,
                  deleted: data.deleted,
                  canDelete: data.canDelete,
                }}
                isGuest={isGuest}
                isThreadItem={isThreadItem}
                queryKey={itemQueryKey}
                onDeleteComment={onDeleteComment!}
              />

              <CommentBody
                bodyData={{
                  content: data.content,
                  images: data.imageList,
                }}
              />
            </div>

            <CommentFooter
              footerData={{
                likeCount: data.likeCount,
                id: data.id,
                isLike: data.isLike,
                deleted: data.deleted,
              }}
              isReply={isReply}
              isGuest={isGuest}
              isReplyFormOpen={isReplyFormOpen}
              setIsReplyFormOpen={setIsReplyFormOpen}
              queryKey={itemQueryKey}
              onFavoriteComment={onFavoriteComment!}
            />
          </div>

          <CommentActions
            isThreadItem={isThreadItem}
            isReplyFormOpen={isReplyFormOpen}
            setIsReplyFormOpen={setIsReplyFormOpen}
            viewReply={isTopLevelComment ? viewReply : autoOpenReplies}
            setViewReply={setViewReply}
            replyCount={data.childCommentCount || 0}
            isGuest={isGuest}
          />
        </div>
      </div>

      {isReplyFormOpen && !isNestedReply && (
        <ReplyForm isThreadItem={isThreadItem} onSubmit={handleReplySubmit} isPending={isPending} />
      )}

      {hasReplyComments && (
        <ul className={cn("rounded-[10px] bg-layout_2depth", viewReply && "py-1")}>
          {replyComments.map((child) => (
            <CommentItem
              key={child.id}
              level={child.depth > 1 ? "nestedReply" : "reply"}
              data={child}
              postId={postId}
              onSubmit={onSubmit}
              isPending={isPending}
              useFetchReplies={useFetchReplies}
              onDeleteComment={onDeleteComment}
              onFavoriteComment={onFavoriteComment}
              isGuest={isGuest}
              autoOpenReplies={isTopLevelComment && viewReply}
              parentQueryKey={childrenQueryKey}
            />
          ))}

          {replyCommentData?.hasNext && (
            <div className="px-5 py-2">
              <ViewMoreComment
                count={replyCommentData.remainingCount}
                isThreadItem={true}
                onClick={() => fetchNextPage()}
              />
            </div>
          )}
        </ul>
      )}
    </li>
  );
};

export default CommentItem;
