import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { AxiosError } from "axios";
import { useEmailLoginErrorMessage } from "./useEmailLoginErrorMessage/useEmailLoginErrorMessage";
import { useToast } from "@/context/ToastContext";
import { LoginFormType } from "../_types/LoginFormType";
import { useErrorToast } from "@/hooks";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminUrl, isValidCallbackUrl } from "@/utils";
import { useApiEmailLogin } from "@/api/fetch/auth";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import useAxios from "@/api/_base/axios/useAxios";
import { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";
import { trackLoginAttempt } from "@/utils/analytics/analytics";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useLoginForm = () => {
  const t = useTranslations("LoginForm");
  const emailLoginErrorMessage = useEmailLoginErrorMessage();
  const { handleSubmit, setValue } = useFormContext<LoginFormType>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookie = getCookie("email");
  const { mutateAsync: emailLoginMutateAsync, isPending } = useApiEmailLogin();
  const { addToast } = useToast();
  const { handlerApiError } = useErrorToast();
  const queryClient = useQueryClient();
  const isSubmittingRef = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const authAxios = useAxios("auth");

  useEffect(() => {
    if (typeof cookie === "string") {
      setValue("email", cookie);
      setValue("rememberId", !!cookie);
    }
  }, []);

  // 역할 조회에 실패해도 로그인 자체는 성공했으므로 일반 사용자 흐름으로 보낸다.
  const isAdminUser = async () => {
    try {
      const { data } = await authAxios.get<GetUsersMeResponse>("/users/me");
      return data.result.role === "ADMIN";
    } catch {
      return false;
    }
  };

  const submitLogin = handleSubmit(async (data) => {
    if (!EMAIL_REGEX.test(data.email)) {
      addToast(t("invalidEmail"), "warning");
      return;
    }

    trackLoginAttempt("email");

    const filterData = {
      email: data.email,
      password: data.password,
    };

    try {
      const loginResponse = await emailLoginMutateAsync(filterData);

      setIsRedirecting(true);

      if (data.rememberId) {
        setCookie("email", data.email, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        deleteCookie("email");
      }

      // 관리자는 토큰 쿠키가 .finditem.kr로 공유되므로 관리자 앱으로 보내면 바로 로그인된 상태가 된다.
      // 임시 비밀번호 계정은 비밀번호 변경 화면이 먼저이고, 그 화면이 변경 후 관리자 앱으로 보낸다.
      if (!loginResponse.result.temporaryPassword && (await isAdminUser())) {
        window.location.replace(getAdminUrl("/admin"));
        return;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT));
      }

      queryClient.clear();

      const rawCallback = searchParams.get("callbackUrl");
      router.replace(isValidCallbackUrl(rawCallback) ? rawCallback : "/");
    } catch (error) {
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
