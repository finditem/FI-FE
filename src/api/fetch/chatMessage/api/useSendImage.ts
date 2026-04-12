import useAppMutation from "@/api/_base/query/useAppMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "../types/ChatMessageResponse";
import { addMessageToCache, removeMessageFromCache } from "@/app/(route)/chat/[postId]/_utils";

interface SendImageContext {
  optimisticId: number;
  imageUrls: string[];
}

interface UseSendImageOptions {
  onSuccess?: () => void;
}

const useSendImage = (roomId: number, userId: number, options?: UseSendImageOptions) => {
  const queryClient = useQueryClient();
  return useAppMutation<FormData, unknown, unknown, SendImageContext>(
    "auth",
    `/chats/${roomId}/images`,
    "post",
    {
      onMutate: (formData) => {
        const optimisticId = -Date.now();
        const imageFiles = Array.from(formData.getAll("images") as File[]);
        const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));

        const optimisticMessage: ChatMessage = {
          messageId: optimisticId,
          messageType: "IMAGE",
          senderId: userId,
          content: "",
          imageUrls,
          createdAt: new Date().toISOString(),
        };

        addMessageToCache(queryClient, roomId, optimisticMessage);
        return { optimisticId, imageUrls };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chatMessages", roomId] });
        requestAnimationFrame(() => {
          options?.onSuccess?.();
        });
      },
      onError: (error, variables, context) => {
        if (context?.optimisticId) {
          removeMessageFromCache(queryClient, roomId, context.optimisticId);
        }
      },
      onSettled: (data, error, variables, context) => {
        if (context?.imageUrls) {
          context.imageUrls.forEach((url) => URL.revokeObjectURL(url));
        }
      },
    }
  );
};

export default useSendImage;
