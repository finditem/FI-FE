import { Suspense } from "react";
import { DetailHeader } from "@/components";
import { NoticeView } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="공지사항" />
      <h1 className="sr-only">관리자 공지사항</h1>

      <Suspense fallback={null}>
        <NoticeView />
      </Suspense>
    </>
  );
};

export default page;
