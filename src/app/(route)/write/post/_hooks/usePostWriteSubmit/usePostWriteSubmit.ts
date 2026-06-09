import { useEffect, useState, useMemo } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useWriteStore } from "@/store";
import {
  PostWriteFormValues,
  PostWriteSubmitValues,
  postWriteSubmitSchema,
} from "../../_types/PostWriteType";
import { PostWriteRequest, usePostPosts } from "@/api/fetch/post";
import { trackPostComplete } from "@/utils/analytics/analytics";
import { resizeImage } from "@/utils";

interface UsePostWriteSubmitProps {
  methods: UseFormReturn<PostWriteFormValues>;
}

const usePostWriteSubmit = ({ methods }: UsePostWriteSubmitProps) => {
  const { lat, lng, fullAddress, radius, postType, clearLocation } = useWriteStore();

  const getSubmitValues = (values: Partial<PostWriteFormValues>) =>
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
    methods.setValue("address", fullAddress || "", { shouldValidate: true });
    methods.setValue("latitude", lat ?? null, { shouldValidate: true });
    methods.setValue("longitude", lng ?? null, { shouldValidate: true });
    methods.setValue("radius", radius ?? null, { shouldValidate: true });
  }, [postType, fullAddress, lat, lng, radius, methods]);

  const watchedValues = useWatch({
    control: methods.control,
  });

  const canSubmit = useMemo(() => {
    return getSubmitValues(watchedValues as Partial<PostWriteFormValues>).success;
  }, [
    watchedValues.postType,
    watchedValues.address,
    watchedValues.latitude,
    watchedValues.longitude,
    watchedValues.radius,
    watchedValues.category,
    watchedValues.title,
    watchedValues.content,
    postType,
    fullAddress,
    lat,
    lng,
    radius,
  ]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<PostWriteFormValues | null>(null);

  const { mutateAsync: postPosts, isPending: isPosting } = usePostPosts();

  const toPostWriteFormData = async (values: PostWriteSubmitValues): Promise<FormData> => {
    const request: PostWriteRequest = {
      postType: values.postType,
      title: values.title,
      category: values.category,
      content: values.content,
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
      radius: values.radius,
      date: new Date().toISOString(),
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

  const submitFormData = async (values: PostWriteFormValues) => {
    const submitValues = getSubmitValues(values);

    if (!submitValues.success) return;

    const formData = await toPostWriteFormData(submitValues.data);

    trackPostComplete(submitValues.data.postType as "분실물" | "습득물");
    postPosts(formData);
    clearLocation();
  };

  const onSubmit = methods.handleSubmit(async (values) => {
    const validImages = values.images.filter((image) => image.file);
    if (validImages.length === 0) {
      setPendingValues(values);
      setIsConfirmModalOpen(true);
      return;
    }

    await submitFormData(values);
  });

  const onConfirmNoImageSubmit = async () => {
    if (pendingValues) {
      await submitFormData(pendingValues);
    }
    setIsConfirmModalOpen(false);
    setPendingValues(null);
  };

  const onCancelSubmit = () => {
    setIsConfirmModalOpen(false);
    setPendingValues(null);
  };

  return {
    onSubmit,
    isPosting,
    canSubmit,
    isConfirmModalOpen,
    onConfirmNoImageSubmit,
    onCancelSubmit,
  };
};

export default usePostWriteSubmit;
