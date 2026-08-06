import { AdminDetailGuestInquiry, AdminDetailInquiry, AdminDetailReport } from "@/api/fetch/admin";
import { REPORT_TYPE_TITLE } from "@/app/[locale]/(admin)/admin/_constants/REPORT_TYPE_TITLE";

type DetailContentVMProps = {
  title: string;
  content: string;
  createdAt: string;
  userEmailLabel: string;
  imageUrls?: string[];
};

export const getDetailContentVM = (
  data: AdminDetailGuestInquiry | AdminDetailReport | AdminDetailInquiry
): DetailContentVMProps | null => {
  let title = "";
  let content = "";
  let createdAt = "";
  let imageUrls: string[] = [];

  if ("reportId" in data) {
    title = REPORT_TYPE_TITLE[data.reportType];
    content = data.reason;
    createdAt = data.createdAt;
  } else if ("title" in data) {
    title = data.title;
    content = data.content;
    createdAt = data.createdAt;
    imageUrls = data.imageUrls || [];
  } else {
    return null;
  }

  let userEmailLabel = "";

  if ("nickname" in data && data.nickname) userEmailLabel = data.nickname as string;
  else if ("email" in data && data.email) userEmailLabel = data.email as string;
  else if ("userEmail" in data && data.userEmail) userEmailLabel = data.userEmail as string;
  else if ("reporterNickname" in data && data.reporterNickname)
    userEmailLabel = data.reporterNickname as string;

  return {
    title,
    content,
    createdAt,
    userEmailLabel,
    imageUrls,
  };
};
