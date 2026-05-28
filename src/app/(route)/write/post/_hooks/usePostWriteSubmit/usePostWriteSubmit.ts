import { useEffect, useState, useMemo } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useWriteStore } from "@/store";
import { PostWriteFormValues } from "../../_types/PostWriteType";
import { PostWriteRequest, usePostPosts } from "@/api/fetch/post";
import { trackPostComplete } from "@/utils/analytics/analytics";
import { resizeImage } from "@/utils";

interface UsePostWriteSubmitProps {
  methods: UseFormReturn<PostWriteFormValues>;
}

const usePostWriteSubmit = ({ methods }: UsePostWriteSubmitProps) => {
  const { lat, lng, fullAddress, radius, postType, clearLocation } = useWriteStore();

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
    const currentPostType = watchedValues.postType || postType;
    const currentAddress = watchedValues.address || fullAddress;
    const currentLat = watchedValues.latitude ?? lat;
    const currentLng = watchedValues.longitude ?? lng;
    const currentRadius = watchedValues.radius ?? radius;

    const hasLocation =
      !!currentAddress && currentLat != null && currentLng != null && currentRadius != null;
    const hasCategory = !!watchedValues.category;
    const hasTitle = !!watchedValues.title && watchedValues.title.trim() !== "";
    const hasContent = !!watchedValues.content && watchedValues.content.trim() !== "";

    return !!currentPostType && hasLocation && hasCategory && hasTitle && hasContent;
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

  const toPostWriteFormData = async (values: PostWriteFormValues): Promise<FormData | null> => {
    if (!postType || !values.category) return null;
    if (!fullAddress || lat == null || lng == null || radius == null) return null;

    const request: PostWriteRequest = {
      postType: postType,
      title: values.title,
      category: values.category,
      content: values.content,
      address: fullAddress,
      latitude: lat,
      longitude: lng,
      radius: radius,
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
    const formData = await toPostWriteFormData(values);

    if (!formData) return;

    if (postType) trackPostComplete(postType as "분실물" | "습득물");
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
