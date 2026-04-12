"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useAddToHomeScreen } from "@/hooks";
import { useWriteFlowStore } from "@/store";
import { CommentList, AddToHomeScreenPWA } from "@/components/domain";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useGetDetailPost } from "@/api/fetch/post";
import {
  useDeleteComment,
  useGetPostsComments,
  useGetRepliesPostsComments,
} from "@/api/fetch/comment";
import PostDetail from "../PostDetail/PostDetail";
import PostDetailTopHeader from "../PostDetailTopHeader/PostDetailTopHeader";
import SimilarItemsSection from "../SimilarItemsSection/SimilarItemsSection";
import PostInputComment from "../PostInputComment/PostInputComment";
import { DetailSkeleton, ErrorSimilarSection } from "../_internal";
import { useHandleReplySubmit } from "../../_hooks/useHandleReplySubmit/useHandleReplySubmit";
import { useToggleCommentLike } from "../../_hooks/usePostCommentLike/usePostCommentLike";
import ManualPopup from "@/app/(route)/manual/_components/ManualPopup/ManualPopup";

interface ClientDetailProps {
  id: number;
  isLoggedIn: boolean;
}

const ClientDetail = ({ id, isLoggedIn }: ClientDetailProps) => {
  const { addToast } = useToast();
  const { showPrompt, incrementViewCount, closePrompt } = useAddToHomeScreen();
  const { showManualPopup, setShowManualPopup } = useWriteFlowStore();

  const { data, isLoading, isError } = useGetDetailPost({ id });
  const { data: commentsData, fetchNextPage } = useGetPostsComments({
    postId: id,
    enabled: isLoggedIn,
  });
  const { handleReplySubmit, isPending } = useHandleReplySubmit(id);
  const { mutate: deleteComment } = useDeleteComment();
  const { handleToggleFavorite } = useToggleCommentLike();

  useEffect(() => {
    if (isError) {
      addToast("게시글 불러오기에 실패했어요", "error");
    }
  }, [isError, addToast]);

  useEffect(() => {
    if (!isLoading && data?.result) {
      incrementViewCount();
    }
  }, [isLoading, data, incrementViewCount]);

  useEffect(() => {
    if (sessionStorage.getItem("showManualPopup") === "true") {
      setShowManualPopup(true);
      sessionStorage.removeItem("showManualPopup");
    }
  }, [setShowManualPopup]);

  const shouldShowSkeleton = isLoading || isError || !data?.result;
  const isErrorState = !isLoading && (isError || !data?.result);

  if (shouldShowSkeleton) {
    return (
      <>
        <ManualPopup isOpen={showManualPopup} onClose={() => setShowManualPopup(false)} />
        <DetailSkeleton isError={isErrorState} />
      </>
    );
  }

  const { isMine, postUserInformation } = data.result;
  const similarTitle = data.result.postType === "LOST" ? "비슷한 제보글" : "비슷한 분실물";

  return (
    <>
      <ManualPopup isOpen={showManualPopup} onClose={() => setShowManualPopup(false)} />
      <PostDetailTopHeader
        postId={id}
        postData={{
          isMine,
          writerId: postUserInformation.userId,
          favoriteStatus: data.result.favoriteStatus,
          postStatus: data.result.postStatus,
        }}
      />

      <div className="flex flex-col h-base">
        <PostDetail data={data.result} />

        <CommentList
          postId={id}
          comments={commentsData}
          onSubmit={handleReplySubmit}
          isPending={isPending}
          isLoggedIn={isLoggedIn}
          useFetchReplies={useGetRepliesPostsComments}
          onDeleteComment={deleteComment}
          onFavoriteComment={(commentId, isLike, queryKey) =>
            handleToggleFavorite({ commentId, isLike, queryKey })
          }
          onCommentLoadMore={() => fetchNextPage()}
        />

        <ErrorBoundary fallback={<ErrorSimilarSection postId={id} title={similarTitle} />}>
          <SimilarItemsSection postId={id} title={similarTitle} />
        </ErrorBoundary>

        <PostInputComment postId={id} isLoggedIn={isLoggedIn} />
      </div>

      <AddToHomeScreenPWA isOpen={showPrompt} onClose={closePrompt} />
    </>
  );
};

export default ClientDetail;
