import { Suspense } from "react";
import { ContentAgreeHeader, ContentAgreeView } from "./_components";

const page = () => {
  return (
    <>
      <ContentAgreeHeader />
      <h1 className="sr-only">콘텐츠 활용 동의 게시글 목록</h1>

      <Suspense fallback={null}>
        <ContentAgreeView />
      </Suspense>
    </>
  );
};

export default page;
