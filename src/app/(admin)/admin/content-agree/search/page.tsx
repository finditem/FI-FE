"use client";

import { Suspense } from "react";
import { DetailHeader } from "@/components/layout";
import { ContentAgreeSearchView } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="콘텐츠 활용 동의 게시글" />

      <Suspense fallback={null}>
        <ContentAgreeSearchView />
      </Suspense>
    </>
  );
};

export default page;
