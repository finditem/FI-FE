"use client";

import { DetailHeader } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { NoticeWriteForm } from "./_components";
import { NoticeWriteFormValues } from "./_types/NoticeWriteType";

const DEFAULT_VALUES: NoticeWriteFormValues = {
  title: "",
  content: "",
  category: "",
  images: [],
};

const NoticeWrite = () => {
  const methods = useForm<NoticeWriteFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <>
      <DetailHeader title="공지사항 글쓰기" />
      <h1 className="sr-only">공지사항 글쓰기 페이지</h1>
      <FormProvider<NoticeWriteFormValues> {...methods}>
        <NoticeWriteForm methods={methods} />
      </FormProvider>
    </>
  );
};

export default NoticeWrite;
