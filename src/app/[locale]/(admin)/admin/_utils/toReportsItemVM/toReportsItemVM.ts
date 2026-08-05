import { AdminGuestInquiryItem, AdminInquiriesItem, AdminReportItem } from "@/api/fetch/admin";
import { AdminReportsItemData } from "../../_types";
import {
  ProcessStatusBadgeConfig,
  ReplyStatusBadgeConfig,
} from "../AdminStatusBadgeConfig/AdminStatusBadgeConfig";
import { REPORT_TYPE_TITLE } from "../../_constants/REPORT_TYPE_TITLE";

export const toReportItemVM = (item: AdminReportItem): AdminReportsItemData => {
  return {
    href: `/admin/reports/report/${item.reportId}`,
    title: REPORT_TYPE_TITLE[item.reportType],
    content: item.reason,
    nickname: item.reporterNickname,
    createdAt: item.createdAt,

    processStatus: ProcessStatusBadgeConfig[item.status],
    answerStatus: ReplyStatusBadgeConfig(item.answered),
  };
};

export const toInquiryItemVM = (item: AdminInquiriesItem): AdminReportsItemData => {
  return {
    href: `/admin/reports/inquiry/${item.inquiryId}`,
    title: item.title,
    content: item.content,
    nickname: item.nickname,
    createdAt: item.createdAt,

    processStatus: ProcessStatusBadgeConfig[item.status],
    answerStatus: ReplyStatusBadgeConfig(item.answered),
  };
};

export const toGuestInquiryItemVM = (item: AdminGuestInquiryItem): AdminReportsItemData => {
  return {
    href: `/admin/guest-inquiries/${item.inquiryId}`,
    title: item.title,
    content: item.content,
    nickname: item.email,
    createdAt: item.createdAt,

    processStatus: ProcessStatusBadgeConfig[item.status],
    answerStatus: ReplyStatusBadgeConfig(item.answered),
  };
};
