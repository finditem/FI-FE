import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { AxiosError } from "axios";
import { useEmailLoginErrorMessage } from "./useEmailLoginErrorMessage/useEmailLoginErrorMessage";
import { useToast } from "@/context/ToastContext";
import type { LoginFormType } from "../_types/LoginFormType";
import { useErrorToast } from "@/hooks";
import { completeLogin } from "@/api/_base/auth/completeLogin";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminUrl, isValidCallbackUrl } from "@/utils";
import { useApiEmailLogin } from "@/api/fetch/auth";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { trackLoginAttempt } from "@/utils/analytics/analytics";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function updateRememberedEmail(email: string, rememberId: boolean): void {
  if (!rememberId) {
    deleteCookie("email");
    return;
  }
  setCookie("email", email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
}

function getLoginDestination(temporaryPassword: boolean, callbackUrl: string | null): string {
  if (temporaryPassword) return "/change-password?reason=temporary-password";
  if (isValidCallbackUrl(callbackUrl)) return callbackUrl;
  return "/";
}

/**
 * 이메일 로그인 제출을 관리하고 공통 세션 초기화 후 계정에 맞는 화면으로 이동합니다.
 * @remarks 임시 비밀번호 변경을 관리자 앱 이동보다 우선하고 중복 제출을 차단합니다.
 * @returns 폼 제출 핸들러와 로그인·이동 진행 상태를 반환합니다.
 * @example
 * const { onSubmitLogin, isPending } = useLoginForm();
 */
const useLoginForm = () => {
  const t = useTranslations("LoginForm");
  const emailLoginErrorMessage = useEmailLoginErrorMessage();
  const { handleSubmit, setValue } = useFormContext<LoginFormType>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rememberedEmail = getCookie("email");
  const { mutateAsync: emailLoginMutateAsync, isPending } = useApiEmailLogin();
  const { addToast } = useToast();
  const { handlerApiError } = useErrorToast();
  const queryClient = useQueryClient();
  const isSubmittingRef = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (typeof rememberedEmail !== "string") return;
    setValue("email", rememberedEmail);
    setValue("rememberId", Boolean(rememberedEmail));
  }, []);

  const submitLogin = handleSubmit(async (formData) => {
    if (!EMAIL_REGEX.test(formData.email)) {
      addToast(t("invalidEmail"), "warning");
      return;
    }

    trackLoginAttempt("email");

    const loginCredentials = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const { result } = await emailLoginMutateAsync(loginCredentials);

      setIsRedirecting(true);

      updateRememberedEmail(formData.email, formData.rememberId);

      // 관리자는 토큰 쿠키가 .finditem.kr로 공유되므로 관리자 앱으로 보내면 바로 로그인된 상태가 된다.
      // 임시 비밀번호 계정은 비밀번호 변경 화면이 먼저이고, 그 화면이 변경 후 관리자 앱으로 보낸다.
      const user = await completeLogin(queryClient, !result.temporaryPassword);
      useAgreeStore.getState().login(true);
      if (!result.temporaryPassword && user?.result.role === "ADMIN") {
        window.location.replace(getAdminUrl("/admin"));
        return;
      }

      const destination = getLoginDestination(
        result.temporaryPassword,
        searchParams.get("callbackUrl")
      );
      router.replace(destination);
      router.refresh();
    } catch (error) {
      setIsRedirecting(false);
      const errorCode = (error as AxiosError<ApiBaseResponseType<null>>).response?.data.code;
      if (errorCode) {
        handlerApiError(emailLoginErrorMessage, errorCode);
      }
    }
  });

  const onSubmitLogin = (event?: BaseSyntheticEvent) => {
    if (isSubmittingRef.current || isPending || isRedirecting) {
      event?.preventDefault();
      return;
    }

    isSubmittingRef.current = true;

    void submitLogin(event).finally(() => {
      isSubmittingRef.current = false;
    });
  };

  return { onSubmitLogin, isPending: isPending || isRedirecting };
};

export default useLoginForm;
