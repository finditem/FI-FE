import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { useWriteStore } from "@/store";
import { PostWriteFormValues } from "../../_types/PostWriteType";
import { GetTempPostResponse, TempPostWriteRequest, usePostTempPost } from "@/api/fetch/post";

interface TempPostActionsParams {
  methods: UseFormReturn<PostWriteFormValues>;
  tempPost: GetTempPostResponse | undefined;
  values: PostWriteFormValues;
  setFormKey: Dispatch<SetStateAction<number>>;
}

const useTempPostActions = ({ methods, tempPost, values, setFormKey }: TempPostActionsParams) => {
  const { setPostType, setLatLng, setAddress, setFullAddress, setRadius } = useWriteStore();

  const { mutateAsync: postTempPost } = usePostTempPost();

  const loadTempPost = () => {
    if (!tempPost?.result) return;
    const { result } = tempPost;

    setPostType(result.postType);
    setLatLng(result.latitude, result.longitude);
    setAddress(result.address);
    setFullAddress(result.address);
    setRadius(result.radius);

    methods.reset({
      postType: result.postType,
      title: result.title || "",
      date: result.date || new Date().toISOString(),
      address: result.address || "",
      latitude: result.latitude,
      longitude: result.longitude,
      content: result.content || "",
      radius: result.radius,
      category: result.category,
      images: result.images.map((img) => ({
        id: img.id,
        previewUrl: img.imgUrl,
      })),
      temporarySave: false,
      tempPostId: result.postId,
    });

    setFormKey((prev) => prev + 1);
  };

  const saveTempPost = async () => {
    const request: TempPostWriteRequest = {
      latitude: values.latitude ?? undefined,
      longitude: values.longitude ?? undefined,
      date: values.date,
      address: values.address,
      title: values.title,
      content: values.content,
      postType: values.postType || undefined,
      category: values.category || undefined,
      radius: values.radius ?? undefined,
      keepImageIdList: values.images.filter((image) => image.id).map((image) => String(image.id)),
    };

    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));

    values.images.forEach((image) => {
      if (image.file) formData.append("images", image.file);
    });

    await postTempPost(formData);
  };

  return { loadTempPost, saveTempPost };
};

export default useTempPostActions;
