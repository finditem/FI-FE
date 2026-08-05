import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useWriteStore } from "@/store";
import {
  PostWriteFormValues,
  PostWriteSubmitValues,
  postWriteSubmitSchema,
} from "../../_types/PostWriteType";
import { usePutPost } from "@/api/fetch/post";
import { PutPostEditRequest } from "@/api/fetch/post/types/PutPostEditType";
import { resizeImage } from "@/utils";

interface UsePostEditSubmitProps {
  postId: number;
  methods: UseFormReturn<PostWriteFormValues>;
}

const usePostEditSubmit = ({ postId, methods }: UsePostEditSubmitProps) => {
  const { lat, lng, fullAddress, radius, postType, clearLocation } = useWriteStore();

  const getSubmitValues = (values: PostWriteFormValues) =>
    postWriteSubmitSchema.safeParse({
      ...values,
      postType: values.postType || postType || "",
      address: values.address || fullAddress || "",
      latitude: values.latitude ?? lat ?? null,
      longitude: values.longitude ?? lng ?? null,
      radius: values.radius ?? radius ?? null,
    });

  useEffect(() => {
    methods.setValue("postType", postType ?? "", { shouldValidate: true });
    methods.setValue("address", fullAddress ?? "", { shouldValidate: true });
    methods.setValue("latitude", lat ?? null, { shouldValidate: true });
    methods.setValue("longitude", lng ?? null, { shouldValidate: true });
    methods.setValue("radius", radius ?? null, { shouldValidate: true });
  }, [postType, fullAddress, lat, lng, radius, methods]);

  const canSubmit = (values: PostWriteFormValues) => {
    return getSubmitValues(values).success;
  };

  const { mutateAsync: putPost, isPending: isPosting } = usePutPost(postId);

  const toFormData = async (values: PostWriteSubmitValues): Promise<FormData> => {
    const firstImage = values.images[0];
    const thumbnailImageId = firstImage?.id ?? null;

    const request: PutPostEditRequest = {
      postType: values.postType,
      title: values.title,
      category: values.category,
      content: values.content,
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
      radius: values.radius,
      date: new Date().toISOString(),
      keepImageIdList: values.images.filter((img) => img.id).map((img) => Number(img.id)),
      thumbnailImageId,
      postStatus: values.postStatus || "SEARCHING",
    };

    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));

    const imageFiles = values.images
      .map((image) => image.file)
      .filter((file): file is File => Boolean(file));
    const resizedFiles = await Promise.all(
      imageFiles.map(async (file) => {
        try {
          return await resizeImage(file);
        } catch {
          return file;
        }
      })
    );

    resizedFiles.forEach((file) => {
      formData.append("image", file);
    });

    return formData;
  };

  const onSubmit = methods.handleSubmit(async (values) => {
    const submitValues = getSubmitValues(values);
    if (!submitValues.success) return;

    const formData = await toFormData(submitValues.data);
    putPost(formData);
    clearLocation();
  });

  return { onSubmit, isPosting, canSubmit };
};

export default usePostEditSubmit;
