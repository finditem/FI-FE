import { DetailHeader } from "@/components";
import { MypageInquiriesIdContainer } from "./_components";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const inquiryId = Number(id);

  return (
    <>
      <DetailHeader title="내 문의 내역" />
      <MypageInquiriesIdContainer id={inquiryId} />
    </>
  );
};

export default page;
