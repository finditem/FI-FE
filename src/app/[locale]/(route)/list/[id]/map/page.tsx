import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { DetailHeader } from "@/components";
import { PostDetailKakaoMap } from "./_components";

const page = () => {
  const t = useTranslations("PostDetailMap");
  const headerTitle = t("headerTitle");

  return (
    <section className="flex h-screen flex-col">
      <DetailHeader title={headerTitle} />
      <h1 className="sr-only">{headerTitle}</h1>

      <div className="min-h-0 flex-1">
        <Suspense fallback={null}>
          <PostDetailKakaoMap />
        </Suspense>
      </div>
    </section>
  );
};

export default page;
