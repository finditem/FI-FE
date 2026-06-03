"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputCommentField } from "@/components";
import { ReportsType } from "../../_types/ReportsType";
import { usePostS3 } from "@/api/fetch/s3";
import { usePostReportsComment } from "../../_hooks/usePostReportsComment";

interface ReportsInputCommentProps {
  reportsId: number;
  reportsType: ReportsType;
}

const ReportsInputComment = ({ reportsId, reportsType }: ReportsInputCommentProps) => {
  const methods = useForm<{ content: string; images: string[] }>();
  const [images, setImages] = useState<File[]>([]);

  const { mutateAsync: uploadImages } = usePostS3();
  const { mutateAsync, isPending } = usePostReportsComment({
    reportsId,
    reportsType,
  });

  const onSubmit = async (data: { content: string; images: string[] }) => {
    if (reportsType === "inquiry") {
      await mutateAsync({ content: data.content, images: [], fileImages: images });
    } else {
      let uploadedImages: string[] = [];

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append("image", image);
        });

        const response = await uploadImages(formData);
        uploadedImages = response.result || [];
      }

      await mutateAsync({ content: data.content, images: uploadedImages });
    }

    methods.reset({ content: "", images: [] });
    setImages([]);
  };

  return (
    <FormProvider {...methods}>
      <form
        className="sticky bottom-0 left-0 right-0 z-10 mt-auto w-full border-t border-neutral-normal-default bg-white px-5 py-4"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <InputCommentField
          name="content"
          images={images}
          setImages={setImages}
          disabled={isPending}
        />
      </form>
    </FormProvider>
  );
};

export default ReportsInputComment;
