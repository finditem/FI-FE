import { DetailHeader } from "@/components";
import { MypageInquiriesIdContainer } from "./_components";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const inquiryId = Number(id);
  const t = await getTranslations("MypageInquiriesPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <MypageInquiriesIdContainer id={inquiryId} />
    </>
  );
};

export default page;
