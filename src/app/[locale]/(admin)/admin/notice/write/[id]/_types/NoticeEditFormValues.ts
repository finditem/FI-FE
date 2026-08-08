import { NoticeCategoryFormValue } from "../../_types/NoticeWriteType";
import { NoticeEditImageItem } from "./NoticeEditImageItem";

export interface NoticeEditFormValues {
  title: string;
  content: string;
  category: NoticeCategoryFormValue;
  images: NoticeEditImageItem[];
}
