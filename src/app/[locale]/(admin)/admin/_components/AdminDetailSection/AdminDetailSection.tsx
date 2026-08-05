import { AdminDetailGuestInquiry, AdminDetailInquiry, AdminDetailReport } from "@/api/fetch/admin";
import {
  DetailContent,
  DetailStatusHeader,
} from "../../reports/[reportsType]/[id]/_components/_internal";
import { ReportsType } from "../../reports/[reportsType]/[id]/_types/ReportsType";

interface AdminDetailSectionProps {
  data?: AdminDetailGuestInquiry | AdminDetailReport | AdminDetailInquiry;
  type: ReportsType;
  isGuest?: boolean;
}

const AdminDetailSection = ({ data, type, isGuest = false }: AdminDetailSectionProps) => {
  if (!data) return null;

  const { requestStatus, answered } = {
    requestStatus: data.status,
    answered: data.answered,
  };

  return (
    <>
      <section
        aria-label="신고/문의 내용"
        className="space-y-[14px] border-b border-flatGray-50 px-5 py-[30px]"
      >
        <DetailStatusHeader
          requestStatus={requestStatus}
          status={answered}
          type={type}
          isGuest={isGuest}
        />

        <DetailContent data={data} />
      </section>
    </>
  );
};

export default AdminDetailSection;
