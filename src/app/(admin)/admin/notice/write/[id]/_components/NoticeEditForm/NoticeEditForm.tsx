"use client";

import { useFormContext, useFormState } from "react-hook-form";
import {
  TitleInput,
  ContentInput,
  CategoryInput,
} from "../../../_components/NoticeWriteForm/_internal";
import { WriteActionSection } from "@/components/domain";
import { NoticeEditFormValues } from "../../_types/NoticeEditFormValues";
import { useSubmitNoticeEdit } from "./_internal/useSubmitNoticeEdit";
import NoticeEditImageSection from "./_internal/NoticeEditImageSection";

const IMAGE_HELP_TEXT = "*사진은 최대 5장 첨부가 가능합니다. (선택)";

const canSubmit = (values: NoticeEditFormValues): boolean =>
  Boolean(values?.title?.trim() && values?.category && values?.content?.trim());

interface NoticeEditFormProps {
  noticeId: number;
}

const NoticeEditForm = ({ noticeId }: NoticeEditFormProps) => {
  const methods = useFormContext<NoticeEditFormValues>();
  const values = methods.watch() as NoticeEditFormValues;
  const { isDirty } = useFormState({ control: methods.control });
  const { submitNoticeEdit, isPending } = useSubmitNoticeEdit({ noticeId });

  const isSubmitDisabled = !canSubmit(values) || !isDirty || isPending;

  const onSubmit = (data: NoticeEditFormValues) => submitNoticeEdit(data);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-base">
      <TitleInput />
      <CategoryInput />
      <ContentInput />
      <NoticeEditImageSection helpText={IMAGE_HELP_TEXT} />
      <div className="sticky bottom-0 w-full max-w-[764px] border-t border-divider-default bg-white">
        <WriteActionSection disabled={isSubmitDisabled} />
      </div>
    </form>
  );
};

export default NoticeEditForm;
