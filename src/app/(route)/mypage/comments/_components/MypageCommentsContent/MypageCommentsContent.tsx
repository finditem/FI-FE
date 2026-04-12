"use client";

import { useGetUserComments } from "@/api/fetch/user/api/useGetUserComments";
import { useFilterParams } from "@/hooks/domain";
import { LoadingState } from "@/components/state";
import { useToast } from "@/context/ToastContext";
import { CommentCard, MypageEmptyUI } from "@/components/domain";
import { useInfiniteScroll } from "@/hooks";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const MypageCommentsContent = () => {
  const { startDate, endDate, simpleSort } = useFilterParams();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;

  const {
    data: commentsData,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetUserComments({
    startDate: startDate,
    endDate: endDate,
    sort: simpleSort,
    keyword,
  });

  const { addToast } = useToast();

  const { ref } = useInfiniteScroll({ hasNextPage, fetchNextPage, isFetchingNextPage });

  useEffect(() => {
    if (isError) addToast("목록을 불러오는데 실패했어요", "error");
  }, [isError, addToast]);

  if (isLoading) return <LoadingState />;

  return (
    <section>
      <h2 className="sr-only">댓글 목록 영역</h2>

      {commentsData && commentsData.length === 0 ? (
        <MypageEmptyUI pageType="comments" />
      ) : (
        <>
          <ul>
            {commentsData &&
              commentsData.map((item) => (
                <CommentCard key={item.commentId} data={item} keyword={keyword} />
              ))}
          </ul>
          {hasNextPage && <div ref={ref} className="h-10" />}
        </>
      )}
    </section>
  );
};

export default MypageCommentsContent;
