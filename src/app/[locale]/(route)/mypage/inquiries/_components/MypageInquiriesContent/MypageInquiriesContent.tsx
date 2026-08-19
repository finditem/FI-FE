"use client";

import { InquiryItemType, useGetUserInquiries } from "@/api/fetch/inquiry";
import { Chip, MypageEmptyUI, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useFormatDate, useInfiniteScroll } from "@/hooks";
import { useFilterParams } from "@/hooks";
import { highlightText } from "@/utils";
import Link from "next/link";
import { useEffect } from "react";
import { INQUIRY_STATUS_CHIP } from "../../_constants/INQUIRY_STATUS_CHIP";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface MypageInquiryItemProps {
  inquiries: InquiryItemType;
  keyword?: string;
}

const MypageInquiryItem = ({ inquiries, keyword }: MypageInquiryItemProps) => {
  const t = useTranslations("MypageInquiriesContent");
  const formatDate = useFormatDate();
  const { inquiryId, title, content, status, createdAt } = inquiries;

  return (
    <li className="flex w-full flex-col justify-between border-b border-divider-default px-5 py-[30px]">
      <Link href={`/mypage/inquiries/${inquiryId}`} aria-label={t("detailAriaLabel", { title })}>
        <Chip
          label={t(INQUIRY_STATUS_CHIP[status].labelKey)}
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
  const t = useTranslations("MypageInquiriesContent");
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
      addToast(t("loadError"), "error");
    }
  }, [isError, addToast, t]);

  const { ref } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  if (isLoading) return <LoadingState />;

  return (
    <section>
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>

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
