import { useFormContext, UseFormSetFocus, useWatch } from "react-hook-form";
import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useEmailErrorMessage, useEmailCheckCodeMessage } from "../_constants/SIGNUP_ERROR_MESSAGE";
import { throttle } from "es-toolkit/compat";
import { useApiCheckCode, useApiSendEmail } from "@/api/fetch/auth";
import { useErrorToast, useNicknameCheck } from "@/hooks";
import { FormType } from "../types/FormType";

type SignUpFieldType = Omit<FormType, "privacyPolicyAgreed" | "marketingConsent">;
type SignUpSetFocus = UseFormSetFocus<SignUpFieldType>;

export const useSignUpBtnClick = () => {
  const t = useTranslations("SignUpBtnClick");
  const emailErrorMessage = useEmailErrorMessage();
  const emailCheckCodeMessage = useEmailCheckCodeMessage();
  const { getValues, trigger, control, setValue } = useFormContext();

  const [emailValue, setEmailValue] = useState("");

  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [isEmailAuthDisabled, setIsEmailAuthDisabled] = useState(true);

  const [isEmailAuthVerified, setIsEmailAuthVerified] = useState(false);

  const { addToast } = useToast();
  const { handlerApiError } = useErrorToast();

  const { mutate: EmailMutate, isPending: EmailPending } = useApiSendEmail();
  const { mutate: CodeMutate, isPending: EmailCodePending } = useApiCheckCode();
  const { handleClickNickname, isNicknameVerified, isNicknameDisabled } = useNicknameCheck();

  const currentEmailAuth = useWatch({
    control,
    name: "emailAuth",
  });

  const [timer, setTimer] = useState(0);

  // 타이머
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (isEmailAuthDisabled) return;
    setIsEmailAuthVerified(false);
  }, [currentEmailAuth, isEmailAuthDisabled]);

  const handlerToClick = useMemo(
    () =>
      throttle(
        async (name: string, setFocus: SignUpSetFocus) => {
          const isValid = await trigger(name);
          if (!isValid) return;

          const rawInputValue = getValues(name);
          const inputValue = typeof rawInputValue === "string" ? rawInputValue.trim() : "";

          if (inputValue) {
            if (name === "email") {
              EmailMutate(
                { email: inputValue },
                {
                  onSuccess: () => {
                    addToast(t("codeSent"), "success");
                    setTimer(300);
                    setIsEmailAuthDisabled(false);
                    setEmailValue(inputValue);
                    setFocus("emailAuth");
                  },
                  onError: (error) => {
                    const errorCode = error.response?.data.code;
                    if (errorCode) {
                      handlerApiError(emailErrorMessage, errorCode || "", "email");
                    }
                  },
                }
              );
            } else if (name === "emailAuth") {
              CodeMutate(
                { email: emailValue, code: inputValue },
                {
                  onSuccess: () => {
                    addToast(t("codeVerified"), "success");
                    setTimer(0);
                    setIsEmailAuthDisabled(true);
                    setIsEmailDisabled(true);
                    setIsEmailAuthVerified(true);

                    setValue("isEmailAuthVerified", true, { shouldValidate: true });
                    setFocus("password");
                  },
                  onError: (error) => {
                    const errorCode = error.response?.data.code;
                    if (errorCode)
                      handlerApiError(emailCheckCodeMessage, errorCode || "", "emailAuth");
                  },
                }
              );
            } else if (name === "nickname") {
              handleClickNickname(name);
            }
          }
        },
        300,
        { leading: true, trailing: false }
      ),
    [
      trigger,
      getValues,
      EmailMutate,
      addToast,
      handlerApiError,
      CodeMutate,
      emailValue,
      handleClickNickname,
      t,
      emailErrorMessage,
      emailCheckCodeMessage,
    ]
  );

  return {
    handlerToClick,
    isEmailAuthDisabled,
    isEmailDisabled,
    isEmailAuthVerified,
    isNicknameVerified,
    isNicknameDisabled,
    EmailPending,
    EmailCodePending,
    timer,
  };
};
