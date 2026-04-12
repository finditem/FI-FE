import useApiEmailLogin from "@/api/fetch/auth/api/useApiEmailLogin";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { EMAIL_LOGIN_ERROR_MESSAGE } from "../_constants/EMAIL_LOGIN_ERROR_MESSAGE";
import { useToast } from "@/context/ToastContext";
import { LoginFormType } from "../_types/LoginFormType";
import { useErrorToast } from "@/hooks/domain";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useLoginForm = () => {
  const { handleSubmit, setValue } = useFormContext<LoginFormType>();
  const router = useRouter();
  const cookie = getCookie("email");
  const { mutate: EmailLoginMutate, isPending } = useApiEmailLogin();
  const { addToast } = useToast();
  const { handlerApiError } = useErrorToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof cookie === "string") {
      setValue("email", cookie);
      setValue("rememberId", !!cookie);
    }
  }, []);

  const onSubmitLogin = handleSubmit((data) => {
    if (!EMAIL_REGEX.test(data.email)) {
      addToast("아이디에 이메일을 입력해주세요.", "warning");
      return;
    }

    const filterData = {
      email: data.email,
      password: data.password,
    };

    EmailLoginMutate(filterData, {
      onSuccess: () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT));
        }

        queryClient.clear();
        router.replace("/");

        if (data.rememberId) {
          setCookie("email", data.email, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            secure: process.env.NODE_ENV === "production",
          });
        } else {
          deleteCookie("email");
        }
      },
      onError: (error) => {
        const errorCode = error.response?.data.code;
        if (errorCode) {
          handlerApiError(EMAIL_LOGIN_ERROR_MESSAGE, errorCode);
        }
      },
    });
  });

  return { onSubmitLogin, isPending };
};

export default useLoginForm;
