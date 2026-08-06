import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useWriteStore } from "@/store";
import { PostDetailData } from "@/api/fetch/post";
import { PostWriteFormValues } from "../../_types/PostWriteType";

interface UsePostEditInitProps {
  data: PostDetailData | null;
  methods: UseFormReturn<PostWriteFormValues>;
}

const usePostEditInit = ({ data, methods }: UsePostEditInitProps) => {
  const { setPostType, setLatLng, setAddress, setFullAddress, setRadius } = useWriteStore();

  useEffect(() => {
    if (!data || methods.getValues("tempPostId") === data.id) return;

    setPostType(data.postType);
    setLatLng(data.latitude, data.longitude);
    setAddress(data.address);
    setFullAddress(data.address);
    setRadius(data.radius);

    methods.reset({
      postType: data.postType,
      title: data.title,
      content: data.content,
      category: data.category,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      date: data.createdAt,
      temporarySave: false,
      images: data.imageResponseList.map((img) => ({
        id: img.id,
        previewUrl: img.imgUrl,
      })),
      postStatus: data.postStatus,
      tempPostId: data.id,
    });
  }, [data, methods, setPostType, setLatLng, setAddress, setFullAddress, setRadius]);
};

export default usePostEditInit;
