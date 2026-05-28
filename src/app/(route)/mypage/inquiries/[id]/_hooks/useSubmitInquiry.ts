import { UseFormSetValue } from "react-hook-form";
import { InquiryFormType } from "../_types/InquiryFormType";
import { Dispatch, SetStateAction } from "react";
import { usePostUserInquiry } from "@/api/fetch/inquiry";

interface useSubmitInquiryProps {
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  inquiryId: number;
  setValue: UseFormSetValue<InquiryFormType>;
}

export const useSubmitInquiry = ({
  images,
  setImages,
  inquiryId,
  setValue,
}: useSubmitInquiryProps) => {
  const { mutate: postInquiryMutate, isPending } = usePostUserInquiry({ inquiryId });

  const onSubmit = async (data: InquiryFormType) => {
    const comment = data.comment.trim();
    if (!comment || isPending) return;

    const formData = new FormData();
    formData.append(
      "comment",
      new Blob(
        [
          JSON.stringify({
            content: comment,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (images)
      images.forEach((img) => {
        formData.append("images", img);
      });

    postInquiryMutate(formData, {
      onSuccess: () => {
        setValue("comment", "");
        setImages([]);
      },
    });
  };

  return {
    onSubmit,
    isPending,
  };
};
