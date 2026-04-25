import useApiLogout from "@/api/fetch/auth/api/useApiLogout";
import { disconnectNotificationSSE } from "@/api/fetch/notification/api/notificationSSEClient";
import { useToast } from "@/context/ToastContext";
import { useAgreeStore, useNotificationStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS } from "@/utils/webPush/webPushConstants";
import { unsubscribeWebPushFromServer } from "@/utils";

const useLogout = () => {
  const { mutate: logoutMutate, isPending } = useApiLogout();
  const { addToast } = useToast();
  const resetUnreadNotificationState = useNotificationStore(
    (state) => state.resetUnreadNotificationState
  );
  const { logout } = useAgreeStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    if (isPending) return;

    void (async () => {
      try {
        await Promise.race([
          unsubscribeWebPushFromServer(),
          new Promise<void>((_, reject) =>
            setTimeout(
              () => reject(new Error("web-push-unsubscribe-timeout")),
              WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS
            )
          ),
        ]);
      } catch {
        // ignore
      }

      logoutMutate(undefined, {
        onSuccess: () => {
          disconnectNotificationSSE();
          resetUnreadNotificationState();
          queryClient.clear();
          logout();
          addToast("로그아웃 되었어요.", "success");
          router.push("/");
        },
        onError: () => {
          addToast("로그아웃에 실패했어요. 다시 시도해주세요.", "error");
        },
      });
    })();
  };

  return { handleLogout, isPending };
};

export default useLogout;
