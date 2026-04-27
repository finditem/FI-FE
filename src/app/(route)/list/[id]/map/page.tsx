import { Suspense } from "react";
import { DetailHeader } from "@/components/layout";
import { PostDetailKakaoMap } from "./_components";

const HEADER_TITLE = "분실/발견 위치";

const page = () => {
  return (
    <section className="flex h-screen flex-col">
      <DetailHeader title={HEADER_TITLE} />
      <h1 className="sr-only">{HEADER_TITLE}</h1>

      <div className="min-h-0 flex-1">
        <Suspense fallback={null}>
          <PostDetailKakaoMap />
        </Suspense>
      </div>
    </section>
  );
};

export default page;
