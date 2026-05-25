"use client";

import { InputComment, GuestLoginModal } from "@/components";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { usePostNoticeCommentSubmit } from "../../../../_hooks/usePostNoticeCommentSubmit/usePostNoticeCommentSubmit";

interface NoticeCommentFormProps {
  noticeId: number;
  isLoggedIn: boolean;
}

const NoticeCommentForm = ({ noticeId, isLoggedIn }: NoticeCommentFormProps) => {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const methods = useForm<{ content: string }>();

  const {
    handleCommentSubmit,
    isPending,
    images: hookImages,
    setImages: hookSetImages,
  } = usePostNoticeCommentSubmit({
    noticeId,
    methods,
    isLoggedIn,
    openGuestModal: () => setIsGuestModalOpen(true),
  });

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleCommentSubmit)}
          className="sticky bottom-0 left-0 right-0 z-10 mt-auto w-full border-t border-neutral-normal-default bg-white px-5 py-4"
        >
          <InputComment
            name="content"
            images={hookImages}
            setImages={hookSetImages}
            disabled={isPending}
          />
        </form>
      </FormProvider>

      <GuestLoginModal isOpen={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)} />
    </>
  );
};

export default NoticeCommentForm;
