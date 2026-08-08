import { NoticeCategory } from "@/types";

export type NoticeCategoryFormValue = "" | NoticeCategory;

export interface NoticeWriteImageItem {
  file: File;
  previewUrl: string;
}

export interface NoticeWriteFormValues {
  title: string;
  content: string;
  category: NoticeCategoryFormValue;
  images: NoticeWriteImageItem[];
}
