import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useGetSimilar } from "@/api/fetch/post";
import { SimilarItemsList } from "../_internal";

interface SimilarItemsSectionProps {
  postId: number;
  title?: string;
}

const SimilarItemsSection = ({ postId, title }: SimilarItemsSectionProps) => {
  const t = useTranslations("SimilarItemsSection");
  const { data: similarData } = useGetSimilar({ postId });

  if (!similarData?.result || similarData.result.length === 0) return null;

  return (
    <>
      <hr className="w-full border-neutral-normal-default" />
      <section className="flex flex-col gap-4 py-[18px] pl-5">
        <h2 className="text-h2-medium text-flatGray-900">{title ?? t("defaultTitle")}</h2>

        <Suspense fallback={null}>
          <SimilarItemsList data={similarData?.result} />
        </Suspense>
      </section>
    </>
  );
};

export default SimilarItemsSection;
