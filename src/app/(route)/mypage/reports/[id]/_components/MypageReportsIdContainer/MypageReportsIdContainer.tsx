"use client";

import { useGetReportById } from "@/api/fetch/report";
import { Chip } from "@/components/common";
import { LoadingState } from "@/components/state";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/utils";
import { useEffect } from "react";
import { REPORT_STATUS_CHIP } from "../../../_constants/REPORT_STATUS_CHIP";
import ReportCommentItem from "../ReportCommentItem/ReportCommentItem";
import { REPORT_TYPE_TITLE } from "@/app/(admin)/admin/_constants/REPORT_TYPE_TITLE";

const MypageReportsIdContainer = ({ id }: { id: number }) => {
  const { data: reportIdData, isError, isLoading } = useGetReportById({ reportId: id });
  const { addToast } = useToast();

  useEffect(() => {
    if (isError) addToast("신고내역을 불러오는데 실패했어요", "error");
  }, [isError, addToast]);

  if (isLoading) return <LoadingState />;

  const result = reportIdData?.result;
  if (!result) return null;

  const {
    nickname,
    reportId,
    reportType,
    targetId,
    targetType,
    targetTitle,
    reason,
    status,
    answered,
    createdAt,
  } = result;

  return (
    <div className="w-full h-base">
      <div className="border-b-flat-gray-50 w-full border-b px-5 py-[30px]">
        <Chip label={REPORT_STATUS_CHIP[status].label} type={REPORT_STATUS_CHIP[status].chipType} />
        <h2 className="mt-[14px] text-h2-medium">{REPORT_TYPE_TITLE[reportType]}</h2>
        <time dateTime={createdAt} className="mt-1 text-body2-regular text-layout-body-default">
          {formatDate(createdAt)}
        </time>
        <p className="mt-6 text-body1-regular text-layout-header-default">{reason}</p>
      </div>

      {answered && (
        <ul>
          <ReportCommentItem data={result} />
        </ul>
      )}
    </div>
  );
};

export default MypageReportsIdContainer;
