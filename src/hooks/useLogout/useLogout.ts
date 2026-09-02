import { useState } from "react";
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
  const { mutateAsync: logoutMutateAsync, isPending } = useApiLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { addToast } = useToast();
  const t = useTranslations("useLogout");
  const resetUnreadNotificationState = useNotificationStore(
    (state) => state.resetUnreadNotificationState
  );
  const { logout } = useAgreeStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    if (isLoggingOut || isPending || isRedirecting) return;
    setIsLoggingOut(true);

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

      try {
        await logoutMutateAsync();

        setIsRedirecting(true);
        disconnectNotificationSSE();
        resetUnreadNotificationState();
        queryClient.clear();
        logout();
        addToast(t("logoutSuccess"), "success");
        router.push("/");
      } catch {
        addToast(t("logoutError"), "error");
      } finally {
        setIsLoggingOut(false);
      }
    })();
  };

  return { handleLogout, isPending: isPending || isLoggingOut || isRedirecting };
};

export default useLogout;
