import { resizeImage } from "@/utils";
import { InquiryWriteFormValues } from "../../_types/InquiryWriteFormValues";
import { useGetUsersMe } from "@/api/fetch/user";
import { usePostInquiry } from "@/api/fetch/inquiry";

const useInquiryWrite = () => {
  const { data: user, isSuccess: isUserSuccess } = useGetUsersMe();
  const { mutate: postInquiry, isPending: isInquiryPending } = usePostInquiry(isUserSuccess);
  const userEmail = user?.result?.email ?? "";

  const onSubmit = async ({
    title,
    content,
    inquiryType,
    email,
    images,
  }: InquiryWriteFormValues) => {
    const inquiry = { title, content, inquiryType, email };
    const formData = new FormData();
    formData.append("inquiry", new Blob([JSON.stringify(inquiry)], { type: "application/json" }));

    const originalFiles = images
      .map((image) => image.file)
      .filter((file): file is File => Boolean(file));
    const resizedFiles = await Promise.all(
      originalFiles.map(async (file) => {
        try {
          return await resizeImage(file);
        } catch {
          return file;
        }
      })
    );

    resizedFiles.forEach((file) => {
      formData.append("images", file);
    });

    postInquiry(formData);
  };

  return {
    onSubmit,
    isInquiryPending,
    userEmail,
    isUserSuccess,
  };
};

export default useInquiryWrite;
