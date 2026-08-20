"use client";

import { useGetReportById } from "@/api/fetch/report";
import { Chip, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useFormatDate } from "@/hooks";
import { useEffect } from "react";
import { REPORT_STATUS_CHIP } from "../../../_constants/REPORT_STATUS_CHIP";
import ReportCommentItem from "../ReportCommentItem/ReportCommentItem";
import { useTranslations } from "next-intl";

const MypageReportsIdContainer = ({ id }: { id: number }) => {
  const t = useTranslations("MypageReportsDetail");
  const formatDate = useFormatDate();
  const { data: reportIdData, isError, isLoading } = useGetReportById({ reportId: id });
  const { addToast } = useToast();

  useEffect(() => {
    if (isError) addToast(t("loadError"), "error");
  }, [isError, addToast, t]);

  if (isLoading) return <LoadingState />;

  const result = reportIdData?.result;
  if (!result) return null;

  const { reportType, reason, status, answered, createdAt } = result;

  return (
    <div className="w-full h-base">
      <div className="border-b-flat-gray-50 w-full border-b px-5 py-[30px]">
        <Chip
          label={t(REPORT_STATUS_CHIP[status].labelKey)}
          type={REPORT_STATUS_CHIP[status].chipType}
        />
        <h2 className="mt-[14px] text-h2-medium">{t(`reportTypes.${reportType}`)}</h2>
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
