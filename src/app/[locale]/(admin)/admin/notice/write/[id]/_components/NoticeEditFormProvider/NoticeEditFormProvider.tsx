"use client";

import { FormProvider, useForm } from "react-hook-form";
import { NoticeDetail } from "@/api/fetch/notice/types/NoticeDetailType";
import { NoticeEditFormValues } from "../../_types/NoticeEditFormValues";
import { toNoticeEditFormValues } from "../../_utils/toNoticeEditFormValues";
import NoticeEditForm from "../NoticeEditForm/NoticeEditForm";

interface NoticeEditFormProviderProps {
  initialData: NoticeDetail;
  noticeId: number;
}

export const NoticeEditFormProvider = ({ initialData, noticeId }: NoticeEditFormProviderProps) => {
  const methods = useForm<NoticeEditFormValues>({
    defaultValues: toNoticeEditFormValues(initialData),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <FormProvider<NoticeEditFormValues> {...methods}>
      <NoticeEditForm noticeId={noticeId} />
    </FormProvider>
  );
};
