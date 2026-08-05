import { NoticeDetail } from "@/api/fetch/notice/types/NoticeDetailType";
import { NoticeEditFormValues } from "../_types/NoticeEditFormValues";
import { NoticeEditImageItem } from "../_types/NoticeEditImageItem";

export function toNoticeEditFormValues(detail: NoticeDetail): NoticeEditFormValues {
  const imageItems: NoticeEditImageItem[] = (detail.images ?? [])
    .filter((url): url is string => Boolean(url))
    .map((url) => ({ previewUrl: url }));

  return {
    title: detail.title ?? "",
    content: detail.content ?? "",
    category: detail.category ?? "",
    images: imageItems,
  };
}
