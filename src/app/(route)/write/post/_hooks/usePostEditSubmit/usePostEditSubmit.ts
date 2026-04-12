import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useWriteStore } from "@/store";
import { PostWriteFormValues } from "../../_types/PostWriteType";
import { usePutPost } from "@/api/fetch/post";
import { PutPostEditRequest } from "@/api/fetch/post/types/PutPostEditType";

interface UsePostEditSubmitProps {
  postId: number;
  methods: UseFormReturn<PostWriteFormValues>;
}

const usePostEditSubmit = ({ postId, methods }: UsePostEditSubmitProps) => {
  const { lat, lng, fullAddress, radius, postType, clearLocation } = useWriteStore();

  useEffect(() => {
    methods.setValue("postType", postType ?? "", { shouldValidate: true });
    methods.setValue("address", fullAddress ?? "", { shouldValidate: true });
    methods.setValue("latitude", lat ?? null, { shouldValidate: true });
    methods.setValue("longitude", lng ?? null, { shouldValidate: true });
    methods.setValue("radius", radius ?? null, { shouldValidate: true });
  }, [postType, fullAddress, lat, lng, radius, methods]);

  const canSubmit = (values: PostWriteFormValues) => {
    if (!postType) return false;
    if (!fullAddress) return false;
    if (lat == null || lng == null || radius == null) return false;
    if (!values.category) return false;
    if (!values.title || !values.content) return false;

    return true;
  };

  const { mutateAsync: putPost, isPending: isPosting } = usePutPost(postId);

  const toFormData = (values: PostWriteFormValues): FormData | null => {
    if (!postType || !values.category) return null;
    if (!fullAddress || lat == null || lng == null || radius == null) return null;

    const firstImage = values.images[0];
    const thumbnailImageId = firstImage?.id ?? null;

    const request: PutPostEditRequest = {
      postType: postType,
      title: values.title,
      category: values.category,
      content: values.content,
      address: fullAddress,
      latitude: lat,
      longitude: lng,
      radius: radius,
      date: new Date().toISOString(),
      keepImageIdList: values.images.filter((img) => img.id).map((img) => Number(img.id)),
      thumbnailImageId,
      postStatus: values.postStatus || "SEARCHING",
    };

    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    values.images.forEach((image) => {
      if (image.file) formData.append("image", image.file);
    });

    return formData;
  };

  const onSubmit = methods.handleSubmit((values) => {
    const formData = toFormData(values);
    if (!formData) return;
    putPost(formData);
    clearLocation();
  });

  return { onSubmit, isPosting, canSubmit };
};

export default usePostEditSubmit;
