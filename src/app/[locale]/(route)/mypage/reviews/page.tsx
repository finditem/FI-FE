import { DetailHeader } from "@/components";
import { getTranslations } from "next-intl/server";
import { ReviewsContainer } from "./_components";

const Page = async () => {
  const t = await getTranslations("MypageReviewsPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <ReviewsContainer />
    </>
  );
};

export default Page;
