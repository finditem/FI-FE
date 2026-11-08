"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { usePostNoticeComment } from "@/api/fetch/noticeComment";

interface UsePostNoticeCommentSubmitProps {
  noticeId: number;
  methods: UseFormReturn<{ content: string }>;
  isLoggedIn: boolean;
  openGuestModal: () => void;
}

export const usePostNoticeCommentSubmit = ({
  noticeId,
  methods,
  isLoggedIn,
  openGuestModal,
}: UsePostNoticeCommentSubmitProps) => {
  const [images, setImages] = useState<File[]>([]);
  const { mutate, isPending } = usePostNoticeComment(noticeId);

  const handleCommentSubmit = (data: { content: string }) => {
    if (!isLoggedIn) {
      openGuestModal();
      return;
    }

    if (isPending) return;

    const trimmedContent = data.content.trim();
    if (!trimmedContent && images.length === 0) return;

    const formData = new FormData();

    const request = {
      content: trimmedContent,
      parentId: null,
    };

    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    images.forEach((image) => formData.append("images", image));

    mutate(formData, {
      onSuccess: () => {
        methods.reset({ content: "" });
        setImages([]);
      },
    });
  };

  return {
    handleCommentSubmit,
    isPending,
    images,
    setImages,
  };
};
