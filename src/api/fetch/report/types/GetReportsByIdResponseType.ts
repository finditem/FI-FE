import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ReportStatus, ReportTargetType, ReportType } from "@/types";

export interface GetReportsByIdResponseType extends ApiBaseResponseType<ReportByIdType> {}

export interface ReportByIdType {
  nickname: string;
  reportId: number;
  targetId: number;
  reportType: ReportType;
  targetType: ReportTargetType;
  targetTitle: string;
  reason: string;
  status: ReportStatus;
  answered: boolean;
  adminAnswer: string;
  adminNickname: string;
  adminProfileImg: string;
  answerImageList: string[];
  resolvedAt: string;
  createdAt: string;
}
