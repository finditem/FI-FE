"use client";

import { useEffect } from "react";
import { useInfiniteScroll } from "@/hooks";
import { EmptyState, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { toInquiryItemVM, toReportItemVM } from "../../../_utils/toReportsItemVM/toReportsItemVM";
import { ReportsTabType } from "../../_types/ReportsTabType";
import { AdminReportsItem } from "../../../_components";
import { getReportsEmptyState } from "../../_utils/getReportsEmptyState";
import { InquiryStatus, ReportStatus } from "@/types";
import { useReportsListQuery } from "../../_hooks/useReportsListQuery";

interface ReportsListProps {
  activeTab: ReportsTabType;
  keyword?: string;
  reportStatus?: ReportStatus;
  inquiryStatus?: InquiryStatus;
  answered?: boolean;
}

const ReportsList = ({
  activeTab,
  keyword,
  reportStatus,
  inquiryStatus,
  answered,
}: ReportsListProps) => {
  const { addToast } = useToast();

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useReportsListQuery({
      activeTab,
      keyword,
      reportStatus,
      inquiryStatus,
      answered,
    });

  const { ref: listRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useEffect(() => {
    if (isError) addToast("신고/문의 내역을 불러오지 못했어요", "error");
  }, [isError, addToast]);

  const hasKeyword = Boolean(keyword?.trim());

  if (isLoading)
    return <LoadingState title={hasKeyword ? "검색하신 내용을 찾고 있어요" : undefined} />;
  if (isError) return null;

  const emptyState = getReportsEmptyState(activeTab, hasKeyword);

  return (
    <section aria-label="신고/문의 목록">
      {data?.length === 0 ? (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {data?.map((item) => {
            if ("reportId" in item) {
              return <AdminReportsItem key={item.reportId} data={toReportItemVM(item)} />;
            }

            return <AdminReportsItem key={item.inquiryId} data={toInquiryItemVM(item)} />;
          })}
        </ul>
      )}
      {hasNextPage && <div ref={listRef} className="h-10 w-full" />}
    </section>
  );
};

export default ReportsList;
