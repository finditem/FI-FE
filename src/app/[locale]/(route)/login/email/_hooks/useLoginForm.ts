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
import { isValidCallbackUrl } from "@/utils";
import { useApiEmailLogin } from "@/api/fetch/auth";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
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

  useEffect(() => {
    if (typeof cookie === "string") {
      setValue("email", cookie);
      setValue("rememberId", !!cookie);
    }
  }, []);

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
      await emailLoginMutateAsync(filterData);

      setIsRedirecting(true);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT));
      }

      queryClient.clear();

      const rawCallback = searchParams.get("callbackUrl");
      router.replace(isValidCallbackUrl(rawCallback) ? rawCallback : "/");

      if (data.rememberId) {
        setCookie("email", data.email, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        deleteCookie("email");
      }
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
