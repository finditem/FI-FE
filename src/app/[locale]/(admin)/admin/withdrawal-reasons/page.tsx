import { DetailHeader, ScrollToTopButton } from "@/components";
import { AdminWithdrawalReasonsView } from "./_components";

export const dynamic = "force-dynamic";

const page = () => {
  return (
    <>
      <DetailHeader title="유저 탈퇴 사유" />
      <h1 className="sr-only">유저 탈퇴 사유</h1>

      <AdminWithdrawalReasonsView />

      <ScrollToTopButton className="fixed-button-position-bottom" />
    </>
  );
};

export default page;
