import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "@/i18n/navigation";
import { useApiLogout } from "@/api/fetch/auth";
import {
  expireSession,
  isAuthenticationError,
  resetClientSession,
} from "@/api/_base/auth/authSession";
import { unsubscribeWebPushBeforeLogout } from "./_internal/unsubscribeWebPushBeforeLogout/unsubscribeWebPushBeforeLogout";

/**
 * 웹 푸시 해지와 서버 로그아웃 후 로컬 세션을 종료하고 홈으로 이동합니다.
 * @remarks
 * 이미 만료된 세션의 401도 로그아웃 성공으로 처리합니다.
 * 캐시·연결·알림·약관 정리는 공통 세션 종료 경로에서 한 번만 수행합니다.
 * @returns 로그아웃 핸들러와 중복 요청·이동을 막는 진행 상태를 반환합니다.
 * @example
 * const { handleLogout, isPending } = useLogout();
 * @author suhyeon
 */
const useLogout = () => {
  const { mutateAsync: logoutMutateAsync, isPending } = useApiLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { addToast } = useToast();
  const t = useTranslations("useLogout");
  const router = useRouter();

  const endServerSession = async (): Promise<void> => {
    try {
      await logoutMutateAsync();
    } catch (error) {
      if (!isAuthenticationError(error)) throw error;
      await expireSession({ redirect: false });
      return;
    }
    resetClientSession();
  };

  const performLogout = async (): Promise<void> => {
    await unsubscribeWebPushBeforeLogout();
    try {
      await endServerSession();
      setIsRedirecting(true);
      addToast(t("logoutSuccess"), "success");
      router.push("/");
      router.refresh();
    } catch {
      addToast(t("logoutError"), "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogout = (): void => {
    if (isLoggingOut || isPending || isRedirecting) return;
    setIsLoggingOut(true);
    void performLogout();
  };

  return { handleLogout, isPending: isPending || isLoggingOut || isRedirecting };
};

export default useLogout;
