import { DetailHeader } from "@/components";
import { MypageReportsIdContainer } from "./_components";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const reportId = Number(id);
  const t = await getTranslations("MypageReportsDetailPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <MypageReportsIdContainer id={reportId} />
    </>
  );
};

export default page;
