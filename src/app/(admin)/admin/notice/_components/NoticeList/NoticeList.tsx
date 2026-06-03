"use client";

import { Suspense } from "react";
import { AdminListItem } from "../../../_components";
import { useGetNotices } from "@/api/fetch/notice";
import { LoadingState } from "@/components";
import { NoticeSortType } from "@/types/NoticeType";
import { useInfiniteScroll } from "@/hooks";

interface NoticeListProps {
  keyword?: string;
  sortType?: NoticeSortType;
}

const NoticeList = ({ keyword, sortType }: NoticeListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetNotices({
    keyword,
    sortType,
  });
  const { ref: noticeListRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <Suspense fallback={<LoadingState />}>
      <section aria-label="공지사항 목록">
        <ul>
          {data?.map((item, index) => (
            <AdminListItem
              key={index}
              data={item}
              imageAlt="공지사항 이미지"
              link={`/notice/${item.noticeId}`}
            />
          ))}
        </ul>
        {hasNextPage && <div ref={noticeListRef} className="h-10 w-full" />}
      </section>
    </Suspense>
  );
};

export default NoticeList;
