import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const useLeaveChatRoom = (roomId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const t = useTranslations("useLeaveChatRoom");

  if (!roomId) return { mutate: () => {} };
  return useAppMutation("auth", `/chats/${roomId}/leave`, "post", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
      queryClient.invalidateQueries({ queryKey: ["chatRoom"] });

      queryClient.removeQueries({ queryKey: ["chatRoomDetail", roomId], exact: true });
      queryClient.removeQueries({ queryKey: ["chatMessages", roomId], exact: true });
      router.replace(`/chat`);
    },
    onError: () => {
      addToast(t("leaveError"), "error");
    },
  });
};

export default useLeaveChatRoom;
