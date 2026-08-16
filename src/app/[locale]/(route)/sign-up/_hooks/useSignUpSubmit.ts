import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";
import { ApiSignUpType, useApiSignUp } from "@/api/fetch/auth";
import { useSignUpErrorMessage } from "./useSignUpErrorMessage/useSignUpErrorMessage";
import { useErrorToast } from "@/hooks";
import { usePermissionStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { throttle } from "es-toolkit/compat";
import { useMemo } from "react";
import { trackSignUp } from "@/utils/analytics/analytics";

export const useSignUpSubmit = () => {
  const t = useTranslations("SignUpSubmit");
  const signUpErrorMessage = useSignUpErrorMessage();
  const router = useRouter();
  const { addToast } = useToast();
  const { mutate: SignUpMutate, isPending } = useApiSignUp();
  const { handlerApiError } = useErrorToast();
  const { setFirstSignUp } = usePermissionStore();
  const queryClient = useQueryClient();

  const submitSignUp = useMemo(
    () =>
      throttle(
        (data: ApiSignUpType) => {
          SignUpMutate(data, {
            onSuccess: () => {
              trackSignUp();
              setFirstSignUp(true);
              queryClient.clear();
              router.replace("/");
              addToast(t("completed"), "success");
            },
            onError: (error) => {
              const errorCode = error?.response?.data?.code;
              if (errorCode) {
                handlerApiError(signUpErrorMessage, errorCode);
              }
            },
          });
        },
        300,
        { leading: true, trailing: false }
      ),
    [
      SignUpMutate,
      setFirstSignUp,
      queryClient,
      router,
      addToast,
      handlerApiError,
      t,
      signUpErrorMessage,
    ]
  );

  return {
    submitSignUp,
    isPending,
  };
};
