import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import { resizeImage } from "@/utils";
import { SelectedImage } from "@/types/SelectedImage";

export const useHandleSendImage = () => {
  const t = useTranslations("HandleSendImage");
  const { addToast } = useToast();

  return async (
    selectedImages: SelectedImage[],
    images: File[],
    setImages: Dispatch<SetStateAction<File[]>>,
    setSelectedImages: Dispatch<SetStateAction<SelectedImage[]>>,
    sendImage: (data: FormData) => void
  ) => {
    if (selectedImages.length === 0) return;

    const sorted = [...selectedImages].sort((a, b) => a.order - b.order);

    try {
      const resizedImages = await Promise.all(
        sorted.map((item) => resizeImage(images[item.index]))
      );

      const formData = new FormData();
      resizedImages.forEach((resizedFile) => {
        formData.append("images", resizedFile);
      });

      sendImage(formData);

      setImages([]);
      setSelectedImages([]);
    } catch {
      addToast(t("imageErrorToast"), "error");
    }
  };
};
