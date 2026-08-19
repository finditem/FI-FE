"use client";

import { useTranslations } from "next-intl";
import { Icon, ImageSelectButton } from "@/components";
import useSendImage from "@/api/fetch/chatMessage/api/useSendImage";
import {
  InputChatImageSectionIds,
  InputChatImageSectionImageState,
} from "../../../_types/InputChatImageSection";
import { useHandleSendImage } from "../../../_hooks/useHandleSendImage/useHandleSendImage";

interface InputChatImageSectionProps {
  ids: InputChatImageSectionIds;
  imageState: InputChatImageSectionImageState;
  onImageSendSuccess?: () => void;
}

const InputChatImageSection = ({
  ids,
  imageState,
  onImageSendSuccess,
}: InputChatImageSectionProps) => {
  const t = useTranslations("InputChatImageSection");
  const { roomId, userId } = ids;
  const { images, setImages, selectedImages, setSelectedImages } = imageState;
  const { mutate: sendImage } = useSendImage(roomId, userId, {
    onSuccess: onImageSendSuccess,
  });
  const handleSendImage = useHandleSendImage();

  return (
    <>
      <div className="mb-[20px] flex items-center justify-between px-[4px] pb-[12px]">
        <button aria-label={t("cancelAriaLabel")} onClick={() => setImages([])}>
          <Icon name="XSecond" size={20} />
        </button>

        <button
          aria-label={t("sendAriaLabel")}
          onClick={() =>
            handleSendImage(selectedImages, images, setImages, setSelectedImages, sendImage)
          }
          className="p-1 text-body1-medium text-brand-normal-default disabled:text-brand-normal-disabled"
          disabled={!selectedImages.length}
        >
          {!selectedImages.length
            ? t("selectLabel")
            : t("sendCountLabel", { count: selectedImages.length })}
        </button>
      </div>
      <ImageSelectButton
        images={images}
        setImages={setImages}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />
    </>
  );
};

export default InputChatImageSection;
