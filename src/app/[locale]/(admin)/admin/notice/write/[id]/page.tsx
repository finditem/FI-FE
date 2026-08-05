"use client";

import { use } from "react";
import { useGetNoticeDetail } from "@/api/fetch/notice";
import { NoticeEditFormProvider } from "./_components/NoticeEditFormProvider/NoticeEditFormProvider";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const noticeId = Number(id);
  const { data: noticeDetail, isLoading } = useGetNoticeDetail({ id: noticeId });

  return (
    <>
      {!isLoading && noticeDetail?.result && (
        <NoticeEditFormProvider initialData={noticeDetail.result} noticeId={noticeId} />
      )}
    </>
  );
};

export default Page;
