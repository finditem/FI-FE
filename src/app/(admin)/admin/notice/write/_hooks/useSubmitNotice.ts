import { usePostNotices } from "@/api/fetch/admin";
import { useDeleteS3, usePostS3 } from "@/api/fetch/s3";
import { NoticeWriteFormValues } from "../_types/NoticeWriteType";

const useSubmitNotice = () => {
  const { mutate: postNotice } = usePostNotices();
  const { mutate: postS3 } = usePostS3();
  const { mutate: deleteS3 } = useDeleteS3();

  const submitNotice = (data: NoticeWriteFormValues) => {
    const { images, ...rest } = data;
    const files = images.map((i) => i.file).filter((f): f is File => f != null);

    const submitNotice = (imageUrls: string[]) =>
      postNotice(
        { ...rest, imageUrls },
        { onError: () => imageUrls.length > 0 && deleteS3(imageUrls) }
      );

    if (files.length === 0) return submitNotice([]);

    const formData = new FormData();
    files.forEach((f) => formData.append("image", f));
    postS3(formData, { onSuccess: ({ result }) => submitNotice(result) });
  };

  return { submitNotice };
};

export default useSubmitNotice;
