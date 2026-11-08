import { SelectedImage } from "@/types/SelectedImage";
import { Dispatch, SetStateAction } from "react";

export interface InputChatImageSectionIds {
  roomId: number;
  userId: number;
}

export interface InputChatImageSectionImageState {
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  selectedImages: SelectedImage[];
  setSelectedImages: Dispatch<SetStateAction<SelectedImage[]>>;
}
