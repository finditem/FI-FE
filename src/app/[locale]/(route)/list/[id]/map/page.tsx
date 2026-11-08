import { Suspense } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { DetailHeader } from "@/components";
import { PostDetailNaverMap } from "./_components";

// 상세의 지도 뷰는 자체 메타가 없어 사이트 기본 제목을 쓰므로 색인에서 제외한다.
export const metadata: Metadata = {
  robots: { index: false },
};

const page = () => {
  const t = useTranslations("PostDetailMap");
  const headerTitle = t("headerTitle");

  return (
    <section className="flex h-screen flex-col">
      <DetailHeader title={headerTitle} />
      <h1 className="sr-only">{headerTitle}</h1>

      <div className="min-h-0 flex-1">
        <Suspense fallback={null}>
          <PostDetailNaverMap />
        </Suspense>
      </div>
    </section>
  );
};

export default page;
