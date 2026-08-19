"use client";

import { ReportItemType, useGetUserReports } from "@/api/fetch/report";
import { Chip, MypageEmptyUI, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useFormatDate, useInfiniteScroll } from "@/hooks";
import { useFilterParams } from "@/hooks";
import { highlightText } from "@/utils";
import Link from "next/link";
import { useEffect } from "react";
import { REPORT_STATUS_CHIP } from "../../_constants/REPORT_STATUS_CHIP";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface MypageReportsItemProps {
  reports: ReportItemType;
  keyword?: string;
}

const MypageReportsItem = ({ reports, keyword }: MypageReportsItemProps) => {
  const t = useTranslations("MypageReportsContent");
  const formatDate = useFormatDate();
  const { reportId, reportType, reason, status, createdAt } = reports;
  const reportTitle = t(`reportTypes.${reportType}`);

  return (
    <li className="flex w-full flex-col justify-between border-b border-divider-default px-5 py-[30px]">
      <Link href={`/mypage/reports/${reportId}`} aria-label={t("detailAriaLabel")}>
        <Chip
          label={t(REPORT_STATUS_CHIP[status].labelKey)}
          type={REPORT_STATUS_CHIP[status].chipType}
        />

        <h3 className="mt-2 text-h3-semibold text-layout-header-default">
          {keyword ? highlightText(reportTitle, keyword) : reportTitle}
        </h3>

        <time
          dateTime={createdAt}
          className="mt-[3px] block text-body2-regular text-layout-body-default"
        >
          {formatDate(createdAt)}
        </time>

        <p className="mt-2 truncate text-body2-regular text-neutral-normal-default">{reason}</p>
      </Link>
    </li>
  );
};

const MypageReportsContent = () => {
  const t = useTranslations("MypageReportsContent");
  const { reportStatus } = useFilterParams();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;

  const {
    data: reportsData,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetUserReports({
    status: reportStatus,
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

      {reportsData && reportsData.length === 0 ? (
        <MypageEmptyUI pageType="reports" />
      ) : (
        <>
          <ul>
            {reportsData &&
              reportsData.map((item) => (
                <MypageReportsItem key={item.reportId} reports={item} keyword={keyword} />
              ))}
          </ul>

          {hasNextPage && <div ref={ref} className="h-10" />}
        </>
      )}
    </section>
  );
};

export default MypageReportsContent;
