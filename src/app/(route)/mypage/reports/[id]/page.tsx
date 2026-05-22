import { DetailHeader } from "@/components";
import { MypageReportsIdContainer } from "./_components";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const reportId = Number(id);

  return (
    <>
      <DetailHeader title="내 신고 내역" />
      <h1 className="sr-only">내 신고 내역 상세 페이지</h1>
      <MypageReportsIdContainer id={reportId} />
    </>
  );
};

export default page;
