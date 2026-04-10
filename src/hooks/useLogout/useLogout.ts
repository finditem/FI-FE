import useApiLogout from "@/api/fetch/auth/api/useApiLogout";
import { disconnectNotificationSSE } from "@/api/fetch/notification/api/notificationSSEClient";
import { useToast } from "@/context/ToastContext";
import { useAgreeStore, useNotificationStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const { mutate: logoutMutate, isPending } = useApiLogout();
  const { addToast } = useToast();
  const router = useRouter();
  const resetUnreadNotificationState = useNotificationStore(
    (state) => state.resetUnreadNotificationState
  );
  const { logout } = useAgreeStore();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    if (isPending) return;

    logoutMutate(undefined, {
      onSuccess: () => {
        disconnectNotificationSSE();
        resetUnreadNotificationState();
        queryClient.clear();
        logout();
        router.replace("/");
        addToast("로그아웃 되었어요.", "success");
      },
      onError: () => {
        addToast("로그아웃에 실패했어요. 다시 시도해주세요.", "error");
      },
    });
  };

  return { handleLogout, isPending };
};

export default useLogout;
