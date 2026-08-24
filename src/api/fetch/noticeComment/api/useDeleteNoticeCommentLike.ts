import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  PostCommentLikeResponse,
  ToggleCommentLikeVariables,
} from "@/api/fetch/comment/types/CommentType";
import { GetNoticeCommentsResponse } from "../types/GetNoticeComments";
import { GetRepliesNoticeCommentsResponse } from "../types/GetRepliesNoticeComments";

type LikeTargetComment = {
  id: number;
  likeCount?: number;
  isLike?: boolean;
  like?: boolean;
};

type InfiniteNoticeLikeCacheData = {
  pages: Array<{
    result?: {
      comments?: LikeTargetComment[];
    };
  }>;
  pageParams: unknown[];
};

type FlatNoticeLikeCacheData = {
  comments: LikeTargetComment[];
};

type NoticeLikeCacheData = InfiniteNoticeLikeCacheData | FlatNoticeLikeCacheData;

type LikeOptimisticContext = {
  previous?: NoticeLikeCacheData;
};

const updateCommentLikeState = (
  comment: LikeTargetComment,
  nextIsLike: boolean
): LikeTargetComment => {
  const nextLikeCount = nextIsLike
    ? (comment.likeCount ?? 0) + 1
    : Math.max(0, (comment.likeCount ?? 0) - 1);

  return {
    ...comment,
    likeCount: nextLikeCount,
    ...(typeof comment.isLike === "boolean" ? { isLike: nextIsLike } : {}),
    ...(typeof comment.like === "boolean" ? { like: nextIsLike } : {}),
  };
};

const patchNoticeLikeCache = (
  old: NoticeLikeCacheData | undefined,
  commentId: number,
  nextIsLike: boolean
): NoticeLikeCacheData | undefined => {
  if (!old) return old;

  if ("pages" in old) {
    return {
      ...old,
      pages: old.pages.map((page) => {
        const pageComments = page.result?.comments;
        if (!pageComments) return page;

        return {
          ...page,
          result: {
            ...page.result,
            comments: pageComments.map((comment) =>
              comment.id === commentId ? updateCommentLikeState(comment, nextIsLike) : comment
            ),
          },
        };
      }),
    };
  }

  if ("comments" in old) {
    return {
      ...old,
      comments: old.comments.map((comment) =>
        comment.id === commentId ? updateCommentLikeState(comment, nextIsLike) : comment
      ),
    };
  }

  return old;
};

const useDeleteNoticeCommentLike = (noticeId: number) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const t = useTranslations("useDeleteNoticeCommentLike");

  return useAppMutation<ToggleCommentLikeVariables, PostCommentLikeResponse>(
    "auth",
    ({ commentId }) => `/notices/comments/${commentId}/like`,
    "delete",
    {
      onMutate: async ({ commentId, queryKey }) => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<
          GetNoticeCommentsResponse | GetRepliesNoticeCommentsResponse
        >(queryKey) as NoticeLikeCacheData | undefined;

        queryClient.setQueryData<NoticeLikeCacheData | undefined>(queryKey, (old) =>
          patchNoticeLikeCache(old, commentId, false)
        );

        return { previous };
      },
      onError: (_error, { queryKey }, context) => {
        const typedContext = context as LikeOptimisticContext | undefined;

        if (typedContext?.previous) {
          queryClient.setQueryData(queryKey, typedContext.previous);
        }

        addToast(t("likeDeleteError"), "error");
      },
      onSettled: (_, __, { queryKey }) => {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ["notice-comments", noticeId] });
      },
    }
  );
};

export default useDeleteNoticeCommentLike;
