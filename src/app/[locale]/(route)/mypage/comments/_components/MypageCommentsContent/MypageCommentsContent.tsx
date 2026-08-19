"use client";

import { useGetUserComments } from "@/api/fetch/user/api/useGetUserComments";
import { useFilterParams } from "@/hooks";
import { LoadingState, CommentCard, MypageEmptyUI } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const MypageCommentsContent = () => {
  const t = useTranslations("MypageCommentsContent");
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
    if (isError) addToast(t("loadError"), "error");
  }, [isError, addToast, t]);

  if (isLoading) return <LoadingState />;

  return (
    <section>
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>

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
