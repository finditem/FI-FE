"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputCommentField, GuestLoginModal } from "@/components";
import { usePostCommentSubmit } from "../../_hooks/usePostCommentSubmit/usePostCommentSubmit";

interface PostInputCommentProps {
  postId: number;
  isLoggedIn: boolean;
}

const PostInputComment = ({ postId, isLoggedIn }: PostInputCommentProps) => {
  const methods = useForm<{ content: string }>();
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const { handleCommentSubmit, isPending, images, setImages } = usePostCommentSubmit({
    postId,
    methods,
    isLoggedIn,
    openGuestModal: () => setIsGuestModalOpen(true),
  });

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="sticky bottom-0 left-0 right-0 z-10 mt-auto w-full border-t border-neutral-normal-default bg-white px-5 py-4"
          onSubmit={methods.handleSubmit(handleCommentSubmit)}
        >
          <InputCommentField
            name="content"
            images={images}
            setImages={setImages}
            disabled={isPending}
          />
        </form>
      </FormProvider>

      <GuestLoginModal isOpen={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)} />
    </>
  );
};

export default PostInputComment;
