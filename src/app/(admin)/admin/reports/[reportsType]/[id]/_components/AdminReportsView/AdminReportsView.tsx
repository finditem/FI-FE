import { LoadingState } from "@/components";
import { AdminDetailSection } from "@/app/(admin)/admin/_components";
import AdminReportsCommentSection from "../AdminReportsCommentSection/AdminReportsCommentSection";
import { ReportsType } from "../../_types/ReportsType";
import { useReportsDetailQuery } from "../../_hooks/useReportsDetailQuery";
import { AdminDetailInquiry, AdminDetailReport, InquiryComments } from "@/api/fetch/admin";

interface AdminReportsViewProps {
  id: number;
  type: ReportsType;
}

const AdminReportsView = ({ id, type }: AdminReportsViewProps) => {
  const { data, isLoading, isError } = useReportsDetailQuery({ id, type });

  if (isError) return null;

  let comments: InquiryComments[] = [];

  if (data?.result) {
    if (type === "inquiry") {
      comments = (data.result as AdminDetailInquiry).comments;
    } else if (type === "report") {
      const reportData = data.result as AdminDetailReport;

      if (reportData.answered) {
        comments = [
          {
            id: reportData.reportId,
            content: reportData.adminAnswer,
            authorId: reportData.adminId,
            authorName: reportData.adminNickname,
            profileImg: reportData.adminProfileImg,
            createdAt: reportData.answeredAt,
            imageList: reportData.answerImageList || [],
            admin: true,
          },
        ];
      }
    }
  }

  return (
    <div className="flex flex-col h-base">
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <AdminDetailSection data={data?.result} type={type} />
          <AdminReportsCommentSection comments={comments} />
        </>
      )}
    </div>
  );
};

export default AdminReportsView;
