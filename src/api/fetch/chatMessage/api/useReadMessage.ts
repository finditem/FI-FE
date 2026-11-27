import useAppMutation from "@/api/_base/query/useAppMutation";
import { useQueryClient } from "@tanstack/react-query";

const useReadMessage = (roomId: number) => {
  const queryClient = useQueryClient();

  return useAppMutation("auth", `/chats/${roomId}/read`, "patch", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
      queryClient.invalidateQueries({ queryKey: ["chatRoomDetail", roomId] });
      queryClient.invalidateQueries({ queryKey: ["chatMessages", roomId] });
      // 서버가 채팅 읽음과 함께 그 방의 채팅 알림도 읽음 처리하므로 안 읽은 알림 점을 다시 맞춘다.
      queryClient.invalidateQueries({ queryKey: ["notificationList"] });
    },
  });
};

export default useReadMessage;
