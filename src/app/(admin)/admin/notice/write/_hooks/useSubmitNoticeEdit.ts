import { usePutNoticeDetail } from "@/api/fetch/admin";
import { useDeleteS3, usePostS3 } from "@/api/fetch/s3";
import { NoticeEditFormValues } from "../[id]/_types/NoticeEditFormValues";

interface UseSubmitNoticeEditParams {
  noticeId: number;
}

export const useSubmitNoticeEdit = ({ noticeId }: UseSubmitNoticeEditParams) => {
  const { mutate: putNotice, isPending } = usePutNoticeDetail(noticeId);
  const { mutate: postS3 } = usePostS3();
  const { mutate: deleteS3 } = useDeleteS3();

  const submitNoticeEdit = (data: NoticeEditFormValues) => {
    const { images, ...rest } = data;

    const fileItems = images.filter((item) => item.file instanceof File);
    const files = fileItems.map((item) => item.file as File);

    const existingUrls = images
      .filter((item) => !(item.file instanceof File))
      .map((item) => item.previewUrl)
      .filter((url) => Boolean(url) && !url.startsWith("blob:"));

    const submitWithImages = (uploadedUrls: string[]) => {
      const imageUrls = [...existingUrls, ...uploadedUrls];

      putNotice(
        { ...rest, imageUrls },
        {
          onError: () => {
            if (uploadedUrls.length > 0) {
              deleteS3(uploadedUrls);
            }
          },
        }
      );
    };

    if (files.length === 0) {
      submitWithImages([]);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));

    postS3(formData, {
      onSuccess: ({ result }) => {
        submitWithImages(result ?? []);
      },
    });
  };

  return { submitNoticeEdit, isPending };
};
