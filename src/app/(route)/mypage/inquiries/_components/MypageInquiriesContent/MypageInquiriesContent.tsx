"use client";

import { InquiryItemType, useGetUserInquiries } from "@/api/fetch/inquiry";
import { Chip } from "@/components/common";
import { MypageEmptyUI } from "@/components/domain";
import { LoadingState } from "@/components/state";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { useFilterParams } from "@/hooks/domain";
import { formatDate, highlightText } from "@/utils";
import Link from "next/link";
import { useEffect } from "react";
import { INQUIRY_STATUS_CHIP } from "../../_constants/INQUIRY_STATUS_CHIP";
import { useSearchParams } from "next/navigation";

interface MypageInquiryItemProps {
  inquiries: InquiryItemType;
  keyword?: string;
}

const MypageInquiryItem = ({ inquiries, keyword }: MypageInquiryItemProps) => {
  const { inquiryId, title, content, status, createdAt } = inquiries;

  return (
    <li className="flex w-full flex-col justify-between border-b border-divider-default px-5 py-[30px]">
      <Link href={`/mypage/inquiries/${inquiryId}`} aria-label={`${title} 문의 상세 내용 보기`}>
        <Chip
          label={INQUIRY_STATUS_CHIP[status].label}
          type={INQUIRY_STATUS_CHIP[status].chipType}
        />

        <h3 className="mt-2 text-h3-semibold text-layout-header-default">
          {keyword ? highlightText(title, keyword) : title}
        </h3>

        <time
          dateTime={createdAt}
          className="mt-[3px] block text-body2-regular text-layout-body-default"
        >
          {formatDate(createdAt)}
        </time>

        <p className="mt-2 truncate text-body2-regular text-neutral-normal-default">{content}</p>
      </Link>
    </li>
  );
};

const MypageInquiriesContent = () => {
  const { inquiryStatus } = useFilterParams();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;

  const {
    data: inquiriesData,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetUserInquiries({
    status: inquiryStatus,
    keyword,
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (isError) {
      addToast("내 문의 목록을 불러오는데 실패했어요", "error");
    }
  }, [isError, addToast]);

  const { ref } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  if (isLoading) return <LoadingState />;

  return (
    <section>
      <h2 className="sr-only">내 문의 내역 목록 영역</h2>

      {inquiriesData && inquiriesData.length === 0 ? (
        <MypageEmptyUI pageType="inquiries" />
      ) : (
        <>
          <ul>
            {inquiriesData &&
              inquiriesData.map((item) => (
                <MypageInquiryItem key={item.inquiryId} inquiries={item} keyword={keyword} />
              ))}
          </ul>

          {hasNextPage && <div ref={ref} className="h-10" />}
        </>
      )}
    </section>
  );
};

export default MypageInquiriesContent;
