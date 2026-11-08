import { useQueryClient } from "@tanstack/react-query";
import { usePostPostsComments } from "@/api/fetch/comment";

export const useHandleReplySubmit = (id: number) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostPostsComments(id);

  const handleReplySubmit = async (content: string, image: File | null, parentId: number) => {
    if (!content.trim() || isPending) return;

    const formData = new FormData();
    const request = {
      content: content.trim(),
      parentId,
    };

    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    if (image) formData.append("image", image);

    return mutateAsync(formData, {
      onSuccess: () => {
        if (parentId) {
          queryClient.invalidateQueries({ queryKey: ["replies-post-comments", parentId] });
        }
      },
    });
  };

  return {
    handleReplySubmit,
    isPending,
  };
};
