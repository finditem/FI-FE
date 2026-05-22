"use client";

import { useEffect } from "react";
import { useGetGuestInquiries } from "@/api/fetch/admin";
import { EmptyState, LoadingState } from "@/components";
import { useInfiniteScroll } from "@/hooks";
import { useToast } from "@/context/ToastContext";
import { AdminReportsItem } from "../../../_components";
import { toGuestInquiryItemVM } from "../../../_utils/toReportsItemVM/toReportsItemVM";

interface GuestInquiriesListProps {
  status: string;
  answered?: boolean;
  keyword: string;
}

const GuestInquiriesList = ({ status, answered, keyword }: GuestInquiriesListProps) => {
  const { addToast } = useToast();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetGuestInquiries({ status, keyword, answered });
  const { ref: listRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useEffect(() => {
    if (isError) addToast("비회원 문의 내역을 불러오지 못했어요", "error");
  }, [isError, addToast]);

  if (isLoading) return <LoadingState />;
  if (isError) return null;

  return (
    <section aria-label="비회원 문의 목록">
      {data?.length === 0 ? (
        <EmptyState
          icon={{ iconName: "NoInquiries", iconSize: 70 }}
          title="등록된 문의 내역이 없어요"
          description={"아직 문의 내역이 없습니다.\n문의가 접수되면 이곳에 표기됩니다."}
        />
      ) : (
        <ul>
          {data?.map((item) => (
            <AdminReportsItem key={item.inquiryId} data={toGuestInquiryItemVM(item)} />
          ))}
          {hasNextPage && <div ref={listRef} className="h-10 w-full" />}
        </ul>
      )}
    </section>
  );
};

export default GuestInquiriesList;
