import { useTranslations } from "next-intl";
import { disconnectNotificationSSE } from "@/api/fetch/notification/api/notificationSSEClient";
import { useToast } from "@/context/ToastContext";
import { useAgreeStore, useNotificationStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS } from "@/constants";
import { unsubscribeWebPushFromServer } from "@/utils";
import { useApiLogout } from "@/api/fetch/auth";

const useLogout = () => {
  const { mutate: logoutMutate, isPending } = useApiLogout();
  const { addToast } = useToast();
  const t = useTranslations("useLogout");
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
          addToast(t("logoutSuccess"), "success");
          router.push("/");
        },
        onError: () => {
          addToast(t("logoutError"), "error");
        },
      });
    })();
  };

  return { handleLogout, isPending };
};

export default useLogout;
